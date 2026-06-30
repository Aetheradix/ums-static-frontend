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
import { type Payment, payments as initialData, bills } from '../mocks';
import { infraUrls } from '../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Payment }
  | { mode: 'view'; item: Payment };

const BILL_OPTIONS = bills
  .filter(b => b.status === 'Approved' || b.status === 'Paid')
  .map(b => ({
    name: `${b.billNo} — ₹${b.amount.toLocaleString('en-IN')}`,
    value: b.id,
  }));
const PAYMENT_MODES = ['NEFT', 'RTGS', 'Cheque', 'Online'].map(v => ({
  name: v,
  value: v,
}));
const BANKS = [
  'SBI',
  'PNB',
  'BOI',
  'BOB',
  'HDFC',
  'ICICI',
  'Axis',
  'Canara',
].map(v => ({ name: v, value: v }));
const STATUSES = ['Pending', 'Processed', 'Failed'].map(v => ({
  name: v,
  value: v,
}));

const EMPTY: Partial<Payment> = {
  paymentNo: '',
  billId: '',
  billNo: '',
  projectName: '',
  amount: 0,
  paymentDate: '',
  paymentMode: 'RTGS',
  bank: 'SBI',
  utrNo: '',
  remarks: '',
  status: 'Pending',
};

const statusVariant = (s: string) => {
  if (s === 'Processed') return 'approved';
  if (s === 'Failed') return 'rejected';
  return 'pending';
};

export default function PaymentTracking() {
  const [data, setData] = useState<Payment[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Payment>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.paymentNo) {
      ToastService.error('Payment Number is required.');
      return;
    }
    if (popup.mode === 'create') {
      const bill = bills.find(b => b.id === form.billId);
      setData(prev => [
        ...prev,
        {
          ...form,
          id: String(Date.now()),
          billNo: bill?.billNo ?? '',
          projectName: bill?.projectName ?? '',
        } as Payment,
      ]);
      ToastService.success('Payment recorded.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as Payment) : d
        )
      );
      ToastService.success('Payment updated.');
    }
    close();
  };

  const handleDelete = (item: Payment) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Payment deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Payment Tracking"
      description="Track all payments made against contractor bills."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Infrastructure Projects', to: infraUrls.portal },
        { label: 'Payment Tracking' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'paymentNo', header: 'Payment No' },
            { field: 'billNo', header: 'Bill No' },
            {
              field: 'amount',
              header: 'Amount',
              cell: (item: Payment) => (
                <span>₹{item.amount.toLocaleString('en-IN')}</span>
              ),
            },
            {
              field: 'paymentDate',
              header: 'Payment Date',
              cell: (item: Payment) => <span>{item.paymentDate || '—'}</span>,
            },
            { field: 'paymentMode', header: 'Mode' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Payment) => (
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
              cell: (item: Payment) => (
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
              label="Record Payment"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search payments..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Record Payment'
            : popup.mode === 'edit'
              ? 'Edit Payment'
              : 'View Payment'
        }
        subtitle="Payment details and bank transaction information."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Payment Number"
            placeholder="e.g. PAY-2025-005"
            value={form.paymentNo ?? ''}
            onChange={v => setForm(f => ({ ...f, paymentNo: v }))}
            required
            disabled={isReadOnly}
          />
          <DropDownList
            label="Bill"
            data={BILL_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.billId}
            onChange={v => setForm(f => ({ ...f, billId: v as string }))}
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={3}>
          <TextBox
            label="Amount (₹)"
            placeholder="Total amount paid"
            value={String(form.amount ?? '')}
            onChange={v => setForm(f => ({ ...f, amount: Number(v) }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Payment Mode"
            data={PAYMENT_MODES}
            textField="name"
            optionValue="value"
            value={form.paymentMode}
            onChange={v => setForm(f => ({ ...f, paymentMode: v as any }))}
            disabled={isReadOnly}
          />
          <DatePicker
            label="Payment Date"
            value={form.paymentDate ? new Date(form.paymentDate) : undefined}
            onChange={v =>
              setForm(f => ({
                ...f,
                paymentDate: v ? v.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
        </FormGrid>
        <FormGrid columns={3}>
          <DropDownList
            label="Bank"
            data={BANKS}
            textField="name"
            optionValue="value"
            value={form.bank}
            onChange={v => setForm(f => ({ ...f, bank: v as string }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="UTR Number"
            placeholder="Bank transaction UTR"
            value={form.utrNo ?? ''}
            onChange={v => setForm(f => ({ ...f, utrNo: v }))}
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
              label={popup.mode === 'create' ? 'Record' : 'Update'}
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
