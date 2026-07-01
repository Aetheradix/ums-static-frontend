import { PortalSelector } from 'shared/new-components';
import { learningUrls } from '../urls';

export default function StudentPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Student Portal — Learning Management"
      moduleDescription="Attend class lectures, download resources, attempt assessments and view your achievements."
      backPath={learningUrls.portal}
      backLabel="LMS Role Selection"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Access deadlines, latest materials, resume courses, and view learning achievements.',
          icon: 'dashboard',
          colorScheme: 'purple',
          path: learningUrls.student.dashboard,
        },
        {
          title: 'My Learning',
          description:
            'Workspace for accessing course video lectures, reading notes, and opening PDFs.',
          icon: 'local_library',
          colorScheme: 'indigo',
          path: learningUrls.student.myLearning,
        },
        {
          title: 'Assessments',
          description:
            'Take available quizzes and check your pending homework/assignment submissions.',
          icon: 'quiz',
          colorScheme: 'orange',
          path: learningUrls.student.assessments,
        },
        {
          title: 'Progress',
          description:
            'Detailed analysis of your course completion rate, module stats, and scores.',
          icon: 'trending_up',
          colorScheme: 'teal',
          path: learningUrls.student.progress,
        },
        {
          title: 'Certificates & Achievements',
          description:
            'Download verified course completion certificates and see collected badges.',
          icon: 'workspace_premium',
          colorScheme: 'amber',
          path: learningUrls.student.certificates,
        },
        {
          title: 'Reports',
          description:
            'Obtain assessment score cards, progress charts, and attendance summaries.',
          icon: 'bar_chart',
          colorScheme: 'blue',
          path: learningUrls.student.reports,
        },
      ]}
    />
  );
}
