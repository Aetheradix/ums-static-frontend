import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import { ToastService } from 'services';
import '../../Grievance.css';

function CommitteeDistributionChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'SGRC (Routine)',
          'Anti-Ragging (Urgent)',
          'ICC (POSH)',
          'SC/ST Cell',
          'Examination',
        ],
        datasets: [
          {
            data: [45, 12, 8, 34, 56],
            backgroundColor: [
              '#3b82f6',
              '#ef4444',
              '#ec4899',
              '#8b5cf6',
              '#0891b2',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 10, font: { size: 10 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref}></canvas>;
}

export default function GrievanceCellDashboard() {
  const navigate = useNavigate();

  const totalCount = complaints.length;
  const pendingAssign = complaints.filter(
    c => c.assignedTo === 'Pending Assignment'
  ).length;
  const escalatedCount = complaints.filter(
    c => c.status === 'Escalated'
  ).length;
  const slaViolated = complaints.filter(c => c.slaStatus === 'Breached').length;
  const appealCount = complaints.filter(c => c.status === 'Appealed').length;

  return (
    <FormPage
      title="Grievance Cell Dashboard"
      description="University Grievance Redressal Monitoring Desk — DAVV Indore."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Grievance Cell Portal', to: grvUrls.cell.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grv-stats-grid">
        <StatCard
          title="Total Registered"
          value={totalCount}
          icon="folder"
          colorScheme="blue"
          subtitle="All filed petitions"
        />
        <StatCard
          title="Pending Assignment"
          value={pendingAssign}
          icon="assignment_late"
          colorScheme="orange"
          subtitle="Needs officer routing"
        />
        <StatCard
          title="Escalated Tickets"
          value={escalatedCount}
          icon="warning"
          colorScheme="red"
          subtitle="Awaiting nodal answers"
        />
        <StatCard
          title="SLA Breaches"
          value={slaViolated}
          icon="timer"
          colorScheme="red"
          subtitle="Overdue resolution targets"
        />
        <StatCard
          title="Active Appeals"
          value={appealCount}
          icon="gavel"
          colorScheme="purple"
          subtitle="Filed to SGRC appellate"
        />
      </div>

      <div className="grv-charts-row">
        <FormCard title="Complaint Distribution by Committee">
          <div style={{ height: 220 }}>
            <CommitteeDistributionChart />
          </div>
        </FormCard>

        <FormCard title="Grievance Cell Administration Controls">
          <div className="grv-quick-actions">
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.cell.management)}
            >
              <i className="pi pi-list text-blue-600"></i>
              <span>All Complaints Master</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.cell.assignment)}
            >
              <i className="pi pi-user-plus text-yellow-600"></i>
              <span>Assign Tickets</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.cell.sla)}
            >
              <i className="pi pi-clock text-red-600"></i>
              <span>SLA Breaches Tracker</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.cell.committees)}
            >
              <i className="pi pi-users text-purple-600"></i>
              <span>Manage SGRC / ICC / Cells</span>
            </button>
          </div>
        </FormCard>
      </div>

      {/* Critical alert queue */}
      <FormCard title="Statutory SLA Violation Watchlist" icon="warning">
        <table className="grv-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Category</th>
              <th>Student / Department</th>
              <th>SLA Status</th>
              <th>Escalation Node</th>
              <th>Trigger Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints
              .filter(c => c.slaStatus === 'Breached')
              .map(c => (
                <tr key={c.id}>
                  <td className="font-mono font-bold text-red-600">
                    {c.ticketNo}
                  </td>
                  <td>{c.category}</td>
                  <td>
                    <div className="font-bold">
                      {c.isAnonymous ? 'Anonymous Request' : c.studentName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {c.assignedDept}
                    </div>
                  </td>
                  <td>
                    <span className="grv-status-pill sla-breached">
                      BREACHED
                    </span>
                  </td>
                  <td>
                    <span className="text-xs font-bold text-red-700">
                      L{c.escalationLevel} ({c.escalatedTo || 'Nodal'})
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        ToastService.success(
                          `Urgent SMS Reminder sent to ${c.assignedTo}`
                        )
                      }
                      className="text-xs bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-bold px-3 py-1 rounded"
                    >
                      Ping Reminder
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
