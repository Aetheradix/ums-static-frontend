import { PortalSelector } from 'shared/new-components';
import { learningUrls } from '../../urls';

export default function ContentManagementPortal() {
  return (
    <PortalSelector
      moduleTitle="Content Management"
      moduleDescription="Manage your courses, structure modules/topics, and upload educational materials."
      backPath={learningUrls.teacher.portal}
      backLabel="Teacher Portal"
      portals={[
        {
          title: 'My Courses',
          description: 'View list of courses and classes assigned to you.',
          icon: 'book',
          colorScheme: 'green',
          path: `${learningUrls.teacher.content}/my-courses`,
        },
        {
          title: 'Module & Topic Management',
          description: 'Create and structure modules and topics for your courses.',
          icon: 'view_module',
          colorScheme: 'indigo',
          path: `${learningUrls.teacher.content}/modules`,
        },
        {
          title: 'Upload Learning Content',
          description: 'Upload new learning materials, assignments, and lectures.',
          icon: 'cloud_upload',
          colorScheme: 'blue',
          path: `${learningUrls.teacher.content}/upload`,
        },
        {
          title: 'Manage Learning Materials',
          description: 'Organize and update existing Videos, PDFs, Notes, and PPTs.',
          icon: 'folder_open',
          colorScheme: 'purple',
          path: `${learningUrls.teacher.content}/materials`,
        },
      ]}
    />
  );
}
