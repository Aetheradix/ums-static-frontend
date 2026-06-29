import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const PENDING = studentApplications.filter(a => a.status === 'Submitted');
const VERIFIED = studentApplications.filter(
  a => a.status !== 'Submitted' && a.status !== 'Draft' && a.teacherRemarks
);
const REJECTED = studentApplications.filter(a => a.status === 'Rejected');

// Standalone Chart Components
function BacklogChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Verified', 'Rejected'],
        datasets: [
          {
            data: [PENDING.length, VERIFIED.length, REJECTED.length],
            backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
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

function AttendanceChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Priya', 'Rahul', 'Vikram', 'Pooja', 'Ravi'],
        datasets: [
          {
            label: 'Attendance (%)',
            data: [82, 78, 68, 92, 87],
            backgroundColor: [
              '#10b981',
              '#10b981',
              '#ef4444',
              '#10b981',
              '#10b981',
            ],
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

function BreakdownChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Academic', 'Attendance', 'Documents', 'Bank Details'],
        datasets: [
          {
            label: 'Verification Rate (%)',
            data: [85, 92, 78, 95],
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

function OutcomesChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Verified', 'Pending', 'Rejected'],
        datasets: [
          {
            data: [64, 22, 14],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
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

export default function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Teacher Dashboard — Scholarship Verification"
      description="Dr. Anil Sharma · HOD, School of Computer Science"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Teacher Portal', to: dbtUrls.teacher.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Pending Verification"
          value={PENDING.length}
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Awaiting your review"
        />
        <StatCard
          title="Verified Today"
          value={VERIFIED.length}
          icon="check_circle"
          colorScheme="green"
          subtitle="Teacher approved"
        />
        <StatCard
          title="Rejected"
          value={REJECTED.length}
          icon="cancel"
          colorScheme="red"
          subtitle="This month"
        />
        <StatCard
          title="Attendance Eligible"
          value="18"
          icon="assignment_turned_in"
          colorScheme="blue"
          subtitle="≥75% attendance"
        />
        <StatCard
          title="CGPA Eligible"
          value="22"
          icon="star"
          colorScheme="purple"
          subtitle="CGPA ≥ 6.0"
        />
        <StatCard
          title="Average Attendance"
          value="83.2%"
          icon="bar_chart"
          colorScheme="teal"
          subtitle="Department average"
        />
      </div>

      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Verification Backlog Share">
          <div style={{ height: 220 }}>
            <BacklogChart />
          </div>
        </FormCard>

        <FormCard title="Attendance Overview (My Department)">
          <div style={{ height: 220 }}>
            <AttendanceChart />
          </div>
        </FormCard>
      </div>

      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Verification Process Breakdown">
          <div style={{ height: 220 }}>
            <BreakdownChart />
          </div>
        </FormCard>

        <FormCard title="Verification Outcomes Distribution">
          <div style={{ height: 220 }}>
            <OutcomesChart />
          </div>
        </FormCard>
      </div>

      <div
        style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}
      >
        <button
          onClick={() => navigate(dbtUrls.teacher.pending)}
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
          Verify Pending Applications →
        </button>
      </div>
    </FormPage>
  );
}
