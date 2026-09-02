import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, NumberBox, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  PaymentDialog,
  ReceiptDialog,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { SectionNote } from '../components/ui';
import {
  MOCK_STUDENT_ID,
  MOCK_STUDENT_NAME,
  MOCK_WARDEN_HOSTEL_ID,
  today,
  uid,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Payment } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const TYPES: { id: Payment['paymentType']; text: string }[] = [
  { id: 'Hostel Fee', text: 'Hostel Fee' },
  { id: 'Mess Fee', text: 'Mess Fee' },
  { id: 'Caution Money', text: 'Caution Money (refundable)' },
  { id: 'Fine', text: 'Fine' },
  { id: 'Other', text: 'Other' },
];

const MODES: { id: Payment['mode']; text: string }[] = [
  { id: 'Online', text: 'Online (Net Banking / Card)' },
  { id: 'UPI', text: 'UPI' },
  { id: 'Cash', text: 'Cash at Counter' },
  { id: 'Challan', text: 'Bank Challan' },
];

const DEFAULTS: Record<Payment['paymentType'], number> = {
  'Hostel Fee': 36000,
  'Mess Fee': 3800,
  'Caution Money': 5000,
  Fine: 0,
  Other: 0,
};

const STATUS_VARIANT = {
  Paid: 'success',
  Pending: 'pending',
  Failed: 'danger',
} as const;

const blank = () => ({
  paymentType: 'Hostel Fee' as Payment['paymentType'],
  period: '2026-27 Session',
  amount: DEFAULTS['Hostel Fee'],
  mode: 'Online' as Payment['mode'],
});

