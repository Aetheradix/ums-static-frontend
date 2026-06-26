import { PortalSelector } from 'shared/new-components';
import { lmsUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Portal — Leave Management"
      moduleDescription="Apply for leave, track your attendance and biometric records."
      backPath={lmsUrls.portal}
      backLabel="Leave Management System"
      portals={[
        {
          title: 'Dashboard',
          description: 'Attendance %, leave balance, applied leaves and quick actions.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: lmsUrls.student.dashboard,
        },
        {
          title: 'Apply Leave',
          description: 'Submit a new leave application.',
          icon: 'edit',
          colorScheme: 'green',
          path: lmsUrls.student.applyLeave,
        },
        {
          title: 'My Leave',
          description: 'Track your leave applications and approvals.',
          icon: 'list',
          colorScheme: 'purple',
          path: lmsUrls.student.myLeave,
        },
        {
          title: 'Attendance',
          description: 'View your attendance calendar and percentage.',
          icon: 'calendar_month',
          colorScheme: 'teal',
          path: lmsUrls.student.attendance,
        },
        {
          title: 'Biometric',
          description: 'View your biometric punch history.',
          icon: 'fingerprint',
          colorScheme: 'orange',
          path: lmsUrls.student.biometric,
        },
        {
          title: 'Notifications',
          description: 'View leave status updates and alerts.',
          icon: 'notifications',
          colorScheme: 'indigo',
          path: lmsUrls.student.notifications,
        },
      ]}
    />
  );
}
