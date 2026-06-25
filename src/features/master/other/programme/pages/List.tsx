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
import ProgrammeForm from '../components/ProgrammeForm';
import {
  useCreateProgrammeMutation,
  useProgrammeActiveStatusMutation,
  useProgrammeQuery,
  useProgrammesQuery,
  useUpdateProgrammeMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useProgrammesQuery();
  const { mutateAsync: toggleStatus } = useProgrammeActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.Other.ProgrammeItem) => {
    await toggleStatus({
      id: item.id,
      isActive: !item.isActive,
    });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Programme"
      description="Manage the list of all programmes in the system."
    >
      <FormCard>
        <GridPanel
          data={data as Master.Other.ProgrammeItem[]}
          loading={isLoading}
          onEdit={programme => setPopup({ mode: 'edit', id: programme.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'programmeDuration', header: 'Duration' },
            { field: 'degreeLevelName', header: 'Degree Level' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Other.ProgrammeItem) => (
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
        title="Create Programme"
        subtitle="Fill in the details to add a new programme."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Programme"
        subtitle="Update the details of the programme."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateProgrammeMutation();

  async function handleSubmit(data: Master.Other.ProgrammeForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Programme created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create programme.');
    }
  }

  return <ProgrammeForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateProgrammeMutation(id);
  const { data, isLoading } = useProgrammeQuery(id);
  const DEFAULT = { name: '', programmeDuration: '', degreeLevelId: 0 };

  async function handleSubmit(formData: Master.Other.ProgrammeForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Programme updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update programme');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <ProgrammeForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
