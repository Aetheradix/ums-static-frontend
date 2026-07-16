import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

// ── Chart Components ───────────────────────────────────────────

function RegistrarTrendChart() {
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
            data: [2, 3, 2, 4, 3, 2],
            borderColor: '#6366f1',
            backgroundColor: '#6366f118',
            tension: 0.35,
            fill: true,
          },
          {
            label: 'Orders Issued',
            data: [1, 2, 2, 3, 2, 2],
            borderColor: '#10b981',
            backgroundColor: '#10b98118',
            tension: 0.35,
            fill: true,
          },
          {
            label: 'Appeals',
            data: [0, 1, 0, 1, 0, 1],
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b18',
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

function ResolutionPie() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'Pending Decision',
          'Committee Review',
          'Under Process',
          'Closed / Resolved',
        ],
        datasets: [
          {
            data: [
              complaints.filter(c => c.status === 'Registrar Decision').length,
              complaints.filter(c => c.status === 'Committee Review').length,
              complaints.filter(c =>
                ['HoD Review', 'Department Review'].includes(c.status)
              ).length,
              complaints.filter(c => c.status === 'Closed').length,
            ],
            backgroundColor: ['#f97316', '#a855f7', '#3b82f6', '#10b981'],
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

function CategoryWorkloadBar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Academic', 'Financial', 'Hostel', 'ICC', 'Admin'],
        datasets: [
          {
            label: 'Cases',
            data: [5, 3, 4, 2, 3],
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#ec4899',
              '#8b5cf6',
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

function ResolutionTimeBar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          '< 7 Days',
          '7–15 Days',
          '15–30 Days',
          '30–45 Days',
          '> 45 Days',
        ],
        datasets: [
          {
            label: 'Cases Resolved',
            data: [2, 4, 5, 3, 1],
            backgroundColor: [
              '#10b981',
              '#10b981',
              '#f59e0b',
              '#f97316',
              '#ef4444',
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

const pendingDecisions = complaints.filter(
  c => c.status === 'Registrar Decision'
);
const underReview = complaints.filter(c =>
  ['Committee Review', 'HoD Review', 'Department Review'].includes(c.status)
);
const closed = complaints.filter(c => c.status === 'Closed');

export default function RegistrarDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Registrar Dashboard"
      description="University-level grievance oversight — review committee recommendations and issue resolution orders."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Registrar Login', to: grvUrls.registrar.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI StatCards */}
      <div className="grv-stats-grid">
        <StatCard
          title="Pending Decision"
          value={pendingDecisions.length}
          icon="gavel"
          colorScheme="orange"
          subtitle="At your desk"
        />
        <StatCard
          title="Committee Referred"
          value={complaints.filter(c => c.status === 'Committee Review').length}
          icon="groups"
          colorScheme="purple"
          subtitle="Awaiting report"
        />
        <StatCard
          title="Under Process"
          value={underReview.length}
          icon="cached"
          colorScheme="blue"
          subtitle="In the pipeline"
        />
        <StatCard
          title="Closed Files"
          value={closed.length}
          icon="archive"
          colorScheme="green"
          subtitle="Resolved"
        />
        <StatCard
          title="Appeals Pending"
          value={2}
          icon="balance"
          colorScheme="red"
          subtitle="Filed appeals"
        />
        <StatCard
          title="Resolution Rate"
          value={`${Math.round((closed.length / Math.max(complaints.length, 1)) * 100)}%`}
          icon="bar_chart"
          colorScheme="teal"
          subtitle="Overall rate"
        />
      </div>

      {/* Row 1: Trend + Pie */}
      <div className="grv-charts-row">
        <FormCard title="Case Flow Trend — Jan to Jun 2026">
          <div style={{ height: 220 }}>
            <RegistrarTrendChart />
          </div>
        </FormCard>
        <FormCard title="Case Stage Distribution">
          <div style={{ height: 220 }}>
            <ResolutionPie />
          </div>
        </FormCard>
      </div>

      {/* Row 2: Category + Resolution Time */}
      <div className="grv-charts-row">
        <FormCard title="Category-wise Workload">
          <div style={{ height: 220 }}>
            <CategoryWorkloadBar />
          </div>
        </FormCard>
        <FormCard title="Resolution Time Buckets">
          <div style={{ height: 220 }}>
            <ResolutionTimeBar />
          </div>
        </FormCard>
      </div>

      {/* Action Buttons */}
      <div className="grv-actions-row">
        <button
          onClick={() => navigate(grvUrls.registrar.pendingDecisions)}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Pending Decisions →
        </button>
        <button
          onClick={() => navigate(grvUrls.registrar.pending)}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#f59e0b',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          All Cases →
        </button>
        <button
          onClick={() => navigate(grvUrls.registrar.portal)}
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
          Registrar Portal
        </button>
      </div>
    </FormPage>
  );
}
