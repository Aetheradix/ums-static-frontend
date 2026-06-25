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
import { useGrantTypesQuery } from 'features/master/grant/grant-type/queries';
import { useGrantCategoriesQuery } from 'features/master/grant/grant-category/queries';
import { ToastService } from 'services';
import EligibilityApplicationProcessForm from '../components/EligibilityApplicationProcessForm';
import {
  useEligibilityApplicationProcessesQuery,
  useEligibilityApplicationProcessActiveStatusMutation,
  useEligibilityApplicationProcessQuery,
  useCreateEligibilityApplicationProcessMutation,
  useUpdateEligibilityApplicationProcessMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: number };

export default function List() {
  const { data, isLoading } = useEligibilityApplicationProcessesQuery();
  const { data: grantTypes = [] } = useGrantTypesQuery();
  const { data: grantCategories = [] } = useGrantCategoriesQuery();
  const { mutateAsync: toggleStatus } =
    useEligibilityApplicationProcessActiveStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const handleToggleStatus = async (
    item: Master.Grant.EligibilityApplicationProcessItem
  ) => {
    await toggleStatus({ id: item.id, isActive: !item.isActive });
  };

  const getGrantTypeName = (grantTypeId: number) => {
    return grantTypes.find(ct => ct.id === grantTypeId)?.name || '-';
  };

  const getGrantCategoryName = (grantCategoryId: number) => {
    return grantCategories.find(gc => gc.id === grantCategoryId)?.name || '-';
  };

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Eligibility Application Process"
      description="Manage eligibility criteria, application process, and approval process for grants."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data}
          onEdit={item => setPopup({ mode: 'edit', id: item.id })}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            {
              field: 'grantTypeId',
              header: 'Grant Type',
              cell: (item: Master.Grant.EligibilityApplicationProcessItem) => (
                <span>{getGrantTypeName(item.grantTypeId)}</span>
              ),
            },
            {
              field: 'grantCategoryId',
              header: 'Grant Category',
              cell: (item: Master.Grant.EligibilityApplicationProcessItem) => (
                <span>{getGrantCategoryName(item.grantCategoryId)}</span>
              ),
            },
            {
              field: 'eligibilityText',
              header: 'Eligibility',
              cell: (item: Master.Grant.EligibilityApplicationProcessItem) => (
                <span title={item.eligibilityText || ''}>
                  {item.eligibilityText && item.eligibilityText.length > 50
                    ? item.eligibilityText.substring(0, 50) + '...'
                    : item.eligibilityText || '-'}
                </span>
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: Master.Grant.EligibilityApplicationProcessItem) => (
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
        title="Create Eligibility Application Process"
        subtitle="Fill in the details to add a new eligibility application process."
      >
        <CreateContent onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Eligibility Application Process"
        subtitle="Update the eligibility application process details."
      >
        {popup.mode === 'edit' && (
          <EditContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function CreateContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } =
    useCreateEligibilityApplicationProcessMutation();

  async function handleSubmit(
    data: Master.Grant.EligibilityApplicationProcessForm
  ) {
    try {
      const result = await mutateAsync({ ...data, isActive: true });
      if (result) {
        ToastService.success(
          'Eligibility Application Process created successfully.'
        );
        onClose();
      }
    } catch {
      ToastService.error('Failed to create eligibility application process');
    }
  }

  return (
    <EligibilityApplicationProcessForm
      onSubmit={handleSubmit}
      isSaving={isPending}
      isEditMode={false}
    />
  );
}

function EditContent({ id, onClose }: { id: number; onClose: () => void }) {
  const { mutateAsync, isPending } =
    useUpdateEligibilityApplicationProcessMutation(id);
  const { data, isLoading } = useEligibilityApplicationProcessQuery(id);
  const DEFAULT = {
    grantTypeId: 0,
    grantCategoryId: 0,
    eligibilityText: '',
    applicationProcessText: '',
    approvalProcessText: '',
  };

  if (isLoading) return <Loader />;

  async function handleSubmit(
    formData: Master.Grant.EligibilityApplicationProcessForm
  ) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success(
          'Eligibility Application Process updated successfully.'
        );
        onClose();
      }
    } catch {
      ToastService.error('Failed to update eligibility application process');
    }
  }

  return (
    <EligibilityApplicationProcessForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
    />
  );
}
