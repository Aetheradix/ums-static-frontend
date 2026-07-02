import { PortalSelector } from 'shared/new-components';
import { admissionsUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Applicant Portal — Admissions"
      moduleDescription="Apply for admission, track your application, pay fees, and view merit list."
      backPath={admissionsUrls.root}
      backLabel="Admissions Management"
      portals={[
        {
          title: 'My Dashboard',
          description: 'Track your application status and progress.',
          icon: 'dashboard',
          colorScheme: 'teal',
          path: admissionsUrls.student.dashboard,
        },
        {
          title: 'Apply Now',
          description: 'Fill and submit application',
          icon: 'assignment',
          colorScheme: 'purple',
          path: admissionsUrls.student.apply,
        },
        {
          title: 'Course Preference',
          description: 'Select course priorities',
          icon: 'list_alt',
          colorScheme: 'green',
          path: admissionsUrls.student.coursePreference,
        },
        {
          title: 'Document Upload',
          description: 'Upload required docs',
          icon: 'upload_file',
          colorScheme: 'orange',
          path: admissionsUrls.student.documents,
        },
        {
          title: 'Application Tracking',
          description: 'Track status timeline',
          icon: 'track_changes',
          colorScheme: 'teal',
          path: admissionsUrls.student.tracking,
        },
        {
          title: 'Merit List',
          description: 'View merit position',
          icon: 'format_list_numbered',
          colorScheme: 'blue',
          path: admissionsUrls.student.meritList,
        },
        {
          title: 'Admission Offer',
          description: 'Accept/Reject offer',
          icon: 'mail',
          colorScheme: 'indigo',
          path: admissionsUrls.student.offer,
        },
        {
          title: 'Admission Letter',
          description: 'Download admission letter',
          icon: 'download',
          colorScheme: 'purple',
          path: admissionsUrls.student.admissionLetter,
        },
      ]}
    />
  );
}
