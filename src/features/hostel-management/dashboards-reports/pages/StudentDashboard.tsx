import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { useNavigate } from 'react-router-dom';
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
        <div
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() =>
            navigate('/hostel-management/reports/student-dashboard')
          }
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-rounded text-blue-600 text-2xl">
              hotel
            </span>
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
              My Room
            </span>
          </div>
          {roomInfo ? (
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-lg text-blue-900 dark:text-blue-200">
                {roomInfo.roomNumber}
              </p>
              <p>{roomInfo.hostelName}</p>
              <p>
                {roomInfo.blockName} • {roomInfo.roomType}
              </p>
              <p>Bed: {roomInfo.bedNumber}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-500">No room allocated yet</p>
              <Button
                label="Apply for Hostel"
                variant="primary"
                icon="add"
                onClick={() =>
                  navigate('/hostel-management/student-application/apply')
                }
              />
            </div>
          )}
        </div>

        {/* Roommate Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-rounded text-green-600 text-2xl">
              group
            </span>
            <span className="text-sm font-semibold text-green-800 dark:text-green-300">
              Roommate
            </span>
          </div>
          {roommate ? (
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-lg text-green-900 dark:text-green-200">
                {roommate.name}
              </p>
              <p>{roommate.program}</p>
              <p>{roommate.department}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No roommate assigned</p>
          )}
        </div>

        {/* Active Gate Pass Card */}
        <div
          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() =>
            navigate('/hostel-management/student-operations/gate-pass-request')
          }
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-rounded text-orange-600 text-2xl">
              exit_to_app
            </span>
            <span className="text-sm font-semibold text-orange-800 dark:text-orange-300">
              Active Gate Pass
            </span>
          </div>
          {activeGatePass ? (
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-lg text-orange-900 dark:text-orange-200">
                {activeGatePass.type}
              </p>
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${activeGatePass.status === 'WARDEN_APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
              >
                {activeGatePass.status.replace(/_/g, ' ')}
              </span>
              <p>
                Return by:{' '}
                {new Date(activeGatePass.returnDateTime).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 mt-2">No active gate pass</p>
          )}
        </div>

        {/* Pending Complaints Card */}
        <div
          className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 rounded-xl p-4 border border-red-200 dark:border-red-700 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/hostel-management/maintenance/requests')}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-rounded text-red-600 text-2xl">
              build
            </span>
            <span className="text-sm font-semibold text-red-800 dark:text-red-300">
              Pending Complaints
            </span>
          </div>
          <p
            className={`font-bold text-3xl ${pendingComplaints > 0 ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}
          >
            {pendingComplaints}
          </p>
          <p className="text-sm text-slate-500">
            {pendingComplaints > 0 ? 'Open ticket(s)' : 'All clear!'}
          </p>
        </div>
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
