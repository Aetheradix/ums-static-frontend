import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { useHostel } from '../../context';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'shared/components/buttons';

export default function StudentDashboard() {
  const { studentDashboard } = useHostel();
  const navigate = useNavigate();

  const {
    student,
    roomInfo,
    roommate,
    activeGatePass,
    pendingComplaints,
    todayMessMenu,
    recentActivity,
    notifications,
  } = studentDashboard;

  return (
    <FormPage
      title={`Welcome, ${student.name}`}
      description={`${student.program} — Semester ${student.semester} | Roll No: ${student.rollNumber}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/student' },
        { label: 'My Dashboard' },
      ]}
    >
      {/* ─── Quick Stats Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Room Info Card */}
        {roomInfo ? (
          <Link to="/hostel-management/reports/student-dashboard">
            <StatCard
              title="My Room"
              value={roomInfo.roomNumber}
              icon="hotel"
              colorScheme="blue"
              subtitle={`${roomInfo.hostelName} • ${roomInfo.blockName}`}
            />
          </Link>
        ) : (
          <Link to="/hostel-management/student-application/apply">
            <StatCard
              title="My Room"
              value="N/A"
              icon="hotel"
              colorScheme="blue"
              subtitle="Apply for Hostel →"
            />
          </Link>
        )}

        {/* Roommate Card */}
        <StatCard
          title="Roommate"
          value={roommate ? roommate.name : 'None'}
          icon="group"
          colorScheme="green"
          subtitle={roommate ? roommate.program : 'No roommate assigned'}
        />

        {/* Active Gate Pass Card */}
        <Link to="/hostel-management/student-operations/gate-pass-request">
          <StatCard
            title="Active Gate Pass"
            value={activeGatePass ? activeGatePass.type : 'None'}
            icon="exit_to_app"
            colorScheme="orange"
            subtitle={
              activeGatePass
                ? `Return by: ${new Date(activeGatePass.returnDateTime).toLocaleDateString()}`
                : 'No active pass'
            }
          />
        </Link>

        {/* Pending Complaints Card */}
        <Link to="/hostel-management/maintenance/requests">
          <StatCard
            title="Pending Complaints"
            value={pendingComplaints}
            icon="build"
            colorScheme="red"
            subtitle={pendingComplaints > 0 ? 'Open ticket(s)' : 'All clear!'}
          />
        </Link>
      </div>

      {/* ─── Today's Mess Menu ──────────────────────────────────────── */}
      <FormCard title="Today's Mess Menu" icon="restaurant">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Breakfast',
              icon: 'free_breakfast',
              items: todayMessMenu.breakfast,
              color: 'amber',
            },
            {
              label: 'Lunch',
              icon: 'lunch_dining',
              items: todayMessMenu.lunch,
              color: 'orange',
            },
            {
              label: 'Snacks',
              icon: 'cookie',
              items: todayMessMenu.snacks,
              color: 'purple',
            },
            {
              label: 'Dinner',
              icon: 'dinner_dining',
              items: todayMessMenu.dinner,
              color: 'blue',
            },
          ].map(meal => (
            <div
              key={meal.label}
              className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-rounded text-slate-600 dark:text-slate-400">
                  {meal.icon}
                </span>
                <span className="font-semibold text-sm">{meal.label}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {meal.items}
              </p>
            </div>
          ))}
        </div>
      </FormCard>

      {/* ─── Quick Actions ──────────────────────────────────────────── */}
      <FormCard title="Quick Actions" icon="bolt">
        <div className="flex flex-wrap gap-3">
          <Button
            label="Apply Gate Pass"
            icon="exit_to_app"
            variant="primary"
            onClick={() =>
              navigate(
                '/hostel-management/student-operations/gate-pass-request'
              )
            }
          />
          <Button
            label="Request Leave"
            icon="event_available"
            variant="outlined"
            onClick={() =>
              navigate('/hostel-management/student-operations/leave-request')
            }
          />
          <Button
            label="Raise Complaint"
            icon="report_problem"
            variant="outlined"
            onClick={() => navigate('/hostel-management/maintenance/requests')}
          />
          <Button
            label="View Mess Menu"
            icon="restaurant"
            variant="outlined"
            onClick={() => navigate('/hostel-management/health/mess-menu')}
          />
          <Button
            label="Room Change Request"
            icon="swap_horiz"
            variant="outlined"
            onClick={() =>
              navigate('/hostel-management/room-management/room-change-request')
            }
          />
        </div>
      </FormCard>

      {/* ─── Two-Column: Activity + Notifications ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <FormCard title="Recent Activity" icon="history">
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div
                key={activity.id}
                className="flex items-start gap-3 text-sm border-b border-slate-100 dark:border-slate-700 pb-3 last:border-0 last:pb-0"
              >
                <span
                  className={`material-symbols-rounded text-lg mt-0.5 ${
                    activity.type === 'GATE_PASS'
                      ? 'text-green-500'
                      : activity.type === 'MAINTENANCE'
                        ? 'text-orange-500'
                        : 'text-blue-500'
                  }`}
                >
                  {activity.type === 'GATE_PASS'
                    ? 'exit_to_app'
                    : activity.type === 'MAINTENANCE'
                      ? 'build'
                      : 'restaurant'}
                </span>
                <div className="flex-1">
                  <p className="text-slate-700 dark:text-slate-300">
                    {activity.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FormCard>

        {/* Notifications */}
        <FormCard title="Notifications" icon="notifications">
          <div className="space-y-3">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 text-sm border-b border-slate-100 dark:border-slate-700 pb-3 last:border-0 last:pb-0 ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10 -mx-2 px-2 py-1 rounded' : ''}`}
              >
                <span
                  className={`material-symbols-rounded text-lg mt-0.5 ${
                    notif.type === 'URGENT'
                      ? 'text-red-500'
                      : notif.type === 'WARNING'
                        ? 'text-amber-500'
                        : 'text-blue-500'
                  }`}
                >
                  {notif.type === 'URGENT'
                    ? 'error'
                    : notif.type === 'WARNING'
                      ? 'warning'
                      : 'info'}
                </span>
                <div className="flex-1">
                  <p className="text-slate-700 dark:text-slate-300">
                    {notif.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(notif.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
