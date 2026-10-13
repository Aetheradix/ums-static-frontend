import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormPage, StatusBadge } from 'shared/new-components';
import { crumbs, useFaculty } from '../components/hooks';
import { StageNote, UniqueIdChip } from '../components/ui';
import { deptName } from '../data';
import { useVisitingFacultyStore } from '../store';
import type { Faculty, SessionType } from '../types';
import {
  billAmountOf,
  countSessions,
  formatDate,
  fromIso,
  inr,
  logVariant,
  periodLabel,
  periodOf,
  toIso,
  todayIso,
} from '../utils';

type Screen = 'today' | 'history' | 'earnings';

const nowTime = () =>
  new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

/**
 * Simulates the Visiting Faculty mobile app: sign in with the Unique ID,
 * mark attendance (time + location captured), and add each theory lecture
 * or practical taken. Entries land in the department login for verification.
 */
export default function MobileApp() {
  const faculty = useFaculty();
  const [user, setUser] = useState<Faculty | null>(null);
  const [loginId, setLoginId] = useState('');
  const [screen, setScreen] = useState<Screen>('today');

  const login = () => {
    const found = faculty.find(
      f => f.uniqueId === loginId.trim().toUpperCase()
    );
    if (!found) {
      ToastService.error('Unique ID not found or joining not yet approved.');
      return;
    }
    setUser(found);
    setScreen('today');
  };

  return (
    <FormPage
      title="Visiting Faculty Mobile App"
      description="Preview of the faculty app — attendance and lecture entries flow straight to the UTD Department login."
      breadcrumbs={crumbs('mobile', 'App Preview')}
    >
      <div className="flex flex-col items-start gap-6 lg:flex-row">
        {/* Phone frame */}
        <div className="mx-auto w-full max-w-[380px] shrink-0 rounded-[2.5rem] border-[10px] border-slate-800 bg-slate-800 shadow-2xl">
          <div className="flex h-[720px] flex-col overflow-hidden rounded-[1.8rem] bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center justify-between bg-[#0d3b6e] px-5 pb-3 pt-4 text-white">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-amber-300">
                  DAVV INDORE
                </p>
                <p className="text-sm font-semibold">Visiting Faculty</p>
              </div>
              {user && (
                <button
                  type="button"
                  className="text-xs text-blue-100 underline"
                  onClick={() => setUser(null)}
                >
                  Sign out
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!user ? (
                <div className="flex h-full flex-col justify-center gap-4">
                  <div className="text-center">
                    <i className="pi pi-mobile text-4xl text-blue-700 dark:text-blue-300" />
                    <h3 className="mt-2 text-lg font-bold">Sign in</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Use the Unique ID issued on joining.
                    </p>
                  </div>
                  <TextBox
                    label="Unique ID"
                    placeholder="e.g. RAHU234F"
                    value={loginId}
                    onChange={setLoginId}
                  />
                  <Button
                    label="Sign in"
                    icon="sign-in"
                    variant="primary"
                    onClick={login}
                  />
                  <div className="flex flex-wrap justify-center gap-2">
                    {faculty.slice(0, 4).map(f => (
                      <button
                        key={f.uniqueId}
                        type="button"
                        className="rounded-full bg-white px-2 py-1 font-mono text-xs text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300"
                        onClick={() => setLoginId(f.uniqueId)}
                      >
                        {f.uniqueId}
                      </button>
                    ))}
                  </div>
                </div>
              ) : screen === 'today' ? (
                <TodayScreen user={user} />
              ) : screen === 'history' ? (
                <HistoryScreen user={user} />
              ) : (
                <EarningsScreen user={user} />
              )}
            </div>

            {user && (
              <nav className="grid grid-cols-3 border-t border-slate-200 bg-white text-xs dark:border-slate-700 dark:bg-slate-800">
                {(
                  [
                    ['today', 'Today', 'calendar-plus'],
                    ['history', 'History', 'history'],
                    ['earnings', 'Earnings', 'wallet'],
                  ] as const
                ).map(([key, label, icon]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setScreen(key)}
                    className={`flex flex-col items-center gap-1 py-2 ${
                      screen === key
                        ? 'font-semibold text-blue-700 dark:text-blue-300'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <i className={`pi pi-${icon}`} />
                    {label}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <FormCard
            title="How the app feeds the payment process"
            icon="sitemap"
          >
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>
                The faculty signs in with the Unique ID issued after Head Office
                approval.
              </li>
              <li>
                On reaching the department, they tap <b>Mark Attendance</b> —
                time and location are captured.
              </li>
              <li>
                After each class they add the lecture: Theory or Practical,
                subject code, program and topic.
              </li>
              <li>
                Entries appear in{' '}
                <b>UTD Department → Attendance &amp; Lectures</b> by teacher and
                date, for verification.
              </li>
              <li>
                Verified entries build the monthly bill (₹400 / theory, ₹800 /
                practical), which Finance pays up to ₹30,000.
              </li>
            </ol>
          </FormCard>
          <StageNote>
            A faculty teaching in more than one UTD picks the department before
            marking attendance — each department verifies and bills only its own
            entries, all under the same Unique ID.
          </StageNote>
        </div>
      </div>
    </FormPage>
  );
}

function TodayScreen({ user }: { user: Faculty }) {
  const logs = useVisitingFacultyStore(s => s.logs);
  const markAttendance = useVisitingFacultyStore(s => s.markAttendance);
  const addSession = useVisitingFacultyStore(s => s.addSession);

  const [dept, setDept] = useState(user.departments[0]);
  const [date, setDate] = useState(todayIso());
  const [type, setType] = useState<SessionType>('Theory');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');

  const log = logs.find(
    l =>
      l.uniqueId === user.uniqueId && l.department === dept && l.date === date
  );
  const codes = type === 'Theory' ? user.subjects : user.labs;

  const mark = () => {
    markAttendance(user.uniqueId, dept, date, nowTime());
    ToastService.success(`Attendance marked at ${dept}.`);
  };

  const add = () => {
    if (!subject || !topic.trim()) {
      ToastService.error('Select the subject and enter the topic covered.');
      return;
    }
    addSession(user.uniqueId, dept, date, {
      type,
      subject,
      program: '',
      topic: topic.trim(),
      time: nowTime(),
    });
    ToastService.success(`${type} lecture added.`);
    setTopic('');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800">
        <p className="text-sm font-semibold">{user.fullName}</p>
        <UniqueIdChip value={user.uniqueId} />
      </div>

      <DropDownList
        label="Department"
        data={user.departments.map(d => ({
          id: d,
          text: `${d} — ${deptName(d)}`,
        }))}
        textField="text"
        valueField="id"
        value={dept}
        onChange={v => v && setDept(v as string)}
      />
      <DatePicker
        label="Date"
        maxDate={new Date()}
        value={fromIso(date)}
        onChange={v => v && setDate(toIso(v))}
      />

      {!log ? (
        <Button
          label="Mark Attendance"
          icon="map-marker"
          variant="success"
          onClick={mark}
        />
      ) : (
        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-200">
          <p className="font-semibold">
            <i className="pi pi-check-circle mr-1" />
            Present — checked in at {log.checkIn}
          </p>
          <p>{log.location}</p>
          <div className="mt-1">
            <StatusBadge label={log.status} variant={logVariant(log.status)} />
          </div>
        </div>
      )}

      {log && (
        <>
          <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800">
            <p className="mb-2 text-sm font-semibold">Add Lecture</p>
            <div className="mb-2 grid grid-cols-2 gap-2">
              {(['Theory', 'Practical'] as SessionType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    setSubject('');
                  }}
                  className={`rounded-lg border py-2 text-sm font-medium ${
                    type === t
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <DropDownList
                label={type === 'Theory' ? 'Subject Code' : 'Lab Code'}
                data={codes.map(c => ({ id: c, text: c }))}
                textField="text"
                valueField="id"
                value={subject}
                onChange={v => setSubject((v as string) ?? '')}
              />
              <TextBox
                label="Topic Covered"
                value={topic}
                onChange={setTopic}
              />
              <Button
                label={`Add ${type}`}
                icon="plus"
                variant="primary"
                onClick={add}
              />
            </div>
          </div>

          <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800">
            <p className="mb-2 text-sm font-semibold">
              Lectures on {formatDate(date)}
            </p>
            {log.sessions.length === 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No lectures added yet.
              </p>
            )}
            <ul className="flex flex-col gap-2">
              {log.sessions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 text-xs last:border-b-0 dark:border-slate-700"
                >
                  <div>
                    <p className="font-semibold">
                      {s.subject} · {s.type}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {s.topic}
                    </p>
                  </div>
                  <span className="text-slate-400">{s.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function HistoryScreen({ user }: { user: Faculty }) {
  const logs = useVisitingFacultyStore(s => s.logs)
    .filter(l => l.uniqueId === user.uniqueId)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 40);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold">Attendance History</p>
      {logs.map(l => {
        const c = countSessions([l]);
        return (
          <div
            key={l.id}
            className="flex items-center justify-between rounded-xl bg-white p-3 text-xs shadow-sm dark:bg-slate-800"
          >
            <div>
              <p className="font-semibold">
                {formatDate(l.date)} · {l.department}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {c.theory} theory · {c.practical} practical · in {l.checkIn}
              </p>
            </div>
            <StatusBadge label={l.status} variant={logVariant(l.status)} />
          </div>
        );
      })}
    </div>
  );
}

function EarningsScreen({ user }: { user: Faculty }) {
  const logs = useVisitingFacultyStore(s => s.logs);
  const bills = useVisitingFacultyStore(s => s.bills);
  const rates = useVisitingFacultyStore(s => s.rates);

  const own = logs.filter(
    l => l.uniqueId === user.uniqueId && l.status !== 'Rejected'
  );
  const periods = [...new Set(own.map(l => periodOf(l.date)))].sort().reverse();

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold">Monthly Earnings</p>
      {periods.map(p => {
        const c = countSessions(own.filter(l => periodOf(l.date) === p));
        const amount = billAmountOf(c.theory, c.practical, rates);
        const paid = bills
          .filter(
            b => b.uniqueId === user.uniqueId && b.period === p && b.paidOn
          )
          .reduce((s, b) => s + (b.payable ?? 0), 0);
        return (
          <div
            key={p}
            className="rounded-xl bg-white p-3 text-xs shadow-sm dark:bg-slate-800"
          >
            <p className="mb-1 text-sm font-semibold">{periodLabel(p)}</p>
            <p>
              {c.days} days · {c.theory} theory · {c.practical} practical
            </p>
            <p className="mt-1">
              Earned: <b>{inr(amount)}</b>
              {amount > rates.limit && (
                <span className="text-red-600">
                  {' '}
                  (payable up to {inr(rates.limit)})
                </span>
              )}
            </p>
            <p>
              Paid:{' '}
              <b className="text-green-700 dark:text-green-400">{inr(paid)}</b>
            </p>
          </div>
        );
      })}
    </div>
  );
}
