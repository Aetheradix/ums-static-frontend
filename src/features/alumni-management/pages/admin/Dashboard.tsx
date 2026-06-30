import Chart from 'chart.js/auto';
import {
  ActivityItem,
  DeadlineItem,
  ProgressBar,
  QuickActionBtn,
} from 'features/alumni-management/components';
import { mockAlumniProfiles } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';

function RegistrationStatusChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const verified = mockAlumniProfiles.filter(
    p => p.status === 'Verified'
  ).length;
  const pending = mockAlumniProfiles.filter(p => p.status === 'Pending').length;
  const rejected = mockAlumniProfiles.filter(
    p => p.status === 'Rejected'
  ).length;

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Verified', 'Pending', 'Rejected'],
        datasets: [
          {
            data: [verified, pending, rejected],
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 8, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [verified, pending, rejected]);

  return <canvas ref={ref} />;
}

function DepartmentDistributionChart() {
  const ref = useRef<HTMLCanvasElement>(null);

  const deptData = [
    {
      dept: 'CSE',
      count: mockAlumniProfiles.filter(p => p.ouCode === 'OU-CSE').length,
    },
    {
      dept: 'ECE',
      count: mockAlumniProfiles.filter(p => p.ouCode === 'OU-ECE').length,
    },
    {
      dept: 'MGT',
      count: mockAlumniProfiles.filter(p => p.ouCode === 'OU-MGT').length,
    },
    { dept: 'MECH', count: 1 },
    { dept: 'CIVIL', count: 0 },
  ];

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4'];
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: deptData.map(d => d.dept),
        datasets: [
          {
            label: 'Alumni',
            data: deptData.map(d => d.count),
            backgroundColor: colors.map(c => c + 'cc'),
            borderColor: colors,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, []);

  return <canvas ref={ref} />;
}

function YearTrendChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const years = [2021, 2022, 2023, 2024, 2025];
  const counts = years.map(
    y => mockAlumniProfiles.filter(p => p.yearOfPassing === y).length
  );

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years.map(String),
        datasets: [
          {
            label: 'Alumni Registered',
            data: counts,
            borderColor: '#14b8a6',
            backgroundColor: 'rgba(20,184,166,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
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

const UPCOMING_DEADLINES = [
  {
    title: 'Annual Alumni Meet Registration Close',
    date: '2025-07-01',
    daysLeft: 5,
    priority: 'high' as const,
  },
  {
    title: 'Email Campaign — July Newsletter',
    date: '2025-07-10',
    daysLeft: 14,
    priority: 'medium' as const,
  },
  {
    title: 'Verification of 2025 Batch Alumni',
    date: '2025-07-31',
    daysLeft: 35,
    priority: 'low' as const,
  },
];

const RECENT_ACTIVITIES = [
  {
    text: 'Priya Nair (ECE-405) verified by Admin',
    time: '2025-05-20 10:35',
    type: 'verify',
  },
  {
    text: 'Amit Verma (MGT-089) registration rejected',
    time: '2025-05-16 14:20',
    type: 'reject',
  },
  {
    text: 'Email Campaign "Annual Meet 2025" sent to 1100 alumni',
    time: '2025-05-01 09:00',
    type: 'campaign',
  },
  {
    text: 'OU-CIVIL mapped to new OU Admin',
    time: '2025-04-28 16:55',
    type: 'settings',
  },
  {
    text: 'Bulk import of 250 alumni records completed',
    time: '2025-04-15 11:20',
    type: 'import',
  },
  {
    text: 'Registration rule RR-03 deactivated',
    time: '2025-04-10 11:00',
    type: 'audit',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const total = mockAlumniProfiles.length;
  const verified = mockAlumniProfiles.filter(
    p => p.status === 'Verified'
  ).length;
  const pending = mockAlumniProfiles.filter(p => p.status === 'Pending').length;
  const rejected = mockAlumniProfiles.filter(
    p => p.status === 'Rejected'
  ).length;
  const verifiedPct = total > 0 ? Math.round((verified / total) * 100) : 0;

  return (
    <FormPage
      title="Alumni Module Dashboard"
      description="Overview of alumni registration activity, communications and key statistics"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Admin Portal', to: alumniUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <StatCard
          title="Total Registered"
          value={total}
          colorScheme="teal"
          icon="users"
        />
        <StatCard
          title="Verified"
          value={verified}
          colorScheme="green"
          icon="check-circle"
        />
        <StatCard
          title="Pending"
          value={pending}
          colorScheme="orange"
          icon="clock"
        />
        <StatCard
          title="Rejected"
          value={rejected}
          colorScheme="red"
          icon="times-circle"
        />
        <StatCard
          title="Verification %"
          value={`${verifiedPct}%`}
          colorScheme="blue"
          icon="chart-pie"
        />
        <StatCard
          title="Active Mentors"
          value="142"
          colorScheme="purple"
          icon="star"
        />
        <StatCard
          title="Campaigns Sent"
          value="4"
          colorScheme="indigo"
          icon="send"
        />
        <StatCard
          title="Departments"
          value="5"
          colorScheme="amber"
          icon="building"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FormCard title="Registration Status">
          <div className="h-64">
            <RegistrationStatusChart />
          </div>
        </FormCard>

        <FormCard title="Department Distribution">
          <div className="h-64">
            <DepartmentDistributionChart />
          </div>
        </FormCard>

        <FormCard title="Alumni Registrations by Year">
          <div className="h-64">
            <YearTrendChart />
          </div>
        </FormCard>
      </div>

      {/* Deadlines + Recent Verifications + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FormCard title="Upcoming Deadlines">
          <div className="space-y-3">
            {UPCOMING_DEADLINES.map((d, i) => (
              <DeadlineItem key={i} {...d} />
            ))}
          </div>
        </FormCard>

        <FormCard title="Recent Registrations">
          <div className="space-y-3">
            {mockAlumniProfiles.slice(0, 5).map(p => (
              <div key={p.enrolmentNo} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-36 truncate">
                  {p.fullName}
                </span>
                <ProgressBar
                  widthClass={
                    p.status === 'Verified'
                      ? 'w-full'
                      : p.status === 'Pending'
                        ? 'w-1/2'
                        : 'w-1/5'
                  }
                  colorScheme={
                    p.status === 'Verified'
                      ? 'green'
                      : p.status === 'Pending'
                        ? 'amber'
                        : 'red'
                  }
                />
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                    p.status === 'Verified'
                      ? 'bg-green-100 text-green-700'
                      : p.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </FormCard>

        <FormCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            <QuickActionBtn
              label="Verify Alumni"
              icon="check-circle"
              onClick={() =>
                navigate(alumniUrls.admin.registrationManagement.dashboard)
              }
            />
            <QuickActionBtn
              label="Add Alumni"
              icon="user-plus"
              onClick={() => navigate(alumniUrls.admin.addAlumni)}
            />
            <QuickActionBtn
              label="Email Campaign"
              icon="send"
              onClick={() =>
                navigate(alumniUrls.admin.communication.emailCampaigns)
              }
            />
            <QuickActionBtn
              label="Import"
              icon="upload"
              onClick={() => navigate(alumniUrls.admin.importAlumni)}
            />
            <QuickActionBtn
              label="Reports"
              icon="chart-bar"
              onClick={() => navigate(alumniUrls.admin.reports)}
            />
            <QuickActionBtn
              label="Audit Logs"
              icon="list"
              onClick={() => navigate(alumniUrls.admin.auditLogs)}
            />
          </div>
        </FormCard>
      </div>

      {/* Recent Activity */}
      <FormCard title="Recent Activity">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECENT_ACTIVITIES.map((a, i) => {
            const colorMap: Record<string, any> = {
              verify: 'green',
              reject: 'red',
              campaign: 'purple',
              import: 'blue',
              settings: 'amber',
              audit: 'teal',
            };
            return (
              <ActivityItem
                key={i}
                text={a.text}
                time={a.time}
                colorScheme={colorMap[a.type] || 'gray'}
              />
            );
          })}
        </div>
      </FormCard>
    </FormPage>
  );
}
