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
  useDepartmentActiveStatusMutation,
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
  const { mutateAsync: toggleStatus } = useDepartmentActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.DepartmentItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Department"
      description="Manage the list of all departments in the system."
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={isLoading}
          onEdit={department => setPopup({ mode: 'edit', id: department.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            { field: 'officeTypeName', header: 'Office Type' },
            { field: 'hodName', header: 'Head of Department' },
            { field: 'contactNumber', header: 'Contact Number' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.DepartmentItem) => (
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
        title="Create Department"
        subtitle="Fill in the details to add a new department."
        size="lg"
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Department"
        subtitle="Update the details of the department."
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

  async function handleSubmit(data: Master.DepartmentForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Department created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create department');
    }
  }

  return <DepartmentForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateDepartmentMutation(id);
  const { data, isLoading } = useDepartmentQuery(id);
  const DEFAULT: Master.DepartmentForm = {
    code: '',
    name: '',
    officeTypeId: 0,
    hodName: '',
    contactNumber: '',
  };

  async function handleSubmit(formData: Master.DepartmentForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Department updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update department');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <DepartmentForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
