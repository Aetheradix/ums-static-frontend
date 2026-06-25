import { useState } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type FacultyCourse, facultyCourses } from '../../data';
import { academicsUrls } from '../../urls';

export default function FacultyMyCourses() {
  const [data] = useState<FacultyCourse[]>(facultyCourses);

  return (
    <FormPage
      title="My Courses"
      description="View all courses assigned to you this semester."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Academic Management', to: academicsUrls.portal },
        { label: 'Faculty Portal', to: academicsUrls.faculty.portal },
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
            { field: 'programme', header: 'Programme' },
            { field: 'semester', header: 'Semester' },
            { field: 'totalStudents', header: 'Total Students' },
            { field: 'enrolledCount', header: 'Enrolled' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: FacultyCourse) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'rejected'}
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
