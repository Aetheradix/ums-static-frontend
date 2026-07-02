import { useEffect, useMemo, useRef } from 'react';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { cases, hearings } from '../../mocks';
import { legalUrls } from '../../urls';
import '../../LegalCase.css';

function CasesByStatusChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const counts = {
      Pending: cases.filter(c => c.status === 'Pending').length,
      'In-favour': cases.filter(c => c.status === 'In-favour').length,
      Against: cases.filter(c => c.status === 'Against').length,
      Disposed: cases.filter(c => c.status === 'Disposed').length,
    };
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(counts),
        datasets: [
          {
            data: Object.values(counts),
            backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#94a3b8'],
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

export default function Dashboard() {
  const stats = useMemo(
    () => ({
      total: cases.length,
      pending: cases.filter(c => c.status === 'Pending').length,
      upcomingHearings: hearings.filter(h => h.status === 'Scheduled').length,
      disposed: cases.filter(c => c.status === 'Disposed' || c.disposalDate)
        .length,
    }),
    []
  );

  return (
    <FormPage
      title="Legal Case Dashboard"
      description="Read-only overview of the university legal caseload."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Legal Case Management', to: legalUrls.portal },
        { label: 'Case Viewer', to: legalUrls.viewer.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="lcm-stats-grid">
        <StatCard
          title="Total Cases"
          value={stats.total}
          icon="gavel"
          colorScheme="blue"
          subtitle="All-time registered"
        />
        <StatCard
          title="Pending Cases"
          value={stats.pending}
          icon="hourglass_top"
          colorScheme="amber"
          subtitle="Awaiting hearing / judgment"
        />
        <StatCard
          title="Upcoming Hearings"
          value={stats.upcomingHearings}
          icon="event"
          colorScheme="purple"
          subtitle="Scheduled next"
        />
        <StatCard
          title="Disposed Cases"
          value={stats.disposed}
          icon="task_alt"
          colorScheme="green"
          subtitle="Closed / resolved"
        />
      </div>

      <div className="lcm-charts-row">
        <FormCard title="Cases by Status">
          <div className="lcm-chart-box">
            <CasesByStatusChart />
          </div>
        </FormCard>
        <FormCard title="About this view">
          <p className="p-1 text-sm leading-relaxed text-gray-600">
            The Case Viewer role provides read-only visibility into the legal
            register. Use the Case Register to browse case details and the
            Reports section to analyse the caseload by status, court and type.
          </p>
        </FormCard>
      </div>
    </FormPage>
  );
}
