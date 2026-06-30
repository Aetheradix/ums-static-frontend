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
import { useDeptDashboardQuery } from '../../hooks/queries';
import { tpUrls } from '../../urls';

function PlacementByProgrammeChart({
  data,
}: {
  data: { programme: string; placed: number; total: number }[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.programme),
        datasets: [
          {
            label: 'Placed Students',
            data: data.map(d => d.placed),
            backgroundColor: '#10b981',
            borderRadius: 4,
          },
          {
            label: 'Total Students',
            data: data.map(d => d.total),
            backgroundColor: '#e5e7eb',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={ref} className="h-64 w-full" />;
}

function PlacedUnplacedDoughnut({ data }: { data: any }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Placed', 'Unplaced'],
        datasets: [
          {
            data: [data.placed, data.unplaced],
            backgroundColor: ['#10b981', '#f59e0b'],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
        cutout: '70%',
      },
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={ref} className="h-64 w-full" />;
}

export default function DeptDashboard() {
  const navigate = useNavigate();
  // Using a hardcoded ouId for static preview (CSE department)
  const ouId = 'OU-CSE';
  const { data: metrics, isLoading } = useDeptDashboardQuery(ouId);

  // Mock data for new charts
  const doughnutData = {
    placed: metrics?.studentsPlaced || 120,
    unplaced: metrics?.studentsUnplaced || 45,
  };

  const quickLinks = [
    {
      label: 'View Applications',
      icon: 'description',
      action: () => navigate(tpUrls.dept.applications),
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Monitor Opportunities',
      icon: 'work',
      action: () => navigate(tpUrls.dept.opportunities),
      color: 'text-indigo-600 bg-indigo-100',
    },
  ];

  return (
    <FormPage
      title="Department Dashboard"
      description="Track placement progress and opportunities for your department's students."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Department Portal', to: tpUrls.dept.portal },
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
              onClick={() => navigate(tpUrls.dept.applications)}
            >
              <StatCard
                title="Total Students"
                value={metrics.totalStudents}
                icon="groups"
                colorScheme="indigo"
              />
            </button>
            <div className="cursor-default text-left">
              <StatCard
                title="Students Placed"
                value={metrics.studentsPlaced}
                icon="verified"
                colorScheme="green"
                trend={{ value: 5, label: 'this week', direction: 'up' }}
              />
            </div>
            <div className="cursor-default text-left">
              <StatCard
                title="Students Unplaced"
                value={metrics.studentsUnplaced}
                icon="person_off"
                colorScheme="amber"
              />
            </div>
            <button
              type="button"
              className="cursor-pointer text-left focus:outline-none"
              onClick={() => navigate(tpUrls.dept.opportunities)}
            >
              <StatCard
                title="Active Opportunities"
                value={metrics.activeOpportunities}
                icon="work"
                colorScheme="teal"
                trend={{ value: 2, label: 'from yesterday', direction: 'up' }}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            <div className="lg:col-span-2">
              <FormCard title="Placement by Programme">
                <div className="p-4">
                  {metrics.placementByProgramme.length > 0 ? (
                    <PlacementByProgrammeChart
                      data={metrics.placementByProgramme}
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center text-gray-500">
                      No data available.
                    </div>
                  )}
                </div>
              </FormCard>
            </div>

            <div className="flex flex-col gap-6">
              <FormCard title="Placed vs Unplaced">
                <div className="p-4 flex items-center justify-center">
                  <PlacedUnplacedDoughnut data={doughnutData} />
                </div>
              </FormCard>

              <FormCard title="Quick Actions">
                <div className="p-4 flex flex-col gap-3">
                  {quickLinks.map((link, idx) => (
                    <button
                      key={idx}
                      onClick={link.action}
                      className="flex items-center gap-4 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <div className={`rounded-full p-2 ${link.color}`}>
                        <i className={`material-symbols-outlined text-xl`}>
                          {link.icon}
                        </i>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {link.label}
                      </span>
                      <Icon
                        name="chevron_right"
                        className="ml-auto text-xs text-gray-400"
                      />
                    </button>
                  ))}
                </div>
              </FormCard>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormCard title="Placement Rates by Programme">
              <div className="p-4 flex flex-col gap-6">
                {metrics.placementByProgramme.map((prog, idx) => {
                  const percentage =
                    Math.round((prog.placed / prog.total) * 100) || 0;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                        <span>{prog.programme}</span>
                        <span>
                          {prog.placed} / {prog.total} ({percentage}%)
                        </span>
                      </div>
                      <ProgressBar
                        value={percentage}
                        colorClass={
                          percentage > 75
                            ? 'bg-green-500'
                            : percentage > 50
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }
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
