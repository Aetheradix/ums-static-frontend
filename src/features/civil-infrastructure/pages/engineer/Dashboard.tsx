import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { civilWorks as initialWorks, milestones as initialMilestones, progressLogs, qualityTests, mbEntries } from '../../mocks';
import { civilUrls } from '../../urls';
import '../civil.css';

const QUICK_ACTIONS = [
  { label: 'SOR Master',          icon: 'list',       path: civilUrls.sorMaster },
  { label: 'BOQ Compilation',     icon: 'file-edit',  path: civilUrls.boqCompilation },
  { label: 'Update Progress',     icon: 'map-marker', path: civilUrls.progressMonitoring },
  { label: 'E-MB Entry',          icon: 'book',       path: civilUrls.eMeasurementBook },
  { label: 'Quality Tests',       icon: 'check-square', path: civilUrls.qualityTesting },
  { label: 'EOT Request',         icon: 'calendar-plus', path: civilUrls.eotRequest },
];

export default function EngineerDashboard() {
  const navigate = useNavigate();

  const [works] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_works');
    return saved ? JSON.parse(saved) : initialWorks;
  });

  const [milestones] = useState<any[]>(() => {
    const saved = localStorage.getItem('civil_milestones');
    return saved ? JSON.parse(saved) : initialMilestones;
  });

  const myWorks = works.filter((w: any) => ['In Progress', 'Work Order Issued', 'Tender Awarded'].includes(w.status));
  const pendingMilestones = milestones.filter((m: any) => m.status === 'Pending' || m.status === 'In Progress');
  const pendingTests = qualityTests.filter((t: any) => t.result === 'Pending');
  const pendingMBs = mbEntries.filter((m: any) => m.status === 'Draft' || m.status === 'Submitted');

  return (
    <FormPage
      title="Site Engineer / JE — Dashboard"
      description="Your active assignments: field progress, E-MB entries, quality testing, and milestone sign-offs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Civil Infrastructure', to: civilUrls.engineerPortal },
        { label: 'Engineer Dashboard' },
      ]}
    >
      {/* Action Center */}
      <div className="civil-action-center">
        <div className="civil-action-header">
          <i className="pi pi-info-circle" />
          <span>My Pending Tasks</span>
        </div>
        <div className="civil-action-grid">
          {[
            { label: 'Active Works', value: myWorks.length, icon: 'building', cls: 'blue', path: civilUrls.progressMonitoring },
            { label: 'Pending Milestones', value: pendingMilestones.length, icon: 'calendar-minus', cls: 'amber', path: civilUrls.milestoneSignoff },
            { label: 'Quality Tests Pending', value: pendingTests.length, icon: 'check-square', cls: 'purple', path: civilUrls.qualityTesting },
            { label: 'MB Drafts / Submitted', value: pendingMBs.length, icon: 'book', cls: 'green', path: civilUrls.eMeasurementBook },
          ].map(a => (
            <div key={a.label} className="civil-action-card" onClick={() => navigate(a.path)}>
              <div className={`civil-action-icon ${a.cls}`}><i className={`pi pi-${a.icon}`} /></div>
              <div>
                <div className="civil-action-value">{a.value}</div>
                <div className="civil-action-label">{a.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="civil-stats-grid">
        <StatCard title="My Active Works" value={String(myWorks.length)} icon="engineering" colorScheme="blue" />
        <StatCard title="MB Entries This Month" value={String(mbEntries.length)} icon="book" colorScheme="teal" subtitle="E-Measurement Book" />
        <StatCard title="Milestones Completed" value={String(milestones.filter((m: any) => m.status === 'Completed').length)} icon="flag" colorScheme="green" />
        <StatCard title="Quality Tests Filed" value={String(qualityTests.length)} icon="science" colorScheme="purple" />
      </div>

      <div className="civil-bottom-row">
        {/* My Active Works */}
        <FormCard title="My Assigned Works" subtitle="Works where you are Site Engineer / JE">
          <table className="civil-table">
            <thead>
              <tr>
                <th>Work ID</th>
                <th>Name</th>
                <th>Work Type</th>
                <th>Category</th>
                <th>Work Basis</th>
                <th>Progress</th>
                <th>Next Milestone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myWorks.map((w: any) => {
                const nextM = milestones.find((m: any) => m.workId === w.id && (m.status === 'Pending' || m.status === 'In Progress'));
                const pct = w.physicalProgress;
                return (
                  <tr key={w.id}>
                    <td><span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.75rem', color: '#1d4ed8' }}>{w.workId}</span></td>
                    <td style={{ maxWidth: 150 }}>{w.name}</td>
                    <td><span style={{ fontSize: '0.75rem' }}>{w.category}</span></td>
                    <td><span style={{ fontSize: '0.75rem' }}>{w.department}</span></td>
                    <td><span className={`civil-pill ${w.workBasis === 'BOQ Based' ? 'purple' : 'blue'}`} style={{ fontSize: '0.65rem' }}>{w.workBasis ?? 'SOR Based'}</span></td>
                    <td>
                      <div className="civil-progress-bar-wrap">
                        <div className="civil-progress-bar-track">
                          <div className={`civil-progress-bar-fill ${pct >= 75 ? 'high' : pct >= 40 ? 'medium' : 'low'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#6b7280', width: 28 }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: '#6b7280' }}>{nextM?.milestoneName ?? '—'}</td>
                    <td><span className={`civil-pill ${w.status === 'In Progress' ? 'blue' : 'amber'}`}>{w.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </FormCard>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <FormCard title="Quick Actions">
            <div className="civil-quick-actions">
              {QUICK_ACTIONS.map(a => (
                <button key={a.label} type="button" className="civil-quick-btn" onClick={() => navigate(a.path)}>
                  <i className={`pi pi-${a.icon}`} />
                  {a.label}
                </button>
              ))}
            </div>
          </FormCard>

          <FormCard title="Recent Field Logs">
            {progressLogs.slice(0, 3).map(log => (
              <div key={log.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{works.find((w: any) => w.id === log.workId)?.workId}</span>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{log.logDate}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.4 }}>{log.description.substring(0, 90)}...</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <span style={{ fontSize: '0.65rem', color: '#2563eb' }}>📍 {log.geoLatitude}, {log.geoLongitude}</span>
                  <span style={{ fontSize: '0.65rem', color: '#16a34a' }}>📷 {log.photoCount} photos</span>
                </div>
              </div>
            ))}
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
