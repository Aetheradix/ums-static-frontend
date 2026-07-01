import { FormCard, FormPage } from 'shared/new-components';
import { scholars } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function ScholarsList() {
  const statusColor: Record<string, string> = {
    Active: 'approved',
    Inactive: 'draft',
    Completed: 'submitted',
    Withdrawn: 'rejected',
  };

  return (
    <FormPage
      title="Scholars List"
      description="All research scholars assigned under your supervision with current status and contact details."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Supervisor Portal', to: thesisUrls.supervisor.portal },
        { label: 'Scholars List' },
      ]}
    >
      <FormCard title={`Assigned Scholars (${scholars.length})`}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {scholars.map(s => (
            <div
              key={s.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: '1.25rem',
                background: '#fff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.875rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        color: '#1f2937',
                      }}
                    >
                      {s.name}
                    </p>
                    <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                      {s.scholarId}
                    </p>
                  </div>
                </div>
                <span className={`dbt-status-pill ${statusColor[s.status]}`}>
                  {s.status}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  marginBottom: '0.875rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#9ca3af', minWidth: 80 }}>
                    Program:
                  </span>
                  <span style={{ color: '#374151', fontWeight: 600 }}>
                    {s.program}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#9ca3af', minWidth: 80 }}>
                    Domain:
                  </span>
                  <span style={{ color: '#374151', fontWeight: 600 }}>
                    {s.researchArea}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#9ca3af', minWidth: 80 }}>Phase:</span>
                  <span style={{ color: '#374151', fontWeight: 600 }}>
                    {s.phase}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#9ca3af', minWidth: 80 }}>Email:</span>
                  <a
                    href={`mailto:${s.email}`}
                    style={{ color: '#1e40af', fontWeight: 600 }}
                  >
                    {s.email}
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#9ca3af', minWidth: 80 }}>
                    Similarity:
                  </span>
                  <span
                    style={{
                      color: s.similarity <= 10 ? '#16a34a' : '#dc2626',
                      fontWeight: 700,
                    }}
                  >
                    {s.similarity}%
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#9ca3af', minWidth: 80 }}>
                    Reg. Date:
                  </span>
                  <span style={{ color: '#374151' }}>{s.registrationDate}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '0.375rem',
                    border: '1px solid #6366f1',
                    background: '#f5f3ff',
                    color: '#4f46e5',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  View Profile
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '0.375rem',
                    border: '1px solid #10b981',
                    background: '#f0fdf4',
                    color: '#059669',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  Log Meeting
                </button>
              </div>
            </div>
          ))}
        </div>
      </FormCard>
    </FormPage>
  );
}
