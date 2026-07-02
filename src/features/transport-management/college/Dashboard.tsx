import { Icon } from 'shared/components/Icon/Icon';
import { useNavigate } from 'react-router-dom';
import '../components/TransportDashboard.css';

export default function CollegeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto w-full">
      {/* Hero Header */}
      <div className="transport-dash-header relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-1.5 rounded-full bg-amber-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                College Transport Dashboard
              </h1>
            </div>
            <p className="text-slate-300 max-w-xl text-lg ml-4">
              Real-time overview of college transport operations, student
              mapping, and vehicle fleet status.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-400">
                System Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="pulse-dot"></span>
                <span className="text-emerald-400 font-bold tracking-wide">
                  LIVE & OPERATIONAL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <Icon name="monitoring" className="text-amber-500" />
        Fleet & Student Metrics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="transport-stat-card">
          <div className="flex justify-between items-start">
            <div className="transport-stat-icon-wrapper">
              <Icon name="groups" className="text-[28px]" />
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full text-xs font-bold">
              +15 This Week
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            Total Students
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
              1,250
            </h3>
          </div>
        </div>

        <div className="transport-stat-card">
          <div className="flex justify-between items-start">
            <div className="transport-stat-icon-wrapper">
              <Icon name="directions_bus" className="text-[28px] bus-moving" />
            </div>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              12 On Route
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            Allocated Buses
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
              15
            </h3>
          </div>
        </div>

        <div className="transport-stat-card">
          <div className="flex justify-between items-start">
            <div className="transport-stat-icon-wrapper">
              <Icon name="route" className="text-[28px]" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            Active Routes
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
              8
            </h3>
            <span className="text-sm font-medium text-slate-500">
              across 45 stops
            </span>
          </div>
        </div>

        <div className="transport-stat-card">
          <div className="flex justify-between items-start">
            <div className="transport-stat-icon-wrapper">
              <Icon name="confirmation_number" className="text-[28px]" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            Gate Passes Issued
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
              45
            </h3>
            <span className="text-sm font-medium text-amber-500">Today</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Quick Operations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="transport-quick-action"
                onClick={() =>
                  navigate(
                    '/transport-management/college-login/add-bus-gate-pass'
                  )
                }
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Icon name="add_circle" className="text-[24px]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Issue Gate Pass
                  </h4>
                  <p className="text-xs text-slate-500">
                    Create new visitor/bus entry
                  </p>
                </div>
              </div>

              <div
                className="transport-quick-action"
                onClick={() =>
                  navigate('/transport-management/college-login/live-tracking')
                }
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Icon name="my_location" className="text-[24px]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Live Tracking
                  </h4>
                  <p className="text-xs text-slate-500">
                    Monitor active fleets on map
                  </p>
                </div>
              </div>

              <div
                className="transport-quick-action"
                onClick={() =>
                  navigate(
                    '/transport-management/college-login/maintenance-request'
                  )
                }
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Icon name="build" className="text-[24px]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Maintenance Request
                  </h4>
                  <p className="text-xs text-slate-500">
                    Raise repair/service ticket
                  </p>
                </div>
              </div>

              <div
                className="transport-quick-action"
                onClick={() =>
                  navigate(
                    '/transport-management/college-login/student-route-mapping'
                  )
                }
              >
                <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Icon name="person_add" className="text-[24px]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Map Student
                  </h4>
                  <p className="text-xs text-slate-500">
                    Assign student to route & stop
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attention Needed */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="notification_important" className="text-red-500" />
            Requires Attention
          </h3>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-red-500 bg-red-100 dark:bg-red-500/20 p-2 rounded-lg">
                  <Icon name="cancel" className="text-[20px]" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    Pickup Cancellations
                  </p>
                  <p className="text-xs text-slate-500">Action needed today</p>
                </div>
              </div>
              <span className="font-black text-lg text-red-600">3</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-orange-500 bg-orange-100 dark:bg-orange-500/20 p-2 rounded-lg">
                  <Icon name="event_busy" className="text-[20px]" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    Staff Leaves
                  </p>
                  <p className="text-xs text-slate-500">
                    Drivers/Attenders on leave
                  </p>
                </div>
              </div>
              <span className="font-black text-lg text-orange-600">2</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-amber-600 bg-amber-100 dark:bg-amber-500/20 p-2 rounded-lg">
                  <Icon name="build_circle" className="text-[20px]" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    Pending Maintenance
                  </p>
                  <p className="text-xs text-slate-500">
                    Vehicles awaiting service
                  </p>
                </div>
              </div>
              <span className="font-black text-lg text-amber-600">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
