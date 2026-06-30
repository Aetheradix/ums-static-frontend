import { PortalSelector } from 'shared/new-components';
import { tdmUrls } from '../urls';

export default function FacultyPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Faculty Portal — Trainer Development"
      moduleDescription="Access your training programmes, competencies, certificates and performance records."
      backPath={tdmUrls.portal}
      backLabel="Trainer Development Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Your training overview, upcoming sessions, certificates and skill growth.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: tdmUrls.faculty.dashboard,
        },
        {
          title: 'My Trainings',
          description:
            'View upcoming, completed and cancelled training programmes.',
          icon: 'school',
          colorScheme: 'green',
          path: tdmUrls.faculty.myTrainings,
        },
        {
          title: 'Apply for Training',
          description: 'Browse and apply for available training programmes.',
          icon: 'add_circle',
          colorScheme: 'purple',
          path: tdmUrls.faculty.applyTraining,
        },
        {
          title: 'My Certificates',
          description: 'View, download and verify your training certificates.',
          icon: 'workspace_premium',
          colorScheme: 'amber',
          path: tdmUrls.faculty.myCertificates,
        },
        {
          title: 'Competencies & Skills',
          description:
            'Review your competency levels, skill gaps and development roadmap.',
          icon: 'psychology',
          colorScheme: 'teal',
          path: tdmUrls.faculty.competencies,
        },
        {
          title: 'Self Assessment',
          description:
            'Complete self-assessment for teaching, research and leadership skills.',
          icon: 'self_improvement',
          colorScheme: 'orange',
          path: tdmUrls.faculty.selfAssessment,
        },
        {
          title: 'My Attendance',
          description:
            'Track your training attendance and participation records.',
          icon: 'fact_check',
          colorScheme: 'indigo',
          path: tdmUrls.faculty.attendance,
        },
        {
          title: 'Submit Feedback',
          description:
            'Rate training sessions and provide feedback on content and trainer.',
          icon: 'rate_review',
          colorScheme: 'red',
          path: tdmUrls.faculty.feedback,
        },
        {
          title: 'My Profile',
          description:
            'View and update your academic profile, qualifications and achievements.',
          icon: 'person',
          colorScheme: 'gray',
          path: tdmUrls.faculty.profile,
        },
      ]}
    />
  );
}
