import { FormCard, FormPage } from 'shared/new-components';
import { syncLogs } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function AdminPortalSyncLogs() {
  return (
    <FormPage
      title="Portal Sync Logs"
      description="View full history and logs of data synchronization with Government Portals."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Portal Sync Logs' },
      ]}
    >
      <FormCard title="Sync Operations History">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Portal Target</th>
                <th>Action Performed</th>
                <th>Status</th>
                <th>Records Transferred</th>
                <th>Timestamp</th>
                <th>Operator</th>
                <th>Error Details</th>
              </tr>
            </thead>
            <tbody>
              {syncLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td style={{ fontWeight: 700 }}>{log.portal}</td>
                  <td>{log.action}</td>
                  <td>
                    <span
                      className={`dbt-status-pill ${log.status.toLowerCase()}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td>{log.records}</td>
                  <td>{log.timestamp}</td>
                  <td>{log.initiatedBy}</td>
                  <td style={{ color: '#b91c1c', fontSize: '0.75rem' }}>
                    {log.errorMsg ?? '—'}
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
