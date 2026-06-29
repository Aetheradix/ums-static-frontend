import { PortalSelector } from 'shared/new-components';
import { learningUrls } from './urls';

export default function LearningPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Learning Management System"
      moduleDescription="Manage your courses, content, assessments and certifications."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Dashboard',
          description: 'Overview of learning progress and analytics.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: learningUrls.dashboard,
        },
        {
          title: 'Masters',
          description: 'Manage master data for courses and categories.',
          icon: 'category',
          colorScheme: 'purple',
          path: learningUrls.masters,
        },
        {
          title: 'Configuration',
          description: 'System configurations and settings.',
          icon: 'settings',
          colorScheme: 'gray',
          path: learningUrls.configuration,
        },
        {
          title: 'Content Management',
          description: 'Manage course content and materials.',
          icon: 'library_books',
          colorScheme: 'indigo',
          path: learningUrls.contentManagement,
        },
        {
          title: 'Assessment',
          description: 'Create and manage assessments and quizzes.',
          icon: 'quiz',
          colorScheme: 'orange',
          path: learningUrls.assessment,
        },
        {
          title: 'Progress Tracking',
          description: 'Track student progress and performance.',
          icon: 'trending_up',
          colorScheme: 'green',
          path: learningUrls.progressTracking,
        },
        {
          title: 'Certification',
          description: 'Manage certificates and awards.',
          icon: 'workspace_premium',
          colorScheme: 'amber',
          path: learningUrls.certification,
        },
      ]}
    />
  );
}
