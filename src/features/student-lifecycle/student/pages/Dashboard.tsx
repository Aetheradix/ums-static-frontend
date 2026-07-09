import { Link } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { listStudents, upcomingEvents } from '../../data';
import {
  academicStanding,
  computeCGPA,
  degreeProgress,
  examEligibility,
  REQUIRED_CREDITS,
} from '../../data/domain';
import { formatDate, formatINR, semesterParity, toRoman } from '../../utils';
import {
  HeroBanner,
  Sparkline,
  Gauge,
  CreditMeter,
  GradeBadge,
} from '../../components';

export default function StudentDashboard() {
  const currentStudentNo = useLifecycleStore(s => s.currentStudentNo);
  const notifications = useLifecycleStore(s => s.notifications);

  const students = listStudents();
  const student = students.find(s => s.enrollmentNo === currentStudentNo);

  if (!student) {
    return (
      <FormPage
        title="Academic Dashboard"
        description="No active student profile found."
      >
        <FormCard>
          <div className="p-8 text-center text-red-500">
            Error: Student profile not loaded. Please select a profile from the
            portal landing page.
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const firstName = student.name.split(' ')[0];
  const cgpa = computeCGPA(student.semesters);
  const progress = degreeProgress(student.semesters);
  const standing = academicStanding(student);
  const eligibility = examEligibility(student);
  const feeDue = student.fees
    .filter(f => f.status !== 'Paid')
    .reduce((sum, f) => sum + f.amount, 0);

  const completed = student.semesters.filter(s =>
    s.courses.every(c => c.status !== 'Pending')
  );
  const sgpaTrend = completed
    .map(s => s.sgpa)
    .filter((v): v is number => v != null);
  const lastSgpa = sgpaTrend.at(-1) ?? null;
  const latest = completed.at(-1);

  // We seed TODAY_ISO as 2026-07-09T00:00:00Z for this demo
  const upcoming = upcomingEvents('2026-07-09T00:00:00Z', 4);
  const recentNotifications = notifications.slice(0, 3);

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.root },
    { label: 'Student Portal', to: studentLifecycleUrls.student.root },
    { label: 'Academic Dashboard' },
  ];

  return (
    <FormPage
      title="Academic Dashboard"
      description="Overview of your current academic standing, cgpa progress, attendance compliance, and schedule."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Heritage Hero Banner */}
        <HeroBanner>
          <div className="flex flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-amber-400 font-semibold tracking-wider uppercase text-xs">
                Semester {toRoman(student.currentSemester)} ·{' '}
                {semesterParity(student.currentSemester)} Semester
              </p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
                Welcome back, {firstName}
              </h1>
              <p className="mt-1.5 text-sm text-slate-300">
                B.E. {student.branch} · Section {student.section} · Enrollment
                No: {student.enrollmentNo}
              </p>
            </div>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${
                  standing.tone === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/400/20 text-emerald-300 border-emerald-500/30'
                    : standing.tone === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/400/20 text-amber-300 border-amber-500/30'
                      : 'bg-red-50 dark:bg-red-950/400/20 text-red-300 border-red-500/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    standing.tone === 'success'
                      ? 'bg-emerald-400'
                      : standing.tone === 'warning'
                        ? 'bg-amber-400'
                        : 'bg-red-400'
                  }`}
                />
                {standing.label}
              </span>
            </div>
          </div>
        </HeroBanner>

        {/* Detained/At Risk Warnings */}
        {eligibility.status !== 'Eligible' && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-4 ${
              eligibility.status === 'Detained'
                ? 'bg-red-50 dark:bg-red-950/40/50 border-red-200 text-red-800'
                : 'bg-amber-50 dark:bg-amber-950/40/50 border-amber-200 text-amber-800'
            }`}
          >
            <Icon
              name="warning"
              className={`mt-0.5 text-xl ${eligibility.status === 'Detained' ? 'text-red-500' : 'text-amber-500'}`}
            />
            <div className="flex-1">
              <h3 className="font-bold text-sm">
                Exam Eligibility{' '}
                {eligibility.status === 'Detained' ? 'Blocked' : 'At Risk'}
              </h3>
              <p className="text-xs mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                Your aggregate attendance is{' '}
                <span className="font-bold">{eligibility.aggregate}%</span>{' '}
                (minimum {75}% required).
                {eligibility.status === 'Detained'
                  ? ' You are currently Detained from sitting examinations.'
                  : ' Please review your course attendance before the exam form window closes.'}
              </p>
            </div>
            <Link
              to={studentLifecycleUrls.student.examinations}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-slate-50 dark:bg-slate-950 transition-colors ${
                eligibility.status === 'Detained'
                  ? 'border-red-300 text-red-700 bg-white dark:bg-slate-900'
                  : 'border-amber-300 text-amber-700 bg-white dark:bg-slate-900'
              }`}
            >
              Review Attendance
            </Link>
          </div>
        )}

        {/* 4 Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="CGPA"
            value={cgpa?.toFixed(2) ?? '—'}
            icon="trending-up"
            colorScheme="green"
            subtitle={`${completed.length} Semesters Completed`}
          />
          <StatCard
            title="Credits Earned"
            value={progress.earned}
            icon="school"
            colorScheme="blue"
            subtitle={`of ${REQUIRED_CREDITS} Required`}
          />
          <StatCard
            title="Attendance"
            value={`${eligibility.aggregate}%`}
            icon="calendar"
            colorScheme={eligibility.aggregate >= 75 ? 'green' : 'red'}
            subtitle="Current Semester"
          />
          <StatCard
            title="Fee Due"
            value={feeDue ? formatINR(feeDue) : 'Nil'}
            icon="payments"
            colorScheme={feeDue ? 'amber' : 'green'}
            subtitle={feeDue ? 'Examination Fee Pending' : 'All Dues Cleared'}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Columns (Performance + Roster) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Performance Snapshot */}
            <FormCard>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Icon name="trending-up" className="text-primary text-xl" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">
                    Performance Snapshot
                  </h3>
                </div>
                <div className="grid items-center gap-6 sm:grid-cols-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      SGPA Trend
                    </span>
                    <div className="mt-1 flex items-end gap-3">
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-200">
                        {lastSgpa != null ? lastSgpa.toFixed(2) : '—'}
                      </span>
                      <Sparkline
                        values={sgpaTrend}
                        className="text-indigo-500"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      across {sgpaTrend.length} terms
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Gauge
                      value={eligibility.aggregate}
                      tone={eligibility.aggregate >= 75 ? 'success' : 'danger'}
                      label={`${eligibility.aggregate}%`}
                      sublabel="Attendance"
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <Gauge
                      value={progress.percent}
                      tone="info"
                      label={`${progress.percent}%`}
                      sublabel="Degree Progress"
                    />
                  </div>
                </div>
              </div>
            </FormCard>

            {/* Academic Standing Credit Progress */}
            <FormCard>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Icon name="verified" className="text-primary text-xl" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">
                    Academic Progress Details
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Academic Standing:
                    </span>
                    <span
                      className={`font-bold ${
                        standing.tone === 'success'
                          ? 'text-emerald-600'
                          : standing.tone === 'warning'
                            ? 'text-amber-600'
                            : 'text-red-600'
                      }`}
                    >
                      {standing.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    {standing.reason}
                  </p>
                  <CreditMeter
                    earned={progress.earned}
                    required={REQUIRED_CREDITS}
                    label="Degree Credits Audit"
                  />
                </div>
              </div>
            </FormCard>

            {/* Latest Semester Results */}
            <FormCard>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="school" className="text-primary text-xl" />
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">
                      {latest
                        ? `Latest Results — Semester ${toRoman(latest.semester)}`
                        : 'Academic Results'}
                    </h3>
                  </div>
                  {latest && (
                    <span className="text-xs text-slate-400 font-medium">
                      Session: {latest.session}
                    </span>
                  )}
                </div>

                {latest ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold text-xs">
                          <th className="py-2">Course</th>
                          <th className="py-2 text-right">Total Marks</th>
                          <th className="py-2 text-center">Letter Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {latest.courses.map(c => (
                          <tr
                            key={c.courseCode}
                            className="text-slate-700 dark:text-slate-300"
                          >
                            <td className="py-3">
                              <span className="font-semibold block text-slate-800 dark:text-slate-200">
                                {c.title}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {c.courseCode} · {c.credits} Credits
                              </span>
                            </td>
                            <td className="py-3 text-right font-mono text-slate-800 dark:text-slate-200">
                              {c.internal !== null && c.external !== null
                                ? c.internal + c.external
                                : '—'}
                            </td>
                            <td className="py-3 text-center">
                              <GradeBadge grade={c.grade} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-6">
                    No results declared yet.
                  </p>
                )}

                {latest?.sgpa != null && (
                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-sm">
                    <span className="text-slate-400 font-medium">
                      Semester SGPA:
                    </span>
                    <span className="font-bold text-lg text-primary">
                      {latest.sgpa.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </FormCard>
          </div>

          {/* Right Column (Deadlines, Notifications, Quick Links) */}
          <div className="flex flex-col gap-6">
            {/* Upcoming Deadlines */}
            <FormCard>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Icon name="clock" className="text-primary text-xl" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">
                    Academic Calendar
                  </h3>
                </div>
                <ul className="flex flex-col gap-4">
                  {upcoming.map(e => (
                    <li key={e.id} className="flex items-start gap-3">
                      <div className="w-12 h-12 shrink-0 rounded-lg bg-blue-50 dark:bg-blue-950/40/70 border border-blue-100 dark:border-blue-900/30 flex flex-col justify-center items-center text-center">
                        <span className="text-sm font-bold text-blue-700 leading-none">
                          {new Date(e.date).getDate()}
                        </span>
                        <span className="text-[8px] uppercase font-bold text-blue-500 mt-1">
                          {new Date(e.date).toLocaleDateString('en-IN', {
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {e.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {e.detail ?? formatDate(e.date)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </FormCard>

            {/* Notifications Feed */}
            <FormCard>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Icon
                      name="notifications"
                      className="text-primary text-xl"
                    />
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">
                      Notifications
                    </h3>
                  </div>
                  <Link
                    to={studentLifecycleUrls.student.notifications}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <ul className="flex flex-col gap-4 divide-y divide-slate-100 dark:divide-slate-800/50">
                  {recentNotifications.map((n, idx) => (
                    <li
                      key={n.id}
                      className={`flex flex-col gap-1 ${idx > 0 ? 'pt-3' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-50 dark:bg-amber-950/400 shrink-0" />
                        )}
                        <p
                          className={`text-xs ${n.read ? 'text-slate-600 dark:text-slate-400' : 'font-semibold text-slate-800 dark:text-slate-200'}`}
                        >
                          {n.title}
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 pl-3.5">
                        {n.message}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </FormCard>

            {/* Quick Actions Links */}
            <div className="flex flex-col gap-2">
              <Link
                to={studentLifecycleUrls.student.registration}
                className="w-full flex items-center justify-between p-3.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-primary-hover hover:-translate-y-px active:translate-y-0 transition-all duration-150"
              >
                <div className="flex items-center gap-2.5">
                  <Icon name="user-check" className="text-lg" />
                  <span>Register CBCS Subjects</span>
                </div>
                <Icon name="arrow-up-right" className="text-md" />
              </Link>

              <Link
                to={studentLifecycleUrls.student.examinations}
                className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-px active:translate-y-0 transition-all duration-150"
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    name="school"
                    className="text-lg text-slate-500 dark:text-slate-400"
                  />
                  <span>Exam Form & Hall Ticket</span>
                </div>
                <Icon
                  name="arrow-up-right"
                  className="text-md text-slate-400"
                />
              </Link>

              <Link
                to={studentLifecycleUrls.student.services}
                className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-px active:translate-y-0 transition-all duration-150"
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    name="verified"
                    className="text-lg text-slate-500 dark:text-slate-400"
                  />
                  <span>Request Certificate</span>
                </div>
                <Icon
                  name="arrow-up-right"
                  className="text-md text-slate-400"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
