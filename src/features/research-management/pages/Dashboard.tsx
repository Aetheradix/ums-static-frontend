import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useResearch } from '../context';
import '../research.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    projects,
    proposals,
    setProjects: _sp,
    disbursedLogs,
  } = useResearch();

  const pendingCount = useMemo(
    () => proposals.filter(p => p.status === 'Pending').length,
    [proposals]
  );
  const approvedCount = useMemo(
    () => proposals.filter(p => p.status === 'Approved').length,
    [proposals]
  );
  const activeGrantsTotal = useMemo(
    () => projects.reduce((acc, curr) => acc + curr.approvedBudget, 0),
    [projects]
  );
  const totalDisbursed = useMemo(
    () => projects.reduce((acc, curr) => acc + curr.disbursedFunds, 0),
    [projects]
  );
  const revisionDraftsCount = useMemo(
    () => proposals.filter(p => p.status === 'Sent Back').length,
    [proposals]
  );

  void _sp;
  void disbursedLogs;

  const getStatusClass = (status: string) => {
    if (status === 'Approved') return 'rm-badge--approved';
    if (status === 'Pending') return 'rm-badge--pending';
    if (status === 'Sent Back') return 'rm-badge--sent-back';
    return 'rm-badge--rejected';
  };

  return (
    <FormPage
      title="Research & Grants Dashboard"
      description="Integrated overview of active projects, proposals queue, and disbursement status"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Research Management', to: '/research-management/dashboard' },
        { label: 'Dashboard' },
      ]}
    >
      <div className="space-y-6">
        {/* Hero */}
        <div className="rm-hero">
          <div className="rm-hero-content">
            <h2 className="rm-hero-title">Research & Grants Command Centre</h2>
            <p className="rm-hero-desc">
              Monitor funded projects, review proposal compliance queues, and
              manage milestone-based disbursement authorizations.
            </p>
          </div>
          <div className="rm-hero-action">
            <Button
              label="Submit Research Proposal +"
              variant="primary"
              onClick={() => navigate('/research-management/proposal-wizard')}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="rm-stats-grid">
          <div className="rm-stat-card rm-stat-card--amber">
            <div>
              <div className="rm-stat-label">Active Projects</div>
              <div className="rm-stat-value" style={{ color: '#92400e' }}>
                {projects.length}
              </div>
            </div>
            <div className="rm-stat-icon rm-stat-icon--amber">
              <i className="pi pi-book" />
            </div>
          </div>
          <div className="rm-stat-card rm-stat-card--indigo">
            <div>
              <div className="rm-stat-label">Funds Awarded</div>
              <div className="rm-stat-value" style={{ color: '#3730a3' }}>
                ₹{(activeGrantsTotal / 100000).toFixed(1)}L
              </div>
            </div>
            <div className="rm-stat-icon rm-stat-icon--indigo">
              <i className="pi pi-star" />
            </div>
          </div>
          <div className="rm-stat-card rm-stat-card--rose">
            <div>
              <div className="rm-stat-label">Compliance Queue</div>
              <div className="rm-stat-value" style={{ color: '#9f1239' }}>
                {pendingCount}
              </div>
            </div>
            <div className="rm-stat-icon rm-stat-icon--rose">
              <i className="pi pi-check-square" />
            </div>
          </div>
          <div className="rm-stat-card rm-stat-card--emerald">
            <div>
              <div className="rm-stat-label">Revision Drafts</div>
              <div className="rm-stat-value" style={{ color: '#065f46' }}>
                {revisionDraftsCount}
              </div>
            </div>
            <div className="rm-stat-icon rm-stat-icon--emerald">
              <i className="pi pi-refresh" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects Breakdown */}
          <FormCard title="Research Projects Breakdown" icon="chart-bar">
            <div className="space-y-3">
              {projects.map(p => {
                const rate =
                  p.approvedBudget > 0
                    ? Math.round((p.disbursedFunds / p.approvedBudget) * 100)
                    : 0;
                return (
                  <div key={p.code} className="rm-project-item">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.83rem',
                      }}
                    >
                      <span style={{ fontWeight: 800, color: '#1e293b' }}>
                        {p.piName}
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 500,
                            color: '#64748b',
                            marginLeft: '0.4rem',
                          }}
                        >
                          • {p.code}
                        </span>
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: '#6366f1',
                          fontWeight: 700,
                        }}
                      >
                        ₹{p.disbursedFunds.toLocaleString()} / ₹
                        {p.approvedBudget.toLocaleString()}
                      </span>
                    </div>
                    <div className="rm-progress-track">
                      <div
                        className={`rm-progress-fill ${rate > 80 ? 'rm-progress-fill--complete' : 'rm-progress-fill--normal'}`}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.7rem',
                        color: '#64748b',
                      }}
                    >
                      <span>
                        Agency:{' '}
                        <strong style={{ color: '#1e293b' }}>{p.agency}</strong>
                      </span>
                      <span style={{ fontWeight: 700 }}>{rate}% Released</span>
                    </div>
                  </div>
                );
              })}
              {projects.length === 0 && (
                <div className="rm-empty-state">
                  <i className="pi pi-book" />
                  <p>No active projects yet.</p>
                </div>
              )}
            </div>
          </FormCard>

          {/* Proposal Queue */}
          <FormCard title="Current Grant Proposals Queue" icon="list">
            <div>
              {proposals.slice(0, 5).map(prop => (
                <div key={prop.id} className="rm-proposal-item">
                  <div>
                    <p className="rm-proposal-name">{prop.piName}</p>
                    <p className="rm-proposal-title">
                      {prop.title.substring(0, 50)}...
                    </p>
                    <p className="rm-proposal-budget">
                      Budget:{' '}
                      <strong>
                        ₹{(prop.totalRequestedFunds as number).toLocaleString()}
                      </strong>
                    </p>
                  </div>
                  <span className={`rm-badge ${getStatusClass(prop.status)}`}>
                    {prop.status === 'Sent Back'
                      ? 'Under Revision'
                      : prop.status}
                  </span>
                </div>
              ))}
              {proposals.length === 0 && (
                <div className="rm-empty-state">
                  <i className="pi pi-list" />
                  <p>No proposals submitted yet.</p>
                </div>
              )}
            </div>
          </FormCard>
        </div>

        {/* Approved Summary */}
        {approvedCount > 0 && (
          <FormCard title="Approved Proposals Summary" icon="check-circle">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rm-summary-card rm-summary-card--emerald">
                <p className="rm-summary-label rm-summary-label--emerald">
                  Total Approved
                </p>
                <p className="rm-summary-value rm-summary-value--emerald">
                  {approvedCount}
                </p>
              </div>
              <div className="rm-summary-card rm-summary-card--indigo">
                <p className="rm-summary-label rm-summary-label--indigo">
                  Total Disbursed
                </p>
                <p className="rm-summary-value rm-summary-value--indigo">
                  ₹{(totalDisbursed / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="rm-summary-card rm-summary-card--amber">
                <p className="rm-summary-label rm-summary-label--amber">
                  Projects Registered
                </p>
                <p className="rm-summary-value rm-summary-value--amber">
                  {projects.length}
                </p>
              </div>
            </div>
          </FormCard>
        )}
      </div>
    </FormPage>
  );
}
