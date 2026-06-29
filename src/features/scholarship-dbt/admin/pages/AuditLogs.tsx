import { FormCard, FormPage } from 'shared/new-components';
import { auditLogs } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function AdminAuditLogs() {
  return (
    <FormPage
      title="Audit Trail Logs"
      description="View full audit trail of administrative, verification, and payment transactions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Audit Logs' },
      ]}
    >
      <FormCard title="System Activity Trail">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Module</th>
                <th>Operator</th>
                <th>Role</th>
                <th>IP Address</th>
                <th>Timestamp</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 700 }}>{log.action}</td>
                  <td>{log.module}</td>
                  <td>{log.performedBy}</td>
                  <td>{log.role}</td>
                  <td style={{ fontFamily: 'monospace' }}>{log.ipAddress}</td>
                  <td>{log.timestamp}</td>
                  <td style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>
    </FormPage>
  );
}
