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
import NewsForm from '../components/NewsForm';
import {
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useNewsQuery,
  useUpdateNewsMutation,
} from '../queries';
import moment from 'moment';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Cms.NewsEventItem };

export default function List() {
  const { data, isLoading } = useNewsQuery();
  const { mutateAsync: deleteItem } = useDeleteNewsMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      await deleteItem(id);
      ToastService.success('News item deleted successfully.');
    }
  };

  return (
    <FormPage
      title="CMS News & Events"
      description="Manage news, events, circulars, and workshops."
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
            { field: 'title', header: 'Title' },
            { field: 'category', header: 'Category' },
            {
              field: 'publishedDate',
              header: 'Published Date',
              cell: (item: Cms.NewsEventItem) => (
                <span>{moment(item.publishedDate).format('DD MMM YYYY')}</span>
              ),
            },
            {
              field: 'isPublished',
              header: 'Status',
              sortable: false,
              cell: (item: Cms.NewsEventItem) => (
                <StatusButton value={item.isPublished} onClick={() => {}} />
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
        title="Create CMS News Item"
        size="lg"
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit CMS News Item"
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
  const { mutateAsync, isPending } = useCreateNewsMutation();

  async function handleSubmit(data: Cms.NewsEventForm) {
    try {
      await mutateAsync(data);
      ToastService.success('News item created successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to create news item');
    }
  }

  return <NewsForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({
  item,
  onClose,
}: {
  item: Cms.NewsEventItem;
  onClose: () => void;
}) {
  const { mutateAsync, isPending } = useUpdateNewsMutation(item.id);

  async function handleSubmit(formData: Cms.NewsEventForm) {
    try {
      await mutateAsync(formData);
      ToastService.success('News item updated successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to update news item');
    }
  }

  return (
    <NewsForm fetchData={item} isSaving={isPending} onSubmit={handleSubmit} />
  );
}
