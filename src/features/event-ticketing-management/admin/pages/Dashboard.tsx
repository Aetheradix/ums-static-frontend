import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { categories, events, registrations } from '../../mocks';
import { eventUrls } from '../../urls';
import '../../EventTicketing.css';

const EVENT_STATUSES = [
  'Draft',
  'Pending Approval',
  'Approved',
  'Published',
  'Ongoing',
  'Completed',
  'Archived',
] as const;

function EventsByStatusChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const data = EVENT_STATUSES.map(
      s => events.filter(e => e.status === s).length
    );
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [...EVENT_STATUSES],
        datasets: [
          {
            data,
            backgroundColor: [
              '#94a3b8',
              '#f59e0b',
              '#22c55e',
              '#10b981',
              '#0ea5e9',
              '#6366f1',
              '#64748b',
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

function RevenueByCategoryChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const labels = categories.map(c => c.name);
    const data = categories.map(cat =>
      events
        .filter(e => e.categoryId === cat.id)
        .reduce((sum, e) => sum + e.ticketPrice * e.registered, 0)
    );
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Revenue (₹)', data, backgroundColor: '#6366f1' }],
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

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const totalRevenue = events.reduce(
      (sum, e) => sum + e.ticketPrice * e.registered,
      0
    );
    const checkedIn = registrations.filter(
      r => r.status === 'Checked-In'
    ).length;
    const attendancePct = registrations.length
      ? Math.round((checkedIn / registrations.length) * 100)
      : 0;
    return {
      totalEvents: events.length,
      registrations: registrations.length,
      revenue: totalRevenue,
      attendancePct,
    };
  }, []);

  return (
    <FormPage
      title="Event Dashboard"
      description="University events — registrations, revenue and attendance overview."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Event & Ticketing Management', to: eventUrls.portal },
        { label: 'Event Administrator', to: eventUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="etm-stats-grid">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon="event"
          colorScheme="blue"
          subtitle="Across all statuses"
        />
        <StatCard
          title="Registrations"
          value={stats.registrations}
          icon="groups"
          colorScheme="purple"
          subtitle="All events"
        />
        <StatCard
          title="Revenue"
          value={`₹${stats.revenue.toLocaleString('en-IN')}`}
          icon="payments"
          colorScheme="green"
          subtitle="Ticket sales"
        />
        <StatCard
          title="Attendance"
          value={`${stats.attendancePct}%`}
          icon="how_to_reg"
          colorScheme="amber"
          subtitle="Checked-in ratio"
        />
      </div>

      <div className="etm-charts-row">
        <FormCard title="Events by Status">
          <div className="etm-chart-box">
            <EventsByStatusChart />
          </div>
        </FormCard>
        <FormCard title="Revenue by Category">
          <div className="etm-chart-box">
            <RevenueByCategoryChart />
          </div>
        </FormCard>
      </div>

      <FormCard title="Quick Actions">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            label="Create New Event"
            icon="plus"
            onClick={() => navigate(eventUrls.admin.eventNew)}
          />
          <Button
            label="View Registrations"
            icon="list"
            variant="outlined"
            onClick={() => navigate(eventUrls.admin.registrations)}
          />
          <Button
            label="Open Reports"
            icon="chart-bar"
            variant="outlined"
            onClick={() => navigate(eventUrls.admin.reports)}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
