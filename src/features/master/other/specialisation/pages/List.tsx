import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import StatusButton from 'shared/components/buttons/StatusButton';
import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import SpecialisationForm from '../components/SpecialisationForm';
import {
  useCreateSpecialisationMutation,
  useSpecialisationActiveStatusMutation,
  useSpecialisationQuery,
  useSpecialisationsQuery,
  useUpdateSpecialisationMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useSpecialisationsQuery();
  const { mutateAsync: toggleStatus } = useSpecialisationActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.Other.SpecialisationItem) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Specialisation"
      description="Manage the list of all specialisations in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Other.SpecialisationItem[]}
          loading={isLoading}
          onEdit={specialisation =>
            setPopup({ mode: 'edit', id: specialisation.id })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'programmeName', header: 'Programme' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Other.SpecialisationItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() => handleToggleStatus(item)}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Create Specialisation"
        subtitle="Fill in the details to add a new specialisation."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Specialisation"
        subtitle="Update the details of the specialisation."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateSpecialisationMutation();

  async function handleSubmit(data: Master.Other.SpecialisationForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Specialisation created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create specialisation.');
    }
  }

  return <SpecialisationForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateSpecialisationMutation(id);
  const { data, isLoading } = useSpecialisationQuery(id);
  const DEFAULT = { name: '', programmeId: 0 };

  async function handleSubmit(formData: Master.Other.SpecialisationForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Specialisation updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update specialisation.');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <SpecialisationForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
