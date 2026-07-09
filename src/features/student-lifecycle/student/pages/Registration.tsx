import { useState, useMemo } from 'react';
import { FormCard, FormPage, ProgressBar } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { coursesForBranchSemester } from '../../data';
import { backlogCourses, MIN_CREDITS_PER_SEM } from '../../data/domain';
import { listStudents } from '../../data';
import { EXTERNAL_PORTALS } from '../../data/domain/constants';
import { semesterParity, toRoman } from '../../utils';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

function SelectableRow({
  type,
  checked,
  disabled,
  onChange,
  title,
  code,
  category,
  credits,
}: {
  type: 'checkbox' | 'radio';
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  title: string;
  code: string;
  category: string;
  credits: number;
}) {
  return (
    <label
      className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all select-none ${
        disabled
          ? 'cursor-not-allowed opacity-60 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
          : checked
            ? 'cursor-pointer border-blue-500 bg-blue-50 dark:bg-blue-950/40/30'
            : 'cursor-pointer border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950/50 hover:border-slate-300 dark:border-slate-700'
      }`}
    >
      <input
        type={type}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="w-4 h-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-700"
      />
      <div className="flex-1">
        <p
          className={`text-sm font-semibold ${checked ? 'text-blue-900' : 'text-slate-800 dark:text-slate-200'}`}
        >
          {title}
        </p>
        <p className="text-[10px] font-medium text-slate-400 mt-0.5">
          {code} · {category}
        </p>
      </div>
      {disabled && <Icon name="lock" className="text-slate-400 text-xs mr-1" />}
      <span
        className={`text-xs font-bold font-mono ${checked ? 'text-blue-700' : 'text-slate-500 dark:text-slate-400'}`}
      >
        {credits} CR
      </span>
    </label>
  );
}

export default function StudentRegistration() {
  const currentStudentNo = useLifecycleStore(s => s.currentStudentNo);
  const students = listStudents();
  const student = students.find(s => s.enrollmentNo === currentStudentNo);

  const [registered, setRegistered] = useState(false);
  const [suppRegistered, setSuppRegistered] = useState(false);

  const sem = student?.currentSemester ?? 5;
  const allCourses = useMemo(
    () => (student ? coursesForBranchSemester(student.branch, sem) : []),
    [student, sem]
  );

  const core = allCourses.filter(
    c => c.category === 'Core' || c.category === 'Laboratory'
  );
  const programElectives = allCourses.filter(
    c => c.category === 'Program Elective'
  );
  const openElectives = allCourses.filter(c => c.category === 'Open Elective');

  const registeredCodes = useMemo(
    () =>
      new Set(
        student?.semesters
          .find(s => s.semester === sem)
          ?.courses.map(c => c.courseCode) ?? []
      ),
    [student, sem]
  );

  const [selPE, setSelPE] = useState<string[]>(() =>
    programElectives.filter(c => registeredCodes.has(c.code)).map(c => c.code)
  );
  const [selOE, setSelOE] = useState<string>(
    () =>
      openElectives.find(c => registeredCodes.has(c.code))?.code ??
      openElectives[0]?.code ??
      ''
  );

  if (!student) {
    return (
      <FormPage
        title="Semester Course Registration"
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

  const backlogs = backlogCourses(student.semesters);
  const selectedCourses = [
    ...core,
    ...programElectives.filter(c => selPE.includes(c.code)),
    ...openElectives.filter(c => c.code === selOE),
  ];
  const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);
  const meetsMin = totalCredits >= MIN_CREDITS_PER_SEM;

  const togglePE = (code: string) => {
    setSelPE(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : prev.length < 2
          ? [...prev, code]
          : prev
    );
  };

  const confirmRegistration = () => {
    setRegistered(true);
    ToastService.success(
      `${totalCredits} credits registered successfully for Semester ${toRoman(sem)}.`
    );
  };

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.student.root },
    { label: 'Semester Course Registration' },
  ];

  const headerAction = registered ? (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
      <span>Registered Confirmed</span>
    </span>
  ) : (
    <a
      href={EXTERNAL_PORTALS.davvSIS.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-colors"
    >
      <Icon name="open-in-new" className="text-xs" />
      <span>Register on SIS Portal</span>
    </a>
  );

  return (
    <FormPage
      title="Semester Course Registration"
      description={`Register your subjects and choose electives for Semester ${toRoman(sem)} (${semesterParity(sem)} term).`}
      breadcrumbs={breadcrumbs}
      headerAction={headerAction}
    >
      <div className="grid gap-6 lg:grid-cols-3 w-full">
        {/* Core & Electives Selectors */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Core courses */}
          <FormCard>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Icon name="assignment" className="text-primary text-xl" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Core Courses
                </h3>
              </div>
              <p className="text-xs text-slate-400 -mt-2">
                Compulsory discipline subjects and labs for your branch —
                auto-registered.
              </p>

              <div className="flex flex-col gap-2">
                {core.map(c => (
                  <SelectableRow
                    key={c.code}
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    onChange={() => {}}
                    title={c.title}
                    code={c.code}
                    category={c.category}
                    credits={c.credits}
                  />
                ))}
              </div>
            </div>
          </FormCard>

          {/* Program electives */}
          <FormCard>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Icon name="view_module" className="text-primary text-xl" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">
                    Program Electives
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selPE.length === 2
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selPE.length}/2 Chosen
                </span>
              </div>
              <p className="text-xs text-slate-400 -mt-2">
                Choose exactly two elective courses from the branch elective
                basket.
              </p>

              <div className="flex flex-col gap-2">
                {programElectives.map(c => {
                  const checked = selPE.includes(c.code);
                  return (
                    <SelectableRow
                      key={c.code}
                      type="checkbox"
                      checked={checked}
                      disabled={registered || (!checked && selPE.length >= 2)}
                      onChange={() => togglePE(c.code)}
                      title={c.title}
                      code={c.code}
                      category={c.category}
                      credits={c.credits}
                    />
                  );
                })}
              </div>
            </div>
          </FormCard>

          {/* Open elective */}
          <FormCard>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Icon name="explore" className="text-primary text-xl" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Generic Open Elective
                </h3>
              </div>
              <p className="text-xs text-slate-400 -mt-2">
                Choose one CBCS open elective course offered across other
                engineering departments.
              </p>

              <div className="flex flex-col gap-2">
                {openElectives.map(c => (
                  <SelectableRow
                    key={c.code}
                    type="radio"
                    checked={selOE === c.code}
                    disabled={registered}
                    onChange={() => setSelOE(c.code)}
                    title={c.title}
                    code={c.code}
                    category={c.category}
                    credits={c.credits}
                  />
                ))}
              </div>
            </div>
          </FormCard>

          {/* Supplementary (ATKT) registration */}
          {backlogs.length > 0 && (
            <FormCard className="border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/40/10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Icon name="history" className="text-red-500 text-xl" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">
                    Supplementary (ATKT) Carryovers
                  </h3>
                </div>
                <p className="text-xs text-slate-400 -mt-2">
                  Register backlog courses below to attempt the upcoming
                  supplementary backlog exams.
                </p>

                <div className="flex flex-col gap-2.5">
                  {backlogs.map(c => (
                    <div
                      key={c.courseCode}
                      className="flex items-center justify-between rounded-xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {c.title}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                          {c.courseCode} · {c.credits} Credits
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                        Backlog / ATKT
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 pt-1">
                  <button
                    disabled={suppRegistered}
                    onClick={() => {
                      setSuppRegistered(true);
                      ToastService.success(
                        `${backlogs.length} backlog course(s) registered for supplementary exam.`
                      );
                    }}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                      suppRegistered
                        ? 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white hover:-translate-y-px active:translate-y-0'
                    }`}
                  >
                    {suppRegistered
                      ? 'Backlogs Registered'
                      : 'Confirm Supplementary Registration'}
                  </button>
                </div>
              </div>
            </FormCard>
          )}
        </div>

        {/* Summary Card */}
        <div className="flex flex-col gap-6">
          <FormCard className="sticky top-20">
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
                Registration Summary
              </h3>

              <div className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Core Courses
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {core.length} Selected
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Program Electives
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selPE.length} Chosen
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Open Elective
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selOE ? 1 : 0} Chosen
                  </span>
                </div>
              </div>

              <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Total Registered Credits
                  </span>
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-200 font-mono">
                    {totalCredits}
                  </span>
                </div>
                <div className="mt-1">
                  <ProgressBar
                    value={Math.min(100, (totalCredits / 24) * 100)}
                    colorClass={
                      meetsMin
                        ? 'bg-emerald-600'
                        : 'bg-amber-50 dark:bg-amber-950/400'
                    }
                  />
                </div>
                <p
                  className={`text-[10px] font-semibold mt-1 ${meetsMin ? 'text-emerald-600' : 'text-amber-600'}`}
                >
                  {meetsMin
                    ? `Meets the ${MIN_CREDITS_PER_SEM} credit CBCS minimum requirement.`
                    : `Below the ${MIN_CREDITS_PER_SEM} credit minimum — "Zero Semester" rules would apply.`}
                </p>
              </div>

              <div className="mt-3">
                <button
                  disabled={registered || selPE.length !== 2 || !selOE}
                  onClick={confirmRegistration}
                  className={`w-full py-3 rounded-xl text-sm font-bold shadow-md transition-all ${
                    registered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-not-allowed flex items-center justify-center gap-1.5'
                      : selPE.length !== 2 || !selOE
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-800 shadow-none'
                        : 'bg-primary text-white hover:bg-primary-hover hover:-translate-y-px active:translate-y-0'
                  }`}
                >
                  {registered ? (
                    <>
                      <Icon name="check-circle" className="text-lg" />
                      <span>Registration Confirmed</span>
                    </>
                  ) : (
                    'Confirm Semester Registration'
                  )}
                </button>
              </div>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
