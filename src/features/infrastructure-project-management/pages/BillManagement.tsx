import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type Bill,
  bills as initialData,
  projects,
  contractors,
} from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Bill }
  | { mode: 'view'; item: Bill };

const PROJECT_OPTIONS = projects.map(p => ({
  name: `${p.code} — ${p.name}`,
  value: p.id,
}));
const CONTRACTOR_OPTIONS = contractors.map(c => ({
  name: c.companyName,
  value: c.id,
}));
const STATUSES = ['Submitted', 'Verified', 'Approved', 'Paid', 'Rejected'].map(
  v => ({ name: v, value: v })
);

const EMPTY: Partial<Bill> = {
  billNo: '',
  projectId: '',
  projectName: '',
  contractorId: '',
  contractorName: '',
  billDate: '',
  amount: 0,
  gst: 0,
  status: 'Submitted',
};

const statusVariant = (s: string) => {
  if (s === 'Paid') return 'approved';
  if (s === 'Rejected') return 'rejected';
  if (s === 'Approved') return 'pending';
  return 'neutral';
};

export default function BillManagement() {
  const [data, setData] = useState<Bill[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Bill>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.billNo) {
      ToastService.error('Bill Number is required.');
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
        } as Bill,
      ]);
      ToastService.success('Bill submitted.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as Bill) : d
        )
      );
      ToastService.success('Bill updated.');
    }
    close();
  };

  const handleDelete = (item: Bill) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Bill deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Bill Management"
      description="Submit, verify and approve contractor bills."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Bill Management' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'billNo', header: 'Bill No' },
            { field: 'projectName', header: 'Project' },
            { field: 'contractorName', header: 'Contractor' },
            {
              field: 'amount',
              header: 'Bill Amount',
              cell: (item: Bill) => (
                <span>₹{item.amount.toLocaleString('en-IN')}</span>
              ),
            },
            { field: 'billDate', header: 'Bill Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Bill) => (
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
              cell: (item: Bill) => (
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
              label="Submit Bill"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search bills..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Submit Bill'
            : popup.mode === 'edit'
              ? 'Edit Bill'
              : 'View Bill'
        }
        subtitle="Contractor bill details and GST."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Bill Number"
            placeholder="e.g. BILL-2025-006"
            value={form.billNo ?? ''}
            onChange={v => setForm(f => ({ ...f, billNo: v }))}
            required
            disabled={isReadOnly}
          />
          <DatePicker
            label="Bill Date"
            value={form.billDate ? new Date(form.billDate) : undefined}
            onChange={v =>
              setForm(f => ({
                ...f,
                billDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
        </FormGrid>
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
            label="Contractor"
            data={CONTRACTOR_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.contractorId}
            onChange={v => setForm(f => ({ ...f, contractorId: v as string }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={3}>
          <TextBox
            label="Amount (₹)"
            placeholder="Bill amount before GST"
            value={String(form.amount ?? '')}
            onChange={v => setForm(f => ({ ...f, amount: Number(v) }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="GST (₹)"
            placeholder="GST amount"
            value={String(form.gst ?? '')}
            onChange={v => setForm(f => ({ ...f, gst: Number(v) }))}
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
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Submit' : 'Update'}
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
