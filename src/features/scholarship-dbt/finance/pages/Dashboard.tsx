import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { dbtTransactions, studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

// Standalone Chart Components
function ReceiptsChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'NSP Central SC',
          'MP State Medhavi',
          'NSP ST Scheme',
          'MAHA DBT OBC',
        ],
        datasets: [
          {
            data: [1245000, 1850000, 820000, 450000],
            backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
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

function ExecutionChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Aadhaar Seeded',
          'Verification Done',
          'Requisition Gen',
          'DBT Credited',
        ],
        datasets: [
          {
            label: 'Rate (%)',
            data: [92, 85, 60, 45],
            backgroundColor: '#3b82f6',
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

function AllocationsChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Central SC/ST',
          'State Schemes',
          'Uni Merit Pool',
          'Private Endowments',
        ],
        datasets: [
          {
            label: 'Allocated (₹ Lakhs)',
            data: [20.6, 18.5, 4.5, 2.3],
            backgroundColor: '#10b981',
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

function ClearanceChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['APBS Bridge', 'NEFT Direct', 'State Push', 'Manual Req'],
        datasets: [
          {
            data: [98, 92, 89, 74],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
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

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const creditedCount = studentApplications.filter(
    a => a.status === 'Credited'
  ).length;
  const pendingCount = studentApplications.filter(
    a => a.status === 'Cell Verified'
  ).length;

  const totalDisbursed = dbtTransactions.reduce(
    (acc, t) => (t.status === 'Success' ? acc + t.amount : acc),
    0
  );
  const pendingDisbursement = studentApplications
    .filter(a =>
      ['Cell Verified', 'Finance Verified', 'Admin Approved'].includes(a.status)
    )
    .reduce((acc, a) => acc + a.amount, 0);

  return (
    <FormPage
      title="Finance Office Dashboard"
      description="Overview of scholarship receipts, fund disbursements, fee offsets, and DBT status."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Finance Office', to: dbtUrls.finance.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Total Disbursed (DBT)"
          value={`₹${totalDisbursed.toLocaleString()}`}
          icon="payments"
          colorScheme="green"
          subtitle="Successfully Credited"
        />
        <StatCard
          title="Pending Disbursement"
          value={`₹${pendingDisbursement.toLocaleString()}`}
          icon="schedule"
          colorScheme="orange"
          subtitle="Approved & In Queue"
        />
        <StatCard
          title="Credited Students"
          value={creditedCount}
          icon="check_circle"
          colorScheme="blue"
          subtitle="Students Paid"
        />
        <StatCard
          title="Awaiting Finance"
          value={pendingCount}
          icon="pending_actions"
          colorScheme="purple"
          subtitle="Needs verification"
        />
      </div>

      {/* Row 1 Charts */}
      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Scholarship Receipts Distribution by Portal">
          <div style={{ height: 220 }}>
            <ReceiptsChart />
          </div>
        </FormCard>

        <FormCard title="DBT Execution Progress Rates">
          <div style={{ height: 220 }}>
            <ExecutionChart />
          </div>
        </FormCard>
      </div>

      {/* Row 2 Charts */}
      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Scholarship Allocations by Source Agency">
          <div style={{ height: 220 }}>
            <AllocationsChart />
          </div>
        </FormCard>

        <FormCard title="Disbursement Clearance Rates (APBS vs NEFT)">
          <div style={{ height: 220 }}>
            <ClearanceChart />
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
          onClick={() => navigate(dbtUrls.finance.receipts)}
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
          Verify Receipts →
        </button>
        <button
          onClick={() => navigate(dbtUrls.finance.feeAdjustment)}
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
          Adjust Student Fees →
        </button>
      </div>
    </FormPage>
  );
}
