import { useState } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type StudentCourse, myStudentCourses } from '../../../academics/data';
import { studentManagementUrls } from '../../urls';

export default function MyCourses() {
  const [data] = useState<StudentCourse[]>(myStudentCourses);

  return (
    <FormPage
      title="My Courses"
      description="View all courses you are currently enrolled in."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Management', to: '/student-management' },
        { label: 'Student Portal', to: studentManagementUrls.student.root },
        { label: 'My Courses' },
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
            { field: 'code', header: 'Code' },
            { field: 'title', header: 'Course Title' },
            { field: 'credits', header: 'Credits' },
            { field: 'faculty', header: 'Faculty' },
            { field: 'semester', header: 'Semester' },
            { field: 'attendance', header: 'Attendance (%)' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: StudentCourse) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Ongoing' ? 'approved' : 'neutral'}
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
