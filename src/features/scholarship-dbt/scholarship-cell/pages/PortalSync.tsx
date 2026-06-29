import { useState } from 'react';
import { ToastService } from 'services';
import { FormCard, FormPage } from 'shared/new-components';
import { govtPortals, syncLogs } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function CellPortalSync() {
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleSync = (portalId: string, name: string) => {
    setSyncing(portalId);
    setTimeout(() => {
      setSyncing(null);
      ToastService.success(`${name} sync completed successfully.`);
    }, 2000);
  };

  return (
    <FormPage
      title="Government Portal Sync"
      description="Sync scholarship data with NSP, State Portal, PFMS, NPCI, UIDAI, ABC and DigiLocker."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Scholarship Cell', to: dbtUrls.cell.portal },
        { label: 'Portal Sync' },
      ]}
    >
      {/* Portal Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {govtPortals.map(portal => (
          <div
            key={portal.id}
            style={{
              padding: '1rem',
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              background: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: portal.color + '1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: portal.color,
                    }}
                  >
                    {portal.acronym.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: '#111827',
                    }}
                  >
                    {portal.acronym}
                  </p>
                  <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                    {portal.type}
                  </p>
                </div>
              </div>
              <span
                className={`dbt-status-pill ${portal.status.toLowerCase()}`}
              >
                {portal.status}
              </span>
            </div>

            <p
              style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '0.625rem',
              }}
            >
              {portal.name}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.375rem',
                marginBottom: '0.875rem',
              }}
            >
              <div
                style={{
                  padding: '0.375rem',
                  background: '#f9fafb',
                  borderRadius: 4,
                }}
              >
                <p style={{ fontSize: '0.625rem', color: '#9ca3af' }}>Synced</p>
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#16a34a',
                  }}
                >
                  {portal.totalSynced}
                </p>
              </div>
              <div
                style={{
                  padding: '0.375rem',
                  background: '#fef2f2',
                  borderRadius: 4,
                }}
              >
                <p style={{ fontSize: '0.625rem', color: '#9ca3af' }}>Failed</p>
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: portal.failedCount > 0 ? '#b91c1c' : '#6b7280',
                  }}
                >
                  {portal.failedCount}
                </p>
              </div>
            </div>

            <p
              style={{
                fontSize: '0.688rem',
                color: '#9ca3af',
                marginBottom: '0.625rem',
              }}
            >
              Last: {portal.lastSync}
            </p>

            <button
              type="button"
              onClick={() => handleSync(portal.id, portal.name)}
              disabled={syncing === portal.id || portal.status === 'Inactive'}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: 6,
                border: 'none',
                background: syncing === portal.id ? '#f3f4f6' : portal.color,
                color: syncing === portal.id ? '#9ca3af' : '#fff',
                fontSize: '0.813rem',
                fontWeight: 600,
                cursor: syncing === portal.id ? 'not-allowed' : 'pointer',
              }}
            >
              {syncing === portal.id ? 'Syncing…' : 'Sync Now'}
            </button>
          </div>
        ))}
      </div>

      {/* Sync History */}
      <FormCard title="Recent Sync Logs">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>Portal</th>
                <th>Action</th>
                <th>Status</th>
                <th>Records</th>
                <th>Timestamp</th>
                <th>By</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {syncLogs.map(log => (
                <tr key={log.id}>
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
                  <td style={{ fontSize: '0.75rem', color: '#b91c1c' }}>
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
