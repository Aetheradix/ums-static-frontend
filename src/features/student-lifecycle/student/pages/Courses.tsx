import { useState, useMemo } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { listStudents, COURSES } from '../../data';
import { BRANCHES, EXTERNAL_PORTALS } from '../../data/domain/constants';
import { toRoman } from '../../utils';
import type { Course, CourseCategory } from '../../types';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

const CATEGORY_STYLE: Record<CourseCategory, string> = {
  Core: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 border-blue-200',
  'Program Elective':
    'bg-purple-50 dark:bg-purple-950/40 text-purple-700 border-purple-200',
  'Open Elective':
    'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800',
  'Skill Enhancement':
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200',
  'Ability Enhancement':
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200',
  Laboratory: 'bg-teal-50 text-teal-700 border-teal-200',
  Project: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-200',
};

export default function StudentCourses() {
  const currentStudentNo = useLifecycleStore(s => s.currentStudentNo);
  const students = listStudents();
  const student = students.find(s => s.enrollmentNo === currentStudentNo);

  const [branch, setBranch] = useState(student?.branch ?? 'CSE');
  const [semester, setSemester] = useState(
    String(student?.currentSemester ?? 5)
  );
  const [query, setQuery] = useState('');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    const semNum = Number(semester);
    const q = query.trim().toLowerCase();
    return COURSES.filter(
      c =>
        (c.branch === branch || c.branch === 'ALL') &&
        c.semester === semNum &&
        (!q ||
          c.title.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q))
    );
  }, [branch, semester, query]);

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.student.root },
    { label: 'Course Catalogue' },
  ];

  const branchOptions = BRANCHES.map(b => ({
    text: `${b.code} — ${b.name}`,
    value: b.code,
  }));
  const semesterOptions = Array.from({ length: 8 }, (_, i) => i + 1).map(n => ({
    text: `Semester ${toRoman(n)}`,
    value: String(n),
  }));

  const gridColumns = [
    {
      field: 'code',
      header: 'Code',
      sortable: true,
      width: '120px',
      cell: (c: Course) => (
        <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
          {c.code}
        </span>
      ),
    },
    {
      field: 'title',
      header: 'Course Title',
      sortable: true,
      cell: (c: Course) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {c.title}
        </span>
      ),
    },
    {
      field: 'credits',
      header: 'CBCS Credits',
      sortable: true,
      width: '120px',
      cell: (c: Course) => (
        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
          {c.credits}
        </span>
      ),
    },
    {
      field: 'category',
      header: 'Category',
      sortable: true,
      width: '180px',
      cell: (c: Course) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${CATEGORY_STYLE[c.category]}`}
        >
          {c.category}
        </span>
      ),
    },
    {
      field: 'code',
      header: 'Syllabus',
      width: '140px',
      cell: (c: Course) => (
        <button
          onClick={() => setActiveCourse(c)}
          className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1"
        >
          <Icon name="menu-book" className="text-[10px]" />
          <span>View Details</span>
        </button>
      ),
    },
  ];

  return (
    <FormPage
      title="Course Catalogue"
      description="Browse active CBCS scheme branches, normal course loads, and syllabus guidelines."
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Filters Selector */}
        <FormCard className="p-5">
          <FormGrid columns={3}>
            <DropDownList
              label="Branch"
              value={branch}
              data={branchOptions}
              textField="text"
              valueField="value"
              onChange={val => setBranch(val as any)}
            />

            <DropDownList
              label="Semester"
              value={semester}
              data={semesterOptions}
              textField="text"
              valueField="value"
              onChange={val => setSemester(val as string)}
            />

            <TextBox
              label="Search Catalogue"
              value={query}
              onChange={val => setQuery(val ?? '')}
              placeholder="Enter Course Code or Title..."
            />
          </FormGrid>
        </FormCard>

        {/* Results List */}
        <FormCard className="p-0 overflow-hidden">
          <GridPanel
            data={filteredCourses}
            dataKey="code"
            emptyMessage="No Courses Found"
            columns={gridColumns as any}
          />
        </FormCard>
      </div>

      {/* Course Detail Modal */}
      <FormPopup
        visible={activeCourse !== null}
        onHide={() => setActiveCourse(null)}
        title={activeCourse?.title ?? ''}
        subtitle={`${activeCourse?.code} · ${activeCourse?.credits} Credits · ${activeCourse?.category}`}
        footer={
          <a
            href={EXTERNAL_PORTALS.library.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex justify-center items-center gap-1.5 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-colors"
          >
            <Icon name="open-in-new" className="text-xs" />
            <span>Open Syllabus PDF (Digital Library)</span>
          </a>
        }
      >
        {activeCourse && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
                Semester {toRoman(activeCourse.semester)}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-bold border ${CATEGORY_STYLE[activeCourse.category]}`}
              >
                {activeCourse.category}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-800">
                {activeCourse.branch === 'ALL'
                  ? 'Open Elective (All Branches)'
                  : `${activeCourse.branch} Core`}
              </span>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Course Outcomes (CO)
              </h4>
              {activeCourse.courseOutcomes &&
              activeCourse.courseOutcomes.length > 0 ? (
                <ul className="flex flex-col gap-2.5 mt-1">
                  {activeCourse.courseOutcomes.map((co, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed items-start"
                    >
                      <span className="font-mono font-bold text-blue-600 shrink-0 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
                        CO{i + 1}
                      </span>
                      <span>{co}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic mt-1">
                  Course outcomes outline details to be published by the
                  department head.
                </p>
              )}
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
