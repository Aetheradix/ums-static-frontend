import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { FormPage, FormCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { useStudentDashboardQuery } from '../../queries';

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

function SgpaTrendChart({ data }: { data?: Examination.SgpaTrendItem[] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || !data?.length) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => `Sem ${d.semester}`),
        datasets: [
          {
            label: 'SGPA',
            data: data.map(d => d.sgpa),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#3b82f6',
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 10, ticks: { stepSize: 2 } },
        },
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, [data]);

  if (!data?.length)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data available
      </div>
    );
  return <canvas ref={ref} />;
}

function SubjectMarksChart({
  data,
}: {
  data?: Examination.SubjectMarksItem[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || !data?.length) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.subject),
        datasets: [
          {
            label: 'Obtained',
            data: data.map(d => d.obtained),
            backgroundColor: 'rgba(59,130,246,0.8)',
            borderColor: '#3b82f6',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Max',
            data: data.map(d => d.max),
            backgroundColor: 'rgba(203,213,225,0.5)',
            borderColor: '#94a3b8',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 12, padding: 8, font: { size: 11 } },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  if (!data?.length)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data available
      </div>
    );
  return <canvas ref={ref} />;
}

function AttendanceChart({
  data,
}: {
  data?: Examination.AttendanceDataPoint[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || !data?.length) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            data: data.map(d => d.value),
            backgroundColor: data.map(d => d.color),
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

  if (!data?.length)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No data available
      </div>
    );
  return <canvas ref={ref} />;
}

