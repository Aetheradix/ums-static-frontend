import { PortalSelector } from 'shared/new-components';
import { tpUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Portal — Training & Placement"
      moduleDescription="Browse opportunities and track your placement journey."
      backPath={tpUrls.root}
      backLabel="Training & Placement"
      portals={[
        {
          title: 'Dashboard',
          description: 'Overview of applications, alerts, and pending actions.',
          icon: 'dashboard',
          colorScheme: 'orange',
          path: tpUrls.student.dashboard,
        },
        {
          title: 'Registration',
          description: 'Complete your training and placement registration.',
          icon: 'how_to_reg',
          colorScheme: 'blue',
          path: tpUrls.student.registration,
        },
        {
          title: 'Available Seasons',
          description: 'Browse and apply for active placement seasons.',
          icon: 'event',
          colorScheme: 'teal',
          path: tpUrls.student.availableSeasons,
        },
        {
          title: 'Browse Jobs',
          description: 'Find and apply for internship and placement openings.',
          icon: 'work',
          colorScheme: 'green',
          path: tpUrls.student.jobs,
        },
        {
          title: 'My Applications',
          description: 'Track hiring status for all your applications.',
          icon: 'assignment',
          colorScheme: 'purple',
          path: tpUrls.student.myApplications,
        },
      ]}
    />
  );
}
