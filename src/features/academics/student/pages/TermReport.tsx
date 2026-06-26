import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { myGrades, myStudentCourses } from '../../data';
import { academicsUrls } from '../../urls';

const totalCredits = myStudentCourses.reduce((sum, c) => sum + c.credits, 0);
const totalMarks = myGrades.reduce((sum, g) => sum + g.total, 0);
const sgpa =
  myGrades.reduce((sum, g) => {
    const credits =
      myStudentCourses.find(c => c.code === g.courseCode)?.credits ?? 0;
    return sum + g.gradePoints * credits;
  }, 0) / totalCredits;

const STATS = [
  { label: 'Total Courses', value: String(myGrades.length) },
  { label: 'Total Credits', value: String(totalCredits) },
  { label: 'Total Marks', value: String(totalMarks) },
  { label: 'SGPA', value: sgpa.toFixed(2) },
];

export default function TermReport() {
  return (
    <FormPage
      title="Term Report"
      description="Your semester performance summary and SGPA."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Academic Management', to: academicsUrls.portal },
        { label: 'Student Portal', to: academicsUrls.student.portal },
        { label: 'Term Report' },
      ]}
    >
      <FormCard>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {STATS.map(stat => (
            <div
              key={stat.label}
              className="bg-slate-50 rounded-lg p-4 text-center"
            >
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <GridPanel
          data={myGrades}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
            },
            { field: 'courseCode', header: 'Code' },
            { field: 'courseTitle', header: 'Course Title' },
            { field: 'midTerm', header: 'Mid-Term' },
            { field: 'endTerm', header: 'End-Term' },
            { field: 'assignment', header: 'Assignment' },
            { field: 'total', header: 'Total' },
            { field: 'grade', header: 'Grade' },
            { field: 'gradePoints', header: 'Grade Points' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: (typeof myGrades)[0]) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Pass' ? 'approved' : 'rejected'}
                />
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
