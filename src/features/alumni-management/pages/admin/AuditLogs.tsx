import { mockAuditLogs } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';

export default function AuditLogs() {
  const columns = [
    { field: 'id', header: 'Log ID' },
    { field: 'action', header: 'Action Performed' },
    { field: 'performedBy', header: 'Performed By' },
    { field: 'affectedRecord', header: 'Affected Record' },
    { field: 'timestamp', header: 'Timestamp' },
  ];

  return (
    <FormPage
      title="Audit Logs"
      description="Track all admin actions and system changes within the Alumni module"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Admin Portal', to: alumniUrls.admin.portal },
        { label: 'Audit Logs' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <GridPanel searchBox data={mockAuditLogs} columns={columns as any} />
        </div>
      </FormCard>
    </FormPage>
  );
}
