import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type WorkOrder,
  workOrders as initialData,
  projects,
  contractors,
} from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: WorkOrder }
  | { mode: 'view'; item: WorkOrder };

const PROJECT_OPTIONS = projects.map(p => ({
  name: `${p.code} — ${p.name}`,
  value: p.id,
}));
const CONTRACTOR_OPTIONS = contractors
  .filter(c => c.status === 'Active')
  .map(c => ({ name: c.companyName, value: c.id }));
const STATUSES = ['Issued', 'In Progress', 'Completed', 'Terminated'].map(
  v => ({ name: v, value: v })
);

const EMPTY: Partial<WorkOrder> = {
  workOrderNo: '',
  projectId: '',
  projectName: '',
  contractorId: '',
  contractorName: '',
  issueDate: '',
  completionDate: '',
  amount: 0,
  terms: '',
  status: 'Issued',
};

const statusVariant = (s: string) => {
  if (s === 'Completed') return 'approved';
  if (s === 'Terminated') return 'rejected';
  if (s === 'In Progress') return 'pending';
  return 'neutral';
};

export default function WorkOrders() {
  const [data, setData] = useState<WorkOrder[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<WorkOrder>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.workOrderNo) {
      ToastService.error('Work Order Number is required.');
      return;
    }
    if (popup.mode === 'create') {
      const proj = projects.find(p => p.id === form.projectId);
      const cont = contractors.find(c => c.id === form.contractorId);
      setData(prev => [
        ...prev,
        {
          ...form,
          id: String(Date.now()),
          projectName: proj?.name ?? '',
          contractorName: cont?.companyName ?? '',
        } as WorkOrder,
      ]);
      ToastService.success('Work order issued.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as WorkOrder) : d
        )
      );
      ToastService.success('Work order updated.');
    }
    close();
  };

  const handleDelete = (item: WorkOrder) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Work order deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Work Orders"
      description="Issue and manage work orders to selected contractors."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Work Orders' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'workOrderNo', header: 'Work Order No' },
            { field: 'projectName', header: 'Project' },
            { field: 'contractorName', header: 'Contractor' },
            { field: 'issueDate', header: 'Issue Date' },
            {
              field: 'amount',
              header: 'Value',
              cell: (item: WorkOrder) => (
                <span>₹{item.amount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: (item: WorkOrder) => (
                <StatusBadge
                  label={item.status}
                  variant={statusVariant(item.status)}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: WorkOrder) => (
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
              label="Issue Work Order"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search work orders..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Issue Work Order'
            : popup.mode === 'edit'
              ? 'Edit Work Order'
              : 'View Work Order'
        }
        subtitle="Work order details and payment terms."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Work Order Number"
            placeholder="e.g. WO-2025-004"
            value={form.workOrderNo ?? ''}
            onChange={v => setForm(f => ({ ...f, workOrderNo: v }))}
            required
            disabled={isReadOnly}
          />
          <DropDownList
            label="Project"
            data={PROJECT_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.projectId}
            onChange={v => setForm(f => ({ ...f, projectId: v as string }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={2}>
          <DropDownList
            label="Contractor"
            data={CONTRACTOR_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.contractorId}
            onChange={v => setForm(f => ({ ...f, contractorId: v as string }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Amount (₹)"
            placeholder="e.g. 5000000"
            value={String(form.amount ?? '')}
            onChange={v => setForm(f => ({ ...f, amount: Number(v) }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={3}>
          <DatePicker
            label="Issue Date"
            value={form.issueDate ? new Date(form.issueDate) : undefined}
            onChange={v =>
              setForm(f => ({
                ...f,
                issueDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
          <DatePicker
            label="Completion Date"
            value={
              form.completionDate ? new Date(form.completionDate) : undefined
            }
            onChange={v =>
              setForm(f => ({
                ...f,
                completionDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
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
          label="Terms & Conditions"
          placeholder="Payment terms, conditions etc."
          value={form.terms ?? ''}
          onChange={v => setForm(f => ({ ...f, terms: v }))}
          disabled={isReadOnly}
          rows={3}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Issue' : 'Update'}
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
