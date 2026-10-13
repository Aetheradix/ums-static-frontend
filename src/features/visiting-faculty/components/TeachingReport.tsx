import { useMemo, useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPopup,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { DEPARTMENTS } from '../data';
import { useVisitingFacultyStore } from '../store';
import type { BillStatus, DailyLog } from '../types';
import {
  billAmountOf,
  billVariant,
  countSessions,
  formatDate,
  inr,
  logVariant,
  periodLabel,
  periodOf,
} from '../utils';
import { useFaculty } from './hooks';
import { UniqueIdChip } from './ui';

interface Row {
  key: string;
  uniqueId: string;
  fullName: string;
  department: string;
  days: number;
  theory: number;
  practical: number;
  amount: number;
  billStatus?: BillStatus;
  payable?: number;
  logs: DailyLog[];
}

/**
 * Faculty-wise teaching report — days present, theory lectures and
 * practicals per month, from the mobile-app entries. `department` locks the
 * report to one UTD (department login); omit it for the university view.
 */
export default function TeachingReport({
  department,
}: {
  department?: string;
}) {
  const logs = useVisitingFacultyStore(s => s.logs);
  const bills = useVisitingFacultyStore(s => s.bills);
  const rates = useVisitingFacultyStore(s => s.rates);
  const faculty = useFaculty();

  const periods = useMemo(
    () => [...new Set(logs.map(l => periodOf(l.date)))].sort().reverse(),
    [logs]
  );
  const [period, setPeriod] = useState(periods[0] ?? '');
  const [deptFilter, setDeptFilter] = useState('');
  const [drill, setDrill] = useState<Row | null>(null);

  const dept = department ?? deptFilter;

  const rows = useMemo<Row[]>(() => {
    const out: Row[] = [];
    for (const f of faculty) {
      for (const d of f.departments) {
        if (dept && d !== dept) continue;
        const own = logs.filter(
          l =>
            l.uniqueId === f.uniqueId &&
            l.department === d &&
            periodOf(l.date) === period &&
            l.status !== 'Rejected'
        );
        if (!own.length) continue;
        const c = countSessions(own);
        const bill = bills.find(
          b =>
            b.uniqueId === f.uniqueId &&
            b.department === d &&
            b.period === period
        );
        out.push({
          key: `${f.uniqueId}-${d}`,
          uniqueId: f.uniqueId,
          fullName: f.fullName,
          department: d,
          days: c.days,
          theory: c.theory,
          practical: c.practical,
          amount: billAmountOf(c.theory, c.practical, rates),
          billStatus: bill?.status,
          payable: bill?.payable,
          logs: [...own].sort((a, b) => a.date.localeCompare(b.date)),
        });
      }
    }
    return out;
  }, [faculty, logs, bills, rates, period, dept]);

  const totals = rows.reduce(
    (t, r) => ({
      theory: t.theory + r.theory,
      practical: t.practical + r.practical,
      amount: t.amount + r.amount,
    }),
    { theory: 0, practical: 0, amount: 0 }
  );

  return (
    <>
      <FormCard title="Filters" icon="filter">
        <FormGrid columns={3}>
          <DropDownList
            label="Month"
            data={periods.map(p => ({ id: p, text: periodLabel(p) }))}
            textField="text"
            valueField="id"
            value={period}
            onChange={v => setPeriod((v as string) ?? period)}
          />
          {!department && (
            <DropDownList
              label="Department"
              data={[
                { id: '', text: 'All Departments' },
                ...DEPARTMENTS.map(d => ({ id: d.code, text: d.code })),
              ]}
              textField="text"
              valueField="id"
              value={deptFilter}
              onChange={v => setDeptFilter((v as string) ?? '')}
            />
          )}
        </FormGrid>
      </FormCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Faculty Teaching"
          value={new Set(rows.map(r => r.uniqueId)).size}
          icon="users"
          colorScheme="blue"
        />
        <StatCard
          title="Theory Lectures"
          value={totals.theory}
          icon="book"
          colorScheme="purple"
          subtitle={`@ ${inr(rates.theoryRate)} each`}
        />
        <StatCard
          title="Practicals"
          value={totals.practical}
          icon="desktop"
          colorScheme="teal"
          subtitle={`@ ${inr(rates.practicalRate)} each`}
        />
        <StatCard
          title="Bill Value"
          value={inr(totals.amount)}
          icon="wallet"
          colorScheme="green"
          subtitle="Before the limit check"
        />
      </div>

      <FormCard
        title={`Faculty-wise Report — ${period ? periodLabel(period) : ''}`}
        icon="chart-bar"
      >
        <GridPanel
          data={rows}
          searchBox
          searchPlaceholder="Search by name or Unique ID..."
          columns={[
            {
              header: 'Unique ID',
              cell: (r: Row) => <UniqueIdChip value={r.uniqueId} />,
            },
            { field: 'fullName', header: 'Faculty', sortable: true },
            { field: 'department', header: 'UTD' },
            { field: 'days', header: 'Days Present', sortable: true },
            { field: 'theory', header: 'Theory', sortable: true },
            { field: 'practical', header: 'Practical', sortable: true },
            {
              header: 'Amount',
              cell: (r: Row) => (
                <span className="font-semibold">{inr(r.amount)}</span>
              ),
            },
            {
              header: 'Bill',
              cell: (r: Row) =>
                r.billStatus ? (
                  <StatusBadge
                    label={r.billStatus}
                    variant={billVariant(r.billStatus)}
                  />
                ) : (
                  <span className="text-xs text-slate-400">Not billed</span>
                ),
            },
            {
              header: 'Paid',
              cell: (r: Row) => (
                <span>{r.payable !== undefined ? inr(r.payable) : '—'}</span>
              ),
            },
            {
              header: '',
              width: '90px',
              cell: (r: Row) => (
                <Button
                  label="Dates"
                  icon="calendar"
                  variant="text"
                  size="small"
                  onClick={() => setDrill(r)}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={!!drill}
        onHide={() => setDrill(null)}
        title={drill ? `${drill.fullName} — ${drill.department}` : ''}
        subtitle={
          drill ? `${drill.uniqueId} · ${periodLabel(period)}` : undefined
        }
        size="lg"
      >
        {drill && (
          <GridPanel
            data={drill.logs}
            columns={[
              {
                header: 'Date',
                cell: (l: DailyLog) => <span>{formatDate(l.date)}</span>,
              },
              { field: 'checkIn', header: 'Check-in' },
              {
                header: 'Theory',
                cell: (l: DailyLog) => (
                  <span>
                    {l.sessions.filter(s => s.type === 'Theory').length}
                  </span>
                ),
              },
              {
                header: 'Practical',
                cell: (l: DailyLog) => (
                  <span>
                    {l.sessions.filter(s => s.type === 'Practical').length}
                  </span>
                ),
              },
              {
                header: 'Subjects',
                cell: (l: DailyLog) => (
                  <span>
                    {[...new Set(l.sessions.map(s => s.subject))].join(', ')}
                  </span>
                ),
              },
              {
                header: 'Status',
                cell: (l: DailyLog) => (
                  <StatusBadge
                    label={l.status}
                    variant={logVariant(l.status)}
                  />
                ),
              },
            ]}
          />
        )}
      </FormPopup>
    </>
  );
}
