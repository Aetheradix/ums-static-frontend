import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Chart } from 'primereact/chart';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Grid from 'shared/components/grid/Grid';
import { FormCard, FormPage } from 'shared/new-components';
import './Dashboard.css';

interface KpiLocationState {
  title?: string;
  value?: string;
  change?: string;
}

interface KpiActivityItem {
  date: string;
  reference: string;
  activity: string;
  status: 'Completed' | 'In Review';
}

function titleFromSlug(slug = '') {
  return slug
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function useDetailTheme() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

export default function KpiDetailPage() {
  const { kpiId } = useParams<{ kpiId: string }>();
  const location = useLocation();
  const isDark = useDetailTheme();

  const state = location.state as KpiLocationState | null;

  const title = state?.title || titleFromSlug(kpiId);
  const currentValue = state?.value || '₹25,000,000';
  const currentStatus = state?.change || 'Approved Plan';

  const chartTextColor = isDark ? '#d4d4d8' : '#52525b';
  const chartMutedColor = isDark ? '#a1a1aa' : '#71717a';
  const chartGridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#eef2f7';

  const trendData = useMemo(
    () => ({
      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      datasets: [
        {
          label: title,
          data: [68, 72, 75, 79, 84, 88],
          borderColor: isDark ? '#60a5fa' : '#002069',
          backgroundColor: isDark
            ? 'rgba(96, 165, 250, 0.12)'
            : 'rgba(0, 32, 105, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: isDark ? '#bfdbfe' : '#ffffff',
        },
      ],
    }),
    [isDark, title]
  );

  const trendOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: chartTextColor,
            usePointStyle: true,
            boxWidth: 8,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: chartMutedColor },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { color: chartMutedColor },
          grid: { color: chartGridColor },
        },
      },
    }),
    [chartGridColor, chartMutedColor, chartTextColor]
  );

  const activities = useMemo<KpiActivityItem[]>(
    () => [
      {
        date: '18 Jul 2026',
        reference: 'FIN-2026-0148',
        activity: `${title} reviewed by Finance Controller`,
        status: 'Completed',
      },
      {
        date: '15 Jul 2026',
        reference: 'FIN-2026-0136',
        activity: 'Monthly financial data synchronized',
        status: 'Completed',
      },
      {
        date: '10 Jul 2026',
        reference: 'FIN-2026-0119',
        activity: 'Supporting documents submitted',
        status: 'In Review',
      },
    ],
    [title]
  );

  const activityColumns =
    useMemo((): Controls.ColumnProps<KpiActivityItem>[] => {
      return [
        {
          field: 'date',
          header: 'Date',
          width: '140px',
        },
        {
          field: 'reference',
          header: 'Reference',
          width: '180px',
        },
        {
          field: 'activity',
          header: 'Activity',
        },
        {
          field: 'status',
          header: 'Status',
          width: '140px',
          cell: item => (
            <span
              className={
                item.status === 'Completed'
                  ? 'kpi-detail-status kpi-detail-status--success'
                  : 'kpi-detail-status kpi-detail-status--pending'
              }
            >
              {item.status}
            </span>
          ),
        },
      ];
    }, []);

  return (
    <FormPage
      title={title}
      description={`Detailed financial information and recent activity for ${title}.`}
    >
      <div className="kpi-detail-page">
        <section className="kpi-detail-hero">
          <div className="kpi-detail-hero-content">
            <span className="kpi-detail-eyebrow">Financial KPI Overview</span>

            <h2 className="kpi-detail-title">{title}</h2>

            <p className="kpi-detail-description">
              Review the current value, financial-year performance, approval
              status, ownership and recent activity for this metric.
            </p>
          </div>

          <div className="kpi-detail-verified">
            <CheckCircle2 />

            <div>
              <strong>Verified data</strong>
              <span>Finance Controller</span>
            </div>
          </div>
        </section>

        <section className="kpi-detail-summary-grid">
          <article className="kpi-detail-summary-card">
            <span className="kpi-detail-summary-icon">
              <TrendingUp />
            </span>

            <p>Current Value</p>
            <strong>{currentValue}</strong>
            <span>{currentStatus}</span>
          </article>

          <article className="kpi-detail-summary-card">
            <span className="kpi-detail-summary-icon">
              <CalendarDays />
            </span>

            <p>Financial Year</p>
            <strong>2025–2026</strong>
            <span>Current reporting period</span>
          </article>

          <article className="kpi-detail-summary-card">
            <span className="kpi-detail-summary-icon">
              <ShieldCheck />
            </span>

            <p>Approval Status</p>
            <strong>Approved</strong>
            <span>Finance Controller verified</span>
          </article>

          <article className="kpi-detail-summary-card">
            <span className="kpi-detail-summary-icon">
              <Clock3 />
            </span>

            <p>Last Updated</p>
            <strong>18 Jul 2026</strong>
            <span>10:45 AM</span>
          </article>
        </section>

        <section className="kpi-detail-content-grid">
          <FormCard>
            <div className="kpi-detail-card-header">
              <div>
                <span>Trend Analysis</span>
                <h3>Performance Trend</h3>
                <p>Monthly movement for the selected financial year.</p>
              </div>

              <TrendingUp />
            </div>

            <div className="kpi-detail-chart">
              <Chart data={trendData} options={trendOptions} type="line" />
            </div>
          </FormCard>

          <FormCard>
            <div className="kpi-detail-card-header">
              <div>
                <span>Metric Profile</span>
                <h3>Metric Information</h3>
                <p>Ownership and reporting details.</p>
              </div>

              <FileText />
            </div>

            <dl className="kpi-detail-info-list">
              <div>
                <dt>Metric Name</dt>
                <dd>{title}</dd>
              </div>

              <div>
                <dt>Responsible Department</dt>
                <dd>Finance & Accounts</dd>
              </div>

              <div>
                <dt>Reporting Frequency</dt>
                <dd>Monthly</dd>
              </div>

              <div>
                <dt>Data Source</dt>
                <dd>General Ledger and Budget Module</dd>
              </div>

              <div>
                <dt>Verification Level</dt>
                <dd>Finance Controller</dd>
              </div>
            </dl>
          </FormCard>
        </section>

        <FormCard>
          <div className="kpi-detail-card-header">
            <div>
              <span>Audit Trail</span>
              <h3>Recent Activity</h3>
              <p>Latest changes and verification actions for this KPI.</p>
            </div>

            <Clock3 />
          </div>

          <div className="kpi-detail-grid-wrapper">
            <Grid<KpiActivityItem>
              data={activities}
              columns={activityColumns}
              pagination={false}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
