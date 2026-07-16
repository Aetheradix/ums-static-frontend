import { FormCard, FormPage } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { listStudents } from '../../data';
import { computeCGPA, degreeProgress } from '../../data/domain';
import { BRANCHES, EXTERNAL_PORTALS } from '../../data/domain/constants';
import { formatDate, toRoman } from '../../utils';
import { HeroBanner } from '../../components';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

const SCHOLARSHIP_STYLE = {
  'Not Applied':
    'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800',
  Applied: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 border-blue-200',
  Sanctioned:
    'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-200',
  Disbursed:
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200',
};

export default function StudentProfile() {
  const currentStudentNo = useLifecycleStore(s => s.currentStudentNo);
  const students = listStudents();
  const student = students.find(s => s.enrollmentNo === currentStudentNo);

  if (!student) {
    return (
      <FormPage
        title="Student Profile"
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

  const branchName =
    BRANCHES.find(b => b.code === student.branch)?.name ?? student.branch;
  const cgpa = computeCGPA(student.semesters);
  const progress = degreeProgress(student.semesters);
  const initials = student.name
    .split(' ')
    .map(n => n[0])
    .join('');

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.student.root },
    { label: 'My Profile' },
  ];

  return (
    <FormPage
      title="Student Profile"
      description="View personal information, parent records, academic registers, and scholarship status."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Banner Card */}
        <HeroBanner>
          <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-4">
              {/* Initials Avatar */}
              <div
                className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center text-white font-black text-xl shadow-inner border border-white/20"
                style={{ backgroundColor: student.photoColor }}
              >
                {initials}
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {student.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  B.E. {branchName} · Semester{' '}
                  {toRoman(student.currentSemester)} · Section {student.section}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2 text-[10px] text-slate-200">
                  <span className="rounded-full bg-white dark:bg-slate-900/10 px-2.5 py-1 border border-white/5">
                    Enrollment No: {student.enrollmentNo}
                  </span>
                  <span className="rounded-full bg-white dark:bg-slate-900/10 px-2.5 py-1 border border-white/5">
                    {student.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 text-center border-t border-white/10 pt-4 sm:pt-0 sm:border-0">
              <div>
                <p className="font-heading text-2xl font-black text-white">
                  {cgpa?.toFixed(2) ?? '—'}
                </p>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  CGPA
                </p>
              </div>
              <div className="border-l border-white/15 pl-6">
                <p className="font-heading text-2xl font-black text-white">
                  {progress.earned}
                </p>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Credits
                </p>
              </div>
            </div>
          </div>
        </HeroBanner>

        {/* Profile details grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Details */}
          <FormCard>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <Icon name="person" className="text-primary text-xl" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                Personal Details
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Date of Birth
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {formatDate(student.dob)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Gender
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {student.gender}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Roll Number
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {student.rollNo}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Category
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {student.category}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Admission Year
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {student.admissionYear}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Aadhaar Verification
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  •••• •••• {student.aadhaarLast4}
                </span>
              </div>
            </div>
          </FormCard>

          {/* Permanent Address */}
          <FormCard>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <Icon name="users" className="text-primary text-xl" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                Permanent Address
              </h3>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/50 flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              <Icon name="compass" className="text-slate-400 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {student.name}
                </p>
                <p className="mt-1">{student.address.line1}</p>
                <p>
                  {student.address.city}, {student.address.state} —{' '}
                  {student.address.pincode}
                </p>
              </div>
            </div>
          </FormCard>

          {/* Parent / Guardian Info */}
          <FormCard>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <Icon name="users" className="text-primary text-xl" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                Parents & Guardians
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {student.guardians.map((g, idx) => (
                <div
                  key={g.relation}
                  className={`flex items-center justify-between ${idx > 0 ? 'pt-3 border-t border-slate-100 dark:border-slate-800' : ''}`}
                >
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {g.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                      {g.relation}{' '}
                      {g.occupation ? ` · Occupation: ${g.occupation}` : ''}
                    </span>
                  </div>
                  <span className="text-xs font-semibold font-mono text-slate-600 dark:text-slate-400">
                    {g.phone}
                  </span>
                </div>
              ))}
            </div>
          </FormCard>

          {/* Scholarship Card */}
          <FormCard>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Icon name="payments" className="text-primary text-xl" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  Scholarship Register
                </h3>
              </div>
              {student.category !== 'General' && (
                <a
                  href={EXTERNAL_PORTALS.scholarshipPortal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Scholarship Portal
                </a>
              )}
            </div>

            {student.scholarship.status === 'Not Applied' &&
            student.category === 'General' ? (
              <p className="text-xs text-slate-400 italic leading-relaxed py-3">
                No active scholarship application record. State post-matric
                scholarship schemes (SC/ST/OBC) are not applicable for open
                category admissions.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Scheme Title
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 bg-slate-50 dark:bg-slate-950 p-2 border border-slate-100 dark:border-slate-800 rounded-lg">
                    {student.scholarship.scheme}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Disbursement Status:
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      SCHOLARSHIP_STYLE[student.scholarship.status]
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        student.scholarship.status === 'Disbursed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/400'
                          : student.scholarship.status === 'Sanctioned'
                            ? 'bg-amber-50 dark:bg-amber-950/400'
                            : student.scholarship.status === 'Applied'
                              ? 'bg-blue-50 dark:bg-blue-950/400'
                              : 'bg-slate-400'
                      }`}
                    />
                    {student.scholarship.status}
                  </span>
                </div>
              </div>
            )}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
