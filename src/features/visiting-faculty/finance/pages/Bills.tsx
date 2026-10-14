import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  ConfirmDialog,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Tabs,
} from 'shared/new-components';
import BillView from '../../components/BillView';
import { crumbs } from '../../components/hooks';
import { StageNote, UniqueIdChip } from '../../components/ui';
import { DEPARTMENTS, deptName } from '../../data';
import { useVisitingFacultyStore } from '../../store';
import type { Bill } from '../../types';
import {
  billVariant,
  deptBatch,
  formatDate,
  inr,
  limitCheck,
  periodLabel,
  simulateBatchPayment,
} from '../../utils';

type Stage =
  | 'Verify & Pay'
  | 'Forward to Registrar & VC'
  | 'With Registrar & VC'
  | 'VC Approved — Process Payment'
  | 'Paid';

interface BatchRow {
  id: string;
  department: string;
  departmentName: string;
  period: string;
  items: Bill[];
  count: number;
  total: number;
  paid: number;
  needsApproval: boolean;
  stage: Stage;
  receivedOn: string;
  sentForApprovalOn?: string;
  approvedOn?: string;
  approvedBy?: string;
  approvalRemarks?: string;
  paidOn?: string;
}

const STAGE_VARIANT: Record<
  Stage,
  'info' | 'danger' | 'warning' | 'approved' | 'success'
> = {
  'Verify & Pay': 'info',
  'Forward to Registrar & VC': 'danger',
  'With Registrar & VC': 'warning',
  'VC Approved — Process Payment': 'approved',
  Paid: 'success',
};

const WORKFLOW = [
  { icon: 'building', label: 'UTD sends bill', note: 'Department login' },
  {
    icon: 'check-square',
    label: 'Finance verifies',
    note: '₹30,000 cap per faculty',
  },
  {
    icon: 'send',
    label: 'Forward to Registrar & VC',
    note: 'Only if UTD total > ₹50,000',
  },
  {
    icon: 'verified',
    label: 'Registrar & VC approve',
    note: 'Registrar & VC Sir login',
  },
  {
    icon: 'wallet',
    label: 'Finance releases payment',
    note: 'Against each Unique ID',
  },
];

const isPayable = (s: Stage) =>
  s === 'VC Approved — Process Payment' || s === 'Verify & Pay';

