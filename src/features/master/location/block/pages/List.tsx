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
import BlockForm from '../components/BlockForm';
import {
  useBlockActiveStatusMutation,
  useBlockQuery,
  useBlocksQuery,
  useCreateBlockMutation,
  useUpdateBlockMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useBlocksQuery();
  const { mutateAsync: toggleStatus } = useBlockActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (item: Master.BlockItem) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Block"
      description="Manage the list of all blocks in the system."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={block => setPopup({ mode: 'edit', id: block.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            { field: 'districtName', header: 'District' },
            { field: 'tehsilName', header: 'Tehsil' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.BlockItem) => (
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
        title="Create Block"
        subtitle="Fill in the details to add a new block."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Block"
        subtitle="Update the details of the block."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateBlockMutation();

  async function handleSubmit(data: Master.BlockForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Block created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create block');
    }
  }

  return <BlockForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateBlockMutation(id);
  const { data, isLoading } = useBlockQuery(id);
  const DEFAULT: Master.BlockForm = {
    code: '',
    name: '',
    districtId: 0,
    tehsilId: 0,
    isActive: true,
  };

  async function handleSubmit(formData: Master.BlockForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('Block updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update block');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <BlockForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
