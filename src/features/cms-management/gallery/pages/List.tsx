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
import GalleryForm from '../components/GalleryForm';
import {
  useCreateGalleryMutation,
  useDeleteGalleryMutation,
  useGalleryQuery,
} from '../queries';

type PopupState = { mode: 'closed' } | { mode: 'create' };

export default function List() {
  const { data, isLoading } = useGalleryQuery();
  const { mutateAsync: deleteItem } = useDeleteGalleryMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      await deleteItem(id);
      ToastService.success('Gallery item deleted successfully.');
    }
  };

  return (
    <FormPage
      title="CMS Gallery"
      description="Manage images displayed on the public CMS website."
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          onRemove={item => handleDelete(item.id)}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'label', header: 'Label' },
            { field: 'emoji', header: 'Emoji' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Cms.GalleryItem) => (
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
        title="Create CMS Gallery Item"
        size="lg"
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateGalleryMutation();

  async function handleSubmit(data: Cms.GalleryForm) {
    try {
      await mutateAsync(data);
      ToastService.success('Gallery item created successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to create gallery item');
    }
  }

  return <GalleryForm onSubmit={handleSubmit} isSaving={isPending} />;
}
