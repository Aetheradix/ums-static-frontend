import { useState } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { auditLogs } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Log = (typeof auditLogs)[0];

export default function AuditLogs() {
  const [list] = useState<Log[]>(auditLogs);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = list.filter(log => {
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusColor: Record<string, string> = {
    Success: 'approved',
    Failed: 'rejected',
    Warning: 'draft',
  };

  return (
    <FormPage
      title="System Audit Logs"
      description="View complete audit trail logs for Devi Ahilya Vishwavidyalaya research system operations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Audit Logs' },
      ]}
    >
      <FormCard title="Audit Logs Stream">
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              type="text"
              placeholder="Search logs by Action, Actor or Module..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: 6,
                fontSize: '0.813rem',
              }}
            />
          </div>
          <div>
            <select
              className="dbt-filter-select"
              style={{ height: 38 }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Warning">Warning</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action Performed</th>
                <th>Module Area</th>
                <th>Performed By</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id}>
                  <td
                    style={{
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      color: '#6b7280',
                    }}
                  >
                    {log.timestamp}
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '0.813rem' }}>
                    {log.action}
                  </td>
                  <td style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {log.module}
                  </td>
                  <td>
                    <div>
                      <p
                        style={{
                          fontSize: '0.813rem',
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        {log.performedBy}
                      </p>
                      <p
                        style={{
                          fontSize: '0.625rem',
                          color: '#9ca3af',
                          margin: 0,
                        }}
                      >
                        {log.role}
                      </p>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {log.ipAddress}
                  </td>
                  <td>
                    <span
                      className={`dbt-status-pill ${statusColor[log.status]}`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>
            No audit log matching filters found.
          </p>
        )}
      </FormCard>
    </FormPage>
  );
}
