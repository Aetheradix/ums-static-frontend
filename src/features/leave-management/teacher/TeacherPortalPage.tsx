import { PortalSelector } from 'shared/new-components';
import { lmsUrls } from '../urls';

export default function TeacherPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Teacher Portal — Leave Management"
      moduleDescription="Manage your leave, attendance, biometric and student approvals."
      backPath={lmsUrls.portal}
      backLabel="Leave Management System"
      portals={[
        {
          title: 'Dashboard',
          description: 'Leave balance, attendance, biometric status and quick actions.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: lmsUrls.teacher.dashboard,
        },
        {
          title: 'Apply Leave',
          description: 'Submit a new leave application.',
          icon: 'edit',
          colorScheme: 'green',
          path: lmsUrls.teacher.applyLeave,
        },
        {
          title: 'My Applications',
          description: 'Track and manage your leave requests.',
          icon: 'assignment',
          colorScheme: 'purple',
          path: lmsUrls.teacher.myApplications,
        },
        {
          title: 'Student Leave Requests',
          description: 'Review and action student leave applications.',
          icon: 'school',
          colorScheme: 'orange',
          path: lmsUrls.teacher.studentRequests,
        },
        {
          title: 'Attendance',
          description: 'View your attendance calendar and summary.',
          icon: 'calendar_month',
          colorScheme: 'teal',
          path: lmsUrls.teacher.attendance,
        },
        {
          title: 'Biometric',
          description: 'View your biometric punch history.',
          icon: 'fingerprint',
          colorScheme: 'indigo',
          path: lmsUrls.teacher.biometric,
        },
        {
          title: 'Reports',
          description: 'View your leave and attendance reports.',
          icon: 'bar_chart',
          colorScheme: 'amber',
          path: lmsUrls.teacher.reports,
        },
      ]}
    />
  );
}
