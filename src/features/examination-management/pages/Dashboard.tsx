import { useNavigate } from 'react-router-dom';
import { useDashboardStatsQuery, useExamSessionsQuery } from '../queries';
import { FormPage, FormCard } from 'shared/new-components';

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStatsQuery();
  const { data: sessions } = useExamSessionsQuery();
  const navigate = useNavigate();

  const cards = [
    {
      label: 'Total Sessions',
      value: stats?.totalSessions ?? 0,
      icon: 'pi-calendar',
      color: 'bg-blue-500',
    },
    {
      label: 'Active Sessions',
      value: stats?.activeSessions ?? 0,
      icon: 'pi-check-circle',
      color: 'bg-green-500',
    },
    {
      label: 'Total Students',
      value: stats?.totalStudents ?? 0,
      icon: 'pi-users',
      color: 'bg-purple-500',
    },
    {
      label: 'Forms Submitted',
      value: stats?.formsSubmitted ?? 0,
      icon: 'pi-file',
      color: 'bg-orange-500',
    },
    {
      label: 'Marks Entry Progress',
      value: `${stats?.marksEntryProgress ?? 0}%`,
      icon: 'pi-chart-bar',
      color: 'bg-teal-500',
    },
    {
      label: 'Results Published',
      value: stats?.resultsPublished ?? 0,
      icon: 'pi-verified',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <FormPage
      title="Examination Dashboard"
      description="Overview of the examination management system"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <FormCard key={card.label}>
            <div className="flex items-center gap-4 p-2">
              <div
                className={`${card.color} w-14 h-14 rounded-lg flex items-center justify-center`}
              >
                <i className={`pi ${card.icon} text-white text-2xl`} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {isLoading ? '...' : card.value}
                </p>
              </div>
            </div>
          </FormCard>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormCard title="Marks Entry Progress" icon="chart-bar">
          <div className="space-y-4">
            <ProgressBar
              label="Theory Marks Entered"
              value={78}
              color="bg-blue-500"
            />
            <ProgressBar
              label="Practical Marks Entered"
              value={65}
              color="bg-green-500"
            />
            <ProgressBar
              label="IA Marks Entered"
              value={92}
              color="bg-purple-500"
            />
            <ProgressBar label="Verified" value={45} color="bg-yellow-500" />
            <ProgressBar label="Approved" value={30} color="bg-teal-500" />
          </div>
        </FormCard>

        <FormCard title="Sessions Overview" icon="calendar">
          <div className="space-y-3">
            {(sessions ?? []).slice(0, 5).map(s => {
              const max = Math.max(...(sessions ?? []).map(x => x.id), 1);
              const barWidth = Math.round((s.id / max) * 100);
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-40 truncate">
                    {s.sessionName}
                  </span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${s.status === 'Active' ? 'bg-green-400' : 'bg-gray-300'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {s.status}
                  </span>
                </div>
              );
            })}
            {(sessions ?? []).length === 0 && (
              <p className="text-sm text-gray-400">No sessions found.</p>
            )}
          </div>
        </FormCard>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormCard title="Quick Actions" icon="bolt">
          <div className="grid grid-cols-2 gap-3">
            <QuickActionBtn
              icon="pi-plus"
              label="New Session"
              onClick={() => navigate('/examination-management/sessions')}
            />
            <QuickActionBtn
              icon="pi-file-export"
              label="Generate Timetable"
              onClick={() => navigate('/examination-management/sessions')}
            />
            <QuickActionBtn
              icon="pi-pencil"
              label="Enter Marks"
              onClick={() => navigate('/examination-management/sessions')}
            />
            <QuickActionBtn
              icon="pi-chart-line"
              label="Publish Results"
              onClick={() => navigate('/examination-management/sessions')}
            />
          </div>
        </FormCard>

        <FormCard title="Recent Activity" icon="history">
          <div className="space-y-3">
            <ActivityItem
              text="Supplementary Exam July 2025 session created"
              time="2 hours ago"
            />
            <ActivityItem
              text="Marks approved for B.Tech Semester 1"
              time="1 day ago"
            />
            <ActivityItem
              text="Admit cards generated for Dec 2024 exam"
              time="2 days ago"
            />
            <ActivityItem
              text="Exam fee configured for MBA program"
              time="3 days ago"
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}

function ProgressBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-800 font-medium">{value}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function QuickActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <i className={`pi ${icon} text-xl text-blue-600`} />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
      <div>
        <p className="text-sm text-gray-700">{text}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}
