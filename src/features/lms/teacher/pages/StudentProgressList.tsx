import { useState } from 'react';
import {
  FormPage,
  FormCard,
  GridPanel,
} from 'shared/new-components';
import { learningUrls } from '../../urls';

const MOCK_STUDENTS = [
  { id: 1, name: 'Arjun Sharma', enrollment: 'CS2021001', course: 'B.Tech Computer Science', progress: '78%', completedModules: '4/6', lastActive: '10 mins ago' },
  { id: 2, name: 'Neha Gupta', enrollment: 'CS2021002', course: 'B.Tech Computer Science', progress: '45%', completedModules: '2/6', lastActive: '1 day ago' },
  { id: 3, name: 'Rohan Shah', enrollment: 'CS2021003', course: 'B.Tech Computer Science', progress: '92%', completedModules: '5/6', lastActive: '2 hours ago' },
];

export default function StudentProgressList() {
  const [data] = useState(MOCK_STUDENTS);

  return (
    <FormPage
      title="Student Progress List"
      description="Track individual student learning activity and module completion."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Teacher Portal', to: learningUrls.teacher.portal },
        { label: 'Progress Tracking', to: learningUrls.teacher.progress },
        { label: 'Student Progress' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          loading={false}
          columns={[
            { field: 'enrollment', header: 'Enrollment No' },
            { field: 'name', header: 'Student Name' },
            { field: 'course', header: 'Course' },
            { field: 'progress', header: 'Course Progress' },
            { field: 'completedModules', header: 'Modules Completed' },
            { field: 'lastActive', header: 'Last Login' },
          ]}
          searchBox
        />
      </FormCard>
    </FormPage>
  );
}
