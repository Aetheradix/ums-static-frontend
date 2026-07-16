import { useState } from 'react';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { DropDownList } from 'shared/components/forms';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { listFaculty, studentsForCourse } from '../../data';
import { ATTENDANCE_THRESHOLD, attendancePercent } from '../../data/domain';
import { formatDate } from '../../utils';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

export default function FacultyAttendance() {
  const currentFacultyId = useLifecycleStore(s => s.currentFacultyId);
  const faculties = listFaculty();
  const faculty = faculties.find(f => f.id === currentFacultyId);

  const [courseCode, setCourseCode] = useState(
    faculty?.coursesTaught[0]?.courseCode ?? ''
  );
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>({});

  if (!faculty) {
    return (
      <FormPage
        title="Attendance Entry"
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
  const isPresent = (id: string) => presentMap[id] ?? true;
  const presentCount = roster.filter(s => isPresent(s.enrollmentNo)).length;

  const submitAttendance = () => {
    ToastService.success(
      `${presentCount} Present · ${roster.length - presentCount} Absent recorded for course ${courseCode}.`
    );
  };

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.faculty.root },
    { label: 'Attendance Entry' },
  ];

  const gridColumns = [
    {
      field: 'name',
      header: 'Student Name',
      cell: (stu: (typeof roster)[0]) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            {stu.name}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {stu.enrollmentNo}
          </span>
        </div>
      ),
    },
    {
      field: 'attendance',
      header: 'Aggregate Attendance',
      sortable: true,
      cell: (stu: (typeof roster)[0]) => {
        const rec = stu.attendance.find(a => a.courseCode === courseCode);
        const pct = rec ? attendancePercent(rec) : 0;
        return (
          <span
            className={`font-bold font-mono text-xs ${pct < ATTENDANCE_THRESHOLD ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}
          >
            {pct}%
          </span>
        );
      },
    },
    {
      field: 'enrollmentNo',
      header: 'Mark Present',
      cell: (stu: (typeof roster)[0]) => (
        <input
          type="checkbox"
          checked={isPresent(stu.enrollmentNo)}
          onChange={() =>
            setPresentMap(prev => ({
              ...prev,
              [stu.enrollmentNo]: !isPresent(stu.enrollmentNo),
            }))
          }
          className="w-4 h-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-700 rounded"
          aria-label={`Present: ${stu.name}`}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Attendance Entry"
      description={`Record student daily lecture attendance sheets for today — ${formatDate('2026-07-09T00:00:00Z')}.`}
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
                  ? `${courseMeta.courseCode} · Section ${courseMeta.section}`
                  : ''}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg border border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                {presentCount} / {roster.length} Present
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

        {/* Attendance Grid Table */}
        <FormCard title="Attendance Registry" className="p-0 overflow-hidden">
          <GridPanel
            data={roster}
            dataKey="enrollmentNo"
            emptyMessage="No students registered in this course."
            columns={gridColumns as any}
          />

          <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/20">
            <button
              onClick={submitAttendance}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:-translate-y-px active:translate-y-0"
            >
              Submit Attendance Sheet
            </button>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
