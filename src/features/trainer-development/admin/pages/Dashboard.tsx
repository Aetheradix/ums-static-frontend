import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import {
  approvalRequests,
  certificates,
  certificationStatus,
  departmentWiseTraining,
  monthlyTrainingTrend,
  trainingPrograms,
  trainers,
} from '../../mocks';
import { tdmUrls } from '../../urls';
import './Dashboard.css';

const completed = trainingPrograms.filter(t => t.status === 'Completed').length;
const ongoing = trainingPrograms.filter(t => t.status === 'Ongoing').length;
const scheduled = trainingPrograms.filter(t => t.status === 'Scheduled').length;
const planned = trainingPrograms.filter(t => t.status === 'Planned').length;
const pendingApprovals = approvalRequests.filter(a => a.status === 'Pending').length;
const issuedCerts = certificates.filter(c => c.status === 'Issued').length;
const expiredCerts = certificates.filter(c => c.status === 'Expired').length;
const activeTrainers = trainers.filter(t => t.status === 'Active').length;
const maxDept = Math.max(...departmentWiseTraining.map(d => d.count));
const maxMonthly = Math.max(...monthlyTrainingTrend.map(m => Math.max(m.offline, m.online, m.hybrid)));

const QUICK_ACTIONS = [
  { label: 'Register Trainer', icon: 'user-plus', path: tdmUrls.admin.trainerRegistration },
  { label: 'Plan Training', icon: 'calendar-plus', path: tdmUrls.admin.trainingPlanning },
  { label: 'Issue Certificate', icon: 'certificate', path: tdmUrls.admin.certificates },
  { label: 'Competency Map', icon: 'sitemap', path: tdmUrls.admin.competencyMapping },
  { label: 'View Reports', icon: 'chart-bar', path: tdmUrls.admin.reports },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Trainer Development Dashboard"
      description="Overview of training programmes, competency development and certification analytics."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI Row 1 */}
      <div className="tdm-dashboard-stats">
        <StatCard title="Active Trainers" value={activeTrainers} icon="groups" colorScheme="blue" subtitle="Internal & External" />
        <StatCard title="Completed Trainings" value={completed} icon="check_circle" colorScheme="green" subtitle="This academic year" trend={{ value: 18, direction: 'up', label: 'vs last year' }} />
        <StatCard title="Ongoing Sessions" value={ongoing} icon="play_circle" colorScheme="orange" subtitle="Currently running" />
        <StatCard title="Pending Approvals" value={pendingApprovals} icon="pending_actions" colorScheme="red" subtitle="Awaiting action" />
      </div>

      {/* KPI Row 2 */}
      <div className="tdm-dashboard-stats-2">
        <StatCard title="Certificates Issued" value={issuedCerts} icon="workspace_premium" colorScheme="purple" subtitle="Total this year" />
        <StatCard title="Upcoming Trainings" value={scheduled + planned} icon="event" colorScheme="teal" subtitle="Planned & Scheduled" />
        <StatCard title="Expired Certifications" value={expiredCerts} icon="warning" colorScheme="amber" subtitle="Renewal required" />
        <StatCard title="Competency Gaps" value="23" icon="psychology" colorScheme="red" subtitle="Across departments" />
      </div>

      {/* Charts Row 1 */}
      <div className="tdm-charts-row">
        {/* Monthly Training Trend */}
        <FormCard title="Monthly Training Trend" subtitle="Offline vs Online vs Hybrid">
          <div className="tdm-trend-chart">
            {monthlyTrainingTrend.map(m => (
              <div key={m.month} className="tdm-trend-col">
                <div className="tdm-trend-bars">
                  <div className="tdm-trend-bar" style={{ height: `${(m.offline / maxMonthly) * 100}px`, background: '#3b82f6' }} />
                  <div className="tdm-trend-bar" style={{ height: `${(m.online / maxMonthly) * 100}px`, background: '#8b5cf6' }} />
                  <div className="tdm-trend-bar" style={{ height: `${(m.hybrid / maxMonthly) * 100}px`, background: '#10b981' }} />
                </div>
                <span className="tdm-trend-month">{m.month}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {[['#3b82f6', 'Offline'], ['#8b5cf6', 'Online'], ['#10b981', 'Hybrid']].map(([color, label]) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#6b7280' }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: color as string, display: 'inline-block' }} />{label}
              </span>
            ))}
          </div>
        </FormCard>

        {/* Department Wise */}
        <FormCard title="Department-wise Training Count">
          {departmentWiseTraining.map(d => (
            <div key={d.dept} className="tdm-bar-row">
              <span className="tdm-bar-label">{d.dept}</span>
              <div className="tdm-bar-track">
                <div className="tdm-bar-fill" style={{ width: `${(d.count / maxDept) * 100}%`, background: d.color }} />
              </div>
              <span className="tdm-bar-value">{d.count}</span>
            </div>
          ))}
        </FormCard>
      </div>

      {/* Charts Row 2 */}
      <div className="tdm-charts-row">
        {/* Certification Status */}
        <FormCard title="Certification Status Distribution">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {certificationStatus.map(c => (
              <div key={c.label} className="tdm-dist-row">
                <span className="tdm-dist-dot" style={{ background: c.color }} />
                <span className="tdm-dist-label">{c.label}</span>
                <div className="tdm-dist-track">
                  <div className="tdm-dist-fill" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
                <span className="tdm-dist-count">{c.count}</span>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Quick Actions */}
        <FormCard title="Quick Actions">
          <div className="tdm-quick-actions">
            {QUICK_ACTIONS.map(a => (
              <button key={a.label} type="button" className="tdm-quick-action-btn" onClick={() => navigate(a.path)}>
                <i className={`pi pi-${a.icon}`} />{a.label}
              </button>
            ))}
            <button type="button" className="tdm-quick-action-btn" onClick={() => navigate(tdmUrls.admin.attendance)}>
              <i className="pi pi-check-square" />Attendance
            </button>
            <button type="button" className="tdm-quick-action-btn" onClick={() => navigate(tdmUrls.admin.approvalWorkflow)}>
              <i className="pi pi-inbox" />Approvals ({pendingApprovals})
            </button>
          </div>
        </FormCard>
      </div>

      {/* Bottom Row */}
      <div className="tdm-bottom-row">
        {/* Recent Training Programs */}
        <FormCard title="Recent Training Programmes">
          <div style={{ overflowX: 'auto' }}>
            <table className="tdm-table">
              <thead>
                <tr>
                  <th>Training ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Mode</th>
                  <th>Trainer</th>
                  <th>Participants</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {trainingPrograms.slice(0, 8).map(t => (
                  <tr key={t.id}>
                    <td style={{ color: '#6b7280' }}>{t.trainingId}</td>
                    <td style={{ fontWeight: 600, maxWidth: '14rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</td>
                    <td>{t.type}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 9999, fontSize: '0.688rem', fontWeight: 600, background: t.mode === 'Online' ? '#dbeafe' : t.mode === 'Offline' ? '#dcfce7' : '#f3e8ff', color: t.mode === 'Online' ? '#1d4ed8' : t.mode === 'Offline' ? '#15803d' : '#7c3aed' }}>
                        {t.mode}
                      </span>
                    </td>
                    <td style={{ color: '#6b7280', fontSize: '0.75rem' }}>{t.trainer.split(' ').slice(0, 2).join(' ')}</td>
                    <td>{t.registeredCount}/{t.maxParticipants}</td>
                    <td><span className={`tdm-status-pill ${t.status.toLowerCase()}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        {/* Pending Approvals */}
        <FormCard title="Pending Approvals">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {approvalRequests.filter(a => a.status === 'Pending').map(a => (
              <div key={a.id} style={{ padding: '0.625rem', borderRadius: 8, border: '1px solid #f3f4f6', background: '#fafafa' }}>
                <p style={{ fontSize: '0.813rem', fontWeight: 600, color: '#111827', marginBottom: 2 }}>{a.title}</p>
                <p style={{ fontSize: '0.688rem', color: '#9ca3af', marginBottom: 4 }}>{a.type} • {a.requestedDate}</p>
                <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>Approver: <strong>{a.currentApprover}</strong></p>
                {a.amount && <p style={{ fontSize: '0.688rem', color: '#f59e0b', fontWeight: 600 }}>₹{a.amount.toLocaleString()}</p>}
              </div>
            ))}
            <button
              type="button"
              onClick={() => navigate(tdmUrls.admin.approvalWorkflow)}
              style={{ marginTop: 4, fontSize: '0.75rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
            >
              View all approvals →
            </button>
          </div>
        </FormCard>
      </div>

      {/* Training Calendar */}
      <div style={{ marginTop: '1.5rem' }}>
        <FormCard title="Training Calendar (Upcoming)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {trainingPrograms.slice(0, 4).map(p => (
               <div key={p.id} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                 <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.5rem', borderRadius: 8, textAlign: 'center', minWidth: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{p.startDate.split(' ')[1]}</div>
                   <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{p.startDate.split(' ')[0]}</div>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{p.title}</div>
                   <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>{p.trainer} • {p.mode}</div>
                 </div>
               </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
