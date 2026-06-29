import { FormCard, FormPage } from 'shared/new-components';
import { activitiesUrls } from '../../urls';
import { clubsList, clubEvents } from '../../data';
import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';

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

function CategoryChart({ data }: { data: { label: string; value: number }[] }) {
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
            backgroundColor: [
              '#a855f7',
              '#3b82f6',
              '#22c55e',
              '#f59e0b',
              '#ef4444',
            ],
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

  return (
    <div className="h-64">
      <canvas ref={ref} />
    </div>
  );
}

export default function Dashboard() {
  const totalClubs = clubsList.length;
  const activeEvents = clubEvents.filter(e => e.status !== 'Completed').length;
  const totalMembers = clubsList.reduce(
    (acc, club) => acc + club.memberCount,
    0
  );
  const totalUpcomingEvents = clubEvents.filter(
    e => e.status === 'Upcoming'
  ).length;

  const categoryMap: Record<string, number> = {};
  clubsList.forEach(c => {
    categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([label, value]) => ({
    label,
    value,
  }));

  return (
    <FormPage
      title="Activities & Clubs Dashboard"
      description="Overview of student clubs, events, and memberships."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Activities & Clubs', to: activitiesUrls.portal },
        { label: 'Admin Portal', to: activitiesUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Clubs" value={totalClubs} color="purple" />
        <KpiCard label="Active Events" value={activeEvents} color="blue" />
        <KpiCard label="Total Members" value={totalMembers} color="green" />
        <KpiCard
          label="Upcoming Events"
          value={totalUpcomingEvents}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FormCard title="Clubs by Category">
          <CategoryChart data={categoryData} />
        </FormCard>

        <FormCard title="Recent Events">
          <div className="space-y-4">
            {clubEvents.map((event, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 rounded-lg border border-gray-100"
              >
                <div>
                  <div className="font-medium text-gray-900">{event.title}</div>
                  <div className="text-sm text-gray-500">
                    {event.club} - {event.date}
                  </div>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${event.status === 'Completed' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'}`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
