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
import CourseForm from '../components/CourseForm';
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useCourseQuery,
  useCoursesQuery,
  useUpdateCourseMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useCoursesQuery();
  const { mutateAsync: deleteItem } = useDeleteCourseMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteItem(id);
      ToastService.success('Course deleted successfully.');
    }
  };

  return (
    <FormPage
      title="CMS Courses"
      description="Manage courses displayed on the public CMS website."
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          onEdit={course => setPopup({ mode: 'edit', id: course.id })}
          onRemove={course => handleDelete(course.id)}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'departmentName', header: 'Department' },
            { field: 'level', header: 'Level' },
            { field: 'duration', header: 'Duration' },
            { field: 'annualFees', header: 'Annual Fees (₹)' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Cms.CourseItem) => (
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
        title="Create CMS Course"
        size="lg"
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit CMS Course"
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
  const { mutateAsync, isPending } = useCreateCourseMutation();

  async function handleSubmit(data: Cms.CourseForm) {
    try {
      await mutateAsync(data);
      ToastService.success('Course created successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to create course');
    }
  }

  return <CourseForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateCourseMutation(id);
  const { data, isLoading } = useCourseQuery(id);

  async function handleSubmit(formData: Cms.CourseForm) {
    try {
      await mutateAsync(formData);
      ToastService.success('Course updated successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to update course');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <CourseForm
      fetchData={data?.data}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
