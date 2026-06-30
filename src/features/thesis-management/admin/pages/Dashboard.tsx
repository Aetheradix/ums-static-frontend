import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { scholars, supervisors } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

function OverallStatusChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'Proposal Phase',
          'Research & Writing',
          'Synopsis Seminar',
          'Jury Evaluation',
          'Completed',
        ],
        datasets: [
          {
            data: [1, 2, 0, 1, 4],
            backgroundColor: [
              '#ef4444',
              '#3b82f6',
              '#f59e0b',
              '#10b981',
              '#a855f7',
            ],
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

function DeptRegistrationChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['SCSIT', 'Electronics', 'Physics', 'Management', 'Chemistry'],
        datasets: [
          {
            label: 'Registered',
            data: [4, 2, 1, 3, 2],
            backgroundColor: '#3b82f6',
          },
          {
            label: 'Completed',
            data: [2, 1, 0, 2, 1],
            backgroundColor: '#10b981',
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

function EnrollmentTrendChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
        datasets: [
          {
            label: 'PhD Intake Registrations',
            data: [8, 12, 15, 14, 18, 22],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.1)',
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

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Admin Dashboard"
      description="DAVV University Research Services — Thesis Management Master Controls & Audits."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Active Scholars"
          value={scholars.length}
          icon="school"
          colorScheme="blue"
          subtitle="University total"
        />
        <StatCard
          title="Active Guides"
          value={supervisors.filter(s => s.status === 'Active').length}
          icon="groups"
          colorScheme="green"
          subtitle="Authorized advisors"
        />
        <StatCard
          title="System Warnings"
          value="1"
          icon="report_problem"
          colorScheme="orange"
          subtitle="Milestone Overdue"
        />
        <StatCard
          title="Clearance Rate"
          value="92.4%"
          icon="verified_user"
          colorScheme="purple"
          subtitle="Overall compliance"
        />
      </div>

      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Research Pipeline Stage Share">
          <div style={{ height: 240 }}>
            <OverallStatusChart />
          </div>
        </FormCard>
        <FormCard title="Departmental Research Volume">
          <div style={{ height: 240 }}>
            <DeptRegistrationChart />
          </div>
        </FormCard>
      </div>

      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Year-on-Year PhD Registration Trend">
          <div style={{ height: 220 }}>
            <EnrollmentTrendChart />
          </div>
        </FormCard>
        <FormCard title="Quick Administrative Shortcuts">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              height: '100%',
              alignContent: 'center',
            }}
          >
            <button
              onClick={() => navigate(thesisUrls.admin.programMaster)}
              className="dbt-report-btn"
              style={{
                padding: '1rem',
                background: '#f5f3ff',
                border: '1px solid #ddd',
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <p style={{ fontWeight: 700, color: '#4f46e5' }}>
                Program Master
              </p>
              <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                Configure research degrees
              </p>
            </button>
            <button
              onClick={() => navigate(thesisUrls.admin.supervisorMaster)}
              className="dbt-report-btn"
              style={{
                padding: '1rem',
                background: '#ecfdf5',
                border: '1px solid #ddd',
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <p style={{ fontWeight: 700, color: '#059669' }}>
                Supervisor Master
              </p>
              <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                Manage guide registry
              </p>
            </button>
            <button
              onClick={() => navigate(thesisUrls.admin.milestoneConfig)}
              className="dbt-report-btn"
              style={{
                padding: '1rem',
                background: '#eff6ff',
                border: '1px solid #ddd',
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <p style={{ fontWeight: 700, color: '#1d4ed8' }}>
                Milestones Config
              </p>
              <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                Configure journey milestones
              </p>
            </button>
            <button
              onClick={() => navigate(thesisUrls.admin.auditLogs)}
              className="dbt-report-btn"
              style={{
                padding: '1rem',
                background: '#f9fafb',
                border: '1px solid #ddd',
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <p style={{ fontWeight: 700, color: '#4b5563' }}>
                System Audit Logs
              </p>
              <p style={{ fontSize: '0.688rem', color: '#6b7280' }}>
                View complete audit trails
              </p>
            </button>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
