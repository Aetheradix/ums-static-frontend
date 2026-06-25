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
import { useGrantTypesQuery } from 'features/master/grant/grant-type/queries';
import { ToastService } from 'services';
import GrantCategoryForm from '../components/GrantCategoryForm';
import {
  useGrantCategoriesQuery,
  useGrantCategoryActiveStatusMutation,
  useGrantCategoryQuery,
  useCreateGrantCategoryMutation,
  useUpdateGrantCategoryMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useGrantCategoriesQuery();
  const { data: grantTypes = [] } = useGrantTypesQuery();
  const { mutateAsync: toggleStatus } = useGrantCategoryActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.Grant.GrantCategoryItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const getGrantTypeName = (grantTypeId: number) => {
    return grantTypes.find(ct => ct.id === grantTypeId)?.name || '-';
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Grant Category"
      description="Manage the list of all grant categories in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={grantCategory =>
            setPopup({ mode: 'edit', id: grantCategory.id })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            {
              header: 'Grant Type',
              cell: (item: Master.Grant.GrantCategoryItem) => (
                <span>{getGrantTypeName(item.grantTypeId)}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Grant.GrantCategoryItem) => (
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
        title="Create Grant Category"
        subtitle="Fill in the details to add a new grant category."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Grant Category"
        subtitle="Update the grant category details."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateGrantCategoryMutation();

  async function handleSubmit(data: Master.Grant.GrantCategoryForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Grant Category created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create grant category');
    }
  }

  return (
    <GrantCategoryForm
      onSubmit={handleSubmit}
      isSaving={isPending}
      isEditMode={false}
    />
  );
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateGrantCategoryMutation(id);
  const { data, isLoading } = useGrantCategoryQuery(id);
  const DEFAULT = { name: '', grantTypeId: 0 };

  if (isLoading) return <Loader />;

  async function handleSubmit(formData: Master.Grant.GrantCategoryForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Grant Category updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update grant category');
    }
  }

  return (
    <GrantCategoryForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
