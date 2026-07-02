import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { useConvocationEvents, useConvocationStats } from '../../../queries';
import { CONVOCATION_URLS } from '../../../urls';

function RegistrationStatusChart() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Verified', 'Pending Verification', 'Incomplete'],
        datasets: [
          {
            data: [650, 200, 50],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12 } },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return <canvas ref={ref} className="h-64 w-full" />;
}

function RegistrationTimelineChart() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: [
          {
            label: 'Registrations',
            data: [150, 300, 550, 750, 900],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return <canvas ref={ref} className="h-64 w-full" />;
}

function DegreeDistributionChart() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['B.Tech', 'M.Tech', 'MBA', 'PhD', 'B.Sc'],
        datasets: [
          {
            label: 'In-Presentia',
            data: [300, 150, 100, 50, 120],
            backgroundColor: '#3b82f6',
          },
          {
            label: 'In-Absentia',
            data: [50, 30, 20, 10, 40],
            backgroundColor: '#9ca3af',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12 } },
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return <canvas ref={ref} className="h-64 w-full" />;
}

export default function ConvocationAdminDashboard() {
  const navigate = useNavigate();
  const { data: stats } = useConvocationStats();
  const { data: events, isLoading: isEventsLoading } = useConvocationEvents();

  const activeEvent = events?.[0];

  return (
    <FormPage
      title="Convocation Admin Dashboard"
      breadcrumbs={[
        { label: 'Convocation Management', to: CONVOCATION_URLS.PORTAL },
        { label: 'Admin Portal', to: CONVOCATION_URLS.ADMIN.ROOT },
        { label: 'Dashboard' },
      ]}
    >
      <div className="space-y-6">
        {/* Active Event Banner */}
        {!isEventsLoading && activeEvent && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <span className="material-symbols-outlined text-xl">event</span>
              </div>
              <div>
                <h3 className="font-semibold text-indigo-900">
                  {activeEvent.title}
                </h3>
                <p className="text-sm text-indigo-700">
                  Status: {activeEvent.status}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(CONVOCATION_URLS.ADMIN.SETUP)}
              className="px-4 py-2 bg-white text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors text-sm font-medium"
            >
              Configure Event
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Eligible"
            value={stats?.totalEligible ?? 0}
            icon="groups"
            colorScheme="indigo"
          />
          <StatCard
            title="Registered"
            value={stats?.registered ?? 0}
            icon="how_to_reg"
            colorScheme="blue"
          />
          <StatCard
            title="Fee Collected"
            value={`₹${(stats?.feeReceived ?? 0).toLocaleString()}`}
            icon="payments"
            colorScheme="green"
          />
          <StatCard
            title="Pending Verification"
            value={stats?.pendingVerification ?? 0}
            icon="pending_actions"
            colorScheme="amber"
          />
          <StatCard
            title="Verified Applications"
            value={stats?.verified ?? 0}
            icon="fact_check"
            colorScheme="teal"
          />
          <StatCard
            title="Passes Generated"
            value={stats?.passesGenerated ?? 0}
            icon="badge"
            colorScheme="purple"
          />
        </div>

        {/* Detailed Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FormCard title="Registration Status">
            <div className="p-4">
              <RegistrationStatusChart />
            </div>
          </FormCard>
          <FormCard title="Registration Timeline">
            <div className="p-4">
              <RegistrationTimelineChart />
            </div>
          </FormCard>
          <FormCard title="Programme Distribution">
            <div className="p-4">
              <DegreeDistributionChart />
            </div>
          </FormCard>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => navigate(CONVOCATION_URLS.ADMIN.ELIGIBILITY)}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center space-x-4"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <span className="material-symbols-outlined">checklist</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Manage Eligibility
                </h4>
                <p className="text-sm text-gray-500">
                  View and update eligible students list
                </p>
              </div>
            </div>
            <div
              onClick={() => navigate(CONVOCATION_URLS.ADMIN.APPLICATIONS)}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center space-x-4"
            >
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <span className="material-symbols-outlined">fact_check</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Review Applications
                </h4>
                <p className="text-sm text-gray-500">
                  Verify documents and generate passes
                </p>
              </div>
            </div>
            <div
              onClick={() => navigate(CONVOCATION_URLS.ADMIN.CONFIG)}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center space-x-4"
            >
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <span className="material-symbols-outlined">settings</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Advanced Config</h4>
                <p className="text-sm text-gray-500">
                  Setup fees, uploads, and pass design
                </p>
              </div>
            </div>
            <div
              onClick={() => navigate(CONVOCATION_URLS.ADMIN.DISPATCH)}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center space-x-4"
            >
              <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                <span className="material-symbols-outlined">
                  local_shipping
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Degree Dispatch</h4>
                <p className="text-sm text-gray-500">
                  Track in-absentia degrees sent by post
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
