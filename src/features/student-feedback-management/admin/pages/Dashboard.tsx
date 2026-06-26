import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { feedbackUrls } from '../../urls';
import { feedbackSessions, studentResponses } from '../../data';

const KPI_COLORS: Record<string, { bg: string; border: string; text: string }> =
  {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-700',
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
    },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  };

function KpiCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  const c = KPI_COLORS[color] || KPI_COLORS.blue;
  return (
    <div className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
      <div className={`text-xs font-medium mb-1 ${c.text} opacity-70`}>
        {label}
      </div>
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
    </div>
  );
}

function ChartContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <FormCard title={title}>
      <div className="h-64">{children}</div>
    </FormCard>
  );
}

const deptSubmissions = (() => {
  const map: Record<string, number> = {};
  studentResponses
    .filter(r => r.completionStatus === 'Completed')
    .forEach(r => {
      map[r.department] = (map[r.department] || 0) + 1;
    });
  return Object.entries(map).map(([label, value]) => ({ label, value }));
})();

const programmeSubmissions = (() => {
  const map: Record<string, number> = {};
  studentResponses
    .filter(r => r.completionStatus === 'Completed')
    .forEach(r => {
      map[r.programme] = (map[r.programme] || 0) + 1;
    });
  return Object.entries(map).map(([label, value]) => ({ label, value }));
})();

const semesterSubmissions = (() => {
  const counts: Record<string, number> = {};
  feedbackSessions
    .filter(s => s.status !== 'Archived')
    .forEach(s => {
      s.semesters.forEach(sem => {
        counts[`Sem ${sem}`] = (counts[`Sem ${sem}`] || 0) + s.responseCount;
      });
    });
  return Object.entries(counts).map(([label, value]) => ({ label, value }));
})();

const facultyRatings = [
  { label: 'Dr. Sharma', rating: 4.2 },
  { label: 'Prof. Verma', rating: 3.8 },
  { label: 'Dr. Patel', rating: 4.5 },
  { label: 'Admin', rating: 4.0 },
  { label: 'Librarian', rating: 3.5 },
];

function CompletionChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current || !data.length) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            data: data.map(d => d.value),
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
  }, [data]);
  if (!data.length)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data
      </div>
    );
  return <canvas ref={ref} />;
}

function DeptChart({ data }: { data: { label: string; value: number }[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current || !data.length) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const colors = [
      '#3b82f6',
      '#22c55e',
      '#f59e0b',
      '#a855f7',
      '#ef4444',
      '#14b8a6',
    ];
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            label: 'Submissions',
            data: data.map(d => d.value),
            backgroundColor: colors.slice(0, data.length).map(c => c + 'cc'),
            borderColor: colors.slice(0, data.length),
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: { x: { beginAtZero: true } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, [data]);
  if (!data.length)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data
      </div>
    );
  return <canvas ref={ref} />;
}

function ProgrammeChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current || !data.length) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            label: 'Submissions',
            data: data.map(d => d.value),
            backgroundColor: [
              '#3b82f6cc',
              '#a855f7cc',
              '#06b6d4cc',
              '#f97316cc',
            ],
            borderColor: ['#3b82f6', '#a855f7', '#06b6d4', '#f97316'],
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, [data]);
  if (!data.length)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data
      </div>
    );
  return <canvas ref={ref} />;
}

function SemesterChart({ data }: { data: { label: string; value: number }[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current || !data.length) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            data: data.map(d => d.value),
            backgroundColor: ['#3b82f6', '#f59e0b'],
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
  }, [data]);
  if (!data.length)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data
      </div>
    );
  return <canvas ref={ref} />;
}

function FacultyRatingChart({
  data,
}: {
  data: { label: string; rating: number }[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current || !data.length) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            label: 'Avg Rating',
            data: data.map(d => d.rating),
            backgroundColor: data.map(() => '#a855f7cc'),
            borderColor: data.map(() => '#a855f7'),
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, [data]);
  if (!data.length)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data
      </div>
    );
  return <canvas ref={ref} />;
}

