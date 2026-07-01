import { PortalSelector } from 'shared/new-components';
import { learningUrls } from './urls';

export default function LearningPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Learning Management System"
      moduleDescription="Access the learning management system based on your role."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Configure courses, map faculty and students, manage masters and view reports.',
          icon: 'admin_panel_settings',
          colorScheme: 'blue',
          path: learningUrls.admin.portal,
        },
        {
          title: 'Teacher Portal',
          description:
            'Manage course content, modules, topics, assignments, evaluate results, and track progress.',
          icon: 'groups',
          colorScheme: 'green',
          path: learningUrls.teacher.portal,
        },
        {
          title: 'Student Portal',
          description:
            'View enrolled courses, modules, watch video lectures, download notes, submit assignments, and take quizzes.',
          icon: 'school',
          colorScheme: 'purple',
          path: learningUrls.student.portal,
        },
      ]}
    />
  );
}
