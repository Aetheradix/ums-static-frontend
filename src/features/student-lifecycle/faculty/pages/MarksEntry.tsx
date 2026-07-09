import { useState } from 'react';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { DropDownList } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import type { Student } from '../../types';
import { useLifecycleStore, overrideKey } from '../../store/useLifecycleStore';
import { listFaculty, studentsForCourse } from '../../data';
import { INTERNAL_PASS_MARK, internalTotal } from '../../data/domain';
import { toRoman } from '../../utils';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

export default function FacultyMarksEntry() {
  const currentFacultyId = useLifecycleStore(s => s.currentFacultyId);
  const overrides = useLifecycleStore(s => s.internalOverrides);
  const saveInternalMarks = useLifecycleStore(s => s.saveInternalMarks);

  const faculties = listFaculty();
  const faculty = faculties.find(f => f.id === currentFacultyId);

  const [courseCode, setCourseCode] = useState(
    faculty?.coursesTaught[0]?.courseCode ?? ''
  );
  const [edits, setEdits] = useState<
    Record<string, { mst2: string; quiz: string }>
  >({});

  if (!faculty) {
    return (
      <FormPage
        title="Marks Entry"
        description="No active faculty profile found."
      >
        <FormCard>
          <div className="p-8 text-center text-red-500">
            Error: Faculty profile not loaded.
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const roster = studentsForCourse(courseCode);
  const courseMeta = faculty.coursesTaught.find(
    c => c.courseCode === courseCode
  );

  const effMarks = (stu: Student) => {
    const ia = stu.internals.find(i => i.courseCode === courseCode)!;
    const key = overrideKey(courseCode, stu.enrollmentNo);
    const ov = overrides[key];
    const e = edits[key];
    const mst2str =
      e?.mst2 !== undefined
        ? e.mst2
        : ((ov?.mst2 ?? ia.mst2)?.toString() ?? '');
    const quizstr =
      e?.quiz !== undefined
        ? e.quiz
        : ((ov?.quiz ?? ia.quiz)?.toString() ?? '');
    const mst2 = mst2str === '' ? null : Number(mst2str);
    const quiz = quizstr === '' ? null : Number(quizstr);
    const total = internalTotal(ia.mst1, mst2, ia.assignment, quiz);
    const finalised = ia.locked || ov != null;
    return { ia, key, mst2str, quizstr, total, finalised };
  };

  const setMarkField = (
    stu: Student,
    field: 'mst2' | 'quiz',
    rawValue: string,
    max: number
  ) => {
    const { key, mst2str, quizstr } = effMarks(stu);
    const clamped =
      rawValue === ''
        ? ''
        : String(Math.max(0, Math.min(max, Math.round(Number(rawValue) || 0))));
    setEdits(prev => ({
      ...prev,
      [key]: {
        mst2: field === 'mst2' ? clamped : mst2str,
        quiz: field === 'quiz' ? clamped : quizstr,
      },
    }));
  };

  const saveMarks = () => {
    let count = 0;
    roster.forEach(stu => {
      const { mst2str, quizstr } = effMarks(stu);
      if (mst2str !== '' && quizstr !== '') {
        saveInternalMarks(courseCode, stu.enrollmentNo, {
          mst2: Number(mst2str),
          quiz: Number(quizstr),
        });
        count += 1;
      }
    });

    // Clear edits that were saved
    setEdits(prev =>
      Object.fromEntries(
        Object.entries(prev).filter(([k]) => !k.startsWith(`${courseCode}:`))
      )
    );
    ToastService.success(
      `Continuous assessment marks finalised for ${count} students.`
    );
  };

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.faculty.root },
    { label: 'Marks Entry' },
  ];

  const rows = roster.map(stu => {
    const { ia, key, mst2str, quizstr, total, finalised } = effMarks(stu);
    return {
      student: stu,
      ia,
      key,
      mst2str,
      quizstr,
      total,
      finalised,
    };
  });

  const gridColumns = [
    {
      field: 'student',
      header: 'Student',
      cell: (r: (typeof rows)[0]) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            {r.student.name}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {r.student.enrollmentNo}
          </span>
        </div>
      ),
    },
    {
      field: 'mst1',
      header: 'MST-1 (/30)',
      sortable: true,
      cell: (r: (typeof rows)[0]) => (
        <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">
          {r.ia.mst1 ?? '—'}
        </span>
      ),
    },
    {
      field: 'mst2str',
      header: 'MST-2 (/30)',
      cell: (r: (typeof rows)[0]) => (
        <input
          type="number"
          min={0}
          max={30}
          value={r.mst2str}
          onChange={e => setMarkField(r.student, 'mst2', e.target.value, 30)}
          className="w-16 rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-center font-mono text-xs focus:border-primary focus:outline-none bg-slate-50 dark:bg-slate-950"
        />
      ),
    },
    {
      field: 'assignment',
      header: 'Assignment (/10)',
      sortable: true,
      cell: (r: (typeof rows)[0]) => (
        <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">
          {r.ia.assignment ?? '—'}
        </span>
      ),
    },
    {
      field: 'quizstr',
      header: 'Quiz (/10)',
      cell: (r: (typeof rows)[0]) => (
        <input
          type="number"
          min={0}
          max={10}
          value={r.quizstr}
          onChange={e => setMarkField(r.student, 'quiz', e.target.value, 10)}
          className="w-16 rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-center font-mono text-xs focus:border-primary focus:outline-none bg-slate-50 dark:bg-slate-950"
        />
      ),
    },
    {
      field: 'total',
      header: 'Consolidated (/20)',
      sortable: true,
      cell: (r: (typeof rows)[0]) => {
        const belowPass = r.total !== null && r.total < INTERNAL_PASS_MARK;
        return r.total === null ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 border border-amber-200">
            Pending
          </span>
        ) : (
          <span
            className={`font-mono font-bold text-sm ${belowPass ? 'text-red-600' : 'text-primary'}`}
          >
            {r.total}
          </span>
        );
      },
    },
  ];

  return (
    <FormPage
      title="Marks Entry"
      description="Record continuous internal evaluation scores (MST-2 & quizzes) which update student records dynamically."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Selector Card */}
        <FormCard className="p-4 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {courseMeta?.title ?? 'Select Course'}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {courseMeta
                  ? `${courseMeta.courseCode} · Sem ${toRoman(courseMeta.semester)} · Section ${courseMeta.section}`
                  : ''}
              </p>
            </div>

            <div className="shrink-0 w-full md:w-64 select-no-label">
              <DropDownList
                label=""
                value={courseCode}
                data={faculty.coursesTaught.map(c => ({
                  text: `${c.courseCode} — ${c.title}`,
                  value: c.courseCode,
                }))}
                textField="text"
                valueField="value"
                onChange={val => setCourseCode(val as string)}
              />
            </div>
          </div>
        </FormCard>

        {/* Entry Table */}
        <FormCard
          title="Internal Marks Register"
          className="p-0 overflow-hidden"
        >
          <GridPanel
            data={rows}
            dataKey="key"
            emptyMessage="No students registered in this course."
            columns={gridColumns as any}
          />

          <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/20">
            <button
              onClick={saveMarks}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:-translate-y-px active:translate-y-0"
            >
              <Icon name="save" className="text-xs" />
              <span>Save Marks Registry</span>
            </button>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