function QuickActionBtn({
  icon = 'chevron-right',
  label,
  onClick,
}: {
  icon?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer"
    >
      <i className={`pi pi-${icon} text-xl text-blue-600`} />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useStudentDashboardQuery();

  if (isError) {
    return (
      <FormPage
        title="Student Dashboard"
        description="Overview of your examination activities"
      >
        <div className="flex items-center justify-center h-64 text-red-500">
          {(error as Error)?.message || 'Failed to load student dashboard'}
        </div>
      </FormPage>
    );
  }

  if (isLoading) {
    return (
      <FormPage
        title="Student Dashboard"
        description="Overview of your examination activities"
      >
        <div className="flex items-center justify-center h-64 text-gray-400">
          Loading dashboard...
        </div>
      </FormPage>
    );
  }

  const info = data?.info as Examination.StudentInfo | undefined;
  const stats = data?.stats as Examination.StudentDashboardStats | undefined;
  const sgpaTrend = (data?.sgpaTrend ?? []) as Examination.SgpaTrendItem[];
  const subjectMarks = (data?.subjectMarks ??
    []) as Examination.SubjectMarksItem[];
  const attendance = (data?.attendanceBreakdown ??
    []) as Examination.AttendanceDataPoint[];
  const upcomingExams = (data?.upcomingExams ??
    []) as Examination.UpcomingExam[];
  const notifications = (data?.notifications ??
    []) as Examination.StudentNotification[];

  return (
    <FormPage
      title="Student Dashboard"
      description="Overview of your examination activities"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
        <KpiCard
          label="Current SGPA"
          value={stats?.currentSgpa?.toFixed(1) ?? '-'}
          color="blue"
        />
        <KpiCard
          label="CGPA"
          value={stats?.cgpa?.toFixed(1) ?? '-'}
          color="indigo"
        />
        <KpiCard
          label="Exams Registered"
          value={stats?.totalExamsRegistered ?? '-'}
          color="green"
        />
        <KpiCard
          label="Attendance"
          value={
            stats?.attendancePercentage != null
              ? `${stats.attendancePercentage}%`
              : '-'
          }
          color="teal"
        />
        <KpiCard
          label="Backlogs"
          value={stats?.backlogs ?? 0}
          color={stats?.backlogs ? 'red' : 'green'}
        />
        <KpiCard
          label="Pending Fees"
          value={stats?.pendingFees ? `₹${stats.pendingFees}` : '₹0'}
          color={stats?.pendingFees ? 'orange' : 'green'}
        />
        <KpiCard
          label="Class Rank"
          value={stats != null ? `${stats.rank}/${stats.totalStudents}` : '-'}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FormCard title="SGPA Trend" className="lg:col-span-1">
          <div className="h-64">
            <SgpaTrendChart data={sgpaTrend} />
          </div>
        </FormCard>

        <FormCard title="Subject Marks" className="lg:col-span-1">
          <div className="h-64">
            <SubjectMarksChart data={subjectMarks} />
          </div>
        </FormCard>

        <FormCard title="Attendance" className="lg:col-span-1">
          <div className="h-64">
            <AttendanceChart data={attendance} />
          </div>
        </FormCard>
      </div>

      {/* Info + Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FormCard
          title="Student Information"
          icon="user"
          className="lg:col-span-1"
        >
          <div className="space-y-3 p-1">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                {info?.name?.charAt(0) ?? '?'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {info?.name}
                </p>
                <p className="text-xs text-gray-500">{info?.rollNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Program</span>
                <p className="font-medium text-gray-800">{info?.program}</p>
              </div>
              <div>
                <span className="text-gray-500">Semester</span>
                <p className="font-medium text-gray-800">
                  Sem {info?.semester}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Enrollment</span>
                <p className="font-medium text-gray-800">
                  {info?.enrollmentNumber}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Batch</span>
                <p className="font-medium text-gray-800">{info?.batch}</p>
              </div>
            </div>
          </div>
        </FormCard>

        <FormCard title="Quick Actions" icon="bolt" className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-3">
            <QuickActionBtn
              icon="file-edit"
              label="Exam Form"
              onClick={() =>
                navigate('/examination-management/student/exam-form')
              }
            />
            <QuickActionBtn
              icon="calendar"
              label="Timetable"
              onClick={() =>
                navigate('/examination-management/student/timetable')
              }
            />
            <QuickActionBtn
              icon="id-card"
              label="Admit Card"
              onClick={() =>
                navigate('/examination-management/student/admit-card')
              }
            />
            <QuickActionBtn
              icon="chart-bar"
              label="Results"
              onClick={() =>
                navigate('/examination-management/student/results')
              }
            />
            <QuickActionBtn
              icon="refresh"
              label="Revaluation"
              onClick={() =>
                navigate('/examination-management/student/revaluation')
              }
            />
            <QuickActionBtn
              icon="copy"
              label="Grade Cards"
              onClick={() =>
                navigate('/examination-management/student/grade-cards')
              }
            />
            <QuickActionBtn
              icon="map"
              label="Seating Plan"
              onClick={() =>
                navigate('/examination-management/student/seating-plan')
              }
            />
            <QuickActionBtn
              icon="file-copy"
              label="Duplicate"
              onClick={() =>
                navigate('/examination-management/student/duplicate-marksheet')
              }
            />
            <QuickActionBtn
              icon="track-changes"
              label="Track Apps"
              onClick={() =>
                navigate('/examination-management/student/track-applications')
              }
            />
          </div>
        </FormCard>
      </div>

      {/* Upcoming Exams + Notifications Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FormCard title="Upcoming Exams" icon="calendar">
          {upcomingExams.length === 0 && (
            <p className="text-sm text-gray-400">No upcoming exams.</p>
          )}
          <div className="space-y-3">
            {upcomingExams.map((exam, i) => (
              <div
                key={i}
                className="flex items-center gap-3 pb-2 border-b border-gray-100 last:border-0"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex flex-col items-center justify-center text-blue-700">
                  <span className="text-xs font-bold">
                    {exam.date.slice(8)}
                  </span>
                  <span className="text-[9px]">{exam.date.slice(0, 4)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {exam.subject}
                  </p>
                  <p className="text-xs text-gray-500">
                    {exam.time} &middot; {exam.hall}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {upcomingExams.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Button
                label="View Full Timetable"
                icon="calendar"
                variant="text"
                onClick={() =>
                  navigate('/examination-management/student/timetable')
                }
              />
            </div>
          )}
        </FormCard>

        <FormCard title="Notifications" icon="bell">
          {notifications.length === 0 && (
            <p className="text-sm text-gray-400">No notifications.</p>
          )}
          <div className="space-y-2">
            {notifications.map((n, i) => {
              const typeStyles: Record<string, string> = {
                warning: 'border-l-amber-500 bg-amber-50',
                success: 'border-l-green-500 bg-green-50',
                info: 'border-l-blue-500 bg-blue-50',
                error: 'border-l-red-500 bg-red-50',
              };
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${typeStyles[n.type] || 'border-l-gray-500 bg-gray-50'}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
