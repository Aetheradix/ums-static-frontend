import { useSchemeTypesQuery } from 'features/master/schemes/scheme-type/queries';
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
import SchemeCategoryForm from '../components/SchemeCategoryForm';
import {
  useCreateSchemeCategoryMutation,
  useSchemeCategoryActiveStatusMutation,
  useSchemeCategoryQuery,
  useSchemesCategoriesQuery,
  useUpdateSchemeCategoryMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useSchemesCategoriesQuery();
  const { data: schemeTypes = [] } = useSchemeTypesQuery();
  const { mutateAsync } = useSchemeCategoryActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.Scheme.SchemeCategoryItem) => {
    await mutateAsync({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const getSchemTypeName = (schemeTypeId: number) => {
    return schemeTypes.find(st => st.id === schemeTypeId)?.name || '-';
  };

  return (
    <FormPage
      title="Scheme Category"
      description="Manage the list of all scheme categories in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={schemeCategory =>
            setPopup({ mode: 'edit', id: schemeCategory.id })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            {
              header: 'Scheme Type',
              cell: (item: Master.Scheme.SchemeCategoryItem) => (
                <span>{getSchemTypeName(item.schemeTypeId)}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Scheme.SchemeCategoryItem) => (
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
        title="Create Scheme Category"
        subtitle="Fill in the details to add a new scheme category."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Scheme Category"
        subtitle="Update the scheme category details."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateSchemeCategoryMutation();

  async function handleSubmit(data: Master.Scheme.SchemeCategoryForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Scheme Category created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create scheme category');
    }
  }

  return (
    <SchemeCategoryForm
      onSubmit={handleSubmit}
      isSaving={isPending}
      isEditMode={false}
    />
  );
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateSchemeCategoryMutation(id);
  const { data, isLoading } = useSchemeCategoryQuery(id);
  const DEFAULT = { name: '', schemeTypeId: 0 };

  if (isLoading) return <Loader />;

  async function handleSubmit(formData: Master.Scheme.SchemeCategoryForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Scheme Category updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update scheme category');
    }
  }

  return (
    <SchemeCategoryForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
