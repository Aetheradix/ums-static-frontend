import { useVisitingFacultyStore } from '../store';
import { facultyMonthStatus, formatDate, inr, periodLabel } from '../utils';
import { StatusBadge } from 'shared/new-components';
import { billVariant } from '../utils';

/**
 * Paid-so-far vs the monthly limit for one faculty, across every UTD.
 * `compact` fits a grid cell; the full version lists each UTD's bill.
 */
export default function LimitMeter({
  uniqueId,
  period,
  compact = false,
}: {
  uniqueId: string;
  period: string;
  compact?: boolean;
}) {
  const bills = useVisitingFacultyStore(s => s.bills);
  const rates = useVisitingFacultyStore(s => s.rates);
  const st = facultyMonthStatus(uniqueId, period, bills, rates);
  const paidPct = Math.min((st.paid / rates.limit) * 100, 100);
  const pendingPct = Math.min(
    (Math.min(st.pending, st.balance) / rates.limit) * 100,
    100 - paidPct
  );
  const utds = [...new Set(st.month.map(b => b.department))];

  const bar = (
    <div
      className="flex h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
      title={`Paid ${inr(st.paid)} · pending ${inr(st.pending)} · balance ${inr(st.balance)} of ${inr(rates.limit)}`}
    >
      {/* widths are data-driven */}
      <div className="h-full bg-green-500" style={{ width: `${paidPct}%` }} />
      <div
        className="h-full bg-amber-400"
        style={{ width: `${pendingPct}%` }}
      />
    </div>
  );

  if (compact) {
    return (
      <div className="flex min-w-[170px] flex-col gap-1">
        {bar}
        <span className="text-[11px] leading-tight text-slate-600 dark:text-slate-300">
          Paid{' '}
          <b className="text-green-700 dark:text-green-400">{inr(st.paid)}</b> ·
          Balance{' '}
          <b className={st.balance === 0 ? 'text-red-600' : ''}>
            {st.balance === 0 ? 'nil' : inr(st.balance)}
          </b>
          {utds.length > 1 && (
            <span className="block text-indigo-600 dark:text-indigo-300">
              Teaches in {utds.length} UTDs: {utds.join(', ')}
            </span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {inr(rates.limit)} limit — {periodLabel(period)}, all UTDs
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <span className="mr-3 inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Paid
          </span>
          <span className="mr-3 inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Bills in
            process
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />{' '}
            Balance
          </span>
        </p>
      </div>
      {bar}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Already paid', inr(st.paid), 'text-green-700 dark:text-green-400'],
          [
            'Balance left',
            inr(st.balance),
            st.balance === 0 ? 'text-red-600' : '',
          ],
          [
            'Bills in process',
            inr(st.pending),
            'text-amber-600 dark:text-amber-400',
          ],
          [
            'Will not fit the limit',
            inr(st.overBy),
            st.overBy ? 'text-red-600 dark:text-red-400' : '',
          ],
        ].map(([label, value, tone]) => (
          <div key={label}>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className={`text-base font-bold ${tone}`}>{value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col divide-y divide-slate-100 text-sm dark:divide-slate-800">
        {st.month.map(b => (
          <div
            key={b.id}
            className="flex flex-wrap items-center justify-between gap-2 py-1.5"
          >
            <span>
              <b>{b.department}</b>
              {b.branch && (
                <span className="text-slate-500 dark:text-slate-400">
                  {' '}
                  · {b.branch}
                </span>
              )}
              <span className="ml-2 text-xs text-slate-400">{b.billNo}</span>
            </span>
            <span className="flex items-center gap-3">
              <span>
                {b.paidOn
                  ? `${inr(b.payable ?? 0)} paid on ${formatDate(b.paidOn)}`
                  : `${inr(b.billAmount)} billed`}
              </span>
              <StatusBadge label={b.status} variant={billVariant(b.status)} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
