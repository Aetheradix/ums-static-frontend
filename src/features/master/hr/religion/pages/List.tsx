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
import ReligionForm from '../components/ReligionForm';
import {
  useCreateReligionMutation,
  useReligionActiveStatusMutation,
  useReligionQuery,
  useReligionsQuery,
  useUpdateReligionMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useReligionsQuery();
  const { mutateAsync: toggleStatus } = useReligionActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.HR.ReligionItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Religion"
      description="Manage the list of all religions in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={religion => setPopup({ mode: 'edit', id: religion.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.HR.ReligionItem) => (
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
        title="Create Religion"
        subtitle="Fill in the details to add a new religion."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Religion"
        subtitle="Update the details of the religion."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateReligionMutation();

  async function handleSubmit(data: Master.HR.ReligionForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Religion created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create religion');
    }
  }

  return <ReligionForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateReligionMutation(id);
  const { data, isLoading } = useReligionQuery(id);
  const DEFAULT: Master.HR.ReligionForm = { name: '', isActive: true };

  async function handleSubmit(formData: Master.HR.ReligionForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Religion updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update religion');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <ReligionForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
