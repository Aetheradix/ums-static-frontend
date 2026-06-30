import { useState } from 'react';
import { ToastService } from 'services';
import '../Thesis.css';

interface Integration {
  id: string;
  name: string;
  type: 'Internal ERP Module' | 'External Database';
  status: 'Connected' | 'Error' | 'Disconnected';
  lastSync: string;
  health: string;
  latency: string;
  logs: string[];
}

export const IntegrationsPanel: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'turnitin',
      name: 'Turnitin similarity Engine',
      type: 'External Database',
      status: 'Connected',
      lastSync: '30 Jun 2026 09:15 AM',
      health: '99.8%',
      latency: '240ms',
      logs: [
        'API Call: /v3/similarity-check [Status 200]',
        'Callback received for report ID #TR-0891',
      ],
    },
    {
      id: 'ithenticate',
      name: 'iThenticate Journal Checker',
      type: 'External Database',
      status: 'Connected',
      lastSync: '30 Jun 2026 07:12 AM',
      health: '99.9%',
      latency: '190ms',
      logs: ['API Call: /v2/check-doc [Status 200]'],
    },
    {
      id: 'orcid',
      name: 'ORCID Registry API',
      type: 'External Database',
      status: 'Connected',
      lastSync: '30 Jun 2026 10:30 AM',
      health: '100%',
      latency: '120ms',
      logs: [
        'Token refresh successful',
        'Synced scholar publications count: 4',
      ],
    },
    {
      id: 'gscholar',
      name: 'Google Scholar scraper',
      type: 'External Database',
      status: 'Connected',
      lastSync: '29 Jun 2026 23:45 PM',
      health: '94.2%',
      latency: '680ms',
      logs: ['Scrape request initiated for author Rajesh Kumar Sahu'],
    },
    {
      id: 'shodhganga',
      name: 'Shodhganga Repository Push',
      type: 'External Database',
      status: 'Error',
      lastSync: '28 Jun 2026 04:00 AM',
      health: '85.4%',
      latency: '1200ms',
      logs: [
        'Socket timeout during multipart upload',
        'Error: Shodhganga FTP host unreachable',
      ],
    },
    {
      id: 'inflibnet',
      name: 'INFLIBNET Indexing Engine',
      type: 'External Database',
      status: 'Connected',
      lastSync: '30 Jun 2026 02:30 AM',
      health: '99.5%',
      latency: '350ms',
      logs: ['Metadata sync completed for 12 records'],
    },
    {
      id: 'doi',
      name: 'Crossref DOI Generator',
      type: 'External Database',
      status: 'Connected',
      lastSync: '30 Jun 2026 05:00 AM',
      health: '99.0%',
      latency: '280ms',
      logs: ['DOI registered: 10.2112/davv.thesis.2026.0891'],
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook/Teams sync',
      type: 'External Database',
      status: 'Connected',
      lastSync: '30 Jun 2026 11:00 AM',
      health: '100%',
      latency: '85ms',
      logs: ['Calendar invite dispatched to external jury chair'],
    },
    {
      id: 'sis',
      name: 'Student Information System (SIS)',
      type: 'Internal ERP Module',
      status: 'Connected',
      lastSync: '30 Jun 2026 11:15 AM',
      health: '100%',
      latency: '5ms',
      logs: ['Fetched student registration state for Sahu'],
    },
    {
      id: 'admissions',
      name: 'Admission & Fee mapping System',
      type: 'Internal ERP Module',
      status: 'Connected',
      lastSync: '30 Jun 2026 10:00 AM',
      health: '100%',
      latency: '8ms',
      logs: ['Fee status read: Outstanding Academic Dues = 0'],
    },
    {
      id: 'academics',
      name: 'Academic Course credits API',
      type: 'Internal ERP Module',
      status: 'Connected',
      lastSync: '30 Jun 2026 10:30 AM',
      health: '100%',
      latency: '12ms',
      logs: ['Coursework credits verified: 12 / 12 credits'],
    },
    {
      id: 'exams',
      name: 'Examination Gradebook register',
      type: 'Internal ERP Module',
      status: 'Connected',
      lastSync: '30 Jun 2026 11:00 AM',
      health: '100%',
      latency: '10ms',
      logs: ['Verified Coursework Exam Grade card: Completed'],
    },
    {
      id: 'faculty',
      name: 'Faculty Load & Workload matrix',
      type: 'Internal ERP Module',
      status: 'Connected',
      lastSync: '30 Jun 2026 09:00 AM',
      health: '100%',
      latency: '6ms',
      logs: ['Supervisor advisory count read successful'],
    },
  ]);

  const [activeLog, setActiveLog] = useState<string | null>(null);

  const handleRetry = (id: string) => {
    ToastService.success(
      `Connection request resent to ${id}. Sync in progress...`
    );
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: 'Connected',
            lastSync: 'Just now',
            latency: '210ms',
            logs: [
              'Retrying endpoint...',
              'Connection re-established successfully!',
              ...item.logs,
            ],
          };
        }
        return item;
      })
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="thesis-integration-grid">
        {integrations.map(int => (
          <div
            key={int.id}
            className="thesis-integration-card"
            style={{
              borderLeft: `4px solid ${int.status === 'Connected' ? '#10b981' : int.status === 'Error' ? '#ef4444' : '#6b7280'}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.5rem',
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#1f2937',
                  }}
                >
                  {int.name}
                </h4>
                <span
                  style={{
                    fontSize: '0.688rem',
                    color: '#9ca3af',
                    fontWeight: 600,
                  }}
                >
                  {int.type}
                </span>
              </div>
              <span
                className={`thesis-status-pill ${int.status.toLowerCase()}`}
              >
                {int.status}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                margin: '0.75rem 0',
                fontSize: '0.75rem',
                color: '#4b5563',
              }}
            >
              <div>
                Last Sync: <strong>{int.lastSync}</strong>
              </div>
              <div>
                API Health: <strong>{int.health}</strong>
              </div>
              <div>
                Latency: <strong>{int.latency}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleRetry(int.id)}
                style={{
                  flex: 1,
                  padding: '0.375rem',
                  border: '1px solid #3b82f6',
                  background: '#eff6ff',
                  color: '#2563eb',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🔄 Retry Sync
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveLog(activeLog === int.id ? null : int.id)
                }
                style={{
                  padding: '0.375rem 0.625rem',
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  color: '#4b5563',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                📄 {activeLog === int.id ? 'Hide Logs' : 'View Logs'}
              </button>
            </div>

            {activeLog === int.id && (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem',
                  background: '#fafafa',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  fontSize: '0.688rem',
                  maxHeight: 80,
                  overflowY: 'auto',
                }}
              >
                {int.logs.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      borderBottom: '1px dashed #f3f4f6',
                      paddingBottom: 2,
                      marginBottom: 2,
                    }}
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
