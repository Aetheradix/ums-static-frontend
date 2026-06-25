import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import StatusButton from 'shared/components/buttons/StatusButton';
import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { ToastService } from 'services';
import GrantTypeForm from '../components/GrantTypeForm';
import {
  useGrantTypeActiveStatusMutation,
  useGrantTypeQuery,
  useGrantTypesQuery,
  useCreateGrantTypeMutation,
  useUpdateGrantTypeMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useGrantTypesQuery();
  const { mutateAsync: toggleStatus } = useGrantTypeActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.Grant.GrantTypeItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Grant Type"
      description="Manage the list of all grant types in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={grantType => setPopup({ mode: 'edit', id: grantType.id })}
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
              cell: (item: Master.Grant.GrantTypeItem) => (
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
        title="Create Grant Type"
        subtitle="Fill in the details to add a new grant type."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Grant Type"
        subtitle="Update the grant type details."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateGrantTypeMutation();

  async function handleSubmit(data: Master.Grant.GrantTypeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Grant Type created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create grant type');
    }
  }

  return (
    <GrantTypeForm
      onSubmit={handleSubmit}
      isSaving={isPending}
      isEditMode={false}
    />
  );
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateGrantTypeMutation(id);
  const { data, isLoading } = useGrantTypeQuery(id);
  const DEFAULT = { name: '' };

  if (isLoading) return <Loader />;

  async function handleSubmit(formData: Master.Grant.GrantTypeForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Grant Type updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update grant type');
    }
  }

  return (
    <GrantTypeForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
