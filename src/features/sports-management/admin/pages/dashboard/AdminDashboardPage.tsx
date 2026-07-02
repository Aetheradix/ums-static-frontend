import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Icon } from 'shared/components/Icon/Icon';
import { StatCard } from 'shared/new-components';

const monthlyData = [
  { name: 'Aug', events: 2, bookings: 4 },
  { name: 'Sep', events: 1, bookings: 6 },
  { name: 'Oct', events: 4, bookings: 3 },
  { name: 'Nov', events: 3, bookings: 7 },
  { name: 'Dec', events: 5, bookings: 5 },
];

const pendingActions = [
  {
    icon: 'sports_baseball',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    title: 'Facility Booking Requests',
    desc: '3 pending approvals',
    path: '/sports-management/admin/booking/facility',
  },
  {
    icon: 'outbox',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Equipment Returns',
    desc: '2 overdue items',
    path: '/sports-management/admin/booking/equipment',
  },
  {
    icon: 'how_to_reg',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Trial Selections',
    desc: '1 team pending finalization',
    path: '/sports-management/admin/teams/squad-selection',
  },
  {
    icon: 'workspace_premium',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Pending Achievements',
    desc: '5 unreviewed records',
    path: '/sports-management/admin/achievements/record',
  },
];

const recentBookings = [
  {
    id: 1,
    student: 'John Doe',
    facility: 'Main Cricket Ground',
    date: '2026-07-10',
    status: 'Pending',
    statusColor: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 2,
    student: 'Jane Smith',
    facility: 'Indoor Badminton Court 1',
    date: '2026-07-09',
    status: 'Approved',
    statusColor: 'bg-green-100 text-green-700',
  },
  {
    id: 3,
    student: 'Mike Ross',
    facility: 'University Pool',
    date: '2026-07-08',
    status: 'Rejected',
    statusColor: 'bg-red-100 text-red-700',
  },
  {
    id: 4,
    student: 'Sarah Lee',
    facility: 'Practice Nets',
    date: '2026-07-07',
    status: 'Approved',
    statusColor: 'bg-green-100 text-green-700',
  },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Sports Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of sports management activities and metrics.
          </p>
        </div>
        <button
          onClick={() => navigate('/sports-management/admin')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <Icon name="arrow_back" />
          Back to Portal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Sports"
          value="12"
          icon="sports_soccer"
          colorScheme="blue"
          subtitle="Active sports offered"
        />
        <StatCard
          title="Active Teams"
          value="8"
          icon="groups"
          colorScheme="orange"
          subtitle="Official university teams"
          trend={{ value: 2, direction: 'up', label: 'this year' }}
        />
        <StatCard
          title="Upcoming Events"
          value="5"
          icon="event"
          colorScheme="purple"
          subtitle="Scheduled tournaments"
        />
        <StatCard
          title="Equipment Issued"
          value="28"
          icon="inventory_2"
          colorScheme="teal"
          subtitle="Currently checked out"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Monthly Activity Overview
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar
                  dataKey="events"
                  name="Events Hosted"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
                <Bar
                  dataKey="bookings"
                  name="Facility Bookings"
                  fill="#14b8a6"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Pending Actions
          </h3>
          <div className="flex flex-col gap-3">
            {pendingActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors w-full text-left"
              >
                <div
                  className={`${action.iconBg} ${action.iconColor} p-2 rounded-full shadow-sm`}
                >
                  <Icon name={action.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-700 block truncate">
                    {action.title}
                  </span>
                  <span className="text-xs text-gray-500">{action.desc}</span>
                </div>
                <Icon name="chevron_right" className="text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Facility Bookings
          </h3>
          <button
            onClick={() =>
              navigate('/sports-management/admin/booking/facility')
            }
            className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
          >
            View All
            <Icon name="chevron_right" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Student
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Facility
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr
                  key={b.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                >
                  <td className="py-3 px-4 text-gray-800">{b.student}</td>
                  <td className="py-3 px-4 text-gray-600">{b.facility}</td>
                  <td className="py-3 px-4 text-gray-600">{b.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 ${b.statusColor} rounded-full text-xs font-medium`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
