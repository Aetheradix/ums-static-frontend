import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import {
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
import { useVisitingFacultyStore } from '../../store';
import type { Bill } from '../../types';
import {
  billVariant,
  formatDate,
  inr,
  limitCheck,
  periodLabel,
} from '../../utils';

/** Stages P3–P4 — consolidated ₹30,000 limit check and payment release. */
export default function FinanceBills() {
  const bills = useVisitingFacultyStore(s => s.bills);
  const rates = useVisitingFacultyStore(s => s.rates);
  const takeUpBill = useVisitingFacultyStore(s => s.takeUpBill);
  const releasePayment = useVisitingFacultyStore(s => s.releasePayment);

  const [tab, setTab] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [txnRef, setTxnRef] = useState('');
  const [remarks, setRemarks] = useState('');

  const open = bills.find(b => b.id === openId) ?? null;
  const check = open ? limitCheck(open, bills, rates) : null;

  const pending = bills.filter(b =>
    ['Sent to Finance', 'Under Verification'].includes(b.status)
  );
  const settled = bills.filter(b =>
    ['Paid', 'Partially Paid', 'Not Payable'].includes(b.status)
  );

  const openBill = (b: Bill) => {
    if (b.status === 'Sent to Finance') takeUpBill(b.id);
    setTxnRef('');
    setRemarks('');
    setOpenId(b.id);
  };

  const release = () => {
    if (!open || !check) return;
    if (check.payable > 0 && !txnRef.trim()) {
      ToastService.error('Enter the bank transaction reference.');
      return;
    }
    releasePayment(open.id, txnRef.trim(), remarks.trim());
    ToastService.success(
      check.payable === 0
        ? `${open.billNo} marked Not Payable — limit already used.`
        : `${inr(check.payable)} released to ${open.uniqueId}${check.notPayable ? ` (${inr(check.notPayable)} not payable)` : ''}.`
    );
    setOpenId(null);
  };

  const columns: Controls.ColumnProps<Bill>[] = [
    { field: 'billNo', header: 'Bill No.' },
    { field: 'department', header: 'UTD' },
    { header: 'Unique ID', cell: b => <UniqueIdChip value={b.uniqueId} /> },
    { field: 'facultyName', header: 'Faculty' },
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
      cell: b => {
        const c =
          b.payable !== undefined
            ? { payable: b.payable }
            : limitCheck(b, bills, rates);
        return (
          <span className="font-semibold text-green-700 dark:text-green-400">
            {inr(c.payable)}
          </span>
        );
      },
    },
    {
      header: 'Status',
      cell: b => (
        <StatusBadge label={b.status} variant={billVariant(b.status)} />
      ),
    },
    {
      header: 'Actions',
      width: '120px',
      cell: b => (
        <Button
          label={b.paidOn ? 'View' : 'Verify'}
          icon={b.paidOn ? 'eye' : 'check-square'}
          variant="text"
          size="small"
          onClick={() => openBill(b)}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Bill Verification & Payment"
      description="Bills from every UTD. Each bill is checked against the consolidated record of the faculty's Unique ID before payment."
      breadcrumbs={crumbs('finance', 'Bill Verification')}
    >
      <StageNote>
        Payable = lower of the bill amount and ({inr(rates.limit)} − amount
        already paid to the same Unique ID for the month, from all UTDs). The
        rest is Not Payable.
      </StageNote>
      <FormCard>
        <Tabs
          activeIndex={tab}
          onTabChange={e => setTab(e.index)}
          tabs={[
            {
              title: `Pending (${pending.length})`,
              content: <GridPanel data={pending} columns={columns} searchBox />,
            },
            {
              title: `Settled (${settled.length})`,
              content: <GridPanel data={settled} columns={columns} searchBox />,
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={!!open}
        onHide={() => setOpenId(null)}
        title={open ? `Bill ${open.billNo}` : 'Bill'}
        subtitle={open ? `${open.facultyName} · ${open.department}` : undefined}
        size="xl"
        footer={
          open && !open.paidOn ? (
            <div className="flex justify-end gap-2">
              <Button
                label="Close"
                variant="outlined"
                onClick={() => setOpenId(null)}
              />
              <Button
                label={
                  check?.payable
                    ? `Release ${inr(check.payable)}`
                    : 'Mark Not Payable'
                }
                icon="wallet"
                variant={check?.payable ? 'success' : 'danger'}
                onClick={release}
              />
            </div>
          ) : undefined
        }
      >
        {open && check && (
          <div className="flex flex-col gap-4">
            <BillView bill={open} />

            <FormCard
              title={`Consolidated Record — ${open.uniqueId}`}
              subtitle={`All bills of this Unique ID for ${periodLabel(open.period)}, from every UTD`}
              icon="sitemap"
            >
              <GridPanel
                data={check.related}
                columns={[
                  { field: 'department', header: 'UTD' },
                  { field: 'billNo', header: 'Bill No.' },
                  {
                    header: 'Bill Date',
                    cell: (b: Bill) => <span>{formatDate(b.billDate)}</span>,
                  },
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
                {[
                  ['Limit', inr(rates.limit), ''],
                  ['Already Paid', inr(check.alreadyPaid), ''],
                  ['Balance', inr(check.balance), ''],
                  [
                    'Payable',
                    inr(open.paidOn ? (open.payable ?? 0) : check.payable),
                    'text-green-700 dark:text-green-400',
                  ],
                  [
                    'Not Payable',
                    inr(
                      open.paidOn ? (open.notPayable ?? 0) : check.notPayable
                    ),
                    'text-red-600 dark:text-red-400',
                  ],
                ].map(([label, value, tone]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {label}
                    </p>
                    <p className={`text-lg font-bold ${tone}`}>{value}</p>
                  </div>
                ))}
              </div>
            </FormCard>

            {!open.paidOn && (
              <FormGrid columns={2}>
                <TextBox
                  label="Bank Transaction Reference"
                  required={check.payable > 0}
                  placeholder="e.g. NEFT/DAVV/0910/1234"
                  value={txnRef}
                  onChange={setTxnRef}
                  disabled={check.payable === 0}
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
    </FormPage>
  );
}
