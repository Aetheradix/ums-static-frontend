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

const activityData = [
  { name: 'Aug', events: 1, bookings: 0 },
  { name: 'Sep', events: 0, bookings: 2 },
  { name: 'Oct', events: 2, bookings: 1 },
  { name: 'Nov', events: 1, bookings: 3 },
  { name: 'Dec', events: 3, bookings: 2 },
];

export default function StudentSportsDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Student Sports Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of your sports activities and registrations.
          </p>
        </div>
        <button
          onClick={() => navigate('/sports-management/student')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <Icon name="arrow_back" />
          Back to Portal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Registered Sports"
          value="2"
          icon="sports_soccer"
          colorScheme="blue"
          subtitle="Active registrations"
        />
        <StatCard
          title="Quota Points"
          value="150"
          icon="stars"
          colorScheme="amber"
          subtitle="Earned this semester"
          trend={{ value: 12, direction: 'up', label: 'vs last month' }}
        />
        <StatCard
          title="Upcoming Events"
          value="3"
          icon="event"
          colorScheme="purple"
          subtitle="Registered events"
        />
        <StatCard
          title="Facility Bookings"
          value="1"
          icon="sports_baseball"
          colorScheme="teal"
          subtitle="Pending approval"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Activity Chart Section */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Activity Overview
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
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
                  name="Events Joined"
                  fill="#a855f7"
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

        {/* Quick Links Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/settings/student-sports-profile/1')}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors w-full text-left"
            >
              <div className="bg-white text-purple-600 p-2 rounded-full shadow-sm">
                <Icon name="person" />
              </div>
              <span className="font-semibold text-gray-700 flex-1">
                My Profile
              </span>
              <Icon name="chevron_right" className="text-gray-400" />
            </button>

            <button
              onClick={() =>
                navigate('/sports-management/student/profile/registration')
              }
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors w-full text-left"
            >
              <div className="bg-white text-green-600 p-2 rounded-full shadow-sm">
                <Icon name="how_to_reg" />
              </div>
              <span className="font-semibold text-gray-700 flex-1">
                Register Sport
              </span>
              <Icon name="chevron_right" className="text-gray-400" />
            </button>

            <button
              onClick={() =>
                navigate('/sports-management/student/events/registration')
              }
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors w-full text-left"
            >
              <div className="bg-white text-orange-600 p-2 rounded-full shadow-sm">
                <Icon name="emoji_events" />
              </div>
              <span className="font-semibold text-gray-700 flex-1">
                Join Event
              </span>
              <Icon name="chevron_right" className="text-gray-400" />
            </button>

            <button
              onClick={() =>
                navigate('/sports-management/student/booking/facility')
              }
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors w-full text-left"
            >
              <div className="bg-white text-teal-600 p-2 rounded-full shadow-sm">
                <Icon name="sports_baseball" />
              </div>
              <span className="font-semibold text-gray-700 flex-1">
                Book Facility
              </span>
              <Icon name="chevron_right" className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Recent Activities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-full mt-1">
              <Icon name="emoji_events" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">
                Basketball Tournament
              </h4>
              <p className="text-sm text-gray-500 mb-2">
                Registered on Oct 12, 2023
              </p>
              <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Confirmed
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
            <div className="bg-teal-100 text-teal-600 p-2 rounded-full mt-1">
              <Icon name="sports_baseball" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">
                Main Ground Booking
              </h4>
              <p className="text-sm text-gray-500 mb-2">
                For practice on Oct 15, 2023
              </p>
              <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                Pending
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full mt-1">
              <Icon name="how_to_reg" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">
                Football Selection
              </h4>
              <p className="text-sm text-gray-500 mb-2">
                Medical fitness approved
              </p>
              <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Approved
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
