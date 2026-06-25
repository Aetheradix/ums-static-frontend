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
import StateForm from '../components/StateForm';
import {
  useCreateStateMutation,
  useStateActiveStatusMutation,
  useStateQuery,
  useStatesQuery,
  useUpdateStateMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useStatesQuery();
  const { mutateAsync: toggleStatus } = useStateActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.StateItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="State"
      description="Manage the list of all states in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}

        <GridPanel
          data={data}
          onEdit={state => setPopup({ mode: 'edit', id: state.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.StateItem) => (
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

      {/* Create Popup */}
      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Create State"
        subtitle="Fill in the details to add a new state."
      >
        <CreateStateContent onClose={closePopup} />
      </FormPopup>

      {/* Edit Popup */}
      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit State"
        subtitle="Update the details of the state."
      >
        {popup.mode === 'edit' && (
          <EditStateContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

/* ── Inline Create Content ── */
function CreateStateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateStateMutation();

  async function handleSubmit(data: Master.StateForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('State created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create state');
    }
  }

  return <StateForm onSubmit={handleSubmit} isSaving={isPending} />;
}

/* ── Inline Edit Content ── */
function EditStateContent({
  id,
  onClose,
}: {
  id: number;
  onClose: () => void;
}) {
  const { mutateAsync, isPending } = useUpdateStateMutation(id);
  const { data, isLoading } = useStateQuery(id);

  const DEFAULT: Master.StateForm = { code: '', name: '', isActive: true };

  async function handleSubmit(formData: Master.StateForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('State updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update state');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <StateForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
