import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import StatusButton from 'shared/components/buttons/StatusButton';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { Loader } from 'shared/components/progress';
import { ToastService } from 'services';
import OfficeTypeForm from '../components/OfficeTypeForm';
import {
  useCreateOfficeTypeMutation,
  useOfficeTypeActiveStatusMutation,
  useOfficeTypeQuery,
  useOfficeTypesQuery,
  useUpdateOfficeTypeMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useOfficeTypesQuery();
  const { mutateAsync: toggleStatus } = useOfficeTypeActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.OfficeTypeItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Office Type"
      description="Manage the list of all office types in the system."
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={isLoading}
          onEdit={officetype => setPopup({ mode: 'edit', id: officetype.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.OfficeTypeItem) => (
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
        title="Create Office Type"
        subtitle="Fill in the details to add a new office type."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Office Type"
        subtitle="Update the details of the office type."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateOfficeTypeMutation();

  async function handleSubmit(data: Master.OfficeTypeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Office Type created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create office type');
    }
  }

  return <OfficeTypeForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateOfficeTypeMutation(id);
  const { data, isLoading } = useOfficeTypeQuery(id);
  const DEFAULT = { code: '', name: '' };

  async function handleSubmit(formData: Master.OfficeTypeForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Office Type updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update office type');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <OfficeTypeForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
