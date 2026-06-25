import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import StatusButton from 'shared/components/buttons/StatusButton';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { ToastService } from 'services';
import FacilityForm from '../components/FacilityForm';
import {
  useCreateFacilityMutation,
  useDeleteFacilityMutation,
  useFacilitiesQuery,
  useUpdateFacilityMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Cms.FacilityItem };

export default function List() {
  const { data, isLoading } = useFacilitiesQuery();
  const { mutateAsync: deleteItem } = useDeleteFacilityMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      await deleteItem(id);
      ToastService.success('Facility deleted successfully.');
    }
  };

  return (
    <FormPage
      title="CMS Facilities"
      description="Manage campus facilities and infrastructure."
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          onEdit={item => setPopup({ mode: 'edit', item })}
          onRemove={item => handleDelete(item.id)}
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
              cell: (item: Cms.FacilityItem) => (
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
        title="Create CMS Facility"
        size="lg"
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit CMS Facility"
        size="lg"
      >
        {popup.mode === 'edit' && (
          <EditContent item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateFacilityMutation();

  async function handleSubmit(data: Cms.FacilityForm) {
    try {
      await mutateAsync(data);
      ToastService.success('Facility created successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to create facility');
    }
  }

  return <FacilityForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({
  item,
  onClose,
}: {
  item: Cms.FacilityItem;
  onClose: () => void;
}) {
  const { mutateAsync, isPending } = useUpdateFacilityMutation(item.id);

  async function handleSubmit(formData: Cms.FacilityForm) {
    try {
      await mutateAsync(formData);
      ToastService.success('Facility updated successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to update facility');
    }
  }

  return (
    <FacilityForm
      fetchData={item}
      isSaving={isPending}
      onSubmit={handleSubmit}
    />
  );
}
