import { Icon } from 'shared/components/Icon/Icon';
import { useNavigate } from 'react-router-dom';
import '../components/TransportDashboard.css';

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto w-full">
      {/* Hero Header */}
      <div className="transport-dash-header relative !bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-1.5 rounded-full bg-emerald-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Student Transport Portal
              </h1>
            </div>
            <p className="text-blue-100 max-w-xl text-lg ml-4">
              Track your assigned bus, check today's pickup schedule, and manage
              your transport leaves.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-md">
            <div className="text-right">
              <p className="text-sm font-medium text-blue-200">Next Pickup</p>
              <div className="flex items-center gap-2 mt-1">
                <Icon
                  name="schedule"
                  className="text-emerald-400 text-[20px]"
                />
                <span className="text-white font-bold tracking-wide text-lg">
                  08:15 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <Icon name="commute" className="text-blue-500" />
        Your Commute Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="transport-stat-card">
          <div className="flex justify-between items-start">
            <div className="transport-stat-icon-wrapper !bg-blue-100 !text-blue-600 dark:!bg-blue-900/40 dark:!text-blue-400">
              <Icon name="route" className="text-[28px]" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            Assigned Route
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
              R-05
            </h3>
            <span className="text-sm font-medium text-slate-500">
              City Center
            </span>
          </div>
        </div>

        <div className="transport-stat-card border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div className="transport-stat-icon-wrapper !bg-emerald-100 !text-emerald-600 dark:!bg-emerald-900/40 dark:!text-emerald-400">
              <Icon name="directions_bus" className="text-[28px] bus-moving" />
            </div>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              On Time
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            Bus Number
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              MP-04-1234
            </h3>
          </div>
        </div>

        <div className="transport-stat-card">
          <div className="flex justify-between items-start">
            <div className="transport-stat-icon-wrapper !bg-orange-100 !text-orange-600 dark:!bg-orange-900/40 dark:!text-orange-400">
              <Icon name="location_on" className="text-[28px]" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            Pickup Stop
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">
              Central Library
            </h3>
          </div>
        </div>

        <div className="transport-stat-card">
          <div className="flex justify-between items-start">
            <div className="transport-stat-icon-wrapper !bg-purple-100 !text-purple-600 dark:!bg-purple-900/40 dark:!text-purple-400">
              <Icon name="event_busy" className="text-[28px]" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            Leaves Taken
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
              2
            </h3>
            <span className="text-sm font-medium text-slate-500">Days</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-full">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Self Service Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="transport-quick-action"
                onClick={() =>
                  navigate('/transport-management/student-login/live-tracking')
                }
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Icon name="share_location" className="text-[24px]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Track Bus Live
                  </h4>
                  <p className="text-xs text-slate-500">
                    See your bus on the map right now
                  </p>
                </div>
              </div>

              <div
                className="transport-quick-action"
                onClick={() =>
                  navigate('/transport-management/student-login/student-leave')
                }
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Icon name="event_busy" className="text-[24px]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Apply for Leave
                  </h4>
                  <p className="text-xs text-slate-500">
                    Cancel your pickup for specific dates
                  </p>
                </div>
              </div>

              <div
                className="transport-quick-action"
                onClick={() =>
                  navigate('/transport-management/student-login/pickup-drop')
                }
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Icon
                    name="transfer_within_a_station"
                    className="text-[24px]"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    My Roster
                  </h4>
                  <p className="text-xs text-slate-500">
                    View daily pickup & drop logs
                  </p>
                </div>
              </div>

              <div
                className="transport-quick-action"
                onClick={() =>
                  navigate(
                    '/transport-management/student-login/bus-stop-enrollment'
                  )
                }
              >
                <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Icon name="add_location_alt" className="text-[24px]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Change Bus Stop
                  </h4>
                  <p className="text-xs text-slate-500">
                    Request stop change or enrollment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Status Widget */}
        <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-700 flex flex-col relative overflow-hidden">
          {/* Map background illustration */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>

          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <Icon name="satellite_alt" className="text-blue-400" />
            Live ETA
          </h3>

          <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center">
            <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 relative">
              <div
                className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-ping"
                style={{ animationDuration: '3s' }}
              ></div>
              <Icon
                name="directions_bus"
                className="text-[48px] text-blue-400"
              />
            </div>

            <h4 className="text-3xl font-black text-white mb-1">12 Mins</h4>
            <p className="text-blue-200 text-sm mb-6">
              Bus is approaching your stop
            </p>

            <button
              onClick={() =>
                navigate('/transport-management/student-login/live-tracking')
              }
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              Open Live Map{' '}
              <Icon name="arrow_forward" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
