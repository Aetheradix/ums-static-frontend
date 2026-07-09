import { Link } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { listStudents } from '../../data';
import {
  MIN_CREDITS_PER_SEM,
  REQUIRED_CREDITS,
  academicStanding,
  backlogCourses,
  creditsEarned,
  creditsRegistered,
  degreeProgress,
} from '../../data/domain';
import { toRoman } from '../../utils';
import { CreditMeter } from '../../components';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

export default function StudentDegreeAudit() {
  const currentStudentNo = useLifecycleStore(s => s.currentStudentNo);
  const students = listStudents();
  const student = students.find(s => s.enrollmentNo === currentStudentNo);

  if (!student) {
    return (
      <FormPage
        title="Degree Audit"
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

  const progress = degreeProgress(student.semesters);
  const standing = academicStanding(student);
  const backlogs = backlogCourses(student.semesters);
  const completedSemesters = student.semesters.filter(s =>
    s.courses.every(c => c.status !== 'Pending')
  );

  const checks = [
    {
      label: 'Minimum credits earned for graduation',
      ok: progress.earned >= REQUIRED_CREDITS,
      detail: `${progress.earned} / ${REQUIRED_CREDITS} CR`,
    },
    {
      label: 'No pending backlog / ATKT courses',
      ok: backlogs.length === 0,
      detail: backlogs.length ? `${backlogs.length} pending` : 'All cleared',
    },
    {
      label: `Every semester matches ≥ ${MIN_CREDITS_PER_SEM} credits (no Zero Semester)`,
      ok: standing.label !== 'Zero Semester',
      detail: standing.label,
    },
  ];
  const graduationReady = checks.every(c => c.ok);

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.student.root },
    { label: 'Degree Audit' },
  ];

  return (
    <FormPage
      title="Degree Audit"
      description="Verify overall credit requirements, backlog carryovers, and graduation clearances."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Progress & Graduation Eligibility Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Progress Card */}
          <FormCard className="lg:col-span-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Overall Credit Progress
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    standing.tone === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200'
                      : standing.tone === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-200'
                        : 'bg-red-50 dark:bg-red-950/40 text-red-700 border-red-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      standing.tone === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/400'
                        : standing.tone === 'warning'
                          ? 'bg-amber-50 dark:bg-amber-950/400'
                          : 'bg-red-50 dark:bg-red-950/400'
                    }`}
                  />
                  {standing.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
                {standing.reason}
              </p>

              <div className="mt-2">
                <CreditMeter
                  earned={progress.earned}
                  required={REQUIRED_CREDITS}
                  label="Degree Credits Complete"
                />
              </div>

              <div className="text-[10px] font-semibold text-slate-400 mt-2">
                {progress.percent}% complete · Completed{' '}
                {completedSemesters.length} of 8 standard semesters.
              </div>
            </div>
          </FormCard>

          {/* Graduation Eligibility Checklist Card */}
          <FormCard
            className={`border-t-4 bg-white dark:bg-slate-900 ${graduationReady ? 'border-t-emerald-500' : 'border-t-slate-300'}`}
          >
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                Graduation Readiness
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2 leading-relaxed">
                {graduationReady ? (
                  <span className="text-emerald-600 font-bold">
                    All degree requirements fully met.
                  </span>
                ) : (
                  <span className="text-slate-400 italic">
                    Credits in progress — clear backlogs and requirements.
                  </span>
                )}
              </p>

              <ul className="flex flex-col gap-4 mt-2">
                {checks.map(c => (
                  <li key={c.label} className="flex items-start gap-2.5">
                    <Icon
                      name={c.ok ? 'check-circle' : 'circle'}
                      className={`text-base shrink-0 mt-0.5 ${c.ok ? 'text-emerald-500' : 'text-slate-300'}`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-normal">
                        {c.label}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {c.detail}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </FormCard>
        </div>

        {/* Backlogs Table (if any) */}
        {backlogs.length > 0 && (
          <FormCard className="border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/40/10 p-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-red-100 dark:border-red-900/30 bg-white dark:bg-slate-900 gap-2">
              <div className="flex items-center gap-2">
                <Icon name="history" className="text-red-500 text-xl" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Pending ATKT Backlogs
                </h3>
              </div>
              <Link
                to={studentLifecycleUrls.student.registration}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
              >
                <span>Register Supplementary Exams</span>
              </Link>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-slate-900">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 text-slate-400 font-semibold text-xs">
                    <th className="px-5 py-3">Course Code & Title</th>
                    <th className="px-5 py-3 text-center">Backlog Credits</th>
                    <th className="px-5 py-3 text-center">Last Score</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {backlogs.map(c => (
                    <tr
                      key={c.courseCode}
                      className="hover:bg-slate-50 dark:bg-slate-950/20 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          {c.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {c.courseCode}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        {c.credits}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-slate-600 dark:text-slate-400">
                        {c.internal !== null && c.external !== null
                          ? c.internal + c.external
                          : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          ATKT Backlog
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormCard>
        )}

        {/* Semester-wise breakdown */}
        <FormCard className="p-0 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/50">
            <Icon name="list-alt" className="text-primary text-xl" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              Semester-wise Credit Audit
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 text-slate-400 font-semibold text-xs">
                  <th className="px-5 py-3">Semester</th>
                  <th className="px-5 py-3">Academic Session</th>
                  <th className="px-5 py-3 text-center">Attempted Credits</th>
                  <th className="px-5 py-3 text-center">Earned Credits</th>
                  <th className="px-5 py-3 text-center">Term SGPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {student.semesters.map(sem => {
                  const isPending = sem.courses.some(
                    c => c.status === 'Pending'
                  );
                  return (
                    <tr
                      key={sem.semester}
                      className="hover:bg-slate-50 dark:bg-slate-950/20 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                        Semester {toRoman(sem.semester)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                        {sem.session}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-slate-600 dark:text-slate-400">
                        {creditsRegistered(sem.courses)}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        {isPending ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          creditsEarned(sem.courses)
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-primary">
                        {sem.sgpa != null ? sem.sgpa.toFixed(2) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
