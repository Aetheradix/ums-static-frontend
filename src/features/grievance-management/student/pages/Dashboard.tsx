import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

// Active mock student
const STUDENT_NAME = 'Arjun Sharma';
const STUDENT_ENROLL = 'CS2021001';
const myComplaints = complaints.filter(
  c => c.enrollmentNo === STUDENT_ENROLL || !c.isAnonymous
);

function ComplaintCategoryChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Academic', 'Financial', 'Hostel', 'Exam', 'SC/ST Cell'],
        datasets: [
          {
            data: [40, 20, 15, 15, 10],
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#0891b2',
              '#8b5cf6',
            ],
            borderWidth: 1,
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
  return <canvas ref={ref} />;
}

function SlaPerformanceChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Within SLA', 'Near SLA', 'Breached'],
        datasets: [
          {
            label: 'Complaints count',
            data: [12, 3, 2],
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

export default function StudentDashboard() {
  const navigate = useNavigate();

  const total = myComplaints.length;
  const openCount = myComplaints.filter(
    c => c.status === 'Submitted' || c.status === 'Assigned'
  ).length;
  const inProgress = myComplaints.filter(
    c => c.status === 'Under Review' || c.status === 'Forwarded'
  ).length;
  const escalated = myComplaints.filter(c => c.status === 'Escalated').length;
  const resolved = myComplaints.filter(c => c.status === 'Resolved').length;
  const closed = myComplaints.filter(c => c.status === 'Closed').length;

  return (
    <FormPage
      title="Student Grievance Dashboard"
      description={`Welcome, ${STUDENT_NAME} (${STUDENT_ENROLL}) · B.Tech CSE · SCSIT Department`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* SLA Alert banner for pending notifications */}
      <div className="grv-alert info">
        <i className="pi pi-info-circle"></i>
        <div>
          <span className="font-bold">UGC Guidelines Alert:</span> Grievances
          submitted under SGRC or SC/ST Cell categories are backed by statutory
          timelines. If unresolved within 15 days, direct appeal mechanisms will
          activate.
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grv-stats-grid">
        <StatCard
          title="Total Complaints"
          value={total}
          icon="folder_open"
          colorScheme="blue"
          subtitle="All filed tickets"
        />
        <StatCard
          title="Open Complaints"
          value={openCount}
          icon="contact_support"
          colorScheme="purple"
          subtitle="Awaiting first action"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon="cached"
          colorScheme="teal"
          subtitle="Under review / notesheet"
        />
        <StatCard
          title="Escalated"
          value={escalated}
          icon="warning"
          colorScheme="red"
          subtitle="SLA breached level"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          icon="check_circle"
          colorScheme="green"
          subtitle="Awaiting verification"
        />
        <StatCard
          title="Closed"
          value={closed}
          icon="archive"
          colorScheme="indigo"
          subtitle="Fully settled grievances"
        />
      </div>

      {/* Row with Charts */}
      <div className="grv-charts-row">
        <FormCard title="University Grievance Share by Category">
          <div style={{ height: 220 }}>
            <ComplaintCategoryChart />
          </div>
        </FormCard>

        <FormCard title="SLA Compliance Metrics (This Semester)">
          <div style={{ height: 220 }}>
            <SlaPerformanceChart />
          </div>
        </FormCard>
      </div>

      {/* Quick Action buttons */}
      <FormCard title="Grievance Quick Actions">
        <div className="grv-quick-actions">
          <button
            className="grv-quick-action-btn"
            onClick={() => navigate(grvUrls.student.raise)}
          >
            <i className="pi pi-plus-circle text-red-600"></i>
            <span>File New Grievance</span>
          </button>
          <button
            className="grv-quick-action-btn"
            onClick={() => navigate(grvUrls.student.track)}
          >
            <i className="pi pi-compass text-blue-600"></i>
            <span>Track Live Complaint</span>
          </button>
          <button
            className="grv-quick-action-btn"
            onClick={() => navigate(grvUrls.student.communication)}
          >
            <i className="pi pi-bell text-yellow-600"></i>
            <span>Communication Center</span>
          </button>
          <button
            className="grv-quick-action-btn"
            onClick={() => navigate(grvUrls.student.appeal)}
          >
            <i className="pi pi-shield text-purple-600"></i>
            <span>Appeal Resolution</span>
          </button>
          <button
            className="grv-quick-action-btn"
            onClick={() => navigate(grvUrls.student.history)}
          >
            <i className="pi pi-history text-gray-600"></i>
            <span>Complaint History</span>
          </button>
        </div>
      </FormCard>

      {/* Recent Activity Table */}
      <div className="mt-6">
        <FormCard title="Recent Filed Complaints Status" icon="list">
          <table className="grv-table">
            <thead>
              <tr>
                <th>Ticket No.</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Date Filed</th>
                <th>Assigned Dept</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myComplaints.slice(0, 3).map(c => (
                <tr key={c.id}>
                  <td className="font-bold text-blue-600">{c.ticketNo}</td>
                  <td>{c.category}</td>
                  <td>{c.subject}</td>
                  <td>{c.submittedDate}</td>
                  <td>{c.assignedDept}</td>
                  <td>
                    <span
                      className={`grv-status-pill ${c.status.toLowerCase().replace(' ', '-')}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(grvUrls.student.details, {
                          state: { complaintId: c.id },
                        })
                      }
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2 py-1 rounded"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormCard>
      </div>
    </FormPage>
  );
}
