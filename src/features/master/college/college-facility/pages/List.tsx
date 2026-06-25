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
import AvailableFacilityForm from '../components/AvailableFacilityForm';
import {
  useAvailableFacilitiesQuery,
  useAvailableFacilityActiveStatusMutation,
  useAvailableFacilityQuery,
  useCreateAvailableFacilityMutation,
  useUpdateAvailableFacilityMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useAvailableFacilitiesQuery();
  const { mutateAsync: toggleStatus } =
    useAvailableFacilityActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (
    item: CollegeMaster.AvailableFacilityItem
  ) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Available Facility"
      description="Manage the list of all available facility in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={availableFacility =>
            setPopup({ mode: 'edit', id: availableFacility.id })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'facilityName', header: 'Facility Name' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: CollegeMaster.AvailableFacilityItem) => (
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
        title="Create Available Facility"
        subtitle="Fill in the details to add a new available facility."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Available Facility"
        subtitle="Update the available facility details."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateAvailableFacilityMutation();

  async function handleSubmit(data: CollegeMaster.AvailableFacilityForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Available Facility created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create Available Facility');
    }
  }

  return (
    <AvailableFacilityForm
      onSubmit={handleSubmit}
      isSaving={isPending}
      isEditMode={false}
    />
  );
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateAvailableFacilityMutation(id);
  const { data, isLoading } = useAvailableFacilityQuery(id);
  const DEFAULT = { facilityName: '' };

  if (isLoading) return <Loader />;

  async function handleSubmit(formData: CollegeMaster.AvailableFacilityForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Available Facility updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update Available Facility');
    }
  }

  return (
    <AvailableFacilityForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
