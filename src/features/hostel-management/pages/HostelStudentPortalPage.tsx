import { PortalSelector } from 'shared/new-components';

export default function HostelStudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Hostel Management — Student Portal"
      moduleDescription="Self-service hub for hostel residents — dashboard, gate passes, complaints, and mess menu."
      backPath="/hostel-management"
      backLabel="Hostel Management"
      portals={[
        {
          title: 'My Dashboard',
          description:
            "Overview of your room, roommate, pending actions, and today's mess menu.",
          icon: 'dashboard',
          colorScheme: 'blue',
          path: '/hostel-management/student-dashboard',
        },
        {
          title: 'Gate Pass & Leave',
          description:
            'Request gate passes, apply for leave, and view your request history.',
          icon: 'exit_to_app',
          colorScheme: 'green',
          path: '/hostel-management/student-application/apply',
        },
        {
          title: 'Maintenance Complaints',
          description:
            'Raise new complaints, track ticket status, and provide feedback.',
          icon: 'build',
          colorScheme: 'orange',
          path: '/hostel-management/maintenance/requests',
        },
        {
          title: 'Mess Menu',
          description:
            "View this week's breakfast, lunch, snacks, and dinner menu.",
          icon: 'restaurant',
          colorScheme: 'purple',
          path: '/hostel-management/student-dashboard/mess-menu',
        },
      ]}
    />
  );
}
