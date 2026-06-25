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
import DivisionForm from '../components/DivisionForm';
import {
  useCreateDivisionMutation,
  useDivisionActiveStatusMutation,
  useDivisionQuery,
  useDivisionsQuery,
  useUpdateDivisionMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useDivisionsQuery();
  const { mutateAsync: toggleStatus } = useDivisionActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.DivisionItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Division"
      description="Manage the list of all divisions in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={division => setPopup({ mode: 'edit', id: division.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            { field: 'stateName', header: 'State' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.DivisionItem) => (
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
        title="Create Division"
        subtitle="Fill in the details to add a new division."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Division"
        subtitle="Update the details of the division."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateDivisionMutation();

  async function handleSubmit(data: Master.DivisionForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Division created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create division');
    }
  }

  return <DivisionForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateDivisionMutation(id);
  const { data, isLoading } = useDivisionQuery(id);
  const DEFAULT: Master.DivisionForm = {
    code: '',
    name: '',
    stateId: 0,
    isActive: true,
  };

  async function handleSubmit(formData: Master.DivisionForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Division updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update division');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <DivisionForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
