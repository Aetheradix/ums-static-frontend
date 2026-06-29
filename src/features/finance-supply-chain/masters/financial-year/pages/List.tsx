import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import StatusButton from 'shared/components/buttons/StatusButton';
import { DatePicker, Switch, TextBox } from 'shared/components/forms';
import { Loader } from 'shared/components/progress';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import type { FinancialYearForm, FinancialYearItem } from '../api';
import {
  useCreateFinancialYearMutation,
  useFinancialYearsQuery,
  useToggleFinancialYearStatusMutation,
  useUpdateFinancialYearMutation,
} from '../queries';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: FinancialYearItem };

export default function List() {
  const { data, isLoading } = useFinancialYearsQuery();
  const { mutateAsync: toggleStatus } = useToggleFinancialYearStatusMutation();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Financial Year"
      description="Manage financial year records for the university."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by year name..."
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'name', header: 'Year Name' },
            { field: 'startDate', header: 'Start Date' },
            { field: 'endDate', header: 'End Date' },
            {
              field: 'isCurrent',
              header: 'Current Year',
              sortable: false,
              cell: (item: FinancialYearItem) => (
                <StatusBadge
                  label={item.isCurrent ? 'Current' : 'Closed'}
                  variant={item.isCurrent ? 'approved' : 'neutral'}
                />
              ),
            },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: FinancialYearItem) => (
                <StatusButton
                  value={item.isActive}
                  onClick={() =>
                    toggleStatus({ id: item.id, isActive: !item.isActive })
                  }
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Year"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={popup.mode === 'create' ? 'Add Year' : 'Edit Year'}
      >
        <FinancialYearFormContent
          item={popup.mode === 'edit' ? popup.item : undefined}
          onClose={closePopup}
        />
      </FormPopup>
    </FormPage>
  );
}

function FinancialYearFormContent({
  item,
  onClose,
}: {
  item?: FinancialYearItem;
  onClose: () => void;
}) {
  const createMut = useCreateFinancialYearMutation();
  const updateMut = useUpdateFinancialYearMutation(item?.id ?? 0);
  const mutation = item ? updateMut : createMut;

  const BLANK: FinancialYearForm = {
    name: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    isActive: true,
  };
  const [form, setForm] = useState<FinancialYearForm>(
    item
      ? {
          name: item.name,
          startDate: item.startDate,
          endDate: item.endDate,
          isCurrent: item.isCurrent,
          isActive: item.isActive,
        }
      : BLANK
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await mutation.mutateAsync(form);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={1}>
        <TextBox
          label="Year Name"
          placeholder="e.g. 2024-2025"
          value={form.name}
          onChange={v => setForm(p => ({ ...p, name: v }))}
          required
        />
        <DatePicker
          label="Start Date"
          value={form.startDate ? new Date(form.startDate) : undefined}
          onChange={v =>
            setForm(p => ({
              ...p,
              startDate: v ? v.toISOString().split('T')[0] : '',
            }))
          }
          required
        />
        <DatePicker
          label="End Date"
          value={form.endDate ? new Date(form.endDate) : undefined}
          onChange={v =>
            setForm(p => ({
              ...p,
              endDate: v ? v.toISOString().split('T')[0] : '',
            }))
          }
          required
        />
        <Switch
          label="Mark as Current Year"
          checked={form.isCurrent}
          onChange={v => setForm(p => ({ ...p, isCurrent: v }))}
        />
      </FormGrid>
      <FormActions
        isEditMode={!!item}
        isLoading={mutation.isPending}
        onSave={() => handleSubmit}
        onReset={() => setForm(BLANK)}
      />
    </form>
  );
}
