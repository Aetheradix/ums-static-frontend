import { FormCard, FormPage } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { listStudents, CALENDAR } from '../../data';
import { ATTENDANCE_THRESHOLD, examEligibility } from '../../data/domain';
import { generateHallTicket } from '../../pdf';
import { formatDate, toRoman } from '../../utils';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

const STATUS_STYLE = {
  Eligible: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'At Risk': 'bg-amber-100 text-amber-800 border-amber-200',
  Detained: 'bg-red-100 text-red-800 border-red-200',
};

const WINDOW = { open: '2026-10-15', close: '2026-10-30' };

export default function StudentExaminations() {
  const currentStudentNo = useLifecycleStore(s => s.currentStudentNo);
  const examReg = useLifecycleStore(s => s.examRegistrations[currentStudentNo]);
  const submitExamForm = useLifecycleStore(s => s.submitExamForm);

  const students = listStudents();
  const student = students.find(s => s.enrollmentNo === currentStudentNo);

  if (!student) {
    return (
      <FormPage
        title="Examinations"
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

  const elig = examEligibility(student);
  const canSubmit = elig.status === 'Eligible';
  const courses = student.attendance.map(a => ({
    code: a.courseCode,
    title: a.title,
  }));
  const examSchedule = CALENDAR.filter(
    e => e.type === 'exam' || e.type === 'form'
  );

  const submitForm = () => {
    const ht = submitExamForm(student.enrollmentNo, {
      semester: student.currentSemester,
      windowOpen: WINDOW.open,
      windowClose: WINDOW.close,
      registeredCourses: courses.map(c => c.code),
    });
    ToastService.success(`Hall Ticket ${ht} has been generated successfully.`);
  };

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.student.root },
    { label: 'Examinations' },
  ];

  return (
    <FormPage
      title="Examinations"
      description={`Submit your end-semester examination forms and download active hall tickets for Semester ${toRoman(student.currentSemester)}.`}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Eligibility Overview Banner */}
        <FormCard
          className={`border-l-4 p-5 bg-white dark:bg-slate-900 ${
            elig.status === 'Eligible'
              ? 'border-l-emerald-500'
              : elig.status === 'Detained'
                ? 'border-l-red-500'
                : 'border-l-amber-500'
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Icon
                name={elig.status === 'Eligible' ? 'check-circle' : 'warning'}
                className={`text-2xl ${
                  elig.status === 'Eligible'
                    ? 'text-emerald-600'
                    : elig.status === 'Detained'
                      ? 'text-red-500'
                      : 'text-amber-500'
                }`}
              />
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Exam Eligibility Status: {elig.status}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Aggregate class attendance is{' '}
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {elig.aggregate}%
                  </span>{' '}
                  (minimum {ATTENDANCE_THRESHOLD}% required).
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STATUS_STYLE[elig.status]}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  elig.status === 'Eligible'
                    ? 'bg-emerald-600'
                    : elig.status === 'Detained'
                      ? 'bg-red-600'
                      : 'bg-amber-600'
                }`}
              />
              {elig.status}
            </span>
          </div>
        </FormCard>

        {/* Content Columns */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Table & Schedule */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Course-wise eligibility table */}
            <FormCard className="p-0 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/50">
                <Icon name="assignment" className="text-primary text-xl" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Course-wise Exam Eligibility
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 text-slate-400 font-semibold text-xs">
                      <th className="px-5 py-3">Course</th>
                      <th className="px-5 py-3 text-center">Attendance</th>
                      <th className="px-5 py-3 text-center">Internal (/20)</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {elig.courses.map(c => (
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
                          {c.reasons.length > 0 && (
                            <p className="mt-1 text-[10px] text-red-600 font-medium">
                              {c.reasons.join(' ')}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={`font-bold font-mono ${c.attendance < ATTENDANCE_THRESHOLD ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}
                          >
                            {c.attendance}%
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                          {c.internal ?? '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              c.eligible
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 dark:bg-red-950/40 text-red-700 border-red-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${c.eligible ? 'bg-emerald-50 dark:bg-emerald-950/400' : 'bg-red-50 dark:bg-red-950/400'}`}
                            />
                            {c.eligible ? 'Eligible' : 'Not Eligible'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FormCard>

            {/* Examination schedule */}
            <FormCard>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Icon name="calendar" className="text-primary text-xl" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">
                    Examination Schedule
                  </h3>
                </div>
                <p className="text-xs text-slate-400 -mt-2">
                  Important deadlines and timeline events for Semester V
                  examinations.
                </p>

                <ul className="flex flex-col gap-4 mt-2">
                  {examSchedule.map(e => (
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
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
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
          </div>

          {/* Right Column: Form Submission / Hall Ticket */}
          <div className="flex flex-col gap-6">
            <FormCard className="sticky top-20">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Icon name="tag" className="text-primary text-xl" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Examination Form
                </h3>
              </div>

              {examReg?.submitted ? (
                <div className="flex flex-col gap-4 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Submitted
                  </span>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col gap-3">
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/50 pb-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        Hall Ticket No.
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {examReg.hallTicketNo}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/50 pb-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        Semester
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {toRoman(examReg.semester)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/50 pb-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        Courses Reg
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {examReg.registeredCourses.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        Exam Centre
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        IET DAVV
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      generateHallTicket(student, {
                        hallTicketNo: examReg.hallTicketNo!,
                        semester: examReg.semester,
                        courses,
                      })
                    }
                    className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-hover flex items-center justify-center gap-1.5 hover:-translate-y-px active:translate-y-0 transition-all duration-150"
                  >
                    <Icon name="download" className="text-sm" />
                    <span>Download Hall Ticket PDF</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 mt-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    You are registering {courses.length} academic courses for
                    the end-semester exams:
                  </p>

                  <ul className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/60 max-h-48 overflow-y-auto">
                    {courses.map(c => (
                      <li
                        key={c.code}
                        className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium"
                      >
                        <span className="truncate pr-2">{c.title}</span>
                        <span className="font-mono text-[10px] text-slate-400 shrink-0">
                          {c.code}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {!canSubmit && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/30 rounded-lg text-[10px] text-red-700 leading-relaxed font-semibold">
                      You cannot submit the exam form because you are not
                      currently exam-eligible (attendance/internals pending).
                    </div>
                  )}

                  <button
                    disabled={!canSubmit}
                    onClick={submitForm}
                    className={`w-full py-3 rounded-xl text-sm font-bold shadow-md transition-all ${
                      canSubmit
                        ? 'bg-primary text-white hover:bg-primary-hover hover:-translate-y-px active:translate-y-0'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-800 cursor-not-allowed shadow-none'
                    }`}
                  >
                    Submit Exam Form
                  </button>
                </div>
              )}
            </FormCard>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
