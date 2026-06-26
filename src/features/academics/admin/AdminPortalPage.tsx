import { PortalSelector } from 'shared/new-components';
import { academicsUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Portal — Academics"
      moduleDescription="Manage all academic data and configurations."
      backPath={academicsUrls.portal}
      backLabel="Academic Management"
      portals={[
        {
          title: 'Dashboard',
          description: 'View KPIs, enrollment trends, and grade distributions.',
          icon: 'dashboard',
          colorScheme: 'indigo',
          path: academicsUrls.admin.dashboard,
        },
        {
          title: 'Programmes',
          description: 'Create and manage academic programmes.',
          icon: 'menu_book',
          colorScheme: 'blue',
          path: academicsUrls.admin.programmes,
        },
        {
          title: 'Courses',
          description: 'Add and configure courses for each programme.',
          icon: 'book',
          colorScheme: 'purple',
          path: academicsUrls.admin.courses,
        },
        {
          title: 'Student Enrollment',
          description: 'Enroll students into programmes and sections.',
          icon: 'how_to_reg',
          colorScheme: 'green',
          path: academicsUrls.admin.enrollment,
        },
        {
          title: 'Academic Sessions',
          description: 'Manage academic years and semester sessions.',
          icon: 'calendar_month',
          colorScheme: 'orange',
          path: academicsUrls.admin.academicSessions,
        },
        {
          title: 'Evaluation Components',
          description: 'Configure evaluation weightages and marks.',
          icon: 'assignment',
          colorScheme: 'red',
          path: academicsUrls.admin.evaluation,
        },
        {
          title: 'Grading Scales',
          description: 'Define grade letters, marks ranges and grade points.',
          icon: 'grade',
          colorScheme: 'teal',
          path: academicsUrls.admin.grading,
        },
      ]}
    />
  );
}
