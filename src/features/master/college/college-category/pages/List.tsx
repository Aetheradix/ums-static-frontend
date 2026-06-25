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
import { useCollegeTypesQuery } from 'features/master/college/college-type/queries';
import { ToastService } from 'services';
import CollegeCategoryForm from '../components/CollegeCategoryForm';
import {
  useCollegeCategoriesQuery,
  useCollegeCategoryActiveStatusMutation,
  useCollegeCategoryQuery,
  useCreateCollegeCategoryMutation,
  useUpdateCollegeCategoryMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useCollegeCategoriesQuery();
  const { data: collegeTypes = [] } = useCollegeTypesQuery();
  const { mutateAsync: toggleStatus } =
    useCollegeCategoryActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (
    item: CollegeMaster.CollegeCategoryItem
  ) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const getCollegeTypeName = (collegeTypeId: number) => {
    return collegeTypes.find(ct => ct.id === collegeTypeId)?.name || '-';
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="College Category"
      description="Manage the list of all college categories in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={collegeCategory =>
            setPopup({ mode: 'edit', id: collegeCategory.id })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            {
              header: 'College Type',
              cell: (item: CollegeMaster.CollegeCategoryItem) => (
                <span>{getCollegeTypeName(item.collegeTypeId)}</span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: CollegeMaster.CollegeCategoryItem) => (
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
        title="Create College Category"
        subtitle="Fill in the details to add a new college category."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit College Category"
        subtitle="Update the college category details."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateCollegeCategoryMutation();

  async function handleSubmit(data: CollegeMaster.CollegeCategoryForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('College Category created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create college category');
    }
  }

  return (
    <CollegeCategoryForm
      onSubmit={handleSubmit}
      isSaving={isPending}
      isEditMode={false}
    />
  );
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateCollegeCategoryMutation(id);
  const { data, isLoading } = useCollegeCategoryQuery(id);
  const DEFAULT = { name: '', collegeTypeId: 0 };

  if (isLoading) return <Loader />;

  async function handleSubmit(formData: CollegeMaster.CollegeCategoryForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('College Category updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update college category');
    }
  }

  return (
    <CollegeCategoryForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
