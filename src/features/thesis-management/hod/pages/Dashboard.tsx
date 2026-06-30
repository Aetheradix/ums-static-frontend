import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { scholars, supervisors } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

function PhasePolarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: ['Proposal', 'Writing', 'Synopsis', 'Viva', 'Completed'],
        datasets: [
          {
            data: [1, 1, 1, 1, 0],
            backgroundColor: [
              'rgba(99,102,241,0.6)',
              'rgba(16,185,129,0.6)',
              'rgba(245,158,11,0.6)',
              'rgba(34,197,94,0.6)',
              'rgba(168,85,247,0.6)',
            ],
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

function WorkloadBarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const activeSupervisors = supervisors.filter(s => s.status === 'Active');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: activeSupervisors.map(s => s.name.split(' ')[1]),
        datasets: [
          {
            label: 'Max Limit',
            data: activeSupervisors.map(s => s.maxLimit),
            backgroundColor: '#e5e7eb',
          },
          {
            label: 'Allocated',
            data: activeSupervisors.map(s => s.currentAllocation),
            backgroundColor: activeSupervisors.map(s =>
              s.currentAllocation >= s.maxLimit ? '#ef4444' : '#3b82f6'
            ),
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

function CompletionTrendChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [
          {
            label: 'PhD Completions',
            data: [2, 3, 4, 3, 5, 4],
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168,85,247,0.1)',
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

export default function HodDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="HOD Dashboard"
      description="School of Computer Science & IT — Research Pipeline Overview, Approvals and Supervisor Workload."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'HOD Portal', to: thesisUrls.hod.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Total Scholars"
          value={scholars.length}
          icon="school"
          colorScheme="blue"
          subtitle="Active in department"
        />
        <StatCard
          title="Proposals Pending"
          value="1"
          icon="approval"
          colorScheme="orange"
          subtitle="Awaiting HOD approval"
        />
        <StatCard
          title="Supervisors Active"
          value={supervisors.filter(s => s.status === 'Active').length}
          icon="groups"
          colorScheme="green"
          subtitle="Guiding scholars"
        />
        <StatCard
          title="Synopsis Pending"
          value="2"
          icon="edit_note"
          colorScheme="purple"
          subtitle="Endorsement needed"
        />
        <StatCard
          title="Overdue Milestones"
          value="1"
          icon="warning"
          colorScheme="red"
          subtitle="Department-wide"
        />
        <StatCard
          title="PhD Completions"
          value="4"
          icon="emoji_events"
          colorScheme="teal"
          subtitle="This academic year"
        />
        <StatCard
          title="Avg Similarity"
          value="7.9%"
          icon="verified_user"
          colorScheme="indigo"
          subtitle="All dept. scholars"
        />
        <StatCard
          title="Papers Published"
          value="18"
          icon="article"
          colorScheme="amber"
          subtitle="By dept. scholars"
        />
      </div>

      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Scholar Research Phase Distribution">
          <div style={{ height: 240 }}>
            <PhasePolarChart />
          </div>
        </FormCard>
        <FormCard title="Supervisor Allocation vs Limit">
          <div style={{ height: 240 }}>
            <WorkloadBarChart />
          </div>
        </FormCard>
      </div>

      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Year-wise PhD Completion Trend">
          <div style={{ height: 220 }}>
            <CompletionTrendChart />
          </div>
        </FormCard>
        <FormCard title="Approval Queue (Action Required)">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {[
              {
                name: 'Amit Khandelwal',
                type: 'Proposal Approval',
                date: '28 Jun 2026',
                priority: '#ef4444',
              },
              {
                name: 'Rajesh Kumar Sahu',
                type: 'Synopsis Endorsement',
                date: '15 Jun 2026',
                priority: '#f59e0b',
              },
              {
                name: 'Priya Verma',
                type: 'Synopsis Endorsement',
                date: '10 Jun 2026',
                priority: '#f59e0b',
              },
              {
                name: 'Sunita Chouhan',
                type: 'Thesis Endorsement',
                date: '01 Jun 2026',
                priority: '#3b82f6',
              },
            ].map((a, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  background: '#f8fafc',
                  borderRadius: 6,
                  borderLeft: `3px solid ${a.priority}`,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#1f2937',
                    }}
                  >
                    {a.name}
                  </p>
                  <p style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                    {a.type} · {a.date}
                  </p>
                </div>
                <button
                  type="button"
                  style={{
                    padding: '0.25rem 0.5rem',
                    border: `1px solid ${a.priority}`,
                    background: '#fff',
                    color: a.priority,
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: '0.688rem',
                    fontWeight: 700,
                  }}
                >
                  Review
                </button>
              </div>
            ))}
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
          onClick={() => navigate(thesisUrls.hod.proposalApprovals)}
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
          Approve Proposals →
        </button>
        <button
          onClick={() => navigate(thesisUrls.hod.supervisorWorkload)}
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
          Supervisor Workload →
        </button>
        <button
          onClick={() => navigate(thesisUrls.hod.deptProgress)}
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
          Dept Progress →
        </button>
      </div>
    </FormPage>
  );
}
