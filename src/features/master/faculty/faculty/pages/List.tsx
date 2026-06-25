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
  useFacultiesQuery,
  useFacultyActiveStatusMutation,
  useFacultyQuery,
  useUpdateFacultyMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useFacultiesQuery();
  const { mutateAsync: toggleStatus } = useFacultyActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.FacultyItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Faculty"
      description="Manage the list of all faculties in the system."
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={isLoading}
          onEdit={faculty => setPopup({ mode: 'edit', id: faculty.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            { field: 'officeTypeName', header: 'Office Type' },
            { field: 'departmentName', header: 'Department' },
            { field: 'designationName', header: 'Designation' },
            { field: 'mobile', header: 'Mobile' },
            { field: 'email', header: 'Email' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.FacultyItem) => (
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
        title="Create Faculty"
        subtitle="Fill in the details to add a new faculty."
        size="lg"
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Faculty"
        subtitle="Update the details of the faculty."
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

  async function handleSubmit(data: Master.FacultyForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Faculty created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create faculty');
    }
  }

  return <FacultyForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { data, isLoading } = useFacultyQuery(id);
  const { mutateAsync, isPending } = useUpdateFacultyMutation(id);

  async function handleSubmit(formData: Master.FacultyForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Faculty updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update faculty');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <FacultyForm
      onSubmit={handleSubmit}
      fetchData={() => Promise.resolve(data!)}
      isSaving={isPending}
      isEditMode
    />
  );
}
