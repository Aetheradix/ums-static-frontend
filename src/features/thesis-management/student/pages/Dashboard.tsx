import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { scholars, milestones } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

const ME = scholars[0];

function MilestoneChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const myMilestones = milestones.filter(m => m.scholarId === 'sch-1');
    const completed = myMilestones.filter(m => m.status === 'Completed').length;
    const inProgress = myMilestones.filter(
      m => m.status === 'In Progress'
    ).length;
    const pending = myMilestones.filter(m => m.status === 'Pending').length;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [
          {
            data: [completed, inProgress, pending],
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

function PhaseProgressChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Proposal',
          'Literature',
          'Experiments',
          'Synopsis',
          'Writing',
          'Defense',
        ],
        datasets: [
          {
            label: 'Target %',
            data: [100, 100, 80, 60, 40, 20],
            backgroundColor: '#e5e7eb',
          },
          {
            label: 'Achieved %',
            data: [100, 100, 45, 0, 0, 0],
            backgroundColor: '#6366f1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 100 } },
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

function PublicationTrendChart() {
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
            label: 'Papers Reviewed',
            data: [2, 5, 8, 12, 15, 22],
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

export default function StudentDashboard() {
  const navigate = useNavigate();
  const myMilestones = milestones.filter(m => m.scholarId === 'sch-1');
  const completed = myMilestones.filter(m => m.status === 'Completed').length;

  return (
    <FormPage
      title="Research Scholar Dashboard"
      description={`${ME.name} — ${ME.scholarId} · ${ME.program}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Research Phase"
          value={ME.phase}
          icon="flag"
          colorScheme="blue"
          subtitle={ME.program}
        />
        <StatCard
          title="Milestones Done"
          value={`${completed}/${myMilestones.length}`}
          icon="emoji_events"
          colorScheme="green"
          subtitle="Overall progress"
        />
        <StatCard
          title="Plagiarism Score"
          value={`${ME.similarity}%`}
          icon="verified_user"
          colorScheme="teal"
          subtitle="Turnitin Verified"
        />
        <StatCard
          title="Expected Completion"
          value={ME.expectedCompletion}
          icon="calendar_month"
          colorScheme="purple"
          subtitle="Program end date"
        />
        <StatCard
          title="Supervisor"
          value="Dr. S. Tanwani"
          icon="person"
          colorScheme="orange"
          subtitle="Primary Guide"
        />
        <StatCard
          title="Registration Date"
          value={ME.registrationDate}
          icon="event"
          colorScheme="indigo"
          subtitle="PhD enrollment"
        />
        <StatCard
          title="Research Code"
          value={ME.researchCode}
          icon="key"
          colorScheme="amber"
          subtitle="URC allocated"
        />
        <StatCard
          title="Upcoming Meeting"
          value="07 Jul 2026"
          icon="groups"
          colorScheme="red"
          subtitle="Next advisory meet"
        />
      </div>

      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Milestone Completion Status">
          <div style={{ height: 240 }}>
            <MilestoneChart />
          </div>
        </FormCard>
        <FormCard title="Research Phase Progress vs Target">
          <div style={{ height: 240 }}>
            <PhaseProgressChart />
          </div>
        </FormCard>
      </div>

      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Literature Review Reading Trend">
          <div style={{ height: 220 }}>
            <PublicationTrendChart />
          </div>
        </FormCard>
        <FormCard title="Recent Activity Log">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {[
              {
                date: '30 Jun 2026',
                event: 'Semester Progress Report submitted',
                color: '#3b82f6',
              },
              {
                date: '25 Jun 2026',
                event: 'Advisory meeting logged (Agenda: Tokenizer benchmark)',
                color: '#10b981',
              },
              {
                date: '15 Jun 2026',
                event: 'Plagiarism report refreshed — 8.5% similarity',
                color: '#22c55e',
              },
              {
                date: '01 Jun 2026',
                event: 'Research Code allocated by URC Cell',
                color: '#a855f7',
              },
              {
                date: '15 Mar 2026',
                event: 'Proposal approved by HOD',
                color: '#f59e0b',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                  padding: '0.5rem',
                  background: '#f8fafc',
                  borderRadius: 6,
                  borderLeft: `3px solid ${item.color}`,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '0.813rem',
                      fontWeight: 600,
                      color: '#1f2937',
                    }}
                  >
                    {item.event}
                  </p>
                  <p style={{ fontSize: '0.688rem', color: '#9ca3af' }}>
                    {item.date}
                  </p>
                </div>
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
          onClick={() => navigate(thesisUrls.student.topicRegistration)}
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
          Topic Registration →
        </button>
        <button
          onClick={() => navigate(thesisUrls.student.progressReports)}
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
          Submit Report →
        </button>
        <button
          onClick={() => navigate(thesisUrls.student.milestoneTracker)}
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
          View Milestones →
        </button>
      </div>
    </FormPage>
  );
}
