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
import NoticeForm from '../components/NoticeForm';
import {
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  useNoticesQuery,
  useUpdateNoticeMutation,
} from '../queries';
import moment from 'moment';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Cms.NoticeItem };

export default function List() {
  const { data, isLoading } = useNoticesQuery();
  const { mutateAsync: deleteItem } = useDeleteNoticeMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      await deleteItem(id);
      ToastService.success('Notice deleted successfully.');
    }
  };

  return (
    <FormPage
      title="CMS Notices"
      description="Manage scrolling or highlighted notices displayed on the public CMS website."
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
            { field: 'text', header: 'Notice Text' },
            {
              field: 'expiresAt',
              header: 'Expires At',
              cell: (item: Cms.NoticeItem) => (
                <span>
                  {item.expiresAt
                    ? moment(item.expiresAt).format('DD MMM YYYY')
                    : 'Never'}
                </span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Cms.NoticeItem) => (
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
        title="Create CMS Notice"
        size="lg"
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit CMS Notice"
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
  const { mutateAsync, isPending } = useCreateNoticeMutation();

  async function handleSubmit(data: Cms.NoticeForm) {
    try {
      await mutateAsync(data);
      ToastService.success('Notice created successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to create notice');
    }
  }

  return <NoticeForm onSubmit={handleSubmit} isSaving={isPending} />;
}

function EditContent({
  item,
  onClose,
}: {
  item: Cms.NoticeItem;
  onClose: () => void;
}) {
  const { mutateAsync, isPending } = useUpdateNoticeMutation(item.id);

  async function handleSubmit(formData: Cms.NoticeForm) {
    try {
      await mutateAsync(formData);
      ToastService.success('Notice updated successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to update notice');
    }
  }

  return (
    <NoticeForm fetchData={item} isSaving={isPending} onSubmit={handleSubmit} />
  );
}
