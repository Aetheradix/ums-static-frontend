import { useState } from 'react';
import { GridPanel, StatusBadge, Tabs } from 'shared/new-components';
import { useVisitingFacultyStore } from '../store';
import type { Bill, DailyLog, TeachingSession } from '../types';
import { formatDate, logVariant, periodOf } from '../utils';

type SessionRow = TeachingSession & {
  id: string;
  date: string;
  checkIn: string;
};

const weekday = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { weekday: 'short' });

/**
 * The attendance behind a bill — every day the faculty marked attendance in
 * the billing month, and every theory lecture and practical taken on each
 * day, as entered from the mobile app and verified by the HOD.
 */
export default function BillAttendance({ bill }: { bill: Bill }) {
  const logs = useVisitingFacultyStore(s => s.logs);
  const [tab, setTab] = useState(0);

  const month = logs
    .filter(
      l =>
        l.uniqueId === bill.uniqueId &&
        l.department === bill.department &&
        periodOf(l.date) === bill.period
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  const counted = month.filter(l => l.status === 'Verified');

  const sessions: SessionRow[] = counted.flatMap(l =>
    l.sessions.map((s, i) => ({
      ...s,
      id: `${l.id}-${i}`,
      date: l.date,
      checkIn: l.checkIn,
    }))
  );
  const theory = sessions.filter(s => s.type === 'Theory');
  const practical = sessions.filter(s => s.type === 'Practical');

  const sessionColumns: Controls.ColumnProps<SessionRow>[] = [
    {
      header: 'Date',
      cell: s => (
        <span>
          {formatDate(s.date)}{' '}
          <span className="text-xs text-slate-400">{weekday(s.date)}</span>
        </span>
      ),
    },
    { field: 'time', header: 'Time' },
    { field: 'subject', header: 'Subject / Lab' },
    { field: 'program', header: 'Program' },
    { field: 'topic', header: 'Topic Covered' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Attendance &amp; Lectures — day-wise detail
        </h4>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {counted.length} days present · {theory.length} theory ·{' '}
          {practical.length} practical
          {month.length > counted.length &&
            ` · ${month.length - counted.length} entr${month.length - counted.length === 1 ? 'y' : 'ies'} not counted`}
        </span>
      </div>

      {/* Days attended — one chip per day of the month */}
      <div className="flex flex-wrap gap-1.5">
        {month.map(l => (
          <span
            key={l.id}
            title={`${formatDate(l.date)} · in ${l.checkIn} · ${l.status}`}
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              l.status === 'Verified'
                ? 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300'
                : l.status === 'Rejected'
                  ? 'bg-red-50 text-red-600 line-through dark:bg-red-950/40 dark:text-red-300'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
            }`}
          >
            {new Date(l.date).getDate()} {weekday(l.date)}
          </span>
        ))}
        {!month.length && (
          <span className="text-xs text-slate-400">
            No attendance entries for this month.
          </span>
        )}
      </div>

      <Tabs
        activeIndex={tab}
        onTabChange={e => setTab(e.index)}
        tabs={[
          {
            title: `Day-wise (${month.length})`,
            content: (
              <GridPanel
                data={month}
                columns={[
                  {
                    header: 'Date',
                    cell: (l: DailyLog) => (
                      <span>
                        {formatDate(l.date)}{' '}
                        <span className="text-xs text-slate-400">
                          {weekday(l.date)}
                        </span>
                      </span>
                    ),
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
                        {[...new Set(l.sessions.map(s => s.subject))].join(
                          ', '
                        )}
                      </span>
                    ),
                  },
                  {
                    header: 'HOD Verification',
                    cell: (l: DailyLog) => (
                      <div className="flex flex-col gap-0.5">
                        <StatusBadge
                          label={l.status}
                          variant={logVariant(l.status)}
                        />
                        {l.remarks && (
                          <span className="text-[11px] text-red-600 dark:text-red-400">
                            {l.remarks}
                          </span>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            ),
          },
          {
            title: `Theory Lectures (${theory.length})`,
            content: <GridPanel data={theory} columns={sessionColumns} />,
          },
          {
            title: `Practicals (${practical.length})`,
            content: <GridPanel data={practical} columns={sessionColumns} />,
          },
        ]}
      />
    </div>
  );
}
