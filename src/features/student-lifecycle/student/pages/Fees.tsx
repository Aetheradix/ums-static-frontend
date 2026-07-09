import { useState } from 'react';
import {
  FormCard,
  FormPage,
  StatCard,
  PaymentDialog,
  GridPanel,
} from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import type { FeeRecord } from '../../types';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { listStudents } from '../../data';
import { generateFeeReceipt } from '../../pdf';
import { formatDate, formatINR, toRoman } from '../../utils';
import { FEE_STRUCTURE } from '../../data/domain/constants';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

export default function StudentFees() {
  const currentStudentNo = useLifecycleStore(s => s.currentStudentNo);
  const paidFees = useLifecycleStore(s => s.paidFees);
  const recordPayments = useLifecycleStore(s => s.recordPayments);

  const [payFees, setPayFees] = useState<FeeRecord[] | null>(null);

  const students = listStudents();
  const student = students.find(s => s.enrollmentNo === currentStudentNo);

  if (!student) {
    return (
      <FormPage
        title="Fees Ledger"
        description="No active student profile found."
      >
        <FormCard>
          <div className="p-8 text-center text-red-500">
            Error: Student profile not loaded.
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const isPaid = (f: FeeRecord) =>
    f.status === 'Paid' || Boolean(paidFees[f.id]);
  const fees = [...student.fees].sort((a, b) => b.semester - a.semester);
  const dues = fees.filter(f => !isPaid(f));
  const totalDue = dues.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.filter(isPaid).reduce((sum, f) => sum + f.amount, 0);

  const handlePaymentSuccess = (transactionId: string) => {
    if (!payFees) return;

    const payments = payFees.map(f => ({
      feeId: f.id,
      enrollmentNo: student.enrollmentNo,
      amount: f.amount,
      method: 'UPI' as const,
      transactionId,
      receiptNo: `MPO/2026/${Math.floor(200000 + Math.random() * 800000)}`,
      paidOn: new Date().toISOString(),
    }));

    recordPayments(payments);
    ToastService.success(
      `Payment of ₹${payFees.reduce((sum, f) => sum + f.amount, 0).toLocaleString('en-IN')} confirmed. Receipts generated.`
    );
    setPayFees(null);
  };

  const downloadReceipt = (f: FeeRecord) => {
    const p = paidFees[f.id];
    generateFeeReceipt(student, {
      receiptNo: p?.receiptNo ?? f.receiptNo ?? '—',
      transactionId: p?.transactionId ?? '—',
      method: p?.method ?? 'Online (UPI)',
      paidOn: p?.paidOn ?? f.paidOn ?? new Date().toISOString(),
      items: [{ head: f.head, semester: f.semester, amount: f.amount }],
      total: f.amount,
    });
  };

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.student.root },
    { label: 'Fees & Payments' },
  ];

  const headerAction =
    dues.length > 0 ? (
      <button
        onClick={() => setPayFees(dues)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-colors"
      >
        <Icon name="payments" className="text-xs" />
        <span>Pay All Dues ({formatINR(totalDue)})</span>
      </button>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        <span>All Fees Cleared</span>
      </span>
    );

  const gridColumns = [
    {
      field: 'semester',
      header: 'Academic Term',
      sortable: true,
      cell: (f: FeeRecord) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">
          Semester {toRoman(f.semester)}
        </span>
      ),
    },
    {
      field: 'head',
      header: 'Fee Particulars',
      sortable: true,
      cell: (f: FeeRecord) => {
        const paid = isPaid(f);
        const p = paidFees[f.id];
        return (
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">
              {f.head} Fee
            </span>
            {paid && (f.receiptNo || p) && (
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 block font-mono">
                Receipt: {p?.receiptNo ?? f.receiptNo}
                {(p?.paidOn ?? f.paidOn)
                  ? ` · Paid on ${formatDate(p?.paidOn ?? f.paidOn!)}`
                  : ''}
              </span>
            )}
          </div>
        );
      },
    },
    {
      field: 'amount',
      header: 'Invoiced Amount',
      sortable: true,
      cell: (f: FeeRecord) => (
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          {formatINR(f.amount)}
        </span>
      ),
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      cell: (f: FeeRecord) => {
        const paid = isPaid(f);
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              paid
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200'
                : f.status === 'Due'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-200'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 border-blue-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${paid ? 'bg-emerald-50 dark:bg-emerald-950/400' : 'bg-amber-50 dark:bg-amber-950/400'}`}
            />
            {paid ? 'Paid' : f.status}
          </span>
        );
      },
    },
    {
      field: 'id',
      header: 'Action',
      cell: (f: FeeRecord) => {
        const paid = isPaid(f);
        return paid ? (
          <button
            onClick={() => downloadReceipt(f)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors"
          >
            <Icon name="download" className="text-xs" />
            <span>Download Receipt</span>
          </button>
        ) : (
          <button
            onClick={() => setPayFees([f])}
            className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors"
          >
            Pay Now
          </button>
        );
      },
    },
  ];

  return (
    <FormPage
      title="Fees Ledger"
      description="Pay semester tuition and examinations fees online. Download secure payment receipt PDFs."
      breadcrumbs={breadcrumbs}
      headerAction={headerAction}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Stat Cards Row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Amount Due"
            value={totalDue ? formatINR(totalDue) : 'Nil'}
            icon="payments"
            colorScheme={totalDue ? 'amber' : 'green'}
            subtitle={totalDue ? 'Action Required' : 'Ledger Cleared'}
          />
          <StatCard
            title="Total Fees Paid"
            value={formatINR(totalPaid)}
            icon="verified"
            colorScheme="green"
            subtitle="Academic History Total"
          />
          <StatCard
            title="Standard Tuition"
            value={formatINR(FEE_STRUCTURE.tuitionPerSemester)}
            icon="description"
            colorScheme="blue"
            subtitle="Per Semester Course Cost"
          />
        </div>

        {/* Ledger Table */}
        <FormCard title="Fee Payment Ledger" className="p-0 overflow-hidden">
          <GridPanel
            data={fees}
            dataKey="id"
            emptyMessage="No fee invoices loaded."
            columns={gridColumns as any}
          />
        </FormCard>
      </div>

      {/* Payment Dialog overlay */}
      <PaymentDialog
        visible={payFees !== null}
        onClose={() => setPayFees(null)}
        onSuccess={handlePaymentSuccess}
        amount={payFees ? payFees.reduce((sum, f) => sum + f.amount, 0) : 0}
        title="Examinations / Semester Fee Payment"
        description={`Confirm fee payment for ${payFees ? payFees.map(f => `${f.head} (Sem ${toRoman(f.semester)})`).join(', ') : ''}`}
      />
    </FormPage>
  );
}
