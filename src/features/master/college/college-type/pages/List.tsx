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
import CollegeTypeForm from '../components/CollegeTypeForm';
import {
  useCollegeTypeActiveStatusMutation,
  useCollegeTypeQuery,
  useCollegeTypesQuery,
  useCreateCollegeTypeMutation,
  useUpdateCollegeTypeMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useCollegeTypesQuery();
  const { mutateAsync: toggleStatus } = useCollegeTypeActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: CollegeMaster.CollegeTypeItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="College Type"
      description="Manage the list of all college types in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={collegeType => setPopup({ mode: 'edit', id: collegeType.id })}
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
              cell: (item: CollegeMaster.CollegeTypeItem) => (
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
        title="Create College Type"
        subtitle="Fill in the details to add a new college type."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit College Type"
        subtitle="Update the college type details."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateCollegeTypeMutation();

  async function handleSubmit(data: CollegeMaster.CollegeTypeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('College Type created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create college type');
    }
  }

  return (
    <CollegeTypeForm
      onSubmit={handleSubmit}
      isSaving={isPending}
      isEditMode={false}
    />
  );
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateCollegeTypeMutation(id);
  const { data, isLoading } = useCollegeTypeQuery(id);
  const DEFAULT = { name: '' };

  if (isLoading) return <Loader />;

  async function handleSubmit(formData: CollegeMaster.CollegeTypeForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('College Type updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update college type');
    }
  }

  return (
    <CollegeTypeForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
