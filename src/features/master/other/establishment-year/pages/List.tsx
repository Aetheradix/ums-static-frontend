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
import EstablishmentYearForm from '../components/EstablishmentYearForm';
import {
  useCreateEstablishmentYearMutation,
  useEstablishmentYearActiveStatusMutation,
  useEstablishmentYearQuery,
  useEstablishmentYearsQuery,
  useUpdateEstablishmentYearMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useEstablishmentYearsQuery();
  const { mutateAsync: toggleStatus } =
    useEstablishmentYearActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (
    item: Master.Other.EstablishmentYearItem
  ) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Establishment Year"
      description="Manage the list of all establishment year in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={establishmentYear =>
            setPopup({ mode: 'edit', id: establishmentYear.id })
          }
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Establishment Year' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Other.EstablishmentYearItem) => (
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
        title="Create Establishment Year"
        subtitle="Fill in the details to add a new establishment year."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Establishment Year"
        subtitle="Update the establishment year details."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateEstablishmentYearMutation();

  async function handleSubmit(data: Master.Other.EstablishmentYearForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Establishment Year created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create Establishment Year');
    }
  }

  return (
    <EstablishmentYearForm
      onSubmit={handleSubmit}
      isSaving={isPending}
      isEditMode={false}
    />
  );
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateEstablishmentYearMutation(id);
  const { data, isLoading } = useEstablishmentYearQuery(id);
  const DEFAULT = { name: '' };

  if (isLoading) return <Loader />;

  async function handleSubmit(formData: Master.Other.EstablishmentYearForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Establishment Year updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update Establishment Year');
    }
  }

  return (
    <EstablishmentYearForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