/** Stages P3–P4 — limit check, Registrar & VC approval above ₹50,000, payment. */
export default function FinanceBills() {
  const bills = useVisitingFacultyStore(s => s.bills);
  const rates = useVisitingFacultyStore(s => s.rates);
  const takeUpBill = useVisitingFacultyStore(s => s.takeUpBill);
  const releasePayment = useVisitingFacultyStore(s => s.releasePayment);
  const releaseBatch = useVisitingFacultyStore(s => s.releaseBatch);
  const forwardBatchForApproval = useVisitingFacultyStore(
    s => s.forwardBatchForApproval
  );

  const [tab, setTab] = useState(0);
  const [period, setPeriod] = useState('');
  const [dept, setDept] = useState('');
  const [search, setSearch] = useState('');

  const [openBillId, setOpenBillId] = useState<string | null>(null);
  const [openBatchId, setOpenBatchId] = useState<string | null>(null);
  const [forwarding, setForwarding] = useState<BatchRow | null>(null);
  const [txnRef, setTxnRef] = useState('');
  const [remarks, setRemarks] = useState('');

  const periods = useMemo(
    () => [...new Set(bills.map(b => b.period))].sort().reverse(),
    [bills]
  );

  // ── Department-wise monthly batches ─────────────────────────
  const batches = useMemo<BatchRow[]>(() => {
    const keys = [
      ...new Set(
        bills
          .filter(b => b.status !== 'Prepared')
          .map(b => `${b.department}|${b.period}`)
      ),
    ];
    return keys
      .map(id => {
        const [department, p] = id.split('|');
        const batch = deptBatch(department, p, bills, rates);
        const items = batch.items;
        const unpaid = items.filter(b => !b.paidOn);
        const stage: Stage = !unpaid.length
          ? 'Paid'
          : batch.awaiting
            ? 'With Registrar & VC'
            : !batch.needsApproval
              ? 'Verify & Pay'
              : batch.approved
                ? 'VC Approved — Process Payment'
                : 'Forward to Registrar & VC';
        const approvedItem = items.find(b => b.approvedOn);
        return {
          id,
          department,
          departmentName: deptName(department),
          period: p,
          items,
          count: items.length,
          total: batch.total,
          paid: items.reduce(
            (s, b) => s + (b.paidOn ? (b.payable ?? 0) : 0),
            0
          ),
          needsApproval: batch.needsApproval,
          stage,
          receivedOn: items.map(b => b.billDate).sort()[0],
          sentForApprovalOn: items.find(b => b.sentForApprovalOn)
            ?.sentForApprovalOn,
          approvedOn: approvedItem?.approvedOn,
          approvedBy: approvedItem?.approvedBy,
          approvalRemarks: items.find(b => b.approvalRemarks)?.approvalRemarks,
          paidOn: unpaid.length
            ? undefined
            : items
                .map(b => b.paidOn ?? '')
                .sort()
                .reverse()[0],
        };
      })
      .sort(
        (a, b) =>
          b.period.localeCompare(a.period) ||
          a.department.localeCompare(b.department)
      );
  }, [bills, rates]);

  // ── Filters ─────────────────────────────────────────────────
  const q = search.trim().toLowerCase();
  const batchMatch = (r: BatchRow) =>
    (!period || r.period === period) &&
    (!dept || r.department === dept) &&
    (!q ||
      r.department.toLowerCase().includes(q) ||
      r.items.some(
        b =>
          b.facultyName.toLowerCase().includes(q) ||
          b.uniqueId.toLowerCase().includes(q)
      ));
  const billMatch = (b: Bill) =>
    (!period || b.period === period) &&
    (!dept || b.department === dept) &&
    (!q ||
      b.facultyName.toLowerCase().includes(q) ||
      b.uniqueId.toLowerCase().includes(q) ||
      b.billNo.toLowerCase().includes(q));

  const shownBatches = batches.filter(batchMatch);
  const readyBatches = batches.filter(
    b => b.stage === 'VC Approved — Process Payment'
  );
  const withVc = shownBatches.filter(b => b.stage === 'With Registrar & VC');
  const toForward = batches.filter(
    b => b.stage === 'Forward to Registrar & VC'
  );
  const toVerify = bills.filter(
    b =>
      ['Sent to Finance', 'Under Verification'].includes(b.status) &&
      billMatch(b)
  );
  const settled = bills.filter(b => b.paidOn && billMatch(b));

  const openBill = bills.find(b => b.id === openBillId) ?? null;
  const billCheck = openBill ? limitCheck(openBill, bills, rates) : null;
  const billBatch = openBill
    ? deptBatch(openBill.department, openBill.period, bills, rates)
    : null;
  const openBatch = batches.find(b => b.id === openBatchId) ?? null;
  const preview = openBatch
    ? simulateBatchPayment(openBatch.items, bills, rates)
    : [];
  const previewPayable = preview.reduce((s, r) => s + r.payable, 0);
  const previewNotPayable = preview.reduce((s, r) => s + r.notPayable, 0);

  // ── Actions ─────────────────────────────────────────────────
  const showBill = (b: Bill) => {
    if (b.status === 'Sent to Finance') takeUpBill(b.id);
    setTxnRef('');
    setRemarks('');
    setOpenBillId(b.id);
  };

  const showBatch = (r: BatchRow) => {
    setTxnRef('');
    setOpenBatchId(r.id);
  };

  const confirmForward = () => {
    if (!forwarding) return;
    forwardBatchForApproval(forwarding.department, forwarding.period);
    ToastService.success(
      `${forwarding.department} bills for ${periodLabel(forwarding.period)} (${inr(forwarding.total)}) forwarded to Registrar & VC Sir for approval.`
    );
    setForwarding(null);
    setOpenBatchId(null);
    setTab(2);
  };

  const processBatch = () => {
    if (!openBatch) return;
    if (!txnRef.trim()) {
      ToastService.error('Enter the bank transaction / batch reference.');
      return;
    }
    const r = releaseBatch(
      openBatch.department,
      openBatch.period,
      txnRef.trim()
    );
    if (!r.count) {
      ToastService.error('Registrar & VC approval is required before payment.');
      return;
    }
    ToastService.success(
      `Payment processed: ${inr(r.paid)} to ${r.count} faculty of ${openBatch.department}${r.notPayable ? ` · ${inr(r.notPayable)} not payable (limit)` : ''}.`
    );
    setOpenBatchId(null);
    setTab(4);
  };

  const releaseOne = () => {
    if (!openBill || !billCheck) return;
    if (!billBatch?.approved) {
      ToastService.error(
        'This department total is above the approval limit — get Registrar & VC approval first.'
      );
      return;
    }
    if (billCheck.payable > 0 && !txnRef.trim()) {
      ToastService.error('Enter the bank transaction reference.');
      return;
    }
    releasePayment(openBill.id, txnRef.trim(), remarks.trim());
    ToastService.success(
      billCheck.payable === 0
        ? `${openBill.billNo} marked Not Payable — limit already used.`
        : `${inr(billCheck.payable)} released to ${openBill.uniqueId}${billCheck.notPayable ? ` (${inr(billCheck.notPayable)} not payable)` : ''}.`
    );
    setOpenBillId(null);
  };

  // ── Columns ─────────────────────────────────────────────────
  const batchColumns: Controls.ColumnProps<BatchRow>[] = [
    { field: 'department', header: 'UTD', sortable: true },
    { header: 'Month', cell: r => <span>{periodLabel(r.period)}</span> },
    { field: 'count', header: 'Bills' },
    {
      header: 'Department Total',
      cell: r => (
        <span
          className={`font-semibold ${r.needsApproval ? 'text-red-600 dark:text-red-400' : ''}`}
        >
          {inr(r.total)}
          {r.needsApproval && (
            <span className="block text-[11px] font-normal">
              above {inr(rates.approvalThreshold)}
            </span>
          )}
        </span>
      ),
    },
    { header: 'Paid', cell: r => <span>{inr(r.paid)}</span> },
    {
      header: 'Stage',
      cell: r => (
        <StatusBadge label={r.stage} variant={STAGE_VARIANT[r.stage]} />
      ),
    },
    {
      header: 'Actions',
      width: '300px',
      cell: r => (
        <div className="flex flex-wrap gap-1">
          <Button
            label="View"
            icon="eye"
            variant="text"
            size="small"
            onClick={() => showBatch(r)}
          />
          {r.stage === 'Forward to Registrar & VC' && (
            <Button
              label="Forward to Registrar & VC"
              icon="send"
              variant="text"
              size="small"
              onClick={() => setForwarding(r)}
            />
          )}
          {isPayable(r.stage) && (
            <Button
              label="Process Payment"
              icon="wallet"
              variant="text"
              size="small"
              onClick={() => showBatch(r)}
            />
          )}
        </div>
      ),
    },
  ];

  const billColumns: Controls.ColumnProps<Bill>[] = [
    { field: 'billNo', header: 'Bill No.' },
    { field: 'department', header: 'UTD' },
    { header: 'Unique ID', cell: b => <UniqueIdChip value={b.uniqueId} /> },
    { field: 'facultyName', header: 'Faculty', sortable: true },
    { header: 'Period', cell: b => <span>{periodLabel(b.period)}</span> },
    {
      header: 'T / P',
      cell: b => (
        <span>
          {b.theoryCount} / {b.practicalCount}
        </span>
      ),
    },
    {
      header: 'Bill Amount',
      cell: b => <span className="font-semibold">{inr(b.billAmount)}</span>,
    },
    {
      header: 'Payable',
      cell: b => (
        <span className="font-semibold text-green-700 dark:text-green-400">
          {inr(
            b.paidOn ? (b.payable ?? 0) : limitCheck(b, bills, rates).payable
          )}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: b => (
        <StatusBadge label={b.status} variant={billVariant(b.status)} />
      ),
    },
    {
      header: 'Actions',
      width: '110px',
      cell: b => (
        <Button
          label={b.paidOn ? 'View' : 'Verify'}
          icon={b.paidOn ? 'eye' : 'check-square'}
          variant="text"
          size="small"
          onClick={() => showBill(b)}
        />
      ),
    },
  ];

  const tile = (label: string, value: string, tone = '') => (
    <div
      key={label}
      className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
    >
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-lg font-bold ${tone}`}>{value}</p>
    </div>
  );

  return (
    <FormPage
      title="Bill Verification & Payment"
      description="Bills from every UTD, checked against each faculty's Unique ID. Department totals above the approval limit go to the Registrar & VC before payment."
      breadcrumbs={crumbs('finance', 'Bill Verification')}
    >
      <FormCard>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          {WORKFLOW.map((w, i) => (
            <li key={w.label} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                <i className={`pi pi-${w.icon}`} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {i + 1}. {w.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {w.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </FormCard>

      {readyBatches.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-300 bg-green-50 px-5 py-4 dark:border-green-800 dark:bg-green-950/40">
          <div className="flex items-start gap-3">
            <i className="pi pi-verified mt-1 text-xl text-green-600 dark:text-green-400" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200">
                Registrar &amp; VC Sir approved {readyBatches.length} department
                bill{readyBatches.length > 1 ? 's' : ''} — process the payment
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {readyBatches
                  .map(
                    b =>
                      `${b.department} · ${periodLabel(b.period)} · ${inr(b.total)} (approved ${formatDate(b.approvedOn)})`
                  )
                  .join('  |  ')}
              </p>
            </div>
          </div>
          <Button
            label="Process Payment"
            icon="wallet"
            variant="success"
            onClick={() => setTab(1)}
          />
        </div>
      )}
      {toForward.length > 0 && (
        <StageNote tone="warning">
          {toForward.length} department bill
          {toForward.length > 1 ? 's are' : ' is'} above{' '}
          {inr(rates.approvalThreshold)} and must be forwarded to the Registrar
          &amp; VC:{' '}
          {toForward
            .map(
              b => `${b.department} (${periodLabel(b.period)}, ${inr(b.total)})`
            )
            .join(', ')}
          .
        </StageNote>
      )}

      <FormCard title="Filters" icon="filter">
        <FormGrid columns={3}>
          <DropDownList
            label="Month"
            data={[
              { id: '', text: 'All Months' },
              ...periods.map(p => ({ id: p, text: periodLabel(p) })),
            ]}
            textField="text"
            valueField="id"
            value={period}
            onChange={v => setPeriod((v as string) ?? '')}
          />
          <DropDownList
            label="Department"
            data={[
              { id: '', text: 'All Departments' },
              ...DEPARTMENTS.map(d => ({
                id: d.code,
                text: `${d.code} — ${d.name}`,
              })),
            ]}
            textField="text"
            valueField="id"
            value={dept}
            onChange={v => setDept((v as string) ?? '')}
          />
          <TextBox
            label="Faculty Name / Unique ID"
            placeholder="e.g. Rahul or RAHU234F"
            icon="search"
            value={search}
            onChange={setSearch}
          />
        </FormGrid>
      </FormCard>

      <FormCard>
        <Tabs
          activeIndex={tab}
          onTabChange={e => setTab(e.index)}
          tabs={[
            {
              title: `Department-wise Bills (${shownBatches.length})`,
              content: <GridPanel data={shownBatches} columns={batchColumns} />,
            },
            {
              title: `VC Approved — Process Payment (${readyBatches.filter(batchMatch).length})`,
              content: (
                <GridPanel
                  data={readyBatches.filter(batchMatch)}
                  columns={[
                    { field: 'department', header: 'UTD' },
                    {
                      header: 'Month',
                      cell: (r: BatchRow) => (
                        <span>{periodLabel(r.period)}</span>
                      ),
                    },
                    { field: 'count', header: 'Bills' },
                    {
                      header: 'Department Total',
                      cell: (r: BatchRow) => (
                        <span className="font-semibold">{inr(r.total)}</span>
                      ),
                    },
                    {
                      header: 'Forwarded On',
                      cell: (r: BatchRow) => (
                        <span>{formatDate(r.sentForApprovalOn)}</span>
                      ),
                    },
                    {
                      header: 'Approved',
                      cell: (r: BatchRow) => (
                        <span>
                          {formatDate(r.approvedOn)}
                          <span className="block text-xs text-slate-500">
                            {r.approvedBy ?? 'Registrar & VC Sir'}
                          </span>
                        </span>
                      ),
                    },
                    {
                      header: 'Remarks',
                      cell: (r: BatchRow) => (
                        <span>{r.approvalRemarks || '—'}</span>
                      ),
                    },
                    {
                      header: 'Actions',
                      width: '170px',
                      cell: (r: BatchRow) => (
                        <Button
                          label="Process Payment"
                          icon="wallet"
                          variant="success"
                          size="small"
                          onClick={() => showBatch(r)}
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: `With Registrar & VC (${withVc.length})`,
              content: (
                <GridPanel
                  data={withVc}
                  columns={[
                    { field: 'department', header: 'UTD' },
                    {
                      header: 'Month',
                      cell: (r: BatchRow) => (
                        <span>{periodLabel(r.period)}</span>
                      ),
                    },
                    { field: 'count', header: 'Bills' },
                    {
                      header: 'Department Total',
                      cell: (r: BatchRow) => (
                        <span className="font-semibold">{inr(r.total)}</span>
                      ),
                    },
                    {
                      header: 'Forwarded On',
                      cell: (r: BatchRow) => (
                        <span>{formatDate(r.sentForApprovalOn)}</span>
                      ),
                    },
                    {
                      header: 'Stage',
                      cell: () => (
                        <StatusBadge
                          label="Awaiting Registrar & VC approval"
                          variant="warning"
                        />
                      ),
                    },
                    {
                      header: 'Actions',
                      width: '100px',
                      cell: (r: BatchRow) => (
                        <Button
                          label="View"
                          icon="eye"
                          variant="text"
                          size="small"
                          onClick={() => showBatch(r)}
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: `Bills to Verify (${toVerify.length})`,
              content: <GridPanel data={toVerify} columns={billColumns} />,
            },
            {
              title: `Paid / Settled (${settled.length})`,
              content: <GridPanel data={settled} columns={billColumns} />,
            },
          ]}
        />
      </FormCard>

      {/* ── Department batch ───────────────────────────────── */}
      <FormPopup
        visible={!!openBatch}
        onHide={() => setOpenBatchId(null)}
        title={
          openBatch
            ? `${openBatch.department} — ${periodLabel(openBatch.period)}`
            : ''
        }
        subtitle={
          openBatch
            ? `${openBatch.departmentName} · ${openBatch.count} bills · total ${inr(openBatch.total)}`
            : undefined
        }
        size="xl"
        footer={
          openBatch ? (
            <div className="flex justify-end gap-2">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setOpenBatchId(null)}
              />
              {openBatch.stage === 'Forward to Registrar & VC' && (
                <Button
                  label="Forward to Registrar & VC"
                  icon="send"
                  variant="warning"
                  onClick={() => setForwarding(openBatch)}
                />
              )}
              {isPayable(openBatch.stage) && (
                <Button
                  label={`Release ${inr(previewPayable)}`}
                  icon="wallet"
                  variant="success"
                  onClick={processBatch}
                />
              )}
            </div>
          ) : undefined
        }
      >
        {openBatch && (
          <div className="flex flex-col gap-4">
            <ol className="grid grid-cols-1 gap-2 sm:grid-cols-4">
              {[
                {
                  label: 'Received by Finance',
                  date: openBatch.receivedOn,
                  done: true,
                },
                {
                  label: openBatch.needsApproval
                    ? 'Forwarded to Registrar & VC'
                    : 'Approval not required',
                  date: openBatch.sentForApprovalOn,
                  done:
                    !openBatch.needsApproval ||
                    !!openBatch.sentForApprovalOn ||
                    !!openBatch.approvedOn,
                },
                {
                  label: openBatch.needsApproval
                    ? `Approved by ${openBatch.approvedBy ?? 'Registrar & VC Sir'}`
                    : `Within ${inr(rates.approvalThreshold)}`,
                  date: openBatch.approvedOn,
                  done: !openBatch.needsApproval || !!openBatch.approvedOn,
                },
                {
                  label: 'Payment released',
                  date: openBatch.paidOn,
                  done: openBatch.stage === 'Paid',
                },
              ].map(s => (
                <li
                  key={s.label}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    s.done
                      ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-200'
                      : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  <i
                    className={`pi ${s.done ? 'pi-check-circle' : 'pi-clock'} mr-1`}
                  />
                  {s.label}
                  <span className="block text-xs">
                    {s.date ? formatDate(s.date) : s.done ? '' : 'Pending'}
                  </span>
                </li>
              ))}
            </ol>

            {openBatch.stage === 'With Registrar & VC' && (
              <StageNote tone="warning">
                Forwarded on {formatDate(openBatch.sentForApprovalOn)} — waiting
                for Registrar &amp; VC Sir. Payment opens here once they
                approve.
              </StageNote>
            )}
            {openBatch.stage === 'Forward to Registrar & VC' && (
              <StageNote tone="warning">
                The department total {inr(openBatch.total)} is above{' '}
                {inr(rates.approvalThreshold)}. Forward it to the Registrar
                &amp; VC for approval.
                {openBatch.approvalRemarks &&
                  ` Returned earlier with remarks: “${openBatch.approvalRemarks}”.`}
              </StageNote>
            )}
            {openBatch.stage === 'VC Approved — Process Payment' && (
              <StageNote tone="success">
                Approved by {openBatch.approvedBy ?? 'Registrar & VC Sir'} on{' '}
                {formatDate(openBatch.approvedOn)}
                {openBatch.approvalRemarks
                  ? ` — “${openBatch.approvalRemarks}”`
                  : ''}
                . Enter the bank reference and release the payment.
              </StageNote>
            )}

            <GridPanel
              data={openBatch.items}
              columns={[
                { field: 'billNo', header: 'Bill No.' },
                {
                  header: 'Unique ID',
                  cell: (b: Bill) => <UniqueIdChip value={b.uniqueId} />,
                },
                { field: 'facultyName', header: 'Faculty' },
                {
                  header: 'T / P',
                  cell: (b: Bill) => (
                    <span>
                      {b.theoryCount} / {b.practicalCount}
                    </span>
                  ),
                },
                {
                  header: 'Bill Amount',
                  cell: (b: Bill) => <span>{inr(b.billAmount)}</span>,
                },
                {
                  header: 'Payable',
                  cell: (b: Bill) => {
                    const p = preview.find(r => r.bill.id === b.id);
                    return (
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        {inr(b.paidOn ? (b.payable ?? 0) : (p?.payable ?? 0))}
                      </span>
                    );
                  },
                },
                {
                  header: 'Not Payable',
                  cell: (b: Bill) => {
                    const p = preview.find(r => r.bill.id === b.id);
                    return (
                      <span className="text-red-600 dark:text-red-400">
                        {inr(
                          b.paidOn ? (b.notPayable ?? 0) : (p?.notPayable ?? 0)
                        )}
                      </span>
                    );
                  },
                },
                {
                  header: 'Status',
                  cell: (b: Bill) => (
                    <StatusBadge
                      label={b.status}
                      variant={billVariant(b.status)}
                    />
                  ),
                },
              ]}
            />

            {preview.length > 0 && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {tile('Department Total', inr(openBatch.total))}
                {tile(
                  'Payable now',
                  inr(previewPayable),
                  'text-green-700 dark:text-green-400'
                )}
                {tile(
                  'Not Payable (₹30,000 cap)',
                  inr(previewNotPayable),
                  'text-red-600 dark:text-red-400'
                )}
              </div>
            )}

            {isPayable(openBatch.stage) && (
              <FormGrid columns={2}>
                <TextBox
                  label="Bank Transaction / Batch Reference"
                  required
                  placeholder="e.g. NEFT/DAVV/1410/BATCH-07"
                  value={txnRef}
                  onChange={setTxnRef}
                />
              </FormGrid>
            )}
          </div>
        )}
      </FormPopup>

      {/* ── Single bill ───────────────────────────────────── */}
      <FormPopup
        visible={!!openBill}
        onHide={() => setOpenBillId(null)}
        title={openBill ? `Bill ${openBill.billNo}` : 'Bill'}
        subtitle={
          openBill
            ? `${openBill.facultyName} · ${openBill.department}`
            : undefined
        }
        size="xl"
        footer={
          openBill && !openBill.paidOn && billBatch?.approved ? (
            <div className="flex justify-end gap-2">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setOpenBillId(null)}
              />
              <Button
                label={
                  billCheck?.payable
                    ? `Release ${inr(billCheck.payable)}`
                    : 'Mark Not Payable'
                }
                icon="wallet"
                variant={billCheck?.payable ? 'success' : 'danger'}
                onClick={releaseOne}
              />
            </div>
          ) : undefined
        }
      >
        {openBill && billCheck && (
          <div className="flex flex-col gap-4">
            {!openBill.paidOn && billBatch && !billBatch.approved && (
              <StageNote tone="warning">
                {openBill.department} bills for {periodLabel(openBill.period)}{' '}
                total {inr(billBatch.total)} — above{' '}
                {inr(rates.approvalThreshold)}.{' '}
                {billBatch.awaiting
                  ? 'Awaiting Registrar & VC approval; payment can be released after approval.'
                  : 'Forward the department bills to the Registrar & VC from the Department-wise Bills tab.'}
              </StageNote>
            )}
            <BillView bill={openBill} />
            <FormCard
              title={`Consolidated Record — ${openBill.uniqueId}`}
              subtitle={`All bills of this Unique ID for ${periodLabel(openBill.period)}, from every UTD`}
              icon="sitemap"
            >
              <GridPanel
                data={billCheck.related}
                columns={[
                  { field: 'department', header: 'UTD' },
                  { field: 'billNo', header: 'Bill No.' },
                  {
                    header: 'Bill Amount',
                    cell: (b: Bill) => <span>{inr(b.billAmount)}</span>,
                  },
                  {
                    header: 'Paid',
                    cell: (b: Bill) => (
                      <span>{b.paidOn ? inr(b.payable ?? 0) : '—'}</span>
                    ),
                  },
                  {
                    header: 'Status',
                    cell: (b: Bill) => (
                      <StatusBadge
                        label={b.status}
                        variant={billVariant(b.status)}
                      />
                    ),
                  },
                ]}
              />
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                {tile('Limit', inr(rates.limit))}
                {tile('Already Paid', inr(billCheck.alreadyPaid))}
                {tile('Balance', inr(billCheck.balance))}
                {tile(
                  'Payable',
                  inr(
                    openBill.paidOn
                      ? (openBill.payable ?? 0)
                      : billCheck.payable
                  ),
                  'text-green-700 dark:text-green-400'
                )}
                {tile(
                  'Not Payable',
                  inr(
                    openBill.paidOn
                      ? (openBill.notPayable ?? 0)
                      : billCheck.notPayable
                  ),
                  'text-red-600 dark:text-red-400'
                )}
              </div>
            </FormCard>
            {!openBill.paidOn && billBatch?.approved && (
              <FormGrid columns={2}>
                <TextBox
                  label="Bank Transaction Reference"
                  required={billCheck.payable > 0}
                  placeholder="e.g. NEFT/DAVV/1410/1234"
                  value={txnRef}
                  onChange={setTxnRef}
                  disabled={billCheck.payable === 0}
                />
                <TextArea
                  label="Finance Remarks"
                  rows={2}
                  value={remarks}
                  onChange={setRemarks}
                />
              </FormGrid>
            )}
          </div>
        )}
      </FormPopup>

      <ConfirmDialog
        visible={!!forwarding}
        onHide={() => setForwarding(null)}
        onConfirm={confirmForward}
        title="Forward to Registrar & VC"
        message={
          forwarding
            ? `Forward ${forwarding.count} bills of ${forwarding.department} for ${periodLabel(forwarding.period)} (total ${inr(forwarding.total)}) to Registrar & VC Sir for approval?`
            : ''
        }
        confirmLabel="Forward"
        variant="warning"
      />
    </FormPage>
  );
}
