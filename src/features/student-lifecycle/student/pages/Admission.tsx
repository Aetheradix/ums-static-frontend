import { Link } from 'react-router-dom';
import { FormCard, FormPage, Stepper } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { listStudents } from '../../data';
import {
  BRANCHES,
  EXTERNAL_PORTALS,
  FEE_STRUCTURE,
} from '../../data/domain/constants';
import { formatINR } from '../../utils';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

export default function StudentAdmission() {
  const currentStudentNo = useLifecycleStore(s => s.currentStudentNo);
  const students = listStudents();
  const student = students.find(s => s.enrollmentNo === currentStudentNo);

  if (!student) {
    return (
      <FormPage
        title="Admission Details"
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

  const a = student.admission;
  const branchName =
    BRANCHES.find(b => b.code === student.branch)?.name ?? student.branch;
  const verified = a.documents.filter(d => d.verified).length;
  const allVerified = verified === a.documents.length;

  const steps = [
    {
      label: 'DTE Allotment',
      description: 'Seat allotted via JEE counselling',
    },
    {
      label: 'Document Verification',
      description: 'Verified at campus counter',
    },
    { label: 'Fee Payment', description: 'Confirm admissions fees receipt' },
    { label: 'Enrolled', description: 'University Enrolment confirm' },
  ];

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.root },
    { label: 'Student Portal', to: studentLifecycleUrls.student.root },
    { label: 'Admission Details' },
  ];

  const headerAction = (
    <a
      href={EXTERNAL_PORTALS.dteCounselling.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-colors"
    >
      <Icon name="open-in-new" className="text-xs" />
      <span>DTE MP Counselling Portal</span>
    </a>
  );

  return (
    <FormPage
      title="Admission & Onboarding"
      description="Track your journey from DTE Madhya Pradesh counselling to enrollment at the institute."
      breadcrumbs={breadcrumbs}
      headerAction={headerAction}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Stepper Card */}
        <FormCard className="p-6">
          <Stepper steps={steps} activeStep={3} />
        </FormCard>

        {/* Content Details Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Seat Allotment & Document Checklists */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Seat Allotment Details */}
            <FormCard>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Icon name="description" className="text-primary text-xl" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">
                    Seat Allotment
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Allotment No.
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {a.allotmentNo}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      JEE Main Rank
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {a.jeeRank?.toLocaleString('en-IN') ?? '—'}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Counselling Round
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      Round {a.counsellingRound}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Branch Allotted
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {branchName}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Quota
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {student.quota}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Admission Category
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {student.category}
                    </span>
                  </div>
                </div>
              </div>
            </FormCard>

            {/* Document Checklist */}
            <FormCard>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Icon
                      name="check-circle"
                      className="text-primary text-xl"
                    />
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">
                      Document Verification
                    </h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      allVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {allVerified ? 'Verified Complete' : 'Verification Pending'}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-1">
                  {verified} of {a.documents.length} mandatory onboarding
                  certificates physically verified.
                </div>

                <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {a.documents.map(d => (
                    <li
                      key={d.name}
                      className="flex items-center justify-between py-2.5"
                    >
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {d.name}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          d.verified
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${d.verified ? 'bg-emerald-50 dark:bg-emerald-950/400' : 'bg-amber-50 dark:bg-amber-950/400'}`}
                        />
                        {d.verified ? 'Verified' : 'Pending'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FormCard>
          </div>

          {/* Right Sidebar Columns */}
          <div className="flex flex-col gap-6">
            {/* Enrollment Credentials Card */}
            <FormCard className="bg-linear-to-br from-blue-50/70 to-indigo-50/50 border-blue-100 dark:border-blue-900/30">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Icon name="verified" className="text-primary text-xl" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">
                    University Enrolment
                  </h3>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Enrollment Number
                  </span>
                  <p className="text-2xl font-black text-primary tracking-wide mt-0.5">
                    {student.enrollmentNo}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                    This is your permanent university registration ID. Use this
                    ID to submit exam forms and request transcripts.
                  </p>
                </div>
                <div className="mt-2.5 pt-3 border-t border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Admission Status:
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Confirmed
                  </span>
                </div>
              </div>
            </FormCard>

            {/* Fee Confirmation Card */}
            <FormCard>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Icon name="payments" className="text-primary text-xl" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">
                    Fee Confirmation
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      First-Semester Tuition
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {formatINR(FEE_STRUCTURE.tuitionPerSemester)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Admission Fee Status
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        a.feePaid
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${a.feePaid ? 'bg-emerald-600' : 'bg-amber-600'}`}
                      />
                      {a.feePaid ? 'Cleared Paid' : 'Pending Due'}
                    </span>
                  </div>

                  <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      to={studentLifecycleUrls.student.fees}
                      className="w-full inline-flex justify-center items-center py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-100 dark:bg-slate-800 transition-colors"
                    >
                      View Fee Ledger
                    </Link>
                  </div>
                </div>
              </div>
            </FormCard>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
