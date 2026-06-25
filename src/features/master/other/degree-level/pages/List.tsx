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
import DegreeLevelForm from '../components/DegreeLevelForm';
import {
  useCreateDegreeLevelMutation,
  useDegreeLevelActiveStatusMutation,
  useDegreeLevelQuery,
  useDegreeLevelsQuery,
  useUpdateDegreeLevelMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useDegreeLevelsQuery();
  const { mutateAsync: toggleStatus } = useDegreeLevelActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.Other.DegreeLevelItem) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Degree Level"
      description="Manage the list of all degree levels in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Other.DegreeLevelItem[]}
          loading={isLoading}
          onEdit={degreeLevel => setPopup({ mode: 'edit', id: degreeLevel.id })}
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
              cell: (item: Master.Other.DegreeLevelItem) => (
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
        title="Create Degree Level"
        subtitle="Fill in the details to add a new degree level."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Degree Level"
        subtitle="Update the details of the degree level."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateDegreeLevelMutation();

  async function handleSubmit(data: Master.Other.DegreeLevelForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Degree level created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create degree level.');
    }
  }

  return <DegreeLevelForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateDegreeLevelMutation(id);
  const { data, isLoading } = useDegreeLevelQuery(id);
  const DEFAULT = { name: '' };

  async function handleSubmit(formData: Master.Other.DegreeLevelForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Degree level updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update degree level');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <DegreeLevelForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
