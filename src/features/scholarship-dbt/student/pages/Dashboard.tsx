import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const MY_APP = studentApplications[0]; // Priya Sharma

// Standalone Chart Components
function ProgressChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Under Review', 'Pending'],
        datasets: [
          {
            data: [55, 25, 20],
            backgroundColor: ['#22c55e', '#3b82f6', '#e5e7eb'],
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
            labels: { boxWidth: 12, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function EligibilityChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['NSP SC', 'MP MMVY', 'DAVV Merit', 'HDFC Kadam'],
        datasets: [
          {
            label: 'Required Min',
            data: [6.0, 7.5, 8.0, 5.5],
            backgroundColor: '#cbd5e1',
          },
          {
            label: 'My Score',
            data: [8.8, 8.8, 8.8, 8.8],
            backgroundColor: '#3b82f6',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 10 },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

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
            label: 'DBT Received (₹)',
            data: [15000, 18000, 22000, 24000, 31000, 45000],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Student Dashboard"
      description={`Welcome, ${MY_APP.studentName} — ${MY_APP.enrollmentNo} · ${MY_APP.course} ${MY_APP.branch}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI Cards */}
      <div className="dbt-stats-grid">
        <StatCard
          title="Active Scholarships"
          value="1"
          icon="workspace_premium"
          colorScheme="blue"
          subtitle="AY 2025-26"
        />
        <StatCard
          title="Applied"
          value="1"
          icon="assignment"
          colorScheme="purple"
          subtitle="This year"
        />
        <StatCard
          title="Pending Verification"
          value="0"
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Awaiting action"
        />
        <StatCard
          title="Approved"
          value="0"
          icon="check_circle"
          colorScheme="green"
          subtitle="Sanctioned"
        />
        <StatCard
          title="Rejected"
          value="0"
          icon="cancel"
          colorScheme="red"
          subtitle="This year"
        />
        <StatCard
          title="DBT Received"
          value="₹0"
          icon="account_balance_wallet"
          colorScheme="teal"
          subtitle="Credited to bank"
        />
        <StatCard
          title="Pending Amount"
          value={`₹${MY_APP.amount.toLocaleString()}`}
          icon="schedule"
          colorScheme="amber"
          subtitle="Under processing"
        />
        <StatCard
          title="Notifications"
          value="3"
          icon="notifications"
          colorScheme="indigo"
          subtitle="Unread"
        />
      </div>

      {/* Row 1 Charts */}
      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Scholarship Progress Allocation (Stage Weightage)">
          <div style={{ height: 220 }}>
            <ProgressChart />
          </div>
        </FormCard>

        <FormCard title="My CGPA vs Scheme Requirements">
          <div style={{ height: 220 }}>
            <EligibilityChart />
          </div>
        </FormCard>
      </div>

      {/* Row 2 Charts */}
      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="DBT Disbursement Monthly Trend">
          <div style={{ height: 220 }}>
            <TrendChart />
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
          onClick={() => navigate(dbtUrls.student.apply)}
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
          Apply Form
        </button>
        <button
          onClick={() => navigate(dbtUrls.student.documents)}
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
          Upload Documents
        </button>
        <button
          onClick={() => navigate(dbtUrls.student.track)}
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
          Track Progress
        </button>
      </div>
    </FormPage>
  );
}
