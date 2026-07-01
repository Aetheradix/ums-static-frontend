import { PortalSelector } from 'shared/new-components';
import { learningUrls } from '../../urls';

export default function ProgressPortal() {
  return (
    <PortalSelector
      moduleTitle="Progress Tracking"
      moduleDescription="Monitor student development, check course reports and module statuses."
      backPath={learningUrls.teacher.portal}
      backLabel="Teacher Portal"
      portals={[
        {
          title: 'Student Progress',
          description:
            'View learning status, quiz performance, and logs for individual students.',
          icon: 'person',
          colorScheme: 'indigo',
          path: `${learningUrls.teacher.progress}/students`,
        },
        {
          title: 'Course Progress',
          description:
            'Monitor average class progress, video counts and grading status.',
          icon: 'analytics',
          colorScheme: 'blue',
          path: `${learningUrls.teacher.progress}/courses`,
        },
        {
          title: 'Module Completion Status',
          description:
            'Review which modules have been completed by each section.',
          icon: 'view_module',
          colorScheme: 'teal',
          path: `${learningUrls.teacher.progress}/modules`,
        },
      ]}
    />
  );
}
