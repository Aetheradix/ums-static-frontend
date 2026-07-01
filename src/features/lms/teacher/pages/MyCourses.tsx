import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
} from 'shared/new-components';
import { learningUrls } from '../../urls';

const MOCK_TEACHER_COURSES = [
  { id: 'c1', code: 'BTECH-CS', name: 'B.Tech Computer Science', category: 'Technical', semester: '5th Sem', modules: 12, students: 240, status: 'Active' },
  { id: 'c2', code: 'BCA', name: 'Bachelor of Computer Applications', category: 'Technical', semester: '3rd Sem', modules: 6, students: 120, status: 'Active' },
  { id: 'c3', code: 'MBA', name: 'Master of Business Administration', category: 'Management', semester: '1st Sem', modules: 8, students: 85, status: 'Active' },
];

export default function MyCourses() {
  const [data] = useState(MOCK_TEACHER_COURSES);

  return (
    <FormPage
      title="My Courses"
      description="List of academic courses and sections assigned to you for teaching."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Teacher Portal', to: learningUrls.teacher.portal },
        { label: 'Content Management', to: learningUrls.teacher.content },
        { label: 'My Courses' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          columns={[
            { field: 'code', header: 'Course Code' },
            { field: 'name', header: 'Course Name' },
            { field: 'semester', header: 'Semester' },
            { field: 'modules', header: 'Modules Count' },
            { field: 'students', header: 'Students Enrolled' },
            { field: 'status', header: 'Status' },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
