import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { complaints } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function GrievanceCellDashboard() {
  const navigate = useNavigate();

  const pendingCount = complaints.filter(
    c =>
      c.status === 'Submitted' ||
      c.status === 'Department Review' ||
      c.status === 'HoD Review'
  ).length;
  const committeeCount = complaints.filter(
    c => c.status === 'Committee Review'
  ).length;
  const closedCount = complaints.filter(
    c => c.status === 'Closed' || c.status === 'Registrar Decision'
  ).length;

  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let chart: Chart | null = null;
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Pending Review', 'Under Committee', 'Resolved & Closed'],
            datasets: [
              {
                data: [pendingCount, committeeCount, closedCount],
                backgroundColor: ['#f59e0b', '#8b5cf6', '#10b981'],
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
                labels: { boxWidth: 10, font: { size: 10 } },
              },
            },
          },
        });
      }
    }
    return () => {
      if (chart) chart.destroy();
    };
  }, [pendingCount, committeeCount, closedCount]);

  return (
    <FormPage
      title="Grievance Cell Administration Hub"
      description="DAVV Indore — Monitor university grievances, assign files, and coordinate statutory committee reviews."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Grievance Cell Portal', to: grvUrls.cell.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grv-stats-grid">
        <StatCard
          title="Pending Queue"
          value={pendingCount}
          icon="hourglass"
          colorScheme="orange"
          subtitle="Awaiting file movement"
        />
        <StatCard
          title="In Committee Review"
          value={committeeCount}
          icon="people"
          colorScheme="purple"
          subtitle="Under detailed hearing"
        />
        <StatCard
          title="Closed Files"
          value={closedCount}
          icon="check_circle"
          colorScheme="green"
          subtitle="Settled files"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FormCard title="Queue Distribution">
            <div style={{ height: 200 }}>
              <canvas ref={chartRef} />
            </div>
          </FormCard>
        </div>

        <div className="lg:col-span-2">
          <FormCard title="Quick Admin Actions">
            <div className="grv-quick-actions">
              <button
                className="grv-quick-action-btn"
                onClick={() => navigate(grvUrls.cell.management)}
              >
                <i className="pi pi-sliders-h text-green-600"></i>
                <span>Grievance Registry</span>
              </button>
              <button
                className="grv-quick-action-btn"
                onClick={() => navigate(grvUrls.cell.committee)}
              >
                <i className="pi pi-users text-purple-600"></i>
                <span>Committee Desk</span>
              </button>
              <button
                className="grv-quick-action-btn"
                onClick={() => navigate(grvUrls.cell.reports)}
              >
                <i className="pi pi-chart-bar text-indigo-600"></i>
                <span>Reports Panel</span>
              </button>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
