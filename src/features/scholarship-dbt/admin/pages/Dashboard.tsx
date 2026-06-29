import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { govtPortals, studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const totalApps = studentApplications.length;
const activePortals = govtPortals.filter(p => p.status === 'Active').length;

// Standalone Chart Components
function GatewayChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Gateway Active', 'Pending Keys', 'Error Logs'],
        datasets: [
          {
            data: [
              activePortals,
              govtPortals.filter(p => p.status === 'Inactive').length,
              govtPortals.filter(p => p.status === 'Error').length,
            ],
            backgroundColor: ['#10b981', '#9ca3af', '#ef4444'],
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

function SecurityChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Key Update', 'Disbursals', 'Rule Change', 'Login Audits'],
        datasets: [
          {
            label: 'Traffic Score',
            data: [85, 92, 54, 72],
            backgroundColor: '#a855f7',
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

function ApiVolumeChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['NSP Sync', 'UIDAI Aadhaar', 'NPCI Check', 'DigiLocker Fetch'],
        datasets: [
          {
            label: 'Calls Count',
            data: [1240, 980, 1450, 680],
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

function PipelineChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: [
          'Submissions',
          'Teacher Verified',
          'Cell Verified',
          'Finance Cleared',
          'Paid & Closed',
        ],
        datasets: [
          {
            data: [100, 85, 72, 60, 54],
            backgroundColor: [
              'rgba(99, 102, 241, 0.6)',
              'rgba(20, 184, 166, 0.6)',
              'rgba(168, 85, 247, 0.6)',
              'rgba(249, 115, 22, 0.6)',
              'rgba(34, 197, 94, 0.6)',
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

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Admin Dashboard"
      description="DAVV University Scholarship & DBT System Configurations & Logs Control Center."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Total Applications"
          value={totalApps}
          icon="assignment"
          colorScheme="blue"
          subtitle="Academic Year 2025-26"
        />
        <StatCard
          title="Integrated Portals"
          value={`${activePortals}/${govtPortals.length}`}
          icon="api"
          colorScheme="green"
          subtitle="API Connections Active"
        />
        <StatCard
          title="Pending Sync Log"
          value="12"
          icon="sync_problem"
          colorScheme="orange"
          subtitle="Failed records"
        />
        <StatCard
          title="Disbursement Rate"
          value="94.5%"
          icon="payments"
          colorScheme="purple"
          subtitle="Overall success rate"
        />
      </div>

      {/* Row 1 Charts */}
      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Integrated Govt Gateway API Status">
          <div style={{ height: 220 }}>
            <GatewayChart />
          </div>
        </FormCard>

        <FormCard title="Security & Audit Traffic Intensity Index">
          <div style={{ height: 220 }}>
            <SecurityChart />
          </div>
        </FormCard>
      </div>

      {/* Row 2 Charts */}
      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="API Requests Volume Share (Successful Syncs)">
          <div style={{ height: 220 }}>
            <ApiVolumeChart />
          </div>
        </FormCard>

        <FormCard title="Verification Approval Pipeline Conversion">
          <div style={{ height: 220 }}>
            <PipelineChart />
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
          onClick={() => navigate(dbtUrls.admin.govtIntegration)}
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
          API Gateway Setup →
        </button>
        <button
          onClick={() => navigate(dbtUrls.admin.eligibilityRules)}
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
          Eligibility Thresholds →
        </button>
        <button
          onClick={() => navigate(dbtUrls.admin.auditLogs)}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Audit Trail Logs →
        </button>
      </div>
    </FormPage>
  );
}
