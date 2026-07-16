import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import {
  complaints,
  grievanceCategories,
  departmentMappings,
  integrationPortals,
  committees,
} from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

// ── Chart Components ───────────────────────────────────────────

function AdminTrendChart() {
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
            data: [8, 12, 10, 15, 13, 11],
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f618',
            tension: 0.35,
            fill: true,
          },
          {
            label: 'Resolved',
            data: [5, 8, 9, 11, 10, 9],
            borderColor: '#10b981',
            backgroundColor: '#10b98118',
            tension: 0.35,
            fill: true,
          },
          {
            label: 'Escalated',
            data: [2, 3, 2, 4, 3, 2],
            borderColor: '#ef4444',
            backgroundColor: '#ef444418',
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
          y: { grid: { color: '#f1f5f9' } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function UniversityCategoryPie() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const catData = grievanceCategories.slice(0, 5).map(cat => ({
      label: cat.name,
      value: complaints.filter(c => c.category === cat.name).length,
      color: cat.color,
    }));
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: catData.map(d => d.label),
        datasets: [
          {
            data: catData.map(d => d.value),
            backgroundColor: catData.map(d => d.color),
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

function CategoryLoadBar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const catData = grievanceCategories.slice(0, 5).map(cat => ({
      label: cat.name.split(' ')[0],
      value: complaints.filter(c => c.category === cat.name).length,
      color: cat.color,
    }));
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: catData.map(d => d.label),
        datasets: [
          {
            label: 'Complaints',
            data: catData.map(d => d.value),
            backgroundColor: catData.map(d => d.color),
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

function IntegrationStatusBar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const connected = integrationPortals.filter(
      p => p.status === 'Connected'
    ).length;
    const syncing = integrationPortals.filter(
      p => p.status === 'Syncing'
    ).length;
    const error = integrationPortals.filter(p =>
      ['Error', 'Disconnected'].includes(p.status)
    ).length;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Connected', 'Syncing', 'Error / Offline'],
        datasets: [
          {
            label: 'Portals',
            data: [connected, syncing, error],
            backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
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

const total = complaints.length;
const active = complaints.filter(c => c.status !== 'Closed').length;
const closed = complaints.filter(c => c.status === 'Closed').length;
const resolutionRate = Math.round((closed / Math.max(total, 1)) * 100);

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Admin Dashboard"
      description="System-wide overview — configure masters, manage users, monitor all grievances, and audit system activity."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Login', to: grvUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI StatCards */}
      <div className="grv-stats-grid">
        <StatCard
          title="Total Complaints"
          value={total}
          icon="folder_open"
          colorScheme="blue"
          subtitle="All time"
        />
        <StatCard
          title="Active Cases"
          value={active}
          icon="pending_actions"
          colorScheme="orange"
          subtitle="In pipeline"
        />
        <StatCard
          title="Resolved / Closed"
          value={closed}
          icon="check_circle"
          colorScheme="green"
          subtitle="Completed"
        />
        <StatCard
          title="Resolution Rate"
          value={`${resolutionRate}%`}
          icon="bar_chart"
          colorScheme="teal"
          subtitle="Overall"
        />
        <StatCard
          title="Categories"
          value={grievanceCategories.length}
          icon="category"
          colorScheme="purple"
          subtitle="Active types"
        />
        <StatCard
          title="Dept Mappings"
          value={departmentMappings.length}
          icon="business"
          colorScheme="indigo"
          subtitle="Configured"
        />
        <StatCard
          title="Committees"
          value={committees.length}
          icon="groups"
          colorScheme="red"
          subtitle="All panels"
        />
        <StatCard
          title="API Integrations"
          value={integrationPortals.length}
          icon="sync"
          colorScheme="amber"
          subtitle="Portals"
        />
      </div>

      {/* Row 1: Trend + Pie */}
      <div className="grv-charts-row">
        <FormCard title="University Grievance Trend — Jan to Jun 2026">
          <div style={{ height: 220 }}>
            <AdminTrendChart />
          </div>
        </FormCard>
        <FormCard title="Category-wise Distribution">
          <div style={{ height: 220 }}>
            <UniversityCategoryPie />
          </div>
        </FormCard>
      </div>

      {/* Row 2: Category Load + Integration Status */}
      <div className="grv-charts-row">
        <FormCard title="Category-wise Load">
          <div style={{ height: 220 }}>
            <CategoryLoadBar />
          </div>
        </FormCard>
        <FormCard title="API Integration Status">
          <div style={{ height: 220 }}>
            <IntegrationStatusBar />
          </div>
        </FormCard>
      </div>

      {/* Action Buttons */}
      <div className="grv-actions-row">
        <button
          onClick={() => navigate(grvUrls.admin.masters)}
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
          Masters Configuration →
        </button>
        <button
          onClick={() => navigate(grvUrls.admin.users)}
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
          User & Role Management →
        </button>
        <button
          onClick={() => navigate(grvUrls.admin.workflow)}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#f97316',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Workflow Config →
        </button>
        <button
          onClick={() => navigate(grvUrls.admin.reports)}
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
          Reports & Audit Logs
        </button>
      </div>
    </FormPage>
  );
}
