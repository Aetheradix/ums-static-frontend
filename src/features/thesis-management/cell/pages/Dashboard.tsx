import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { scholars, milestones } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

function RegistrationStatusChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Registered', 'Pending Code', 'Under Review', 'Completed'],
        datasets: [
          {
            data: [3, 1, 2, 4],
            backgroundColor: ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7'],
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

function MilestoneStatusChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const completed = milestones.filter(m => m.status === 'Completed').length;
    const inProgress = milestones.filter(
      m => m.status === 'In Progress'
    ).length;
    const pending = milestones.filter(m => m.status === 'Pending').length;
    const overdue = milestones.filter(m => m.status === 'Overdue').length;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
        datasets: [
          {
            label: 'Milestones',
            data: [completed, inProgress, pending, overdue],
            backgroundColor: ['#22c55e', '#3b82f6', '#e5e7eb', '#ef4444'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function PlagiarismSpreadChart() {
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
            label: 'Threshold (10%)',
            data: [10, 10, 10, 10],
            backgroundColor: '#fecaca',
          },
          {
            label: 'Scholar Similarity',
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
        scales: { y: { max: 30 } },
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

export default function CellDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Research Cell Dashboard"
      description="DAVV University Research Cell (URC) — Registration, Pipeline and Operational Metrics."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Research Cell', to: thesisUrls.cell.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Total Registrations"
          value={scholars.length}
          icon="how_to_reg"
          colorScheme="blue"
          subtitle="Active PhD scholars"
        />
        <StatCard
          title="Proposals Pending"
          value="1"
          icon="pending_actions"
          colorScheme="orange"
          subtitle="HOD approved, URC pending"
        />
        <StatCard
          title="Plagiarism Cleared"
          value="3"
          icon="verified_user"
          colorScheme="green"
          subtitle="Below 10% threshold"
        />
        <StatCard
          title="Plagiarism Flagged"
          value="1"
          icon="warning"
          colorScheme="red"
          subtitle="Above threshold"
        />
        <StatCard
          title="Jury Configured"
          value="1"
          icon="groups"
          colorScheme="purple"
          subtitle="Viva panels ready"
        />
        <StatCard
          title="Viva Scheduled"
          value="1"
          icon="event"
          colorScheme="teal"
          subtitle="Aug 2026"
        />
        <StatCard
          title="Repository Published"
          value="0"
          icon="library_books"
          colorScheme="indigo"
          subtitle="DOI not yet assigned"
        />
        <StatCard
          title="Overdue Milestones"
          value={milestones.filter(m => m.status === 'Overdue').length}
          icon="timer_off"
          colorScheme="amber"
          subtitle="Across all scholars"
        />
      </div>

      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Scholar Registration Pipeline Status">
          <div style={{ height: 240 }}>
            <RegistrationStatusChart />
          </div>
        </FormCard>
        <FormCard title="All-Scholar Milestone Status">
          <div style={{ height: 240 }}>
            <MilestoneStatusChart />
          </div>
        </FormCard>
      </div>

      <div className="dbt-charts-row" style={{ marginBottom: '1.5rem' }}>
        <FormCard title="Plagiarism Similarity Index Comparison">
          <div style={{ height: 220 }}>
            <PlagiarismSpreadChart />
          </div>
        </FormCard>
        <FormCard title="Recent URC Operations">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {[
              {
                text: 'Research Code DAVV-SCS-PHD-2025-0891 allocated — Rajesh Sahu',
                color: '#22c55e',
                date: '01 Jun 2026',
              },
              {
                text: 'Plagiarism score synced via Turnitin API — 8.5%',
                color: '#3b82f6',
                date: '12 Mar 2025',
              },
              {
                text: 'Viva scheduled — Sunita Chouhan — 18 Aug 2026',
                color: '#6366f1',
                date: '15 Jun 2026',
              },
              {
                text: 'Milestone overdue alert sent — Amit Khandelwal',
                color: '#f59e0b',
                date: '28 Jun 2026',
              },
              {
                text: 'DOI registration failed — Crossref timeout',
                color: '#ef4444',
                date: '27 Jun 2026',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                  padding: '0.5rem 0.75rem',
                  background: '#f8fafc',
                  borderRadius: 6,
                  borderLeft: `3px solid ${item.color}`,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#1f2937',
                    }}
                  >
                    {item.text}
                  </p>
                  <p style={{ fontSize: '0.625rem', color: '#9ca3af' }}>
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
          onClick={() => navigate(thesisUrls.cell.scholarRegistration)}
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
          Scholar Registration →
        </button>
        <button
          onClick={() => navigate(thesisUrls.cell.defenseScheduling)}
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
          Schedule Defense →
        </button>
        <button
          onClick={() => navigate(thesisUrls.cell.milestoneMonitoring)}
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
          Monitor Milestones →
        </button>
      </div>
    </FormPage>
  );
}
