import { Link } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { useLifecycleStore, overrideKey } from '../../store/useLifecycleStore';
import { listFaculty, getStudent, studentsForCourse } from '../../data';
import { toRoman } from '../../utils';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

export default function FacultyDashboard() {
  const currentFacultyId = useLifecycleStore(s => s.currentFacultyId);
  const overrides = useLifecycleStore(s => s.internalOverrides);

  const faculties = listFaculty();
  const faculty = faculties.find(f => f.id === currentFacultyId);

  if (!faculty) {
    return (
      <FormPage
        title="Faculty Dashboard"
        description="No active faculty profile found."
      >
        <FormCard>
          <div className="p-8 text-center text-red-500">
            Error: Faculty profile not loaded. Please select a profile from the
            portal landing page.
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const firstName = faculty.name
    .replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/, '')
    .split(' ')[0];
  const primaryCourse = faculty.coursesTaught[0];
  const roster = studentsForCourse(primaryCourse.courseCode);

  const pendingCount = roster.filter(s => {
    const ia = s.internals.find(i => i.courseCode === primaryCourse.courseCode);
    const ov = overrides[overrideKey(primaryCourse.courseCode, s.enrollmentNo)];
    return ia?.mst2 == null && ov?.mst2 == null;
  }).length;

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.faculty.root },
    { label: 'Faculty Dashboard' },
  ];

  return (
    <FormPage
      title={`Welcome back, Dr. ${firstName}`}
      description={`${faculty.designation} · Department of ${faculty.department}`}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Stat Cards Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Courses Load"
            value={faculty.coursesTaught.length}
            icon="menu-book"
            colorScheme="blue"
            subtitle="Assigned Teaching Load"
          />
          <StatCard
            title="Total Students"
            value={roster.length}
            icon="users"
            colorScheme="blue"
            subtitle={`Course: ${primaryCourse.courseCode}`}
          />
          <StatCard
            title="Advisees Assigned"
            value={faculty.advisorOf.length}
            icon="school"
            colorScheme="purple"
            subtitle="Faculty Advisor Scheme"
          />
          <StatCard
            title="Pending Internals"
            value={pendingCount}
            icon="edit-note"
            colorScheme={pendingCount ? 'amber' : 'green'}
            subtitle="MST-2 Marks Entry"
          />
        </div>

        {/* Content Columns Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Courses Load */}
          <div className="lg:col-span-2">
            <FormCard className="p-0 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/50">
                <Icon name="menu-book" className="text-primary text-xl" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  My Assigned Courses
                </h3>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {faculty.coursesTaught.map(c => (
                  <li
                    key={c.courseCode}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50 dark:bg-slate-950/20 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {c.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">
                        {c.courseCode} · B.E. {c.branch} · Sem{' '}
                        {toRoman(c.semester)} · Sec {c.section}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        to={studentLifecycleUrls.faculty.marksEntry}
                        className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover shadow-sm transition-colors"
                      >
                        Marks Entry
                      </Link>
                      <Link
                        to={studentLifecycleUrls.faculty.classList}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors"
                      >
                        Class List
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </FormCard>
          </div>

          {/* Advisees Column */}
          <FormCard className="p-0 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/50">
              <Icon name="school" className="text-primary text-xl" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                Assigned Advisees
              </h3>
            </div>

            {faculty.advisorOf.length === 0 ? (
              <p className="p-5 text-sm text-slate-400 text-center italic">
                No advisees assigned under your profile.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-96 overflow-y-auto">
                {faculty.advisorOf.map(id => {
                  const s = getStudent(id);
                  if (!s) return null;
                  const initials = s.name
                    .split(' ')
                    .map(n => n[0])
                    .join('');
                  return (
                    <li
                      key={id}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:bg-slate-950/20 transition-colors"
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm"
                        style={{ backgroundColor: s.photoColor }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                          {s.name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {s.enrollmentNo}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
