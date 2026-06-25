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
import DepartmentForm from '../components/DepartmentForm';
import {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useDepartmentQuery,
  useDepartmentsQuery,
  useUpdateDepartmentMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useDepartmentsQuery();
  const { mutateAsync: deleteItem } = useDeleteDepartmentMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      await deleteItem(id);
      ToastService.success('Department deleted successfully.');
    }
  };

  return (
    <FormPage
      title="CMS Departments"
      description="Manage departments displayed on the public CMS website."
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          onEdit={dept => setPopup({ mode: 'edit', id: dept.id })}
          onRemove={dept => handleDelete(dept.id)}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'shortName', header: 'Short Name' },
            { field: 'totalCourses', header: 'Courses' },
            { field: 'totalFaculty', header: 'Faculty' },
            { field: 'totalStudents', header: 'Students' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Cms.DepartmentItem) => (
                <StatusButton value={item.isActive} onClick={() => {}} />
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
        title="Create CMS Department"
        size="lg"
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit CMS Department"
        size="lg"
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateDepartmentMutation();

  async function handleSubmit(data: Cms.DepartmentForm) {
    try {
      await mutateAsync(data);
      ToastService.success('Department created successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to create department');
    }
  }

  return <DepartmentForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateDepartmentMutation(id);
  const { data, isLoading } = useDepartmentQuery(id);

  async function handleSubmit(formData: Cms.DepartmentForm) {
    try {
      await mutateAsync(formData);
      ToastService.success('Department updated successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to update department');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <DepartmentForm
      fetchData={data?.data}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
