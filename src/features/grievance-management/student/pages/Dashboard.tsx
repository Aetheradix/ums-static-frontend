import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

// ── Chart Components ───────────────────────────────────────────

function GrievanceTrendChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Filed',
            data: [1, 2, 1, 3, 2, 1],
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f618',
            tension: 0.35,
            fill: true,
          },
          {
            label: 'Resolved',
            data: [0, 1, 1, 2, 1, 1],
            borderColor: '#10b981',
            backgroundColor: '#10b98118',
            tension: 0.35,
            fill: true,
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
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#f1f5f9' }, ticks: { stepSize: 1 } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function CategoryPieChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Academic', 'Financial', 'Hostel', 'Examination'],
        datasets: [
          {
            data: [2, 1, 1, 1],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
            borderWidth: 2,
            borderColor: '#fff',
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

function StatusBarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Submitted',
          'Dept Review',
          'HoD Review',
          'Committee',
          'Closed',
        ],
        datasets: [
          {
            label: 'Complaints',
            data: [1, 1, 1, 1, 1],
            backgroundColor: [
              '#3b82f6',
              '#f59e0b',
              '#f97316',
              '#a855f7',
              '#10b981',
            ],
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#f1f5f9' }, ticks: { stepSize: 1 } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

// ── Dashboard Component ────────────────────────────────────────

const myComplaints = complaints.slice(0, 5);
const open = myComplaints.filter(c => c.status !== 'Closed').length;
const closed = myComplaints.filter(c => c.status === 'Closed').length;
const underReview = myComplaints.filter(c =>
  ['HoD Review', 'Committee Review', 'Department Review'].includes(c.status)
).length;

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Student Dashboard"
      description="Welcome back! Here's an overview of your grievances and activity."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Login', to: grvUrls.student.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI StatCards */}
      <div className="grv-stats-grid">
        <StatCard
          title="Total Filed"
          value={myComplaints.length}
          icon="folder_open"
          colorScheme="blue"
          subtitle="All time"
        />
        <StatCard
          title="Open Cases"
          value={open}
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Awaiting action"
        />
        <StatCard
          title="Under Review"
          value={underReview}
          icon="rate_review"
          colorScheme="purple"
          subtitle="In progress"
        />
        <StatCard
          title="Resolved"
          value={closed}
          icon="check_circle"
          colorScheme="green"
          subtitle="Completed"
        />
        <StatCard
          title="Appeals Filed"
          value={0}
          icon="gavel"
          colorScheme="red"
          subtitle="Filed appeals"
        />
        <StatCard
          title="Avg Response"
          value="18 days"
          icon="timer"
          colorScheme="teal"
          subtitle="Resolution time"
        />
      </div>

      {/* Row 1: Trend + Pie */}
      <div className="grv-charts-row">
        <FormCard title="Grievance Filing Trend — Jan to Jun 2026">
          <div style={{ height: 220 }}>
            <GrievanceTrendChart />
          </div>
        </FormCard>
        <FormCard title="Category Distribution">
          <div style={{ height: 220 }}>
            <CategoryPieChart />
          </div>
        </FormCard>
      </div>

      {/* Row 2: Status Bar */}
      <div className="grv-charts-row">
        <FormCard title="Complaints by Status">
          <div style={{ height: 220 }}>
            <StatusBarChart />
          </div>
        </FormCard>
        <FormCard title="Quick Summary">
          <div style={{ padding: '0.5rem 0' }}>
            {[
              {
                label: 'Ticket No.',
                value: myComplaints[0]?.ticketNo ?? '—',
                note: 'Latest complaint',
              },
              {
                label: 'Category',
                value: myComplaints[0]?.category ?? '—',
                note: 'Most recent',
              },
              {
                label: 'Status',
                value: myComplaints[0]?.status ?? '—',
                note: 'Current stage',
              },
              {
                label: 'Submitted',
                value: myComplaints[0]?.submittedDate ?? '—',
                note: 'Date filed',
              },
            ].map(r => (
              <div
                key={r.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {r.label}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#1e293b',
                  }}
                >
                  {r.value}
                </span>
              </div>
            ))}
          </div>
        </FormCard>
      </div>

      {/* Action Buttons */}
      <div className="grv-actions-row">
        <button
          onClick={() => navigate(grvUrls.student.raise)}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Raise New Grievance
        </button>
        <button
          onClick={() => navigate(grvUrls.student.track)}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Track Complaint →
        </button>
        <button
          onClick={() => navigate(grvUrls.student.history)}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          View History
        </button>
        <button
          onClick={() => navigate(grvUrls.student.communication)}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Communication Center
        </button>
      </div>
    </FormPage>
  );
}
