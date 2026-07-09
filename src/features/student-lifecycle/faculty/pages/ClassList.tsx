import { useState } from 'react';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { DropDownList } from 'shared/components/forms';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { listFaculty, studentsForCourse } from '../../data';
import { ATTENDANCE_THRESHOLD, courseEligibility } from '../../data/domain';
import { toRoman } from '../../utils';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

export default function FacultyClassList() {
  const currentFacultyId = useLifecycleStore(s => s.currentFacultyId);
  const faculties = listFaculty();
  const faculty = faculties.find(f => f.id === currentFacultyId);

  const [courseCode, setCourseCode] = useState(
    faculty?.coursesTaught[0]?.courseCode ?? ''
  );

  if (!faculty) {
    return (
      <FormPage
        title="Class List / Roster"
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
  const eligibleCount = roster.filter(
    s => courseEligibility(s, courseCode).eligible
  ).length;

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.faculty.root },
    { label: 'Class List / Roster' },
  ];

  const gridColumns = [
    {
      field: 'name',
      header: 'Student Name',
      cell: (stu: (typeof roster)[0]) => {
        const initials = stu.name
          .split(' ')
          .map(n => n[0])
          .join('');
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0 shadow-sm"
              style={{ backgroundColor: stu.photoColor }}
            >
              {initials}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {stu.name}
              </p>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                {stu.enrollmentNo}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      field: 'attendance',
      header: 'Course Attendance',
      sortable: true,
      cell: (stu: (typeof roster)[0]) => {
        const e = courseEligibility(stu, courseCode);
        return (
          <span
            className={`font-bold font-mono text-xs ${e.attendance < ATTENDANCE_THRESHOLD ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}
          >
            {e.attendance}%
          </span>
        );
      },
    },
    {
      field: 'internal',
      header: 'Internal Score (/20)',
      sortable: true,
      cell: (stu: (typeof roster)[0]) => {
        const e = courseEligibility(stu, courseCode);
        return (
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
            {e.internal ?? '—'}
          </span>
        );
      },
    },
    {
      field: 'eligible',
      header: 'Exam Eligibility',
      sortable: true,
      cell: (stu: (typeof roster)[0]) => {
        const e = courseEligibility(stu, courseCode);
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              e.eligible
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200'
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 border-red-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${e.eligible ? 'bg-emerald-50 dark:bg-emerald-950/400' : 'bg-red-50 dark:bg-red-950/400'}`}
            />
            {e.eligible ? 'Eligible' : 'Detained'}
          </span>
        );
      },
    },
  ];

  return (
    <FormPage
      title="Class List / Roster"
      description="View assigned courses enrollment listings, class attendance rates, and continuous internal assessment progress."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Selector Header Panel */}
        <FormCard className="p-4 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {courseMeta?.title ?? 'Select Course'}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {courseMeta
                  ? `${courseMeta.courseCode} · B.E. ${courseMeta.branch} · Sem ${toRoman(courseMeta.semester)} · Section ${courseMeta.section}`
                  : ''}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                {eligibleCount} / {roster.length} Eligible
              </span>

              <div className="w-64 select-no-label">
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
          </div>
        </FormCard>

        {/* Student Roster Table */}
        <FormCard title="Enrolled Students" className="p-0 overflow-hidden">
          <GridPanel
            data={roster}
            dataKey="enrollmentNo"
            emptyMessage="No students registered in this course."
            columns={gridColumns as any}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
