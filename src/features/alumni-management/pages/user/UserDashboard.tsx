import Chart from 'chart.js/auto';
import {
  ActivityItem,
  ProgressBar,
  QuickActionBtn,
} from 'features/alumni-management/components';
import {
  mockEducationalQualifications,
  mockProfessionalExperience,
} from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormPage, StatCard } from 'shared/new-components';

function ProfileCompletionChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const sections = [
      { label: 'Basic Info', pct: 100 },
      { label: 'Contact', pct: 90 },
      { label: 'Qualifications', pct: 80 },
      { label: 'Experience', pct: 70 },
      { label: 'Contributions', pct: 75 },
      { label: 'Privacy', pct: 60 },
    ];
    const c = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sections.map(s => s.label),
        datasets: [
          {
            label: 'Completion %',
            data: sections.map(s => s.pct),
            backgroundColor: sections.map(s =>
              s.pct === 100
                ? '#22c55ecc'
                : s.pct >= 75
                  ? '#3b82f6cc'
                  : '#f59e0bcc'
            ),
            borderRadius: 4,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 100, ticks: { callback: v => `${v}%` } } },
        plugins: { legend: { display: false } },
      },
    });
    return () => c.destroy();
  }, []);
  return <canvas ref={ref} />;
}

function QualificationTimeline() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const c = new Chart(ctx, {
      type: 'line',
      data: {
        labels: mockEducationalQualifications
          .map(q => `${q.level} (${q.year})`)
          .reverse(),
        datasets: [
          {
            label: 'Score',
            data: mockEducationalQualifications
              .map(q => parseFloat(q.score.replace(/[^0-9.]/g, '')))
              .reverse(),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: false } },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11 } },
          },
        },
      },
    });
    return () => c.destroy();
  }, []);
  return <canvas ref={ref} />;
}

const MY_RECENT_ACTIVITY = [
  {
    text: 'Work experience at Infosys added',
    time: '2025-06-10 09:30',
    type: 'exp',
  },
  {
    text: 'M.Tech qualification updated',
    time: '2025-06-05 14:00',
    type: 'qual',
  },
  {
    text: 'Mentorship contribution opted in',
    time: '2025-05-28 11:15',
    type: 'contrib',
  },
  { text: 'Mobile number updated', time: '2025-05-20 10:00', type: 'profile' },
  {
    text: 'Email privacy set to visible',
    time: '2025-05-15 16:45',
    type: 'privacy',
  },
  { text: 'LinkedIn URL added', time: '2025-04-30 12:00', type: 'profile' },
];

export default function UserDashboard() {
  const navigate = useNavigate();

  return (
    <FormPage
      title="Welcome, Rahul Sharma!"
      description="Your Alumni Portal — profile overview, qualifications and activity"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'User Portal', to: alumniUrls.user.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          title="Profile Completion"
          value="85%"
          colorScheme="blue"
          icon="user"
        />
        <StatCard
          title="Qualifications"
          value={mockEducationalQualifications.length}
          colorScheme="purple"
          icon="book"
        />
        <StatCard
          title="Work Experiences"
          value={mockProfessionalExperience.length}
          colorScheme="orange"
          icon="briefcase"
        />
        <StatCard
          title="Active Contributions"
          value="3"
          colorScheme="green"
          icon="heart"
        />
        <StatCard
          title="Account Status"
          value="Active"
          colorScheme="teal"
          icon="shield"
        />
        <StatCard
          title="Year of Passing"
          value="2025"
          colorScheme="indigo"
          icon="calendar"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FormCard title="Profile Section Completion">
          <div className="h-64">
            <ProfileCompletionChart />
          </div>
        </FormCard>

        <FormCard title="Academic Score Progression">
          <div className="h-64">
            <QualificationTimeline />
          </div>
        </FormCard>
      </div>

      {/* Recent Experience + Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FormCard title="Recent Experience" className="lg:col-span-1">
          <div className="space-y-3">
            {mockProfessionalExperience.map((exp, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-36 truncate">
                  {exp.company_name}
                </span>
                <ProgressBar
                  widthClass={exp.end_date === 'Present' ? 'w-full' : 'w-3/5'}
                  colorScheme={exp.end_date === 'Present' ? 'blue' : 'gray'}
                />
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${exp.end_date === 'Present' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {exp.end_date === 'Present' ? 'Current' : 'Past'}
                </span>
              </div>
            ))}
          </div>
        </FormCard>

        <FormCard title="Quick Actions" className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-3">
            <QuickActionBtn
              label="Edit Profile"
              icon="user-edit"
              onClick={() => navigate(alumniUrls.user.myProfile)}
            />
            <QuickActionBtn
              label="Qualifications"
              icon="book"
              onClick={() => navigate(alumniUrls.user.qualifications)}
            />
            <QuickActionBtn
              label="Experience"
              icon="briefcase"
              onClick={() => navigate(alumniUrls.user.experience)}
            />
            <QuickActionBtn
              label="Contributions"
              icon="heart"
              onClick={() => navigate(alumniUrls.user.contributionPreferences)}
            />
            <QuickActionBtn
              label="Privacy"
              icon="lock"
              onClick={() => navigate(alumniUrls.user.privacySettings)}
            />
            <QuickActionBtn
              label="Alumni Directory"
              icon="users"
              onClick={() => navigate(alumniUrls.admin.verifiedAlumni)}
            />
          </div>
        </FormCard>

        <FormCard title="Recent Activity" className="lg:col-span-1">
          <div className="space-y-2">
            {MY_RECENT_ACTIVITY.slice(0, 5).map((a, i) => {
              const colorMap: Record<string, any> = {
                profile: 'blue',
                qual: 'purple',
                exp: 'orange',
                contrib: 'green',
                privacy: 'teal',
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
      </div>
    </FormPage>
  );
}
