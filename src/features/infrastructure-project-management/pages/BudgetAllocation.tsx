import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type BudgetAllocation,
  budgetAllocations as initialData,
  projects,
} from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: BudgetAllocation }
  | { mode: 'view'; item: BudgetAllocation };

const PROJECT_OPTIONS = projects.map(p => ({
  name: `${p.code} — ${p.name}`,
  value: p.id,
}));
const FY_OPTIONS = ['2024-25', '2025-26', '2026-27'].map(v => ({
  name: v,
  value: v,
}));
const BUDGET_HEADS = [
  'Civil Works',
  'Electrical Works',
  'Plumbing',
  'Equipment',
  'Furniture',
  'IT Infrastructure',
  'Miscellaneous',
].map(v => ({ name: v, value: v }));
const FUNDING_SOURCES = [
  'Central Govt',
  'State Govt',
  'University Fund',
  'UGC Grant',
  'External',
].map(v => ({ name: v, value: v }));
const STATUSES = ['Active', 'Partially Used', 'Exhausted'].map(v => ({
  name: v,
  value: v,
}));

const EMPTY: Partial<BudgetAllocation> = {
  projectId: '',
  projectName: '',
  financialYear: '2025-26',
  budgetHead: 'Civil Works',
  allocatedAmount: 0,
  usedAmount: 0,
  fundingSource: 'University Fund',
  remarks: '',
  status: 'Active',
};

export default function BudgetAllocationPage() {
  const [data, setData] = useState<BudgetAllocation[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<BudgetAllocation>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.projectId || !form.budgetHead) {
      ToastService.error('Project and Budget Head are required.');
      return;
    }
    if (popup.mode === 'create') {
      const proj = projects.find(p => p.id === form.projectId);
      setData(prev => [
        ...prev,
        {
          ...form,
          id: String(Date.now()),
          projectName: proj?.name ?? '',
        } as BudgetAllocation,
      ]);
      ToastService.success('Budget allocated.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as BudgetAllocation)
            : d
        )
      );
      ToastService.success('Budget allocation updated.');
    }
    close();
  };

  const handleDelete = (item: BudgetAllocation) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Allocation deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Budget Allocation"
      description="Allocate and track project budgets by head and financial year."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Budget Allocation' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'projectName', header: 'Project' },
            { field: 'budgetHead', header: 'Budget Head' },
            {
              field: 'allocatedAmount',
              header: 'Allocated',
              cell: (item: BudgetAllocation) => (
                <span>₹{item.allocatedAmount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'usedAmount',
              header: 'Used',
              cell: (item: BudgetAllocation) => (
                <span>₹{item.usedAmount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'id',
              header: 'Remaining',
              cell: (item: BudgetAllocation) => (
                <span
                  style={{
                    color:
                      item.allocatedAmount - item.usedAmount < 0
                        ? '#dc2626'
                        : '#16a34a',
                    fontWeight: 600,
                  }}
                >
                  ₹
                  {(item.allocatedAmount - item.usedAmount).toLocaleString(
                    'en-IN'
                  )}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: BudgetAllocation) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Active'
                      ? 'approved'
                      : item.status === 'Exhausted'
                        ? 'rejected'
                        : 'pending'
                  }
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: BudgetAllocation) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'view', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'edit', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="trash"
                    variant="danger"
                    onClick={() => handleDelete(item)}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Allocate Budget"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search allocations..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'New Budget Allocation'
            : popup.mode === 'edit'
              ? 'Edit Allocation'
              : 'View Allocation'
        }
        subtitle="Configure budget head and allocation details."
        size="lg"
      >
        <FormGrid columns={2}>
          <DropDownList
            label="Project"
            data={PROJECT_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.projectId}
            onChange={v => setForm(f => ({ ...f, projectId: v as string }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Financial Year"
            data={FY_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.financialYear}
            onChange={v => setForm(f => ({ ...f, financialYear: v as string }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <DropDownList
            label="Budget Head"
            data={BUDGET_HEADS}
            textField="name"
            optionValue="value"
            value={form.budgetHead}
            onChange={v => setForm(f => ({ ...f, budgetHead: v as string }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Funding Source"
            data={FUNDING_SOURCES}
            textField="name"
            optionValue="value"
            value={form.fundingSource}
            onChange={v => setForm(f => ({ ...f, fundingSource: v as any }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <TextBox
            label="Allocated Amount (₹)"
            placeholder="e.g. 5000000"
            value={String(form.allocatedAmount ?? '')}
            onChange={v => setForm(f => ({ ...f, allocatedAmount: Number(v) }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Status"
            data={STATUSES}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v as any }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Remarks"
          placeholder="Any additional notes"
          value={form.remarks ?? ''}
          onChange={v => setForm(f => ({ ...f, remarks: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Allocate' : 'Update'}
              variant="primary"
              icon="save"
              onClick={handleSave}
            />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
