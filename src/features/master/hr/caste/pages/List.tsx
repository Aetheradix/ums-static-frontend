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
import CasteForm from '../components/CasteForm';
import {
  useCasteActiveStatusMutation,
  useCasteQuery,
  useCastesQuery,
  useCreateCasteMutation,
  useUpdateCasteMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useCastesQuery();
  const { mutateAsync: toggleStatus } = useCasteActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.HR.CasteItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Caste"
      description="Manage the list of all castes in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={caste => setPopup({ mode: 'edit', id: caste.id })}
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
              cell: (item: Master.HR.CasteItem) => (
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
        title="Create Caste"
        subtitle="Fill in the details to add a new caste."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Caste"
        subtitle="Update the details of the caste."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateCasteMutation();

  async function handleSubmit(data: Master.HR.CasteForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Caste created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create caste');
    }
  }

  return <CasteForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateCasteMutation(id);
  const { data, isLoading } = useCasteQuery(id);
  const DEFAULT: Master.HR.CasteForm = { name: '', isActive: true };

  async function handleSubmit(formData: Master.HR.CasteForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Caste updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update caste');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <CasteForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
