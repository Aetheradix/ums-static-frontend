import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

function DeptInboxTrendsChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Monthly Petitions Lodged',
            data: [4, 9, 12, 8, 15, 20, 25],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.3,
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

export default function DepartmentDashboard() {
  const navigate = useNavigate();

  // Mapped department context - SCSIT / Examination
  const assigned = complaints.filter(
    c => c.assignedDept === 'Examination Department'
  );
  const totalCount = assigned.length;
  const pendingReview = assigned.filter(
    c =>
      c.status === 'Submitted' ||
      c.status === 'Assigned' ||
      c.status === 'Under Review'
  ).length;
  const resolvedCount = assigned.filter(c => c.status === 'Resolved').length;
  const breachedCount = assigned.filter(c => c.slaStatus === 'Breached').length;

  return (
    <FormPage
      title="Department Redressal Dashboard"
      description="Review assigned complaints, manage digital eOffice notesheets and SLA resolution targets."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Department Portal', to: grvUrls.department.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grv-stats-grid">
        <StatCard
          title="Total Assigned Complaints"
          value={totalCount}
          icon="assignment"
          colorScheme="blue"
          subtitle="All-time assigned cases"
        />
        <StatCard
          title="Pending Action review"
          value={pendingReview}
          icon="schedule"
          colorScheme="orange"
          subtitle="Needs notesheet / response"
        />
        <StatCard
          title="SLA Breached Cases"
          value={breachedCount}
          icon="warning"
          colorScheme="red"
          subtitle="Exceeded resolution timeline"
        />
        <StatCard
          title="Resolved Cases"
          value={resolvedCount}
          icon="check_circle"
          colorScheme="green"
          subtitle="Waiting student acceptance"
        />
      </div>

      <div className="grv-charts-row">
        <FormCard title="Assigned Complaint Inbox Trends">
          <div style={{ height: 220 }}>
            <DeptInboxTrendsChart />
          </div>
        </FormCard>

        <FormCard title="Department Quick Controls">
          <div className="grv-quick-actions">
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.department.inbox)}
            >
              <i className="pi pi-inbox text-blue-600"></i>
              <span>Open Complaint Inbox</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.department.notesheet)}
            >
              <i className="pi pi-file text-yellow-600"></i>
              <span>Create Notesheet</span>
            </button>
            <button
              className="grv-quick-action-btn"
              onClick={() => navigate(grvUrls.department.reports)}
            >
              <i className="pi pi-chart-line text-purple-600"></i>
              <span>Resolution Statistics</span>
            </button>
          </div>
        </FormCard>
      </div>

      <FormCard
        title="Urgent Action Queue (Examination Department)"
        icon="warning"
      >
        <table className="grv-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Student Name</th>
              <th>Category / Subject</th>
              <th>SLA Status</th>
              <th>Escalation Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assigned
              .filter(c => c.status !== 'Closed')
              .map(c => (
                <tr key={c.id}>
                  <td className="font-mono font-bold">{c.ticketNo}</td>
                  <td>{c.isAnonymous ? 'Anonymous' : c.studentName}</td>
                  <td>
                    <div className="font-bold text-slate-800">{c.subject}</div>
                    <div className="text-[10px] text-slate-400">
                      {c.category} · {c.subCategory}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`grv-status-pill ${c.slaStatus === 'Breached' ? 'sla-breached' : c.slaStatus === 'Near Breach' ? 'sla-near' : 'sla-ok'}`}
                    >
                      {c.slaStatus}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold">L{c.escalationLevel}</span>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(grvUrls.department.details, {
                          state: { complaintId: c.id },
                        })
                      }
                      className="text-xs bg-indigo-600 text-white font-bold px-3 py-1 rounded hover:bg-indigo-700"
                    >
                      Action Desk
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
