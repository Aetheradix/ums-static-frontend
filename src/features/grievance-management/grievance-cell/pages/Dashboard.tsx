import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints, committees } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

// ── Chart Components ───────────────────────────────────────────

function CellTrendChart() {
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
            label: 'Escalated',
            data: [4, 6, 5, 8, 7, 5],
            borderColor: '#ef4444',
            backgroundColor: '#ef444418',
            tension: 0.35,
            fill: true,
          },
          {
            label: 'Committee Referred',
            data: [2, 3, 2, 4, 3, 2],
            borderColor: '#a855f7',
            backgroundColor: '#a855f718',
            tension: 0.35,
            fill: true,
          },
          {
            label: 'Resolved',
            data: [3, 4, 4, 5, 5, 4],
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

function CellCategoryPie() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Academic', 'Financial', 'Hostel', 'ICC/Ragging', 'Admin'],
        datasets: [
          {
            data: [
              complaints.filter(c => c.category === 'Academic Grievance')
                .length,
              complaints.filter(c => c.category === 'Financial Grievance')
                .length,
              complaints.filter(c => c.category === 'Hostel & Infrastructure')
                .length,
              complaints.filter(c =>
                ['Sexual Harassment (ICC)', 'Anti-Ragging Cell'].includes(
                  c.category
                )
              ).length,
              complaints.filter(c => c.category === 'Administrative & HRMS')
                .length,
            ],
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#ec4899',
              '#8b5cf6',
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

function CellStatusBar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Committee Review',
          'Registrar Decision',
          'Serious/Sensitive',
          'Resolved',
          'On Appeal',
        ],
        datasets: [
          {
            label: 'Cases',
            data: [4, 2, 3, 6, 1],
            backgroundColor: [
              '#a855f7',
              '#6366f1',
              '#ec4899',
              '#10b981',
              '#f97316',
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

function CommitteeWorkloadBar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const activeComms = committees.filter(c => c.status === 'Active');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: activeComms.map(c => c.acronym),
        datasets: [
          {
            label: 'Total Cases',
            data: activeComms.map(c => c.totalCases),
            backgroundColor: '#6366f1',
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

const escalated = complaints.filter(c =>
  ['Committee Review', 'Registrar Decision'].includes(c.status)
);
const pending = complaints.filter(c =>
  ['HoD Review', 'Department Review'].includes(c.status)
);
const serious = complaints.filter(c =>
  ['Sexual Harassment (ICC)', 'Anti-Ragging Cell'].includes(c.category)
);
const closed = complaints.filter(c => c.status === 'Closed');

export default function GrievanceCellDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Grievance Cell Dashboard"
      description="Central control — manage all escalated, serious, and committee-referred complaints."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Grievance Cell', to: grvUrls.cell.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI StatCards */}
      <div className="grv-stats-grid">
        <StatCard
          title="Total Escalations"
          value={escalated.length}
          icon="escalator_warning"
          colorScheme="red"
          subtitle="At cell level"
        />
        <StatCard
          title="Pending Review"
          value={pending.length}
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Below cell"
        />
        <StatCard
          title="Committee Active"
          value={committees.filter(c => c.status === 'Active').length}
          icon="groups"
          colorScheme="purple"
          subtitle="Active panels"
        />
        <StatCard
          title="Serious / Sensitive"
          value={serious.length}
          icon="report"
          colorScheme="red"
          subtitle="ICC / ARC cases"
        />
        <StatCard
          title="Resolved"
          value={closed.length}
          icon="check_circle"
          colorScheme="green"
          subtitle="This year"
        />
        <StatCard
          title="Avg Resolution"
          value="18 days"
          icon="timer"
          colorScheme="teal"
          subtitle="Cell level"
        />
      </div>

      {/* Row 1: Trend + Pie */}
      <div className="grv-charts-row">
        <FormCard title="Escalation Trend — Jan to Jun 2026">
          <div style={{ height: 220 }}>
            <CellTrendChart />
          </div>
        </FormCard>
        <FormCard title="Category Distribution">
          <div style={{ height: 220 }}>
            <CellCategoryPie />
          </div>
        </FormCard>
      </div>

      {/* Row 2: Status + Committee Workload */}
      <div className="grv-charts-row">
        <FormCard title="Status-wise Breakdown">
          <div style={{ height: 220 }}>
            <CellStatusBar />
          </div>
        </FormCard>
        <FormCard title="Committee Workload">
          <div style={{ height: 220 }}>
            <CommitteeWorkloadBar />
          </div>
        </FormCard>
      </div>

      {/* Action Buttons */}
      <div className="grv-actions-row">
        <button
          onClick={() => navigate(grvUrls.cell.complaints)}
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
          Complaint Management →
        </button>
        <button
          onClick={() => navigate(grvUrls.cell.committee)}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#a855f7',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Committee Review →
        </button>
        <button
          onClick={() => navigate(grvUrls.cell.committeeManagement)}
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
          Manage Committees →
        </button>
        <button
          onClick={() => navigate(grvUrls.cell.reports)}
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
          Reports & Analytics
        </button>
      </div>
    </FormPage>
  );
}