export default function Payments() {
  const { data, add } = useHms();
  const { isStudent, activePortal } = useHmsRole();

  const [form, setForm] = useState(blank);
  const [payOpen, setPayOpen] = useState(false);
  const [receipt, setReceipt] = useState<Payment | null>(null);
  const [studentFilter, setStudentFilter] = useState('All');

  const scoped = useMemo(
    () =>
      isStudent
        ? data.payments.filter(p => p.studentId === MOCK_STUDENT_ID)
        : data.payments.filter(p => p.hostelId === MOCK_WARDEN_HOSTEL_ID),
    [data.payments, isStudent]
  );

  const rows = useMemo(
    () =>
      studentFilter === 'All'
        ? scoped
        : scoped.filter(p => p.studentId === studentFilter),
    [scoped, studentFilter]
  );

  const studentOptions = useMemo(() => {
    const seen = new Map<string, string>();
    scoped.forEach(p => seen.set(p.studentId, p.studentName));
    return [
      { id: 'All', text: 'All Students' },
      ...Array.from(seen.entries()).map(([id, name]) => ({
        id,
        text: `${name} (${id})`,
      })),
    ];
  }, [scoped]);

  const totals = useMemo(() => {
    const paid = rows
      .filter(p => p.status === 'Paid')
      .reduce((s, p) => s + p.amount, 0);
    const pending = rows
      .filter(p => p.status === 'Pending')
      .reduce((s, p) => s + p.amount, 0);
    const caution = rows
      .filter(p => p.paymentType === 'Caution Money' && p.status === 'Paid')
      .reduce((s, p) => s + p.amount, 0);
    return { paid, pending, caution };
  }, [rows]);

  const onPaid = (transactionId: string) => {
    const payment: Payment = {
      id: uid('PM'),
      studentId: MOCK_STUDENT_ID,
      studentName: MOCK_STUDENT_NAME,
      hostelId: MOCK_WARDEN_HOSTEL_ID,
      paymentType: form.paymentType,
      period: form.period,
      amount: form.amount,
      mode: form.mode,
      transactionId,
      paymentDate: today(),
      receiptNo: `RCPT/${new Date().getFullYear()}/${String(data.payments.length + 1).padStart(4, '0')}`,
      status: 'Paid',
    };
    add('payments', payment);
    setPayOpen(false);
    setReceipt(payment);
    setForm(blank());
    ToastService.success('Payment recorded. Your receipt is ready.');
  };

  return (
    <FormPage
      title={isStudent ? 'Fee & Payments' : 'Student Payments'}
      description={
        isStudent
          ? 'Pay your hostel fee, caution money and monthly mess charges, and download a receipt for each.'
          : 'Every hostel, mess, caution-money and fine payment recorded against your residents.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Fee & Payments')}
    >
      <FormGrid columns={3}>
        <StatCard
          title="Total Paid"
          value={`₹${totals.paid.toLocaleString()}`}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title="Outstanding"
          value={`₹${totals.pending.toLocaleString()}`}
          icon="schedule"
          colorScheme="amber"
        />
        <StatCard
          title="Caution Money Held"
          value={`₹${totals.caution.toLocaleString()}`}
          icon="shield"
          colorScheme="blue"
          subtitle="Refundable at checkout"
        />
      </FormGrid>

      {isStudent && (
        <>
          <SectionNote tone="info" title="Complete your admission">
            Pay the hostel fee and the refundable caution money to confirm your
            seat — the warden allots your room once these are cleared.
          </SectionNote>

          <FormCard title="Make a Payment" icon="credit-card">
            <FormGrid columns={4}>
              <DropDownList
                label="Payment Type"
                data={TYPES}
                textField="text"
                valueField="id"
                value={form.paymentType}
                onChange={v => {
                  const type = (v as Payment['paymentType']) ?? 'Hostel Fee';
                  setForm(f => ({
                    ...f,
                    paymentType: type,
                    amount: DEFAULTS[type] || f.amount,
                  }));
                }}
              />
              <TextBox
                label="Period"
                placeholder="e.g. September 2026 / 2026-27 Session"
                value={form.period}
                onChange={v => setForm({ ...form, period: v })}
              />
              <NumberBox
                label="Amount (₹)"
                min={0}
                value={form.amount}
                onChange={v => setForm({ ...form, amount: v ?? 0 })}
              />
              <DropDownList
                label="Payment Mode"
                data={MODES}
                textField="text"
                valueField="id"
                value={form.mode}
                onChange={v =>
                  setForm({ ...form, mode: (v as Payment['mode']) ?? 'Online' })
                }
              />
            </FormGrid>
            <div className="mt-4 flex gap-3">
              <Button
                label="Proceed to Pay"
                variant="primary"
                icon="credit-card"
                onClick={() => setPayOpen(true)}
              />
              <Button
                label="Clear"
                variant="outlined"
                onClick={() => setForm(blank())}
              />
            </div>
          </FormCard>
        </>
      )}

      <FormCard
        title={isStudent ? 'My Payment History' : 'Payment Ledger'}
        icon="list"
      >
        {!isStudent && (
          <FormGrid columns={4}>
            <DropDownList
              label="Filter by Student"
              data={studentOptions}
              textField="text"
              valueField="id"
              value={studentFilter}
              onChange={v => setStudentFilter((v as string) ?? 'All')}
            />
          </FormGrid>
        )}
        <GridPanel<Payment>
          data={rows}
          searchBox
          searchPlaceholder="Search by student, receipt no. or period..."
          searchFields={['studentName', 'receiptNo', 'period']}
          pagination
          emptyMessage="No payments recorded yet."
          columns={[
            ...(isStudent
              ? []
              : [
                  {
                    field: 'studentName' as const,
                    header: 'Student',
                    cell: (p: Payment) => (
                      <div className="flex flex-col">
                        <span className="font-semibold">{p.studentName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {p.studentId}
                        </span>
                      </div>
                    ),
                  },
                ]),
            { field: 'paymentType', header: 'Type', width: 140 },
            { field: 'period', header: 'Period', width: 160 },
            {
              field: 'amount',
              header: 'Amount',
              width: 120,
              cell: p => <>₹{p.amount.toLocaleString()}</>,
            },
            { field: 'mode', header: 'Mode', width: 110 },
            {
              field: 'transactionId',
              header: 'Transaction ID',
              cell: p => (
                <span className="font-mono text-xs">
                  {p.transactionId || '—'}
                </span>
              ),
            },
            { field: 'paymentDate', header: 'Paid On', width: 120 },
            {
              field: 'receiptNo',
              header: 'Receipt No.',
              cell: p => (
                <span className="font-mono text-xs">{p.receiptNo || '—'}</span>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              width: 110,
              cell: p => (
                <StatusBadge
                  label={p.status}
                  variant={STATUS_VARIANT[p.status]}
                />
              ),
            },
            {
              header: 'Receipt',
              sortable: false,
              width: 110,
              cell: p =>
                p.status === 'Paid' ? (
                  <Button
                    label="View"
                    icon="file"
                    variant="outlined"
                    size="small"
                    onClick={() => setReceipt(p)}
                  />
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                ),
            },
          ]}
        />
      </FormCard>

      <PaymentDialog
        visible={payOpen}
        onClose={() => setPayOpen(false)}
        onSuccess={onPaid}
        amount={form.amount}
        title={`${form.paymentType} Payment`}
        description={`${form.paymentType} for ${form.period || 'the selected period'}`}
      />
      <ReceiptDialog
        visible={Boolean(receipt)}
        onClose={() => setReceipt(null)}
        transactionId={receipt?.transactionId ?? ''}
        amount={receipt?.amount ?? 0}
        date={receipt?.paymentDate ?? ''}
        title={`Receipt ${receipt?.receiptNo ?? ''}`}
      />
    </FormPage>
  );
}
