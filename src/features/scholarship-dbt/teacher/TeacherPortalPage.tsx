import { PortalSelector } from 'shared/new-components';
import { dbtUrls } from '../urls';

export default function TeacherPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Teacher Portal — Scholarship & DBT"
      moduleDescription="Verify student scholarship applications, validate attendance eligibility and academic records."
      backPath={dbtUrls.portal}
      backLabel="Scholarship & DBT"
      portals={[
        {
          title: 'Dashboard',
          description:
            "Pending verifications, approved/rejected counts and today's workload.",
          icon: 'dashboard',
          colorScheme: 'blue',
          path: dbtUrls.teacher.dashboard,
        },
        {
          title: 'Pending Verification',
          description:
            'Review and verify pending student scholarship applications.',
          icon: 'pending_actions',
          colorScheme: 'orange',
          path: dbtUrls.teacher.pending,
        },
        {
          title: 'Student Profile',
          description:
            "View student's full academic profile including CGPA, backlog and marks.",
          icon: 'person_search',
          colorScheme: 'purple',
          path: dbtUrls.teacher.studentProfile,
        },
        {
          title: 'Attendance Verification',
          description:
            'Verify student attendance percentage and scholarship eligibility.',
          icon: 'assignment_turned_in',
          colorScheme: 'green',
          path: dbtUrls.teacher.attendanceVerify,
        },
        {
          title: 'Academic Verification',
          description:
            'Validate academic performance, CGPA and internal marks.',
          icon: 'school',
          colorScheme: 'teal',
          path: dbtUrls.teacher.academicVerify,
        },
        {
          title: 'Document Verification',
          description: 'Preview and verify student uploaded documents.',
          icon: 'folder_open',
          colorScheme: 'indigo',
          path: dbtUrls.teacher.documentVerify,
        },
        {
          title: 'Verification History',
          description: 'View all previously verified scholarship applications.',
          icon: 'history',
          colorScheme: 'gray',
          path: dbtUrls.teacher.history,
        },
      ]}
    />
  );
}
