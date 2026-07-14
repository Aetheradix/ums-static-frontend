import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function DepartmentOfficerPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Department Officer Portal — Grievance Management"
      moduleDescription="DAVV Indore — Under Process & New Grievance File Monitoring desk. Initiate and forward digital green notesheets."
      backPath={grvUrls.portal}
      backLabel="Grievance Management System"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Grievance statistics, active files counter, and status summary.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: grvUrls.departmentOfficer.dashboard,
        },
        {
          title: 'Complaint Inbox',
          description:
            'Access new and pending complaints, apply search/filters, and view details.',
          icon: 'inbox',
          colorScheme: 'green',
          path: grvUrls.departmentOfficer.inbox,
        },
      ]}
    />
  );
}
