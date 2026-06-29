import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox, NumberBox, DropDownList } from 'shared/components/forms';
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
import { FINANCIAL_YEARS } from '../../../mock-data';
import type { BudgetForm, BudgetItem } from '../api';
import {
  useBudgetsQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
} from '../queries';

const FY_OPTIONS = FINANCIAL_YEARS.map(f => ({ label: f.name, value: f.name }));
const STATUS_OPTIONS = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: BudgetItem };

export default function List() {
  const { data, isLoading } = useBudgetsQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Budget Creation"
      description="Create and manage annual and supplementary budgets."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by code, title, financial year..."
          onEdit={item => setPopup({ mode: 'edit', item })}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'budgetCode', header: 'Budget Code' },
            { field: 'title', header: 'Title' },
            { field: 'financialYear', header: 'Financial Year' },
            {
              field: 'totalAmount',
              header: 'Total Amount (₹)',
              cell: (item: BudgetItem) => (
                <span>₹{item.totalAmount.toLocaleString('en-IN')}</span>
              ),
            },
            { field: 'preparedBy', header: 'Prepared By' },
            { field: 'createdDate', header: 'Created Date' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: BudgetItem) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Approved' ||
                    item.status === 'Delivered' ||
                    item.status === 'Good' ||
                    item.status === 'Paid' ||
                    item.status === 'Active' ||
                    item.status === 'Completed' ||
                    item.status === 'Filed' ||
                    item.status === 'Deposited' ||
                    item.status === 'Issued' ||
                    item.status === 'Matched' ||
                    item.status === 'Open'
                      ? 'approved'
                      : item.status === 'Pending' ||
                          item.status === 'Draft' ||
                          item.status === 'Defective' ||
                          item.status === 'Repair' ||
                          item.status === 'Medium'
                        ? 'pending'
                        : item.status === 'Closed' ||
                            item.status === 'Retired' ||
                            item.status === 'Low' ||
                            item.status === 'Cancelled'
                          ? 'neutral'
                          : 'rejected'
                  }
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create Budget"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
        />
      </FormCard>
      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Create Budget"
        subtitle="Add a new budget entry."
        size="lg"
      >
        <BudgetFormContent onClose={closePopup} />
      </FormPopup>
      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Budget"
        subtitle="Update budget details."
        size="lg"
      >
        {popup.mode === 'edit' && (
          <BudgetFormContent item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function BudgetFormContent({
  item,
  onClose,
}: {
  item?: BudgetItem;
  onClose: () => void;
}) {
  const createMut = useCreateBudgetMutation();
  const updateMut = useUpdateBudgetMutation(item?.id ?? 0);
  const mutation = item ? updateMut : createMut;
  const BLANK: BudgetForm = {
    budgetCode: '',
    title: '',
    financialYear: '',
    totalAmount: 0,
    status: 'Draft',
    preparedBy: '',
    approvedBy: '',
    createdDate: new Date().toISOString().split('T')[0],
  };
  const [form, setForm] = useState<BudgetForm>(
    item
      ? {
          budgetCode: item.budgetCode,
          title: item.title,
          financialYear: item.financialYear,
          totalAmount: item.totalAmount,
          status: item.status,
          preparedBy: item.preparedBy,
          approvedBy: item.approvedBy,
          createdDate: item.createdDate,
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
      <FormGrid columns={2}>
        <TextBox
          label="Budget Code"
          placeholder="e.g. BDG-2025-002"
          value={form.budgetCode}
          onChange={v => setForm(p => ({ ...p, budgetCode: v }))}
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Financial Year"
          data={FY_OPTIONS}
          value={form.financialYear}
          onChange={v => setForm(p => ({ ...p, financialYear: v as string }))}
          required
        />
        <TextBox
          label="Title"
          placeholder="e.g. Annual Budget 2025-26"
          value={form.title}
          onChange={v => setForm(p => ({ ...p, title: v }))}
          required
        />
        <NumberBox
          label="Total Amount (₹)"
          placeholder="e.g. 25000000"
          value={form.totalAmount}
          onChange={v => setForm(p => ({ ...p, totalAmount: v ?? 0 }))}
          required
        />
        <TextBox
          label="Prepared By"
          placeholder="e.g. Dr. R. Sharma"
          value={form.preparedBy}
          onChange={v => setForm(p => ({ ...p, preparedBy: v }))}
          required
        />
        <DropDownList
          textField="label"
          valueField="value"
          label="Status"
          data={STATUS_OPTIONS}
          value={form.status}
          onChange={v => setForm(p => ({ ...p, status: v as string }))}
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
