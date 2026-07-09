import { FormCard, FormPage, StatCard, GridPanel } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { listStudents } from '../../data';
import { classification, computeCGPA, degreeProgress } from '../../data/domain';
import { toRoman } from '../../utils';
import { GradeBadge } from '../../components';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

export default function StudentResults() {
  const currentStudentNo = useLifecycleStore(s => s.currentStudentNo);
  const students = listStudents();
  const student = students.find(s => s.enrollmentNo === currentStudentNo);

  if (!student) {
    return (
      <FormPage
        title="Results & Grade Cards"
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

  const cgpa = computeCGPA(student.semesters);
  const progress = degreeProgress(student.semesters);
  const completedSemesters = student.semesters.filter(s =>
    s.courses.every(c => c.status !== 'Pending')
  );
  const latestCompletedSem = completedSemesters.at(-1)?.semester;
  const orderedSemesters = [...student.semesters].sort(
    (a, b) => b.semester - a.semester
  );

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.student.root },
    { label: 'Results & Grade Cards' },
  ];

  const handleRevalRequest = (semNum: number) => {
    ToastService.success(
      `Revaluation application submitted for Semester ${toRoman(semNum)}. The higher score will be retained.`
    );
  };

  const gridColumns = [
    {
      field: 'title',
      header: 'Course Code & Title',
      cell: (c: (typeof student.semesters)[0]['courses'][0]) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            {c.title}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {c.courseCode} · {c.credits} Credits
          </span>
        </div>
      ),
    },
    {
      field: 'internal',
      header: 'Internal (/20)',
      sortable: true,
      cell: (c: (typeof student.semesters)[0]['courses'][0]) => (
        <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">
          {c.internal ?? '—'}
        </span>
      ),
    },
    {
      field: 'external',
      header: 'External (/80)',
      sortable: true,
      cell: (c: (typeof student.semesters)[0]['courses'][0]) => (
        <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">
          {c.external ?? '—'}
        </span>
      ),
    },
    {
      field: 'total',
      header: 'Total (/100)',
      sortable: true,
      cell: (c: (typeof student.semesters)[0]['courses'][0]) => {
        const tot =
          c.internal !== null && c.external !== null
            ? c.internal + c.external
            : null;
        return (
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
            {tot ?? '—'}
          </span>
        );
      },
    },
    {
      field: 'grade',
      header: 'Letter Grade',
      sortable: true,
      cell: (c: (typeof student.semesters)[0]['courses'][0]) => (
        <GradeBadge grade={c.grade} />
      ),
    },
    {
      field: 'gradePoint',
      header: 'GP',
      sortable: true,
      cell: (c: (typeof student.semesters)[0]['courses'][0]) => (
        <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
          {c.gradePoint ?? '—'}
        </span>
      ),
    },
  ];

  return (
    <FormPage
      title="Results & Grade Cards"
      description="View semester-wise credit results, continuous evaluation breakdown, and GPA trends."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Stat Cards Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Cumulative CGPA"
            value={cgpa?.toFixed(2) ?? '—'}
            icon="grade"
            colorScheme="green"
            subtitle={`${completedSemesters.length} Semesters Clear`}
          />
          <StatCard
            title="Standing Division"
            value={classification(cgpa)}
            icon="verified"
            colorScheme="blue"
            subtitle="Based on overall CGPA"
          />
          <StatCard
            title="Credits Earned"
            value={progress.earned}
            icon="school"
            colorScheme="blue"
            subtitle={`of ${progress.required} Required`}
          />
          <StatCard
            title="Completed Semesters"
            value={completedSemesters.length}
            icon="calendar"
            colorScheme="purple"
            subtitle="Academic History"
          />
        </div>

        {/* Semesters Grade Sheets List */}
        <div className="flex flex-col gap-6">
          {orderedSemesters.map(sem => {
            const isPending = sem.courses.some(c => c.status === 'Pending');
            return (
              <FormCard key={sem.semester} className="p-0 overflow-hidden">
                {/* Header of Semester Card */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">
                      Semester {toRoman(sem.semester)}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {sem.session}
                    </p>
                  </div>

                  <div>
                    {isPending ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                        Results Awaited
                      </span>
                    ) : sem.semester === latestCompletedSem ? (
                      <button
                        onClick={() => handleRevalRequest(sem.semester)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 dark:bg-slate-950 transition-colors"
                      >
                        <Icon name="history" className="text-xs" />
                        <span>Request Revaluation</span>
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Table details */}
                <GridPanel
                  data={sem.courses}
                  dataKey="courseCode"
                  emptyMessage="No results available for this semester."
                  columns={gridColumns as any}
                />

                {/* Footer summary of SGPA */}
                <div className="flex items-center justify-end gap-4 border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/30">
                  {sem.courses.some(c => c.status === 'Backlog') && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      Backlogs Pending (ATKT)
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-bold uppercase">
                    Semester SGPA:
                  </span>
                  <span className="font-bold text-base text-primary font-mono">
                    {sem.sgpa != null ? sem.sgpa.toFixed(2) : '—'}
                  </span>
                </div>
              </FormCard>
            );
          })}
        </div>
      </div>
    </FormPage>
  );
}
