import { PortalSelector } from 'shared/new-components';
import { feedbackUrls } from '../urls';

export default function FeedbackAdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Feedback Management"
      moduleDescription="Manage feedback sessions, templates, questions, assignments, and view analytics."
      backPath={feedbackUrls.portal}
      backLabel="Student Feedback Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'View stats, completion rates, and visual analytics.',
          icon: 'dashboard',
          colorScheme: 'indigo',
          path: feedbackUrls.admin.dashboard,
        },
        {
          title: 'Feedback Sessions',
          description:
            'Create, publish, close, and manage feedback collection sessions.',
          icon: 'assignment',
          colorScheme: 'blue',
          path: feedbackUrls.admin.sessions,
        },
        {
          title: 'Question Bank',
          description:
            'Manage questions, categories, and answer types for templates.',
          icon: 'quiz',
          colorScheme: 'green',
          path: feedbackUrls.admin.questionBank,
        },
        {
          title: 'Feedback Templates',
          description:
            'Create reusable question templates for feedback sessions.',
          icon: 'description',
          colorScheme: 'purple',
          path: feedbackUrls.admin.templates,
        },
        {
          title: 'Feedback Assignment',
          description:
            'Assign templates to courses, faculty, and student groups.',
          icon: 'assignment_ind',
          colorScheme: 'teal',
          path: feedbackUrls.admin.assignments,
        },
        {
          title: 'Student Responses',
          description: 'View and filter student feedback submissions.',
          icon: 'people',
          colorScheme: 'orange',
          path: feedbackUrls.admin.responses,
        },
        {
          title: 'Reports & Analytics',
          description: 'Analyze feedback data with charts and export options.',
          icon: 'bar_chart',
          colorScheme: 'red',
          path: feedbackUrls.admin.reports,
        },
        {
          title: 'Notifications',
          description:
            'Configure notification templates and delivery channels.',
          icon: 'notifications',
          colorScheme: 'amber',
          path: feedbackUrls.admin.notifications,
        },
        {
          title: 'Settings',
          description:
            'Configure feedback parameters and system-wide settings.',
          icon: 'settings',
          colorScheme: 'gray',
          path: feedbackUrls.admin.settings,
        },
      ]}
    />
  );
}
