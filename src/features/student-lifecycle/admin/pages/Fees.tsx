import { FormCard, FormPage, StatCard, GridPanel } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import type { FeeRecord, Student } from '../../types';
import { STUDENTS } from '../../data';
import { DEFAULT_MATRIX } from '../../data/domain';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { formatDateTime, formatINR, toRoman } from '../../utils';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

interface DueRow {
  student: Student;
  fee: FeeRecord;
}

export default function AdminFees() {
  const currentAdminRole = useLifecycleStore(s => s.currentAdminRole);
  const paidFees = useLifecycleStore(s => s.paidFees);
  const recordPayments = useLifecycleStore(s => s.recordPayments);

  const perms = DEFAULT_MATRIX[currentAdminRole] || [];
  const canView = perms.includes('fees.view');
  const canManage = perms.includes('fees.manage');

  if (!canView) {
    return (
      <FormPage
        title="Fee Collections"
        description="Access Denied. You do not have permissions to view fee data."
      >
        <FormCard>
          <div className="p-8 text-center text-red-500 flex flex-col items-center justify-center gap-3">
            <Icon name="block" className="text-5xl" />
            <p className="font-bold">Unauthorized Access</p>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  let totalCollected = 0;
  let totalOutstanding = 0;
  const duesList: DueRow[] = [];

  STUDENTS.forEach(s => {
    s.fees.forEach(f => {
      const paid = f.status === 'Paid' || Boolean(paidFees[f.id]);
      if (paid) {
        totalCollected += f.amount;
      } else {
        totalOutstanding += f.amount;
        duesList.push({ student: s, fee: f });
      }
    });
  });

  const uniqueStudentsWithDues = new Set(
    duesList.map(d => d.student.enrollmentNo)
  ).size;
  const sessionPayments = Object.values(paidFees).sort(
    (a, b) => new Date(b.paidOn).getTime() - new Date(a.paidOn).getTime()
  );

  const handleMarkPaid = (student: Student, fee: FeeRecord) => {
    const txnId =
      'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const receiptNo = `REC/CBA/2026/${Math.floor(100000 + Math.random() * 900000)}`;
    const paidOn = new Date().toISOString();

    recordPayments([
      {
        feeId: fee.id,
        enrollmentNo: student.enrollmentNo,
        amount: fee.amount,
        method: 'Counter',
        transactionId: txnId,
        receiptNo,
        paidOn,
      },
    ]);

    ToastService.success(
      `Counter payment of ${formatINR(fee.amount)} recorded for ${student.name}.`
    );
  };

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.admin.root },
    { label: 'Fee Collection Registry' },
  ];

  const duesColumns = [
    {
      field: 'student.name',
      header: 'Defaulter Profile',
      cell: (r: DueRow) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            {r.student.name}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {r.student.enrollmentNo}
          </span>
        </div>
      ),
    },
    {
      field: 'fee.head',
      header: 'Invoiced Fee Head',
      cell: (r: DueRow) => (
        <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs">
          {r.fee.head} · Semester {toRoman(r.fee.semester)}
        </span>
      ),
    },
    {
      field: 'fee.amount',
      header: 'Pending Amount',
      sortable: true,
      cell: (r: DueRow) => (
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          {formatINR(r.fee.amount)}
        </span>
      ),
    },
  ];

  if (canManage) {
    duesColumns.push({
      field: 'fee.id',
      header: 'Action',
      cell: (r: DueRow) => (
        <button
          onClick={() => handleMarkPaid(r.student, r.fee)}
          className="px-2.5 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover shadow-sm transition-colors"
        >
          Mark as Paid
        </button>
      ),
    } as any);
  }

  const payLogColumns = [
    {
      field: 'receiptNo',
      header: 'Receipt No.',
      sortable: true,
      cell: (p: (typeof sessionPayments)[0]) => (
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
          {p.receiptNo}
        </span>
      ),
    },
    {
      field: 'enrollmentNo',
      header: 'Enrollment',
      sortable: true,
      cell: (p: (typeof sessionPayments)[0]) => (
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
          {p.enrollmentNo}
        </span>
      ),
    },
    {
      field: 'method',
      header: 'Channel',
      sortable: true,
      cell: (p: (typeof sessionPayments)[0]) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
          {p.method}
        </span>
      ),
    },
    {
      field: 'amount',
      header: 'Paid Amount',
      sortable: true,
      cell: (p: (typeof sessionPayments)[0]) => (
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          {formatINR(p.amount)}
        </span>
      ),
    },
    {
      field: 'paidOn',
      header: 'Payment Time',
      sortable: true,
      cell: (p: (typeof sessionPayments)[0]) => (
        <span className="text-xs font-medium text-slate-400">
          {formatDateTime(p.paidOn)}
        </span>
      ),
    },
  ];

  return (
    <FormPage
      title="Fee Collection Registry"
      description="Monitor student tuition balances, record manual counter payments, and audit collected session fees."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Stat Cards Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue Collected"
            value={formatINR(totalCollected)}
            icon="payments"
            colorScheme="green"
            subtitle="Cleared Ledger Total"
          />
          <StatCard
            title="Total Dues Outstanding"
            value={formatINR(totalOutstanding)}
            icon="warning"
            colorScheme={totalOutstanding ? 'amber' : 'green'}
            subtitle="Receivables Balance"
          />
          <StatCard
            title="Defaulter Students"
            value={uniqueStudentsWithDues}
            icon="users"
            colorScheme="blue"
            subtitle="Outstanding Due Profiles"
          />
          <StatCard
            title="Payments This Session"
            value={sessionPayments.length}
            icon="check-circle"
            colorScheme="indigo"
            subtitle="Recorded Receipts"
          />
        </div>

        {/* Outstanding Dues List */}
        <FormCard
          title="Outstanding Invoiced Dues"
          className="p-0 overflow-hidden"
        >
          <GridPanel
            data={duesList}
            dataKey="fee.id"
            emptyMessage="All student fee registers are completely cleared."
            columns={duesColumns as any}
            scrollHeight="240px"
            scrollable
          />
        </FormCard>

        {/* Ledger logs */}
        <FormCard
          title="Payments Log (Current Session)"
          className="p-0 overflow-hidden"
        >
          <GridPanel
            data={sessionPayments}
            dataKey="feeId"
            emptyMessage="No fee payments captured in this academic session."
            columns={payLogColumns as any}
            scrollHeight="240px"
            scrollable
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
