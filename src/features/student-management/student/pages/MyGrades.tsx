import { useState } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type StudentGrade, myGrades } from '../../../academics/data';
import { studentManagementUrls } from '../../urls';

export default function MyGrades() {
  const [data] = useState<StudentGrade[]>(myGrades);

  return (
    <FormPage
      title="My Grades"
      description="Check your marks and grades for all subjects."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Management', to: '/student-management' },
        { label: 'Student Portal', to: studentManagementUrls.student.root },
        { label: 'My Grades' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
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
              cell: (item: StudentGrade) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Pass' ? 'approved' : 'rejected'}
                />
              ),
            },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
