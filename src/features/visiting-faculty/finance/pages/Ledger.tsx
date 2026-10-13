import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { crumbs } from '../../components/hooks';
import { UniqueIdChip } from '../../components/ui';
import { useVisitingFacultyStore } from '../../store';
import { inr, periodLabel } from '../../utils';

interface LedgerRow {
  key: string;
  uniqueId: string;
  facultyName: string;
  period: string;
  departments: string;
  bills: number;
  billed: number;
  paid: number;
  notPayable: number;
  balance: number;
  pending: number;
}

/** Payment ledger — one row per Unique ID per month, across all UTDs. */
export default function Ledger() {
  const bills = useVisitingFacultyStore(s => s.bills);
  const rates = useVisitingFacultyStore(s => s.rates);

  const map = new Map<string, LedgerRow>();
  for (const b of bills) {
    const key = `${b.uniqueId}-${b.period}`;
    const row = map.get(key) ?? {
      key,
      uniqueId: b.uniqueId,
      facultyName: b.facultyName,
      period: b.period,
      departments: '',
      bills: 0,
      billed: 0,
      paid: 0,
      notPayable: 0,
      balance: rates.limit,
      pending: 0,
    };
    row.departments = [
      ...new Set([
        ...row.departments.split(', ').filter(Boolean),
        b.department,
      ]),
    ].join(', ');
    row.bills++;
    row.billed += b.billAmount;
    if (b.paidOn) {
      row.paid += b.payable ?? 0;
      row.notPayable += b.notPayable ?? 0;
    } else {
      row.pending += b.billAmount;
    }
    row.balance = Math.max(rates.limit - row.paid, 0);
    map.set(key, row);
  }
  const rows = [...map.values()].sort(
    (a, b) =>
      b.period.localeCompare(a.period) ||
      a.facultyName.localeCompare(b.facultyName)
  );

  return (
    <FormPage
      title="Payment Ledger"
      description={`What each Unique ID has been billed and paid per month, from every UTD, against the ${inr(rates.limit)} limit.`}
      breadcrumbs={crumbs('finance', 'Payment Ledger')}
    >
      <FormCard>
        <GridPanel
          data={rows}
          searchBox
          searchPlaceholder="Search by faculty or Unique ID..."
          columns={[
            {
              header: 'Unique ID',
              cell: (r: LedgerRow) => <UniqueIdChip value={r.uniqueId} />,
            },
            { field: 'facultyName', header: 'Faculty', sortable: true },
            {
              header: 'Month',
              cell: (r: LedgerRow) => <span>{periodLabel(r.period)}</span>,
            },
            { field: 'departments', header: 'UTDs' },
            { field: 'bills', header: 'Bills' },
            {
              header: 'Billed',
              cell: (r: LedgerRow) => <span>{inr(r.billed)}</span>,
            },
            {
              header: 'Paid',
              cell: (r: LedgerRow) => (
                <span className="font-semibold text-green-700 dark:text-green-400">
                  {inr(r.paid)}
                </span>
              ),
            },
            {
              header: 'Not Payable',
              cell: (r: LedgerRow) => (
                <span className="text-red-600 dark:text-red-400">
                  {inr(r.notPayable)}
                </span>
              ),
            },
            {
              header: 'Awaiting',
              cell: (r: LedgerRow) => <span>{inr(r.pending)}</span>,
            },
            {
              header: 'Balance under Limit',
              cell: (r: LedgerRow) => (
                <span
                  className={
                    r.balance === 0
                      ? 'font-semibold text-red-600'
                      : 'font-semibold'
                  }
                >
                  {r.balance === 0 ? 'Limit reached' : inr(r.balance)}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
