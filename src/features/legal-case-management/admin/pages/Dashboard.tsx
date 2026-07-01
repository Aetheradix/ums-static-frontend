import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { cases, courts, hearings } from '../../mocks';
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

function CasesByCourtChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const labels = courts.map(c => c.code);
    const data = courts.map(
      court => cases.filter(c => c.courtId === court.id).length
    );
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Cases', data, backgroundColor: '#3b82f6' }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { precision: 0 } } },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function CasesByTypeChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const types = Array.from(new Set(cases.map(c => c.caseTypeName)));
    const data = types.map(t => cases.filter(c => c.caseTypeName === t).length);
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: types,
        datasets: [
          {
            data,
            backgroundColor: ['#6366f1', '#0ea5e9', '#f43f5e', '#22c55e'],
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
  const navigate = useNavigate();

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
      description="University legal cell — caseload, hearings and disposal overview."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Legal Case Management', to: legalUrls.portal },
        { label: 'Case Administrator', to: legalUrls.admin.portal },
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
        <FormCard title="Cases by Court">
          <div className="lcm-chart-box">
            <CasesByCourtChart />
          </div>
        </FormCard>
      </div>

      <div className="lcm-charts-row">
        <FormCard title="Cases by Type">
          <div className="lcm-chart-box">
            <CasesByTypeChart />
          </div>
        </FormCard>
        <FormCard title="Quick Actions">
          <div className="flex flex-col gap-3">
            <Button
              label="Register New Case"
              icon="plus"
              onClick={() => navigate(legalUrls.admin.caseNew)}
            />
            <Button
              label="Schedule / View Hearings"
              icon="calendar"
              variant="outlined"
              onClick={() => navigate(legalUrls.admin.hearings)}
            />
            <Button
              label="Log Advocate Payment"
              icon="wallet"
              variant="outlined"
              onClick={() => navigate(legalUrls.admin.payments)}
            />
            <Button
              label="Open Reports"
              icon="chart-bar"
              variant="outlined"
              onClick={() => navigate(legalUrls.admin.reports)}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
