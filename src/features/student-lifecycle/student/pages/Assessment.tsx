import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { useLifecycleStore, overrideKey } from '../../store/useLifecycleStore';
import { listStudents } from '../../data';
import { INTERNAL_PASS_MARK, internalTotal } from '../../data/domain';
import { toRoman } from '../../utils';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

function formatMarkCell(value: number | null) {
  return value === null ? (
    <span className="text-slate-400 font-medium">—</span>
  ) : (
    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
      {value}
    </span>
  );
}

export default function StudentAssessment() {
  const currentStudentNo = useLifecycleStore(s => s.currentStudentNo);
  const overrides = useLifecycleStore(s => s.internalOverrides);

  const students = listStudents();
  const student = students.find(s => s.enrollmentNo === currentStudentNo);

  if (!student) {
    return (
      <FormPage
        title="Internal Assessment"
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

  const rows = student.internals.map(ia => {
    const ov = overrides[overrideKey(ia.courseCode, student.enrollmentNo)];
    const mst2 = ov?.mst2 !== undefined ? ov.mst2 : ia.mst2;
    const quiz = ov?.quiz !== undefined ? ov.quiz : ia.quiz;
    const total = internalTotal(ia.mst1, mst2, ia.assignment, quiz);
    const finalised = ia.locked || ov != null;
    return {
      code: ia.courseCode,
      title: ia.title,
      mst1: ia.mst1,
      mst2,
      assignment: ia.assignment,
      quiz,
      total,
      finalised,
    };
  });

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.student.root },
    { label: 'Internal Assessment' },
  ];

  const gridColumns = [
    {
      field: 'title',
      header: 'Course Name',
      cell: (r: (typeof rows)[0]) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            {r.title}
          </span>
          <span className="text-[10px] font-mono text-slate-400">{r.code}</span>
        </div>
      ),
    },
    {
      field: 'mst1',
      header: 'MST-1 (/30)',
      sortable: true,
      cell: (r: (typeof rows)[0]) => formatMarkCell(r.mst1),
    },
    {
      field: 'mst2',
      header: 'MST-2 (/30)',
      sortable: true,
      cell: (r: (typeof rows)[0]) => formatMarkCell(r.mst2),
    },
    {
      field: 'assignment',
      header: 'Assignment (/10)',
      sortable: true,
      cell: (r: (typeof rows)[0]) => formatMarkCell(r.assignment),
    },
    {
      field: 'quiz',
      header: 'Quiz (/10)',
      sortable: true,
      cell: (r: (typeof rows)[0]) => formatMarkCell(r.quiz),
    },
    {
      field: 'total',
      header: 'Scaled Total (/20)',
      sortable: true,
      cell: (r: (typeof rows)[0]) => {
        const belowPass = r.total !== null && r.total < INTERNAL_PASS_MARK;
        return r.total === null ? (
          <span className="text-slate-400">—</span>
        ) : (
          <span
            className={`font-mono font-bold text-base ${belowPass ? 'text-red-600' : 'text-primary'}`}
          >
            {r.total}
          </span>
        );
      },
    },
    {
      field: 'finalised',
      header: 'Status',
      sortable: true,
      cell: (r: (typeof rows)[0]) => {
        const belowPass = r.total !== null && r.total < INTERNAL_PASS_MARK;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              r.finalised
                ? belowPass
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-700 border-red-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                r.finalised
                  ? belowPass
                    ? 'bg-red-50 dark:bg-red-950/400'
                    : 'bg-emerald-50 dark:bg-emerald-950/400'
                  : 'bg-amber-50 dark:bg-amber-950/400 animate-pulse'
              }`}
            />
            {r.finalised
              ? belowPass
                ? 'Below Pass'
                : 'Finalised'
              : 'In Progress'}
          </span>
        );
      },
    },
  ];

  return (
    <FormPage
      title="Internal Assessment"
      description={`Continuous internal assessment evaluations for Semester ${toRoman(student.currentSemester)} — accounting for 20% of your final grades.`}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Info Card */}
        <FormCard className="bg-blue-50 dark:bg-blue-950/40/50 border-blue-100 dark:border-blue-900/30 p-4">
          <div className="flex gap-3 items-start text-blue-800">
            <Icon name="info" className="text-xl shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Internal marks combine the better of two Mid-Semester Tests (MST)
              with your assignment and quiz scores, scaled to a maximum of{' '}
              <strong>20 marks</strong>. A minimum of{' '}
              <strong>{INTERNAL_PASS_MARK}/20</strong> is required, along with
              75% attendance, to be eligible to sit the end-semester
              examinations.
            </p>
          </div>
        </FormCard>

        {/* Component-wise Table */}
        <FormCard title="Component-wise Marks" className="p-0 overflow-hidden">
          <GridPanel
            data={rows}
            dataKey="code"
            emptyMessage="No Internal Assessment records loaded."
            columns={gridColumns as any}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
