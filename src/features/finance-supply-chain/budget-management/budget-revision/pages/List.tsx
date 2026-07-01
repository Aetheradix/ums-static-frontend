import React, { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, NumberBox, TextBox } from 'shared/components/forms';
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
import { BUDGET_HEADS, BUDGETS } from '../../../mock-data';
import type { BudgetRevisionForm, BudgetRevisionItem } from '../api';
import {
  useBudgetRevisionsQuery,
  useCreateBudgetRevisionMutation,
  useUpdateBudgetRevisionMutation,
} from '../queries';

const fmt = (v: number) => `₹${v.toLocaleString('en-IN')}`;

type PopupState = { mode: 'closed' } | { mode: 'create' };

// const STATUS_OPTIONS = [
//   { label: 'All', value: 'All' },
//   { label: 'Pending', value: 'Pending' },
//   { label: 'Approved', value: 'Approved' },
//   { label: 'Rejected', value: 'Rejected' },
// ];

export default function List() {
  const { data = [], isLoading } = useBudgetRevisionsQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  // const [statusFilter, setStatusFilter] = useState('All');

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const updateMut = useUpdateBudgetRevisionMutation();

  const handleApprove = async (id: number) => {
    await updateMut.mutateAsync({ id, data: { status: 'Approved' } });
  };

  const handleReject = async (id: number) => {
    await updateMut.mutateAsync({ id, data: { status: 'Rejected' } });
  };

  // const filteredData = statusFilter === 'All' ? data : data.filter(d => d.status === statusFilter);

  return (
    <FormPage
      title="Budget Revision"
      description="Track budget revision requests and their approval status."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          // data={filteredData}
          data={data}
          searchBox
          searchPlaceholder="Search by revision no, budget code, head..."
          toolbar={
            <div className="flex gap-4 items-center">
              <div className="w-48 [&_.input-block]:!mb-0">
                {/* <DropDownList
                  textField="label"
                  valueField="value"
                  data={STATUS_OPTIONS}
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(v as string)}
                /> */}
              </div>
              <Button
                label="Request Revision"
                icon="plus"
                variant="primary"
                onClick={() => setPopup({ mode: 'create' })}
                className="whitespace-nowrap"
              />
            </div>
          }
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'revisionNo', header: 'Revision No' },
            { field: 'budgetCode', header: 'Budget Code' },
            { field: 'budgetHead', header: 'Budget Head' },
            {
              field: 'originalAmount',
              header: 'Original (₹)',
              cell: (i: BudgetRevisionItem) => (
                <span>{fmt(i.originalAmount)}</span>
              ),
            },
            {
              field: 'revisedAmount',
              header: 'Revised (₹)',
              cell: (i: BudgetRevisionItem) => (
                <span className="font-semibold text-blue-700">
                  {fmt(i.revisedAmount)}
                </span>
              ),
            },
            { field: 'reason', header: 'Reason' },
            { field: 'date', header: 'Date' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (i: BudgetRevisionItem) => (
                <StatusBadge
                  label={i.status}
                  variant={
                    i.status === 'Approved'
                      ? 'approved'
                      : i.status === 'Pending'
                        ? 'pending'
                        : 'rejected'
                  }
                />
              ),
            },
            {
              header: 'Actions',
              cell: (i: BudgetRevisionItem) => {
                if (i.status !== 'Pending') return <></>;
                return (
                  <div className="flex gap-2">
                    <Button
                      label="Approve"
                      variant="primary"
                      icon="check"
                      onClick={() => handleApprove(i.id)}
                      disabled={updateMut.isPending}
                    />
                    <Button
                      label="Reject"
                      variant="danger"
                      icon="times"
                      onClick={() => handleReject(i.id)}
                      disabled={updateMut.isPending}
                    />
                  </div>
                );
              },
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Request Budget Revision"
        subtitle="Submit a request to revise an existing budget."
        size="lg"
      >
        <BudgetRevisionFormContent onClose={closePopup} />
      </FormPopup>
    </FormPage>
  );
}

function BudgetRevisionFormContent({ onClose }: { onClose: () => void }) {
  const createMut = useCreateBudgetRevisionMutation();

  const budgetOptions = BUDGETS.map(b => ({
    label: `${b.budgetCode} - ${b.title}`,
    value: b.budgetCode,
  }));

  const BLANK: BudgetRevisionForm = {
    budgetCode: '',
    budgetHead: '',
    originalAmount: 0,
    revisedAmount: 0,
    reason: '',
    status: 'Pending',
  };

  const [form, setForm] = useState<BudgetRevisionForm>(BLANK);

  const headOptions = BUDGET_HEADS.map(h => ({ label: h.name, value: h.name }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createMut.mutateAsync(form);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <DropDownList
          label="Budget Code"
          data={budgetOptions}
          textField="label"
          valueField="value"
          value={form.budgetCode}
          onChange={v => setForm(p => ({ ...p, budgetCode: v as string }))}
          required
        />
        <DropDownList
          label="Budget Head"
          data={headOptions}
          textField="label"
          valueField="value"
          value={form.budgetHead}
          onChange={v => setForm(p => ({ ...p, budgetHead: v as string }))}
          required
        />
        <NumberBox
          label="Original Amount (₹)"
          placeholder="e.g. 2000000"
          value={form.originalAmount}
          onChange={v => setForm(p => ({ ...p, originalAmount: v ?? 0 }))}
          required
        />
        <NumberBox
          label="Revised Amount (₹)"
          placeholder="e.g. 2500000"
          value={form.revisedAmount}
          onChange={v => setForm(p => ({ ...p, revisedAmount: v ?? 0 }))}
          required
        />
        <div className="col-span-2">
          <TextBox
            label="Reason for Revision"
            placeholder="Detailed reason for why revision is needed"
            value={form.reason}
            onChange={v => setForm(p => ({ ...p, reason: v }))}
            required
          />
        </div>
      </FormGrid>
      <FormActions
        isEditMode={false}
        isLoading={createMut.isPending}
        onReset={() => setForm(BLANK)}
      />
    </form>
  );
}
