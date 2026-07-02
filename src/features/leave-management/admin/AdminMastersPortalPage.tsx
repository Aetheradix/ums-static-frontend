import { PortalSelector } from 'shared/new-components';
import { lmsUrls } from '../urls';

export default function AdminMastersPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Masters — Leave Management"
      moduleDescription="Manage master configurations for leaves, policies, workflows and calendars."
      backPath={lmsUrls.admin.portal}
      backLabel="Admin Portal"
      portals={[
        {
          title: 'Leave Types',
          description: 'Create and manage leave type masters.',
          icon: 'category',
          colorScheme: 'purple',
          path: lmsUrls.admin.leaveTypes,
        },
        {
          title: 'Leave Policy',
          description: 'Configure department-wise leave policies.',
          icon: 'description',
          colorScheme: 'teal',
          path: lmsUrls.admin.leavePolicy,
        },
        {
          title: 'Approval Hierarchy',
          description: 'Set up multi-level approval workflows.',
          icon: 'account_tree',
          colorScheme: 'orange',
          path: lmsUrls.admin.approvalHierarchy,
        },
        {
          title: 'Academic Calendar',
          description: 'Manage working days, holidays and exam schedules.',
          icon: 'event',
          colorScheme: 'indigo',
          path: lmsUrls.admin.academicCalendar,
        },
      ]}
    />
  );
}
