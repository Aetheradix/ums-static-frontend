import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import type { Complaint } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

// ── Chart Components ───────────────────────────────────────────

function OfficerTrendChart() {
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
            label: 'Assigned Files',
            data: [2, 4, 3, 5, 4, 3],
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f618',
            tension: 0.35,
            fill: true,
          },
          {
            label: 'Forwarded to HOD',
            data: [1, 3, 2, 4, 3, 2],
            borderColor: '#a855f7',
            backgroundColor: '#a855f718',
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

function OfficerCategoryPie() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Academic', 'Financial', 'Hostel', 'Administrative'],
        datasets: [
          {
            data: [3, 1, 1, 1],
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

function OfficerStatusBar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['New', 'Reviewing', 'Forwarded', 'Resolved'],
        datasets: [
          {
            label: 'Files Count',
            data: [2, 3, 4, 2],
            backgroundColor: ['#3b82f6', '#f59e0b', '#a855f7', '#10b981'],
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

export default function DepartmentOfficerDashboard() {
  const navigate = useNavigate();

  const newComplaintsCount = complaints.filter(
    (c: Complaint) => c.status === 'Submitted'
  ).length;
  const underProcessCount = complaints.filter(
    (c: Complaint) =>
      c.status === 'Department Review' ||
      c.status === 'HoD Review' ||
      c.status === 'Committee Review'
  ).length;
  const completedCount = complaints.filter(
    (c: Complaint) => c.status === 'Closed' || c.status === 'Registrar Decision'
  ).length;

  return (
    <FormPage
      title="Department Officer Desk"
      description="DAVV Indore — Review assigned student/teacher files, compile official notesheets, and draft recommendations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        {
          label: 'Department Officer Login',
          to: grvUrls.departmentOfficer.portal,
        },
        { label: 'Dashboard' },
      ]}
    >
      {/* eOffice Notice banner */}
      <div className="grv-alert success mb-4">
        <i className="pi pi-check-circle"></i>
        <div>
          <span className="font-bold">eOffice Portal Status Active:</span> You
          are connected to the central university file tracking system.
          Notesheet drafting is mandatory for all file forward/return movements.
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grv-stats-grid">
        <StatCard
          title="New Files"
          value={newComplaintsCount}
          icon="mark_unread_chat_alt"
          colorScheme="blue"
          subtitle="Awaiting notesheet"
        />
        <StatCard
          title="Under Process"
          value={underProcessCount}
          icon="cached"
          colorScheme="orange"
          subtitle="Notesheet active"
        />
        <StatCard
          title="Completed Cases"
          value={completedCount}
          icon="check_circle"
          colorScheme="green"
          subtitle="Settled files"
        />
        <StatCard
          title="Avg Forward Time"
          value="4 days"
          icon="timer"
          colorScheme="purple"
          subtitle="To HOD desk"
        />
      </div>

      {/* Row 1: Trend Line + Category Pie */}
      <div className="grv-charts-row">
        <FormCard title="Assigned Files Flow Trend — Jan to Jun 2026">
          <div style={{ height: 220 }}>
            <OfficerTrendChart />
          </div>
        </FormCard>
        <FormCard title="Category Distribution">
          <div style={{ height: 220 }}>
            <OfficerCategoryPie />
          </div>
        </FormCard>
      </div>

      {/* Row 2: Status Bar + Guidelines Card */}
      <div className="grv-charts-row">
        <FormCard title="File Status Overview">
          <div style={{ height: 220 }}>
            <OfficerStatusBar />
          </div>
        </FormCard>
        <FormCard title="Desk Statistics Summary">
          <div style={{ padding: '0.5rem 0' }}>
            {[
              {
                label: 'Assigned Department',
                value: 'SCSIT / Estate Section',
                note: 'Current jurisdiction',
              },
              {
                label: 'Active Notesheets',
                value: underProcessCount,
                note: 'Drafting required',
              },
              {
                label: 'Completed Review Files',
                value: completedCount,
                note: 'Forwarded to HOD',
              },
              {
                label: 'eOffice API Integration',
                value: 'Connected (Sync Active)',
                note: 'Last synced today',
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

      {/* Quick Actions centered at the bottom */}
      <div className="grv-actions-row">
        <button
          onClick={() => navigate(grvUrls.departmentOfficer.inbox)}
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
          Go to Inbox →
        </button>
        <button
          onClick={() => navigate(grvUrls.portal)}
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
          Switch Role
        </button>
      </div>
    </FormPage>
  );
}
