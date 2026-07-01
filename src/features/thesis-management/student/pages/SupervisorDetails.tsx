import { FormCard, FormPage } from 'shared/new-components';
import { scholars } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

const ME = scholars[0];

export default function SupervisorDetails() {
  const guides = [
    {
      role: 'Primary Guide',
      name: 'Dr. Sanjay Tanwani',
      designation: 'Professor & HOD',
      dept: 'School of Computer Science & IT',
      email: 'sanjay.tanwani@dauniv.ac.in',
      phone: '+91 9800001111',
      cabin: '#302, SCS Block',
      specialization: 'AI, NLP, Cloud Computing',
      publications: 87,
      phDStudents: 6,
      colorScheme: 'blue' as const,
    },
    {
      role: 'Co-Guide',
      name: 'Dr. Preeti Saxena',
      designation: 'Associate Professor',
      dept: 'School of Computer Science & IT',
      email: 'preeti.saxena@dauniv.ac.in',
      phone: '+91 9800002222',
      cabin: '#214, IT Block',
      specialization: 'Computer Vision, IoT, Deep Learning',
      publications: 54,
      phDStudents: 5,
      colorScheme: 'green' as const,
    },
  ];

  const colorMap: Record<
    string,
    { bg: string; border: string; badge: string }
  > = {
    blue: { bg: '#eff6ff', border: '#bfdbfe', badge: '#1e40af' },
    green: { bg: '#f0fdf4', border: '#bbf7d0', badge: '#166534' },
  };

  return (
    <FormPage
      title="Supervisor Details"
      description={`${ME.name} — Allocated Guide and Co-Guide details for your PhD research.`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Supervisor Details' },
      ]}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {guides.map((g, i) => {
          const colors = colorMap[g.colorScheme];
          return (
            <div
              key={i}
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: '1.5rem',
                background: colors.bg,
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
                <div>
                  <span
                    style={{
                      fontSize: '0.688rem',
                      fontWeight: 700,
                      color: colors.badge,
                      background: colors.border,
                      padding: '0.2rem 0.5rem',
                      borderRadius: 4,
                    }}
                  >
                    {g.role}
                  </span>
                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      color: '#1f2937',
                      marginTop: '0.5rem',
                    }}
                  >
                    {g.name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {g.designation}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {g.dept}
                  </p>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: colors.badge,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                  }}
                >
                  {g.name.charAt(0)}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.375rem',
                  fontSize: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#9ca3af', minWidth: 80 }}>Email:</span>
                  <a
                    href={`mailto:${g.email}`}
                    style={{ color: colors.badge, fontWeight: 600 }}
                  >
                    {g.email}
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#9ca3af', minWidth: 80 }}>Phone:</span>
                  <span style={{ color: '#374151', fontWeight: 600 }}>
                    {g.phone}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#9ca3af', minWidth: 80 }}>Cabin:</span>
                  <span style={{ color: '#374151', fontWeight: 600 }}>
                    {g.cabin}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: '#9ca3af', minWidth: 80 }}>
                    Domain:
                  </span>
                  <span style={{ color: '#374151', fontWeight: 600 }}>
                    {g.specialization}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: `1px solid ${colors.border}`,
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: colors.badge,
                    }}
                  >
                    {g.publications}
                  </p>
                  <p style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                    Publications
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: colors.badge,
                    }}
                  >
                    {g.phDStudents}
                  </p>
                  <p style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                    PhD Students
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <FormCard title="Recent Advisory Interactions">
        <table className="dbt-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Agenda</th>
              <th>Mode</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600 }}>25 Jun 2026</td>
              <td>Tokenizer benchmark analysis and methodology finalization</td>
              <td>
                <span className="dbt-status-pill approved">Offline</span>
              </td>
              <td style={{ color: '#16a34a', fontWeight: 600 }}>Logged ✓</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>10 Jun 2026</td>
              <td>Literature Review gaps identification</td>
              <td>
                <span className="dbt-status-pill submitted">Online</span>
              </td>
              <td style={{ color: '#16a34a', fontWeight: 600 }}>Logged ✓</td>
            </tr>
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
