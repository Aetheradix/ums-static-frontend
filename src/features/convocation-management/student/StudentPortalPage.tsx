import { PortalSelector } from 'shared/new-components';
import { CONVOCATION_URLS } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Convocation Portal"
      moduleDescription="Register for the convocation, pay fees, and download your entry pass."
      backPath={CONVOCATION_URLS.PORTAL}
      backLabel="Back to Convocation Portal"
      portals={[
        {
          title: 'Dashboard',
          description: 'View your convocation status and announcements.',
          icon: 'dashboard',
          colorScheme: 'indigo',
          path: CONVOCATION_URLS.STUDENT.DASHBOARD,
        },
        {
          title: 'Registration Form',
          description: 'Apply for the convocation and update your details.',
          icon: 'app_registration',
          colorScheme: 'indigo',
          path: CONVOCATION_URLS.STUDENT.REGISTRATION,
        },
        {
          title: 'Convocation Pass',
          description: 'Download your QR-coded entry pass for the ceremony.',
          icon: 'qr_code_2',
          colorScheme: 'indigo',
          path: CONVOCATION_URLS.STUDENT.PASS,
        },
      ]}
    />
  );
}
