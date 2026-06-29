import { PortalSelector } from 'shared/new-components';
import { dbtUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Portal — Scholarship & DBT"
      moduleDescription="Apply for scholarships, track your applications and direct benefit transfers."
      backPath={dbtUrls.portal}
      backLabel="Scholarship & DBT"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Active scholarships, application stats, recent activity and quick actions.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: dbtUrls.student.dashboard,
        },
        {
          title: 'Available Schemes',
          description:
            'Browse Central, State, University and private scholarship schemes.',
          icon: 'card_giftcard',
          colorScheme: 'green',
          path: dbtUrls.student.schemes,
        },
        {
          title: 'Apply Scholarship',
          description:
            'Submit a new scholarship application with personal, academic and bank details.',
          icon: 'edit_note',
          colorScheme: 'purple',
          path: dbtUrls.student.apply,
        },
        {
          title: 'Upload Documents',
          description:
            'Upload and manage required documents for your scholarship application.',
          icon: 'upload_file',
          colorScheme: 'teal',
          path: dbtUrls.student.documents,
        },
        {
          title: 'Aadhaar & Bank Verification',
          description:
            'Verify Aadhaar identity and bank account via NPCI seeding status.',
          icon: 'verified_user',
          colorScheme: 'indigo',
          path: dbtUrls.student.aadhaarBank,
        },
        {
          title: 'Bonafide Certificate',
          description:
            'Request and download your bonafide certificate for scholarship purposes.',
          icon: 'badge',
          colorScheme: 'orange',
          path: dbtUrls.student.bonafide,
        },
        {
          title: 'Application Preview',
          description:
            'Review your complete filled application before final submission.',
          icon: 'preview',
          colorScheme: 'amber',
          path: dbtUrls.student.preview,
        },
        {
          title: 'Track Application',
          description:
            'Follow the full approval timeline of your submitted scholarship application.',
          icon: 'track_changes',
          colorScheme: 'blue',
          path: dbtUrls.student.track,
        },
        {
          title: 'Scholarship History',
          description:
            'View all your previous scholarship applications and outcomes.',
          icon: 'history',
          colorScheme: 'gray',
          path: dbtUrls.student.history,
        },
        {
          title: 'DBT Payment History',
          description:
            'View direct benefit transfer payment status and download receipts.',
          icon: 'account_balance_wallet',
          colorScheme: 'green',
          path: dbtUrls.student.dbtPayments,
        },
        {
          title: 'Notifications',
          description:
            'View all alerts, portal messages and government notifications.',
          icon: 'notifications',
          colorScheme: 'red',
          path: dbtUrls.student.notifications,
        },
        {
          title: 'Raise Grievance',
          description: 'Raise a support ticket for scholarship-related issues.',
          icon: 'report_problem',
          colorScheme: 'pink',
          path: dbtUrls.student.grievance,
        },
        {
          title: 'Downloads',
          description:
            'Download bonafide, approval letters, certificates and payment receipts.',
          icon: 'download',
          colorScheme: 'teal',
          path: dbtUrls.student.downloads,
        },
      ]}
    />
  );
}