export default function Dashboard() {
  const activeSessions = feedbackSessions.filter(
    s => s.status === 'Open' || s.status === 'Published'
  ).length;
  const draftSessions = feedbackSessions.filter(
    s => s.status === 'Draft'
  ).length;
  const closedSessions = feedbackSessions.filter(
    s => s.status === 'Closed' || s.status === 'Archived'
  ).length;
  const totalTarget = feedbackSessions.reduce((s, x) => s + x.targetCount, 0);
  const totalSubmitted = feedbackSessions.reduce(
    (s, x) => s + x.responseCount,
    0
  );
  const pendingStudents = totalTarget - totalSubmitted;
  const completionRate =
    totalTarget > 0 ? Math.round((totalSubmitted / totalTarget) * 100) : 0;
  const avgRating = 4.1;

  const sessionsCompleted = feedbackSessions
    .filter(s => s.status === 'Closed')
    .reduce((s, x) => s + x.responseCount, 0);
  const sessionsOpen = feedbackSessions
    .filter(s => s.status === 'Open')
    .reduce((s, x) => s + x.responseCount, 0);
  const sessionsPublished = feedbackSessions
    .filter(s => s.status === 'Published')
    .reduce((s, x) => s + x.responseCount, 0);
  const completionData = [
    { label: 'Completed', value: sessionsCompleted },
    { label: 'Open', value: sessionsOpen },
    { label: 'Published', value: sessionsPublished },
  ];

  const recentActivities = [
    {
      text: 'New session "Faculty Feedback Even 2024-25" created.',
      time: '2 hours ago',
      type: 'session',
    },
    {
      text: 'Feedback "Faculty Feedback Odd 2024-25" published.',
      time: '1 day ago',
      type: 'marks',
    },
    {
      text: '342 responses received for "Faculty Feedback Odd 2024-25".',
      time: '3 days ago',
      type: 'fee',
    },
    {
      text: 'Session "Infrastructure Feedback 2024" closed.',
      time: '1 week ago',
      type: 'timetable',
    },
    {
      text: 'New template "Library Services" created.',
      time: '2 weeks ago',
      type: 'qp',
    },
  ];

  return (
    <FormPage
      title="Feedback Management Dashboard"
      description="Overview of feedback sessions, submissions, and analytics."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Feedback Management', to: feedbackUrls.portal },
        { label: 'Admin Portal', to: feedbackUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
        <KpiCard label="Active Sessions" value={activeSessions} color="blue" />
        <KpiCard label="Draft Sessions" value={draftSessions} color="orange" />
        <KpiCard label="Closed Sessions" value={closedSessions} color="green" />
        <KpiCard label="Students Assigned" value={totalTarget} color="purple" />
        <KpiCard label="Submitted" value={totalSubmitted} color="teal" />
        <KpiCard label="Pending" value={pendingStudents} color="red" />
        <KpiCard
          label="Completion"
          value={`${completionRate}%`}
          color="indigo"
        />
        <KpiCard label="Avg Rating" value={avgRating} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ChartContainer title="Feedback Completion">
          <CompletionChart data={completionData} />
        </ChartContainer>
        <ChartContainer title="Department-wise Submissions">
          <DeptChart data={deptSubmissions} />
        </ChartContainer>
        <ChartContainer title="Programme-wise Submissions">
          <ProgrammeChart data={programmeSubmissions} />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Semester-wise Submissions">
          <SemesterChart data={semesterSubmissions} />
        </ChartContainer>
        <ChartContainer title="Faculty Rating Distribution">
          <FacultyRatingChart data={facultyRatings} />
        </ChartContainer>
      </div>

      <FormCard title="Recent Activities" icon="clock">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentActivities.map((a, i) => {
            const typeColors: Record<string, string> = {
              session: 'bg-blue-500',
              marks: 'bg-green-500',
              fee: 'bg-amber-500',
              timetable: 'bg-teal-500',
              qp: 'bg-rose-500',
            };
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100"
              >
                <div
                  className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${typeColors[a.type] || 'bg-gray-400'}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{a.text}</p>
                  <p className="text-xs text-gray-400">{a.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </FormCard>
    </FormPage>
  );
}
