import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function GrievanceCellPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Grievance Cell Portal — Administration"
      moduleDescription="DAVV Indore — Nodal cell management. Oversee all university complaints, coordinate committee reviews, and compile analytical reports."
      backPath={grvUrls.portal}
      backLabel="Grievance Management System"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Grievance statistics, active reviews, and closed counters.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: grvUrls.cell.dashboard,
        },
        {
          title: 'Complaint Management',
          description:
            'Access the list of all filed complaints, search/filters, and view details.',
          icon: 'manage_accounts',
          colorScheme: 'green',
          path: grvUrls.cell.management,
        },
        {
          title: 'Committee Review',
          description:
            'Coordinate review with statutory advisory panels, log member remarks, and recommendation letters.',
          icon: 'people',
          colorScheme: 'purple',
          path: grvUrls.cell.committee,
        },
        {
          title: 'Reports & Audits',
          description:
            'Analytical reports mapping category-wise, department-wise, monthly, and resolution metrics.',
          icon: 'analytics',
          colorScheme: 'indigo',
          path: grvUrls.cell.reports,
        },
      ]}
    />
  );
}
