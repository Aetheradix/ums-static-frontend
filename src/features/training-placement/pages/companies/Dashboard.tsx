import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormCard,
  FormPage,
  StatCard,
  ProgressBar,
} from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { useCompanyDashboardQuery } from '../../hooks/queries';
import { tpUrls } from '../../urls';

function ApplicantsByJobChart({
  data,
}: {
  data: { jobTitle: string; count: number }[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.jobTitle),
        datasets: [
          {
            label: 'Applicants',
            data: data.map(d => d.count),
            backgroundColor: '#0ea5e9',
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

function ApplicationStatusDoughnut({ data }: { data: any }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Shortlisted', 'In Review', 'Offered', 'Rejected'],
        datasets: [
          {
            data: [
              data.shortlisted,
              data.inReview,
              data.offered,
              data.rejected,
            ],
            backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' },
        },
        cutout: '70%',
      },
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={ref} className="h-64 w-full" />;
}

function ApplicantsTimelineLine({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.date),
        datasets: [
          {
            label: 'New Applications',
            data: data.map(d => d.count),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
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

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const companyId = 'COMP-001';
  const { data: metrics, isLoading } = useCompanyDashboardQuery(companyId);

  // Mock data for new charts
  const statusData = {
    shortlisted: 45,
    inReview: 85,
    offered: 15,
    rejected: 30,
  };
  const timelineData = [
    { date: 'Mon', count: 12 },
    { date: 'Tue', count: 19 },
    { date: 'Wed', count: 15 },
    { date: 'Thu', count: 25 },
    { date: 'Fri', count: 32 },
    { date: 'Sat', count: 10 },
    { date: 'Sun', count: 14 },
  ];

  const jobShortlistRates = [
    { title: 'Software Development Engineer', shortlists: 45, total: 120 },
    { title: 'Data Analyst', shortlists: 15, total: 55 },
  ];

  return (
    <FormPage
      title="Company Dashboard"
      description="Monitor your job postings, applicants, and active placement seasons."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Company Portal', to: tpUrls.company.portal },
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
              className="cursor-pointer text-left focus:outline-none"
              onClick={() => navigate(tpUrls.company.opportunities)}
            >
              <StatCard
                title="Active Job Posts"
                value={metrics.activeJobPosts}
                icon="work"
                colorScheme="teal"
                trend={{ value: 2, label: 'from last month', direction: 'up' }}
              />
            </button>
            <button
              type="button"
              className="cursor-pointer text-left focus:outline-none"
              onClick={() => navigate(tpUrls.company.opportunities)}
            >
              <StatCard
                title="Draft Job Posts"
                value={metrics.draftJobPosts}
                icon="edit_document"
                colorScheme="amber"
              />
            </button>
            <div className="cursor-default text-left">
              <StatCard
                title="Total Applicants"
                value={metrics.totalApplicants}
                icon="groups"
                colorScheme="blue"
                trend={{ value: 15, label: 'this week', direction: 'up' }}
              />
            </div>
            <button
              type="button"
              className="cursor-pointer text-left focus:outline-none"
              onClick={() => navigate(tpUrls.company.seasons)}
            >
              <StatCard
                title="Active Seasons"
                value={metrics.activeSeasons}
                icon="event"
                colorScheme="orange"
              />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormCard title="Applicant Trends (Last 7 Days)">
              <div className="p-4">
                <ApplicantsTimelineLine data={timelineData} />
              </div>
            </FormCard>

            <FormCard title="Overall Application Status">
              <div className="p-4 flex items-center justify-center">
                <ApplicationStatusDoughnut data={statusData} />
              </div>
            </FormCard>

            <FormCard title="Applicants by Job Post">
              <div className="p-4">
                {metrics.applicantsByJob.length > 0 ? (
                  <ApplicantsByJobChart data={metrics.applicantsByJob} />
                ) : (
                  <div className="flex h-64 items-center justify-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Icon
                        name="inbox"
                        className="text-4xl mb-4 text-gray-300"
                      />
                      <p>No applicants yet.</p>
                    </div>
                  </div>
                )}
              </div>
            </FormCard>

            <FormCard title="Shortlisting Rates">
              <div className="p-4 flex flex-col gap-6">
                {jobShortlistRates.map((job, idx) => {
                  const percentage = Math.round(
                    (job.shortlists / job.total) * 100
                  );
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                        <span>{job.title}</span>
                        <span>
                          {job.shortlists} / {job.total} ({percentage}%)
                        </span>
                      </div>
                      <ProgressBar
                        value={percentage}
                        colorClass="bg-indigo-500"
                      />
                    </div>
                  );
                })}
              </div>
            </FormCard>
          </div>
        </>
      )}
    </FormPage>
  );
}
