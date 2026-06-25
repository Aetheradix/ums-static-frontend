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
import DistrictForm from '../components/DistrictForm';
import {
  useCreateDistrictMutation,
  useDistrictActiveStatusMutation,
  useDistrictQuery,
  useDistrictsQuery,
  useUpdateDistrictMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useDistrictsQuery();
  const { mutateAsync: toggleStatus } = useDistrictActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.DistrictItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="District"
      description="Manage the list of all districts in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={district => setPopup({ mode: 'edit', id: district.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            { field: 'divisionName', header: 'Division' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.DistrictItem) => (
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
        title="Create District"
        subtitle="Fill in the details to add a new district."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit District"
        subtitle="Update the details of the district."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateDistrictMutation();

  async function handleSubmit(data: Master.DistrictForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('District created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create district');
    }
  }

  return <DistrictForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateDistrictMutation(id);
  const { data, isLoading } = useDistrictQuery(id);
  const DEFAULT: Master.DistrictForm = {
    code: '',
    name: '',
    divisionId: 0,
    isActive: true,
  };

  async function handleSubmit(formData: Master.DistrictForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('District updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update district');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <DistrictForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
