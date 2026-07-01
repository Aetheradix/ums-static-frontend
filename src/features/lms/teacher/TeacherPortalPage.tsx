import { PortalSelector } from 'shared/new-components';
import { learningUrls } from '../urls';

export default function TeacherPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Teacher Portal — Learning Management"
      moduleDescription="Manage your courses, content uploads, assessments, student progress and certifications."
      backPath={learningUrls.portal}
      backLabel="Learning Management System"
      portals={[
        {
          title: 'Dashboard',
          description: 'Overview of assigned courses, students, and grading activities.',
          icon: 'dashboard',
          colorScheme: 'green',
          path: learningUrls.teacher.dashboard,
        },
        {
          title: 'Content Management',
          description: 'Manage modules, topics, and upload videos/PDFs/notes/PPTs.',
          icon: 'library_books',
          colorScheme: 'indigo',
          path: learningUrls.teacher.content,
        },
        {
          title: 'Assessment Management',
          description: 'Create quizzes, assign assignments, evaluate and publish results.',
          icon: 'quiz',
          colorScheme: 'orange',
          path: learningUrls.teacher.assessment,
        },
        {
          title: 'Progress Tracking',
          description: 'Monitor student progress, module completion status, and analytics.',
          icon: 'trending_up',
          colorScheme: 'teal',
          path: learningUrls.teacher.progress,
        },
        {
          title: 'Certificate',
          description: 'View eligible students, recommend certificates and check status.',
          icon: 'workspace_premium',
          colorScheme: 'amber',
          path: learningUrls.teacher.certificate,
        },
        {
          title: 'Reports',
          description: 'Generate course progress, student performance, and quiz/assignment reports.',
          icon: 'bar_chart',
          colorScheme: 'blue',
          path: learningUrls.teacher.reports,
        },
      ]}
    />
  );
}
