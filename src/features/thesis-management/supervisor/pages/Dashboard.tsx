import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { scholars } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

function PhaseDistributionChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'Proposal Approved',
          'Writing Thesis',
          'Synopsis Pending',
          'Viva Scheduled',
        ],
        datasets: [
          {
            data: [1, 1, 1, 1],
            backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#22c55e'],
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

function PlagiarismBarChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: scholars.map(s => s.name.split(' ')[0]),
        datasets: [
          {
            label: 'Threshold',
            data: [10, 10, 10, 10],
            backgroundColor: '#fee2e2',
          },
          {
            label: 'Scholar Similarity %',
            data: scholars.map(s => s.similarity),
            backgroundColor: scholars.map(s =>
              s.similarity <= 10 ? '#22c55e' : '#ef4444'
            ),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 30 } },
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

function MeetingTrendChart() {
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
            label: 'Advisory Meetings Conducted',
            data: [4, 6, 8, 7, 10, 9],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.1)',
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

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const active = scholars.filter(s => s.status === 'Active').length;

  return (
    <FormPage
      title="Supervisor Dashboard"
      description="Dr. Sanjay Tanwani — Research Supervision Overview, Scholar Progress and Pending Actions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Supervisor Portal', to: thesisUrls.supervisor.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Total Scholars"
          value={scholars.length}
          icon="groups"
          colorScheme="blue"
          subtitle="Allocated under supervision"
        />
        <StatCard
          title="Active Scholars"
          value={active}
          icon="school"
          colorScheme="green"
          subtitle="Currently enrolled"
        />
        <StatCard
          title="Pending Reviews"
          value="3"
          icon="pending_actions"
          colorScheme="orange"
          subtitle="Proposals & reports"
        />
        <StatCard
          title="Overdue Milestones"
          value="1"
          icon="warning"
          colorScheme="red"
          subtitle="Needs immediate action"
        />
        <StatCard
          title="Meetings This Month"
          value="9"
          icon="event"
          colorScheme="purple"
          subtitle="June 2026"
        />
        <StatCard
          title="Avg Plagiarism"
          value="7.9%"
          icon="verified_user"
          colorScheme="teal"
          subtitle="All scholars combined"
        />
        <StatCard
          title="Papers Published"
          value="12"
          icon="article"
          colorScheme="indigo"
          subtitle="Under your guidance"
        />
        <StatCard
          title="Scholars Completed"
          value="4"
          icon="emoji_events"
          colorScheme="amber"
          subtitle="All time"
        />
      </div>

      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Scholar Phase Distribution">
          <div style={{ height: 240 }}>
            <PhaseDistributionChart />
          </div>
        </FormCard>
        <FormCard title="Plagiarism Similarity Comparison">
          <div style={{ height: 240 }}>
            <PlagiarismBarChart />
          </div>
        </FormCard>
      </div>

      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Monthly Advisory Meeting Trend">
          <div style={{ height: 220 }}>
            <MeetingTrendChart />
          </div>
        </FormCard>
        <FormCard title="Pending Action Items">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {[
              {
                text: 'Review Progress Report — Rajesh Sahu (Jun 2026)',
                priority: 'High',
                color: '#ef4444',
              },
              {
                text: 'Review Proposal V1.0 — Amit Khandelwal',
                priority: 'High',
                color: '#ef4444',
              },
              {
                text: 'Sign-off Milestone: Plagiarism Clear — Priya Verma',
                priority: 'Medium',
                color: '#f59e0b',
              },
              {
                text: 'Schedule Viva Jury Recommendation — Sunita Chouhan',
                priority: 'Medium',
                color: '#f59e0b',
              },
              {
                text: 'Log Meeting Notes — 25 Jun 2026 (Rajesh)',
                priority: 'Low',
                color: '#3b82f6',
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
                  borderLeft: `3px solid ${a.color}`,
                }}
              >
                <p style={{ fontSize: '0.75rem', color: '#374151' }}>
                  {a.text}
                </p>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    color: a.color,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {a.priority}
                </span>
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
          onClick={() => navigate(thesisUrls.supervisor.scholarsList)}
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
          Scholar List →
        </button>
        <button
          onClick={() => navigate(thesisUrls.supervisor.proposalReview)}
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
          Review Proposals →
        </button>
        <button
          onClick={() => navigate(thesisUrls.supervisor.milestones)}
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
          Sign Milestones →
        </button>
      </div>
    </FormPage>
  );
}
