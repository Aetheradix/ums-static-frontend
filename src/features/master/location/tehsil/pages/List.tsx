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
import TehsilForm from '../components/TehsilForm';
import {
  useCreateTehsilMutation,
  useTehsilActiveStatusMutation,
  useTehsilQuery,
  useTehsilsQuery,
  useUpdateTehsilMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useTehsilsQuery();
  const { mutateAsync: toggleStatus } = useTehsilActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.TehsilItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Tehsil"
      description="Manage the list of all tehsils in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={tehsil => setPopup({ mode: 'edit', id: tehsil.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            { field: 'districtName', header: 'District' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.TehsilItem) => (
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
        title="Create Tehsil"
        subtitle="Fill in the details to add a new tehsil."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Tehsil"
        subtitle="Update the details of the tehsil."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateTehsilMutation();

  async function handleSubmit(data: Master.TehsilForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Tehsil created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create tehsil');
    }
  }

  return <TehsilForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateTehsilMutation(id);
  const { data, isLoading } = useTehsilQuery(id);
  const DEFAULT: Master.TehsilForm = {
    code: '',
    name: '',
    districtId: 0,
    isActive: true,
  };

  async function handleSubmit(formData: Master.TehsilForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Tehsil updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update tehsil');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <TehsilForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
