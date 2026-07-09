import { Link } from 'react-router-dom';
import {
  FormCard,
  FormPage,
  StatCard,
  ProgressBar,
} from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import type { Permission } from '../../types';
import { STUDENTS, FACULTY } from '../../data';
import {
  BRANCHES,
  adminRoleLabel,
  computeCGPA,
  DEFAULT_MATRIX,
} from '../../data/domain';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { formatINR } from '../../utils';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

const QUICK_ACTIONS: {
  to: string;
  label: string;
  icon: string;
  permission: Permission;
}[] = [
  {
    to: studentLifecycleUrls.admin.students,
    label: 'Student Roster',
    icon: 'school',
    permission: 'students.view',
  },
  {
    to: studentLifecycleUrls.admin.fees,
    label: 'Fee Collection',
    icon: 'payments',
    permission: 'fees.view',
  },
  {
    to: studentLifecycleUrls.admin.announcements,
    label: 'Announcements',
    icon: 'campaign',
    permission: 'announcements.send',
  },
  {
    to: studentLifecycleUrls.admin.reports,
    label: 'CSV Reports',
    icon: 'summarize',
    permission: 'reports.view',
  },
  {
    to: studentLifecycleUrls.admin.roles,
    label: 'Roles & Access',
    icon: 'security',
    permission: 'roles.edit',
  },
  {
    to: studentLifecycleUrls.admin.settings,
    label: 'Portal Settings',
    icon: 'settings',
    permission: 'settings.edit',
  },
];

export default function AdminDashboard() {
  const currentAdminRole = useLifecycleStore(s => s.currentAdminRole);
  const imported = useLifecycleStore(s => s.importedStudents);
  const paidFees = useLifecycleStore(s => s.paidFees);

  const activeAdminName =
    currentAdminRole === 'super'
      ? 'Dr. P. Bansal (Director)'
      : currentAdminRole === 'registrar'
        ? "Registrar's Office"
        : currentAdminRole === 'exam'
          ? 'Examination Cell'
          : currentAdminRole === 'accounts'
            ? 'Accounts Section'
            : 'CSE Department Admin';

  const perms = DEFAULT_MATRIX[currentAdminRole] || [];

  const cgpas = STUDENTS.map(s => computeCGPA(s.semesters)).filter(
    (x): x is number => x !== null
  );
  const avgCgpa = cgpas.length
    ? cgpas.reduce((a, b) => a + b, 0) / cgpas.length
    : null;

  let collected = 0;
  STUDENTS.forEach(s => {
    s.fees.forEach(f => {
      if (f.status === 'Paid' || paidFees[f.id]) {
        collected += f.amount;
      }
    });
  });

  const strength = BRANCHES.map(b => ({
    ...b,
    enrolled: STUDENTS.filter(s => s.branch === b.code).length,
  }));

  const activeQuickActions = QUICK_ACTIONS.filter(q =>
    perms.includes(q.permission)
  );

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.admin.root },
    { label: 'Admin Command Center' },
  ];

  return (
    <FormPage
      title="Admin Command Center"
      description={`Signed in as ${activeAdminName} · Role: ${adminRoleLabel(currentAdminRole)}`}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Stat Cards Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={STUDENTS.length + imported.length}
            icon="school"
            colorScheme="blue"
            subtitle="Registered Profiles"
          />
          <StatCard
            title="Active Faculty"
            value={FACULTY.length}
            icon="groups"
            colorScheme="purple"
            subtitle="Teaching Officers"
          />
          <StatCard
            title="Fees Collected"
            value={formatINR(collected)}
            icon="payments"
            colorScheme="green"
            subtitle="Tuition & Exams Revenue"
          />
          <StatCard
            title="Average CGPA"
            value={avgCgpa?.toFixed(2) ?? '—'}
            icon="trending-up"
            colorScheme="indigo"
            subtitle="Academic Quality KPI"
          />
        </div>

        {/* Quick Links Menu */}
        {activeQuickActions.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {activeQuickActions.map(q => (
              <Link
                key={q.to}
                to={q.to}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center shadow-sm hover:shadow-md transition-all duration-200 group hover:-translate-y-px"
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Icon name={q.icon} className="text-lg font-bold" />
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {q.label}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Sanctioned Intakes */}
        <FormCard className="p-0 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/50">
            <Icon name="list-alt" className="text-primary text-xl" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              Branch-wise Sanctioned Intakes
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 text-slate-400 font-semibold text-xs">
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Engineering Branch Title</th>
                  <th className="px-5 py-3 text-center">Sanctioned Seats</th>
                  <th className="px-5 py-3">Seat Allocation Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {strength.map(b => (
                  <tr
                    key={b.code}
                    className="hover:bg-slate-50 dark:bg-slate-950/20 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {b.code}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                      {b.name}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      {b.intake}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="w-48">
                        <ProgressBar
                          value={(b.intake / 120) * 100}
                          colorClass="bg-blue-600"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
