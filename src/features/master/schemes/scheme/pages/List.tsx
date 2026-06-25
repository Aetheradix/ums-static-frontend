import { useSchemeTypesQuery } from 'features/master/schemes/scheme-type/queries';
import { useSchemesCategoriesQuery } from 'features/master/schemes/scheme-category/queries';
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
import SchemeForm from '../components/SchemeForm';
import {
  useCreateSchemeMutation,
  useSchemeActiveStatusMutation,
  useSchemeQuery,
  useSchemesQuery,
  useUpdateSchemeMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useSchemesQuery();
  const { data: schemeTypes = [] } = useSchemeTypesQuery();
  const { data: schemeCategories = [] } = useSchemesCategoriesQuery();
  const { mutateAsync } = useSchemeActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.Scheme.SchemeItem) => {
    await mutateAsync({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const getSchemeTypeName = (schemeTypeId: number) => {
    return schemeTypes.find(st => st.id === schemeTypeId)?.name || '-';
  };

  const getSchemeCategoryName = (schemeCategoryId: number) => {
    return (
      schemeCategories.find(
        (sc: Master.Scheme.SchemeCategoryItem) => sc.id === schemeCategoryId
      )?.name || '-'
    );
  };

  return (
    <FormPage
      title="Scheme"
      description="Manage the list of all schemes in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={scheme => setPopup({ mode: 'edit', id: scheme.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            {
              header: 'Scheme Type',
              cell: (item: Master.Scheme.SchemeItem) => (
                <span>{getSchemeTypeName(item.schemeTypeId)}</span>
              ),
            },
            {
              header: 'Scheme Category',
              cell: (item: Master.Scheme.SchemeItem) => (
                <span>{getSchemeCategoryName(item.schemeCategoryId)}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Scheme.SchemeItem) => (
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
        title="Create Scheme"
        subtitle="Fill in the details to add a new scheme."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Scheme"
        subtitle="Update the scheme details."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateSchemeMutation();

  async function handleSubmit(data: Master.Scheme.SchemeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Scheme created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create scheme');
    }
  }

  return (
    <SchemeForm
      onSubmit={handleSubmit}
      isSaving={isPending}
      isEditMode={false}
    />
  );
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateSchemeMutation(id);
  const { data, isLoading } = useSchemeQuery(id);
  const DEFAULT = { name: '', code: '', schemeTypeId: 0, schemeCategoryId: 0 };

  if (isLoading) return <Loader />;

  async function handleSubmit(formData: Master.Scheme.SchemeForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Scheme updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update scheme');
    }
  }

  return (
    <SchemeForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
