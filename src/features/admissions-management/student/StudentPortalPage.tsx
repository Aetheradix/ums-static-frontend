import { PortalSelector } from 'shared/new-components';
import { admissionsUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Portal — Admissions"
      moduleDescription="Apply for admission, track your application, pay fees, and select subjects."
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
          description: 'Fill and submit your admission application form.',
          icon: 'assignment',
          colorScheme: 'indigo',
          path: admissionsUrls.student.apply,
        },
        {
          title: 'Application Status',
          description:
            'Track the current status of your admission application.',
          icon: 'track_changes',
          colorScheme: 'blue',
          path: admissionsUrls.student.status,
        },
        {
          title: 'Fee Payment',
          description: 'Pay your admission registration fee online.',
          icon: 'payments',
          colorScheme: 'green',
          path: admissionsUrls.student.feePayment,
        },
      ]}
    />
  );
}
