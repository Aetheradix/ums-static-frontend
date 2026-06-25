import { useCallback, useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { ToastService } from 'services';
import StatForm from '../components/StatForm';
import { useStatsQuery, useUpdateStatMutation } from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'edit'; item: Cms.UniversityStatItem };

export default function List() {
  const { data, isLoading } = useStatsQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="CMS University Statistics"
      description="Manage the key statistics displayed on the public CMS website."
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'label', header: 'Label' },
            { field: 'value', header: 'Value' },
            { field: 'icon', header: 'Icon' },
            { field: 'displayOrder', header: 'Display Order' },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit CMS Statistic"
        size="lg"
      >
        {popup.mode === 'edit' && (
          <EditContent item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function EditContent({
  item,
  onClose,
}: {
  item: Cms.UniversityStatItem;
  onClose: () => void;
}) {
  const { mutateAsync, isPending } = useUpdateStatMutation(item.id);

  async function handleSubmit(formData: Cms.UniversityStatForm) {
    try {
      await mutateAsync(formData);
      ToastService.success('Statistic updated successfully.');
      onClose();
    } catch {
      ToastService.error('Failed to update statistic');
    }
  }

  return (
    <StatForm fetchData={item} isSaving={isPending} onSubmit={handleSubmit} />
  );
}
