import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

function HearingsIntensityChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'SGRC Appeals',
          'SC/ST Appeals',
          'POSH hearings',
          'Finance Disputes',
        ],
        datasets: [
          {
            label: 'Active Hearings count',
            data: [5, 2, 1, 4],
            backgroundColor: '#f97316',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref}></canvas>;
}

export default function AuthorityDashboard() {
  const navigate = useNavigate();

  const totalDecisions = complaints.filter(
    c => c.status === 'Closed' || c.status === 'Resolved'
  ).length;
  const pendingApprovals = complaints.filter(
    c => c.status === 'Forwarded' || c.status === 'Escalated'
  ).length;
  const pendingAppeals = complaints.filter(c => c.status === 'Appealed').length;

  return (
    <FormPage
      title="Registrar / HoD Redressal Desk"
      description="Administrative and Statutory Appellate Board Desk — DAVV Indore."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Authority Portal', to: grvUrls.authority.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grv-stats-grid">
        <StatCard
          title="Pending Approvals"
          value={pendingApprovals}
          icon="fact_check"
          colorScheme="blue"
          subtitle="Forwarded departmental files"
        />
        <StatCard
          title="Appellate Appeals Review"
          value={pendingAppeals}
          icon="gavel"
          colorScheme="orange"
          subtitle="Contested resolution review"
        />
        <StatCard
          title="Decision History Signed"
          value={totalDecisions}
          icon="verified"
          colorScheme="green"
          subtitle="All-time closed cases"
        />
      </div>

      <div className="grv-charts-row">
        <FormCard title="Appellate Hearings Intensity">
          <div style={{ height: 220 }}>
            <HearingsIntensityChart />
          </div>
        </FormCard>

        <FormCard title="Appellate Quick Panel">
          <div className="grv-quick-actions">
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.authority.approvals)}
            >
              <i className="pi pi-check-square text-blue-600"></i>
              <span>Pending Approvals Queue</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.authority.appeals)}
            >
              <i className="pi pi-shield text-red-600"></i>
              <span>Appeals Hearings Panel</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.authority.history)}
            >
              <i className="pi pi-history text-gray-600"></i>
              <span>Decision History logs</span>
            </button>
          </div>
        </FormCard>
      </div>

      <FormCard title="High Priority Appellate Queue" icon="warning">
        <table className="grv-table">
          <thead>
            <tr>
              <th>Ticket No</th>
              <th>Student Petitioner</th>
              <th>Subject Heading</th>
              <th>Current Stage</th>
              <th>SLA Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints
              .filter(c => c.status === 'Escalated' || c.status === 'Appealed')
              .map(c => (
                <tr key={c.id}>
                  <td className="font-mono font-bold text-red-600">
                    {c.ticketNo}
                  </td>
                  <td>{c.isAnonymous ? 'Anonymous Request' : c.studentName}</td>
                  <td>
                    <div className="font-bold text-slate-800 text-xs">
                      {c.subject}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {c.category}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`grv-status-pill ${c.status.toLowerCase().replace(' ', '-')}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`grv-status-pill ${c.slaStatus === 'Breached' ? 'sla-breached' : 'sla-ok'}`}
                    >
                      {c.slaStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        if (c.status === 'Appealed') {
                          navigate(grvUrls.authority.appeals);
                        } else {
                          navigate(grvUrls.authority.approvals);
                        }
                      }}
                      className="text-xs bg-orange-600 text-white font-bold px-3 py-1 rounded hover:bg-orange-700"
                    >
                      Hear Grievance
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </FormCard>
    </FormPage>
  );
}
