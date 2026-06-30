import { PortalSelector } from 'shared/new-components';

export default function ReportsPortalPage() {
  return (
    <PortalSelector
      backPath="/transport-management"
      backLabel="Transport Management"
      moduleTitle="Reports & Analytics"
      moduleDescription="View and export transport management reports."
      portals={[
        {
          title: 'Vehicle Maintenance Report',
          description: 'View maintenance records and expenses.',
          path: '/transport-management/reports/maintenance-report',
          icon: 'summarize',
          colorScheme: 'teal',
        },
        {
          title: 'Gate Pass Report',
          description: 'View entry and exit logs of buses.',
          path: '/transport-management/reports/gate-pass-report',
          icon: 'history',
          colorScheme: 'teal',
        },
        {
          title: 'Driver/Attender Route Detail Report',
          description: 'Report showing staff assignments across routes.',
          path: '/transport-management/reports/driver-attender-route-detail',
          icon: 'format_list_numbered',
          colorScheme: 'teal',
        },
      ]}
    />
  );
}
