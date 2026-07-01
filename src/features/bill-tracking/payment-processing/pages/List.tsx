import { useCallback, useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  NumberBox,
  TextBox,
} from 'shared/components/forms';
import { Loader } from 'shared/components/progress';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Stepper,
} from 'shared/new-components';
import {
  BT_BANK_ACCOUNTS,
  BT_VENDOR_BILLS,
  BT_EMPLOYEE_CLAIMS,
} from '../../mock-data';
import type { PaymentVoucherForm, PaymentVoucherItem } from '../api';
import {
  usePaymentVouchersQuery,
  useCreatePaymentVoucherMutation,
} from '../queries';

const BANK_OPTIONS = BT_BANK_ACCOUNTS.map(b => ({
  label: b.name,
  value: b.name,
}));
const MODE_OPTIONS = [
  { label: 'NEFT', value: 'NEFT' },
  { label: 'RTGS', value: 'RTGS' },
  { label: 'Cheque', value: 'Cheque' },
  { label: 'Cash', value: 'Cash' },
];

const APPROVED_BILLS = [
  ...BT_VENDOR_BILLS.filter(b => b.status === 'Approved').map(b => ({
    label: `${b.billNo} — ${b.vendor} (₹${b.netPayable.toLocaleString('en-IN')})`,
    value: b.billNo,
    party: b.vendor,
    amount: b.netPayable,
  })),
  ...BT_EMPLOYEE_CLAIMS.filter(c => c.status === 'Approved').map(c => ({
    label: `${c.claimNo} — ${c.employeeName} (₹${c.claimAmount.toLocaleString('en-IN')})`,
    value: c.claimNo,
    party: c.employeeName,
    amount: c.claimAmount,
  })),
];

const BILL_STAGES = ['Received', 'Submitted', 'Verified', 'Approved', 'Paid'];

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'view'; item: PaymentVoucherItem };

export default function List() {
  const { data, isLoading } = usePaymentVouchersQuery();
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  return (
    <FormPage
      title="Payment Processing"
      description="Process payments for approved bills and employee claims via bank accounts."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by voucher no, bill ref, party..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'voucherNo', header: 'Voucher No' },
            { field: 'billRef', header: 'Bill Ref' },
            { field: 'party', header: 'Party' },
            { field: 'paymentDate', header: 'Payment Date' },
            { field: 'bankAccount', header: 'Bank Account' },
            { field: 'paymentMode', header: 'Mode' },
            {
              field: 'amount',
              header: 'Amount (₹)',
              cell: (i: PaymentVoucherItem) => (
                <span className="font-semibold text-green-700">
                  ₹{i.amount.toLocaleString('en-IN')}
                </span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: () => <StatusBadge label="Paid" variant="approved" />,
            },
            {
              header: 'Actions',
              sortable: false,
              width: '80px',
              cell: (i: PaymentVoucherItem) => (
                <Button
                  icon="eye"
                  variant="outlined"
                  onClick={() => setPopup({ mode: 'view', item: i })}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Process Payment"
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
        title="Process Payment"
        subtitle="Record a payment against an approved bill or claim."
        size="lg"
      >
        <PaymentForm onClose={closePopup} />
      </FormPopup>

      <FormPopup
        visible={popup.mode === 'view'}
        onHide={closePopup}
        title={`Payment Voucher: ${popup.mode === 'view' ? popup.item.voucherNo : ''}`}
        subtitle="View payment details."
        size="lg"
      >
        {popup.mode === 'view' && (
          <PaymentDetailView item={popup.item} onClose={closePopup} />
        )}
      </FormPopup>
    </FormPage>
  );
}

function PaymentForm({ onClose }: { onClose: () => void }) {
  const createMut = useCreatePaymentVoucherMutation();
  const BLANK: PaymentVoucherForm = {
    billRef: '',
    party: '',
    paymentDate: '',
    bankAccount: '',
    paymentMode: 'NEFT',
    transactionRef: '',
    amount: 0,
    remarks: '',
  };
  const [form, setForm] = useState<PaymentVoucherForm>(BLANK);

  function handleBillSelect(val: string) {
    const selected = APPROVED_BILLS.find(b => b.value === val);
    setForm(p => ({
      ...p,
      billRef: val,
      party: selected?.party ?? '',
      amount: selected?.amount ?? 0,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createMut.mutateAsync(form);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid columns={2}>
        <DropDownList
          label="Bill / Claim Reference"
          textField="label"
          valueField="value"
          data={APPROVED_BILLS}
          value={form.billRef}
          onChange={v => handleBillSelect(v as string)}
        />
        <TextBox
          label="Party Name"
          placeholder="Auto-filled from bill"
          value={form.party}
          onChange={() => {}}
        />
        <DatePicker
          label="Payment Date"
          value={form.paymentDate ? new Date(form.paymentDate) : undefined}
          onChange={v =>
            setForm(p => ({
              ...p,
              paymentDate: v ? v.toISOString().split('T')[0] : '',
            }))
          }
          required
        />
        <DropDownList
          label="Bank Account"
          textField="label"
          valueField="value"
          data={BANK_OPTIONS}
          value={form.bankAccount}
          onChange={v => setForm(p => ({ ...p, bankAccount: v as string }))}
        />
        <DropDownList
          label="Payment Mode"
          textField="label"
          valueField="value"
          data={MODE_OPTIONS}
          value={form.paymentMode}
          onChange={v => setForm(p => ({ ...p, paymentMode: v as string }))}
        />
        <TextBox
          label="Transaction Reference"
          placeholder="NEFT/RTGS ref or Cheque no."
          value={form.transactionRef}
          onChange={v => setForm(p => ({ ...p, transactionRef: v }))}
          required
        />
        <NumberBox
          label="Amount (₹)"
          value={form.amount}
          onChange={v => setForm(p => ({ ...p, amount: v ?? 0 }))}
          required
        />
        <TextBox
          label="Remarks"
          placeholder="Optional"
          value={form.remarks}
          onChange={v => setForm(p => ({ ...p, remarks: v }))}
        />
      </FormGrid>
      <FormActions
        isEditMode={false}
        isLoading={createMut.isPending}
        onSave={() => {}}
        onReset={() => setForm(BLANK)}
      />
    </form>
  );
}

function PaymentDetailView({
  item,
  onClose,
}: {
  item: PaymentVoucherItem;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Stepper
        steps={BILL_STAGES.map(s => ({ label: s }))}
        activeStep={4} // Paid
      />
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
        {[
          ['Voucher No.', item.voucherNo],
          ['Bill Reference', item.billRef],
          ['Party', item.party],
          ['Payment Date', item.paymentDate],
          ['Bank Account', item.bankAccount],
          ['Payment Mode', item.paymentMode],
          ['Transaction Ref.', item.transactionRef],
          ['Amount', `₹${item.amount.toLocaleString('en-IN')}`],
          ['Remarks', item.remarks || 'N/A'],
          ['Status', item.status],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
              {label}
            </p>
            <p className="text-sm font-medium text-gray-900">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2 border-t border-gray-100">
        <Button label="Close" variant="outlined" onClick={onClose} />
      </div>
    </div>
  );
}
