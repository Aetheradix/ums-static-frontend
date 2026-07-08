import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormCard,
  FormPage,
  StatCard,
  ProgressBar,
} from 'shared/new-components';
import { useAdminDashboardQuery } from '../../hooks/queries';
import { tpUrls } from '../../urls';

function ApplicantsBySeasonChart({
  data,
}: {
  data: { seasonCode: string; count: number }[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.seasonCode),
        datasets: [
          {
            label: 'Applicants',
            data: data.map(d => d.count),
            backgroundColor: '#6366f1',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={ref} className="h-64 w-full" />;
}

function MonthlyTrendChart({
  data,
}: {
  data: { month: string; count: number }[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.month),
        datasets: [
          {
            label: 'Applications',
            data: data.map(d => d.count),
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.1)',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={ref} className="h-64 w-full" />;
}

function CompanyDistributionChart({
  data,
}: {
  data: { sector: string; count: number }[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.sector),
        datasets: [
          {
            data: data.map(d => d.count),
            backgroundColor: [
              '#6366f1',
              '#3b82f6',
              '#06b6d4',
              '#10b981',
              '#f59e0b',
            ],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { boxWidth: 12 },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={ref} className="h-64 w-full" />;
}

function HiringFunnelChart({
  data,
}: {
  data: { stage: string; count: number }[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.stage),
        datasets: [
          {
            label: 'Candidates',
            data: data.map(d => d.count),
            backgroundColor: '#8b5cf6',
            borderRadius: 6,
          },
        ],
      },
      options: {
        indexAxis: 'y', // horizontal bar
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true } },
      },
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={ref} className="h-64 w-full" />;
}

function SeasonProgressBars({
  data,
}: {
  data: { seasonCode: string; completed: number; total: number }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {data.map(season => {
        const percentage = Math.round((season.completed / season.total) * 100);
        return (
          <div key={season.seasonCode} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>{season.seasonCode}</span>
              <span>{percentage}%</span>
            </div>
            <ProgressBar
              value={percentage}
              heightClass="h-2.5"
              roundedClass="rounded-full"
              colorClass="bg-indigo-600 transition-all duration-500"
              className="overflow-hidden"
            />
          </div>
        );
      })}
    </div>
  );
}
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: metrics, isLoading } = useAdminDashboardQuery();

  return (
    <FormPage
      title="Training & Placement Dashboard"
      description="Monitor campus recruitment activity, companies, and student applications."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      {isLoading || !metrics ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <button
              type="button"
              className="cursor-pointer text-left"
              onClick={() => navigate(tpUrls.admin.companies)}
            >
              <StatCard
                title="Total Companies"
                value={metrics.totalCompanies}
                icon="business"
                colorScheme="indigo"
              />
            </button>
            <button
              type="button"
              className="cursor-pointer text-left"
              onClick={() => navigate(tpUrls.admin.applications)}
            >
              <StatCard
                title="Total Applicants"
                value={metrics.totalApplicants}
                icon="groups"
                colorScheme="blue"
              />
            </button>
            <button
              type="button"
              className="cursor-pointer text-left"
              onClick={() => navigate(tpUrls.admin.opportunities)}
            >
              <StatCard
                title="Active Job Posts"
                value={metrics.totalJobPosts}
                icon="work"
                colorScheme="teal"
              />
            </button>
            <button
              type="button"
              className="cursor-pointer text-left"
              onClick={() => navigate(tpUrls.admin.settings.placementSeasons)}
            >
              <StatCard
                title="Active Seasons"
                value={metrics.activeSeasons}
                icon="event"
                colorScheme="orange"
              />
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <StatCard
              title="Pending Verifications"
              value={metrics.pendingVerifications}
              icon="pending_actions"
              colorScheme="amber"
              subtitle="Companies awaiting approval"
            />
            <StatCard
              title="Selected Students"
              value={metrics.selectedStudents}
              icon="verified"
              colorScheme="green"
              subtitle="Across all seasons"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormCard title="Applicants by Season">
              <div className="p-4">
                <ApplicantsBySeasonChart data={metrics.applicantsBySeason} />
              </div>
            </FormCard>
            <FormCard title="Monthly Application Trend">
              <div className="p-4">
                <MonthlyTrendChart data={metrics.monthlyTrend} />
              </div>
            </FormCard>
            <FormCard title="Company Distribution (by Sector)">
              <div className="p-4">
                <CompanyDistributionChart data={metrics.companyDistribution} />
              </div>
            </FormCard>
            <FormCard title="Hiring Funnel">
              <div className="p-4">
                <HiringFunnelChart data={metrics.hiringFunnel} />
              </div>
            </FormCard>
            <FormCard title="Placement Season Progress">
              <div className="p-4">
                <SeasonProgressBars data={metrics.seasonProgress} />
              </div>
            </FormCard>
          </div>
        </>
      )}
    </FormPage>
  );
}
