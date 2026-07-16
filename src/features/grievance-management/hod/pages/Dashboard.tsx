import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

// ── Chart Components ───────────────────────────────────────────

function HodTrendChart() {
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
            label: 'Received',
            data: [3, 5, 4, 7, 6, 4],
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f618',
            tension: 0.35,
            fill: true,
          },
          {
            label: 'Forwarded to Cell',
            data: [1, 2, 1, 3, 2, 1],
            borderColor: '#a855f7',
            backgroundColor: '#a855f718',
            tension: 0.35,
            fill: true,
          },
          {
            label: 'Resolved at Dept',
            data: [2, 3, 3, 4, 4, 3],
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

function DeptCategoryPie() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Academic', 'Financial', 'Hostel', 'Admin', 'Examination'],
        datasets: [
          {
            data: [5, 3, 4, 2, 2],
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#8b5cf6',
              '#ec4899',
            ],
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

function HodStatusBar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Dept Review',
          'HoD Review',
          'Escalated',
          'Resolved',
          'Closed',
        ],
        datasets: [
          {
            label: 'Cases',
            data: [4, 3, 2, 5, 3],
            backgroundColor: [
              '#f59e0b',
              '#f97316',
              '#ef4444',
              '#10b981',
              '#6b7280',
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

function EscalationBar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['SCSIT', 'Finance', 'Hostel', 'Admin', 'Library'],
        datasets: [
          {
            label: 'Resolved',
            data: [12, 8, 6, 10, 4],
            backgroundColor: '#10b981',
            borderRadius: 4,
          },
          {
            label: 'Pending',
            data: [3, 2, 5, 1, 2],
            backgroundColor: '#f97316',
            borderRadius: 4,
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
          y: { grid: { color: '#f1f5f9' } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

// ── Dashboard Component ────────────────────────────────────────

const deptComplaints = complaints.slice(0, 10);
const hodPending = deptComplaints.filter(c => c.status === 'HoD Review').length;
const deptPending = deptComplaints.filter(
  c => c.status === 'Department Review'
).length;
const escalated = deptComplaints.filter(c =>
  ['Committee Review', 'Registrar Decision'].includes(c.status)
).length;
const resolved = deptComplaints.filter(c => c.status === 'Closed').length;

export default function HodDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="HOD / Dean Dashboard"
      description="Department-level grievance management — review, resolve, and escalate cases."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Department Login', to: grvUrls.hod.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI StatCards */}
      <div className="grv-stats-grid">
        <StatCard
          title="Dept Review Queue"
          value={deptPending}
          icon="inbox"
          colorScheme="orange"
          subtitle="Awaiting officer"
        />
        <StatCard
          title="HoD Review"
          value={hodPending}
          icon="pending_actions"
          colorScheme="amber"
          subtitle="At your desk"
        />
        <StatCard
          title="Escalated to Cell"
          value={escalated}
          icon="escalator_warning"
          colorScheme="red"
          subtitle="Forwarded"
        />
        <StatCard
          title="Resolved at Dept"
          value={resolved}
          icon="check_circle"
          colorScheme="green"
          subtitle="This month"
        />
        <StatCard
          title="Total Dept Cases"
          value={deptComplaints.length}
          icon="folder_open"
          colorScheme="blue"
          subtitle="All cases"
        />
        <StatCard
          title="Avg Resolution"
          value="12 days"
          icon="timer"
          colorScheme="teal"
          subtitle="Department level"
        />
      </div>

      {/* Row 1: Trend + Pie */}
      <div className="grv-charts-row">
        <FormCard title="Grievance Trend — Jan to Jun 2026">
          <div style={{ height: 220 }}>
            <HodTrendChart />
          </div>
        </FormCard>
        <FormCard title="Category Distribution">
          <div style={{ height: 220 }}>
            <DeptCategoryPie />
          </div>
        </FormCard>
      </div>

      {/* Row 2: Status + Dept Performance */}
      <div className="grv-charts-row">
        <FormCard title="Status-wise Breakdown">
          <div style={{ height: 220 }}>
            <HodStatusBar />
          </div>
        </FormCard>
        <FormCard title="Department Performance">
          <div style={{ height: 220 }}>
            <EscalationBar />
          </div>
        </FormCard>
      </div>

      {/* Action Buttons */}
      <div className="grv-actions-row">
        <button
          onClick={() => navigate(grvUrls.hod.review)}
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
          Review Cases →
        </button>
        <button
          onClick={() => navigate(grvUrls.hod.pending)}
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
          Pending Complaints →
        </button>
        <button
          onClick={() => navigate(grvUrls.hod.portal)}
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
          HOD Portal
        </button>
      </div>
    </FormPage>
  );
}
