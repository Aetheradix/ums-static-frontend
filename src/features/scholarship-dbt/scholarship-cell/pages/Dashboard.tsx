import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { govtPortals, studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

// Standalone Chart Components
function TrendChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
          {
            label: 'Applied',
            data: [120, 150, 180, 220, 240, 210],
            borderColor: '#3b82f6',
            tension: 0.3,
          },
          {
            label: 'Sanctioned',
            data: [90, 110, 140, 170, 190, 180],
            borderColor: '#a855f7',
            tension: 0.3,
          },
          {
            label: 'Credited',
            data: [60, 80, 110, 130, 160, 150],
            borderColor: '#10b981',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12 } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function CategoryChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['OBC', 'SC', 'ST', 'General', 'EWS'],
        datasets: [
          {
            data: [42, 28, 15, 10, 5],
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#a855f7',
              '#f59e0b',
              '#ef4444',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12 } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function SchemeChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Post Matric SC',
          'Post Matric ST',
          'OBC State',
          'MMVY State',
          'NSP Central',
        ],
        datasets: [
          {
            label: 'DBT Amount (₹ Lakhs)',
            data: [15.2, 8.5, 12.0, 18.5, 6.2],
            backgroundColor: '#3b82f6',
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
  return <canvas ref={ref} />;
}

function PortalChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Active Portals', 'Warning / Errors', 'Offline Portals'],
        datasets: [
          {
            data: [
              govtPortals.filter(p => p.status === 'Active').length,
              govtPortals.filter(p => p.status === 'Error').length,
              govtPortals.filter(p => p.status === 'Inactive').length,
            ],
            backgroundColor: ['#10b981', '#ef4444', '#9ca3af'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12 } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function WorkloadChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Total Syncs',
          'Aadhaar Matches',
          'Audits Settled',
          'NPCI Active',
        ],
        datasets: [
          {
            label: 'Performance Rate (%)',
            data: [88, 92, 74, 85],
            backgroundColor: '#a855f7',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 100 },
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

export default function CellDashboard() {
  const navigate = useNavigate();
  const apps = studentApplications;
  const submitted = apps.filter(a => a.status === 'Submitted').length;
  const approved = apps.filter(a =>
    [
      'Admin Approved',
      'Govt Synced',
      'Sanctioned',
      'DBT Processed',
      'Credited',
    ].includes(a.status)
  ).length;
  const rejected = apps.filter(a => a.status === 'Rejected').length;

  return (
    <FormPage
      title="Scholarship Cell — Dashboard"
      description="Manage all scholarship applications, portal sync status and DBT overview."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Scholarship Cell', to: dbtUrls.cell.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Total Applications"
          value={apps.length}
          icon="assignment"
          colorScheme="blue"
          subtitle="AY 2025-26"
        />
        <StatCard
          title="Pending Verification"
          value={submitted}
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Awaiting cell"
        />
        <StatCard
          title="Approved (Cell)"
          value={approved}
          icon="check_circle"
          colorScheme="green"
          subtitle="This year"
        />
        <StatCard
          title="Rejected"
          value={rejected}
          icon="cancel"
          colorScheme="red"
          subtitle="This year"
        />
        <StatCard
          title="On Hold"
          value={apps.filter(a => a.status === 'On Hold').length}
          icon="pause_circle"
          colorScheme="purple"
          subtitle="Need NPCI"
        />
        <StatCard
          title="DBT Processed"
          value={
            apps.filter(a => ['DBT Processed', 'Credited'].includes(a.status))
              .length
          }
          icon="payments"
          colorScheme="teal"
          subtitle="Transferred"
        />
        <StatCard
          title="Total DBT Amount"
          value="₹48.2L"
          icon="account_balance_wallet"
          colorScheme="indigo"
          subtitle="Sanctioned"
        />
        <StatCard
          title="Portal Sync Status"
          value={`${govtPortals.filter(p => p.status === 'Active').length}/${govtPortals.length}`}
          icon="cloud_sync"
          colorScheme="amber"
          subtitle="Active portals"
        />
      </div>

      {/* Row 1 Charts */}
      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Application Trend — Apr to Sep 2025">
          <div style={{ height: 220 }}>
            <TrendChart />
          </div>
        </FormCard>

        <FormCard title="Category Distribution">
          <div style={{ height: 220 }}>
            <CategoryChart />
          </div>
        </FormCard>
      </div>

      {/* Row 2 Charts */}
      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="DBT Amount by Scheme">
          <div style={{ height: 220 }}>
            <SchemeChart />
          </div>
        </FormCard>

        <FormCard title="Government Portal API Connections Status Share">
          <div style={{ height: 220 }}>
            <PortalChart />
          </div>
        </FormCard>
      </div>

      {/* Row 3 Charts */}
      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Cell Workload Clearance Index">
          <div style={{ height: 220 }}>
            <WorkloadChart />
          </div>
        </FormCard>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginTop: '1rem',
        }}
      >
        <button
          onClick={() => navigate(dbtUrls.cell.applications)}
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
          Manage Applications →
        </button>
        <button
          onClick={() => navigate(dbtUrls.cell.portalSync)}
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
          Sync Portals Now →
        </button>
      </div>
    </FormPage>
  );
}
