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
import DownloadForm from '../components/DownloadForm';
import {
  useCreateDownloadMutation,
  useDeleteDownloadMutation,
  useDownloadsQuery,
  useUpdateDownloadMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Cms.DownloadItem };

export default function List() {
  const { data, isLoading } = useDownloadsQuery();
  const { mutateAsync: deleteItem } = useDeleteDownloadMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this download?')) {
      await deleteItem(id);
      ToastService.success('Download deleted successfully.');
    }
  };

  return (
    <FormPage
      title="CMS Downloads"
      description="Manage downloadable documents (PDFs, forms, etc.)."
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
            { field: 'fileType', header: 'Type' },
            { field: 'fileSizeDisplay', header: 'Size' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Cms.DownloadItem) => (
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
        title="Create CMS Download"
        size="lg"
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit CMS Download"
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
  const { mutateAsync, isPending } = useCreateDownloadMutation();

  async function handleSubmit(data: Cms.DownloadForm) {
    try {
      await mutateAsync(data);
      ToastService.success('Download created successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to create download');
    }
  }

  return <DownloadForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({
  item,
  onClose,
}: {
  item: Cms.DownloadItem;
  onClose: () => void;
}) {
  const { mutateAsync, isPending } = useUpdateDownloadMutation(item.id);

  async function handleSubmit(formData: Cms.DownloadForm) {
    try {
      await mutateAsync(formData);
      ToastService.success('Download updated successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to update download');
    }
  }

  return (
    <DownloadForm
      fetchData={item}
      isSaving={isPending}
      onSubmit={handleSubmit}
    />
  );
}
