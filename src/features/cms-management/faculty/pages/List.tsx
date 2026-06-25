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
import FacultyForm from '../components/FacultyForm';
import {
  useCreateFacultyMutation,
  useDeleteFacultyMutation,
  useFacultyMemberQuery,
  useFacultyQuery,
  useUpdateFacultyMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useFacultyQuery();
  const { mutateAsync: deleteItem } = useDeleteFacultyMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const handleDelete = async (id: number) => {
    if (
      window.confirm('Are you sure you want to delete this faculty member?')
    ) {
      await deleteItem(id);
      ToastService.success('Faculty member deleted successfully.');
    }
  };

  return (
    <FormPage
      title="CMS Faculty"
      description="Manage faculty members displayed on the public CMS website."
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          onEdit={faculty => setPopup({ mode: 'edit', id: faculty.id })}
          onRemove={faculty => handleDelete(faculty.id)}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'fullName', header: 'Name' },
            { field: 'designation', header: 'Designation' },
            { field: 'departmentName', header: 'Department' },
            { field: 'qualification', header: 'Qualification' },
            { field: 'experienceYears', header: 'Experience (Yrs)' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Cms.FacultyItem) => (
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
        title="Create CMS Faculty Member"
        size="lg"
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit CMS Faculty Member"
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
  const { mutateAsync, isPending } = useCreateFacultyMutation();

  async function handleSubmit(data: Cms.FacultyForm) {
    try {
      await mutateAsync(data);
      ToastService.success('Faculty member created successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to create faculty member');
    }
  }

  return <FacultyForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateFacultyMutation(id);
  const { data, isLoading } = useFacultyMemberQuery(id);

  async function handleSubmit(formData: Cms.FacultyForm) {
    try {
      await mutateAsync(formData);
      ToastService.success('Faculty member updated successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to update faculty member');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <FacultyForm
      fetchData={data?.data}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
