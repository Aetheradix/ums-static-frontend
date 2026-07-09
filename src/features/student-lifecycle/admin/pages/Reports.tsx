import {
  FormCard,
  FormPage,
  StatCard,
  ProgressBar,
} from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { STUDENTS } from '../../data';
import {
  BRANCHES,
  GRADE_SCALE,
  computeCGPA,
  DEFAULT_MATRIX,
} from '../../data/domain';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { formatINR, formatPercent } from '../../utils';
import { GradeBadge } from '../../components';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

const GRADE_COLOR: Record<string, string> = {
  O: 'bg-emerald-600',
  'A+': 'bg-emerald-600',
  A: 'bg-emerald-600',
  'B+': 'bg-blue-600',
  B: 'bg-blue-600',
  C: 'bg-amber-50 dark:bg-amber-950/400',
  P: 'bg-amber-50 dark:bg-amber-950/400',
  F: 'bg-red-600',
};

export default function AdminReports() {
  const currentAdminRole = useLifecycleStore(s => s.currentAdminRole);
  const imported = useLifecycleStore(s => s.importedStudents);
  const paidFees = useLifecycleStore(s => s.paidFees);

  const perms = DEFAULT_MATRIX[currentAdminRole] || [];
  const canView = perms.includes('reports.view');

  if (!canView) {
    return (
      <FormPage
        title="Reports & Analytics"
        description="Access Denied. You do not have permissions to view reports."
      >
        <FormCard>
          <div className="p-8 text-center text-red-500 flex flex-col items-center justify-center gap-3">
            <Icon name="block" className="text-5xl" />
            <p className="font-bold">Unauthorized Access</p>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  // CGPA analytics
  const cgpas = STUDENTS.map(s => computeCGPA(s.semesters)).filter(
    (x): x is number => x !== null
  );
  const avgCgpa = cgpas.length
    ? cgpas.reduce((a, b) => a + b, 0) / cgpas.length
    : null;

  // Fees collections analytics
  let collected = 0;
  let outstanding = 0;
  STUDENTS.forEach(s => {
    s.fees.forEach(f => {
      const paid = f.status === 'Paid' || Boolean(paidFees[f.id]);
      if (paid) {
        collected += f.amount;
      } else {
        outstanding += f.amount;
      }
    });
  });

  // Grade distributions & Pass Rates
  const gradeCounts: Record<string, number> = {};
  let passCount = 0;
  let failCount = 0;

  STUDENTS.forEach(s => {
    s.semesters.forEach(sem => {
      sem.courses.forEach(c => {
        if (c.grade) {
          gradeCounts[c.grade] = (gradeCounts[c.grade] ?? 0) + 1;
          if (c.grade === 'F') {
            failCount += 1;
          } else {
            passCount += 1;
          }
        }
      });
    });
  });

  const totalGraded = passCount + failCount;
  const passRate = totalGraded ? (passCount / totalGraded) * 100 : 0;
  const maxGradeCount = Math.max(1, ...Object.values(gradeCounts));

  // Branch strength calculations
  const strengthList = BRANCHES.map(b => ({
    ...b,
    count:
      STUDENTS.filter(s => s.branch === b.code).length +
      imported.filter(i => i.branch === b.code).length,
  })).filter(b => b.count > 0);

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.admin.root },
    { label: 'Reports & Analytics' },
  ];

  return (
    <FormPage
      title="Reports & Analytics"
      description="Cohort-level academic reporting metrics, pass rates, grading scales, and branch distribution graphs."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Analytics stats card row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Student Strengths"
            value={STUDENTS.length + imported.length}
            icon="groups"
            colorScheme="blue"
            subtitle="Active Admissions"
          />
          <StatCard
            title="Average Cohort CGPA"
            value={avgCgpa?.toFixed(2) ?? '—'}
            icon="trending-up"
            colorScheme="indigo"
            subtitle="Academic Standard"
          />
          <StatCard
            title="Syllabus Pass Rate"
            value={formatPercent(passRate)}
            icon="emoji_events"
            colorScheme="green"
            subtitle="Clear Exams Success"
          />
          <StatCard
            title="Revenue Collection"
            value={formatINR(collected)}
            icon="payments"
            colorScheme="blue"
            subtitle={`${formatINR(outstanding)} Outstanding Dues`}
          />
        </div>

        {/* Grade Distribution & Branch Strength Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Grade Distribution Bar Chart */}
          <FormCard>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <Icon name="grade" className="text-primary text-xl" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                Grades Distribution ({totalGraded} Results)
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {GRADE_SCALE.map(g => {
                const count = gradeCounts[g.letter] ?? 0;
                return (
                  <div key={g.letter} className="flex items-center gap-3">
                    <span className="w-10">
                      <GradeBadge grade={g.letter} />
                    </span>
                    <div className="flex-1">
                      <ProgressBar
                        value={(count / maxGradeCount) * 100}
                        colorClass={
                          GRADE_COLOR[g.letter] ||
                          'bg-slate-50 dark:bg-slate-9500'
                        }
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </FormCard>

          {/* Branch strength register table */}
          <FormCard className="p-0 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/50">
              <Icon name="dns" className="text-primary text-xl" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                Sanctioned Strength Status
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 text-slate-400 font-semibold text-xs">
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Branch Engineering Title</th>
                    <th className="px-5 py-3 text-center">Enrolled</th>
                    <th className="px-5 py-3 text-center">Max Intake</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {strengthList.map(b => (
                    <tr
                      key={b.code}
                      className="hover:bg-slate-50 dark:bg-slate-950/20 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                        {b.code}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                        {b.name}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                        {b.count}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-500 dark:text-slate-400">
                        {b.intake}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
