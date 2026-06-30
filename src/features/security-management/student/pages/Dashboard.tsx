// Student Dashboard — mirrors Employee Dashboard but with student role
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { helplines, awarenessPrograms, incidents } from '../../mocks';
import { smsUrls } from '../../urls';
import '../../super-admin/pages/Dashboard.css';

const MY_NAME = 'Amit Sharma';
const myIncidents = incidents.filter(i => i.reportedBy === MY_NAME);

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="My Security Dashboard"
      description="Track your reported incidents, access emergency contacts and upcoming programs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Student Portal', to: smsUrls.student.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="sms-dashboard-stats">
        <StatCard title="My Incidents" value={myIncidents.length} icon="report_problem" colorScheme="blue" subtitle="Total reported" />
        <StatCard title="Pending Cases" value={myIncidents.filter(i => i.status !== 'Closed' && i.status !== 'Resolved').length} icon="pending_actions" colorScheme="orange" subtitle="Under processing" />
        <StatCard title="Resolved Cases" value={myIncidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length} icon="check_circle" colorScheme="green" subtitle="Completed" />
        <StatCard title="Emergency Contacts" value={helplines.filter(h => h.status === 'Active').length} icon="phone_in_talk" colorScheme="red" subtitle="Active helplines" />
      </div>

      <div className="sms-charts-row">
        <FormCard title="My Recent Incidents">
          {myIncidents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <i className="pi pi-shield" style={{ fontSize: '2rem', color: '#22c55e', display: 'block', marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>No incidents reported. Stay safe!</p>
            </div>
          ) : myIncidents.map(inc => (
            <div key={inc.id} style={{ padding: '0.625rem', border: '1px solid #f3f4f6', borderRadius: 8, marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.813rem', fontWeight: 600 }}>{inc.incidentId}</p>
                <span className={`sms-status-pill status-${inc.status.toLowerCase().replace(/ /g, '-')}`}>{inc.status}</span>
              </div>
              <p style={{ fontSize: '0.688rem', color: '#6b7280', marginTop: 2 }}>{inc.category} · {inc.reportedDate}</p>
            </div>
          ))}
          <button type="button" className="sms-view-all-btn" onClick={() => navigate(smsUrls.student.myIncidents)}>View All →</button>
        </FormCard>

        <FormCard title="Emergency Helplines">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {helplines.filter(h => h.status === 'Active').slice(0, 5).map(h => (
              <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="pi pi-phone" style={{ color: '#dc2626' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.813rem', fontWeight: 500 }}>{h.helplineName}</p>
                  <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>{h.contactNumber}</p>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="sms-view-all-btn" onClick={() => navigate(smsUrls.student.helplines)}>View All →</button>
        </FormCard>

        <FormCard title="Upcoming Programs">
          {awarenessPrograms.filter(p => p.status === 'Upcoming').map(p => (
            <div key={p.id} style={{ padding: '0.625rem', border: '1px solid #ede9fe', borderRadius: 8, marginBottom: '0.5rem', background: '#faf5ff' }}>
              <p style={{ fontSize: '0.813rem', fontWeight: 600, color: '#6d28d9' }}>{p.programName}</p>
              <p style={{ fontSize: '0.688rem', color: '#6b7280', marginTop: 2 }}>{p.date} · {p.venue}</p>
            </div>
          ))}
          <button type="button" className="sms-view-all-btn" onClick={() => navigate(smsUrls.student.awareness)}>View All →</button>
        </FormCard>
      </div>

      <FormCard title="Quick Actions">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Report Incident', icon: 'exclamation-triangle', path: smsUrls.student.reportIncident, color: '#ef4444' },
            { label: 'My Incidents', icon: 'list', path: smsUrls.student.myIncidents, color: '#3b82f6' },
            { label: 'Emergency Helplines', icon: 'phone', path: smsUrls.student.helplines, color: '#16a34a' },
            { label: 'Safety Guidelines', icon: 'book', path: smsUrls.student.guidelines, color: '#0891b2' },
            { label: 'Awareness Programs', icon: 'megaphone', path: smsUrls.student.awareness, color: '#7c3aed' },
          ].map(a => (
            <button key={a.label} type="button" onClick={() => navigate(a.path)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.25rem', border: '2px solid #f3f4f6', borderRadius: 12, background: 'white', cursor: 'pointer', minWidth: 120, transition: 'all 0.15s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = a.color; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#f3f4f6'; }}
            >
              <i className={`pi pi-${a.icon}`} style={{ fontSize: '1.5rem', color: a.color }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#374151' }}>{a.label}</span>
            </button>
          ))}
        </div>
      </FormCard>
    </FormPage>
  );
}
