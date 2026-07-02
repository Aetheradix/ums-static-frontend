import { Icon } from 'shared/components/Icon/Icon';
import { useNavigate } from 'react-router-dom';
import '../components/TransportDashboard.css';

export default function AdminDashboard() {
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
                Global Transport Administration
              </h1>
            </div>
            <p className="text-slate-300 max-w-xl text-lg ml-4">
              Manage transporters, vehicle fleets, insurances, and overarching
              compliance for the entire university network.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-400">
                Network Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="pulse-dot"></span>
                <span className="text-emerald-400 font-bold tracking-wide">
                  SECURE & ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <Icon name="monitoring" className="text-amber-500" />
        Key Fleet Metrics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="transport-stat-card">
          <div className="flex justify-between items-start">
            <div className="transport-stat-icon-wrapper">
              <Icon name="local_shipping" className="text-[28px]" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            Registered Transporters
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
              12
            </h3>
            <span className="text-sm font-medium text-emerald-500">Active</span>
          </div>
        </div>

        <div className="transport-stat-card">
          <div className="flex justify-between items-start">
            <div className="transport-stat-icon-wrapper">
              <Icon name="directions_car" className="text-[28px] bus-moving" />
            </div>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-bold">
              45 Total
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            Active Vehicles
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
              42
            </h3>
            <span className="text-sm font-medium text-slate-500">
              in operation
            </span>
          </div>
        </div>

        <div className="transport-stat-card">
          <div className="flex justify-between items-start">
            <div className="transport-stat-icon-wrapper">
              <Icon name="badge" className="text-[28px]" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            Drivers & Attenders
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
              38
            </h3>
            <span className="text-sm font-medium text-slate-500">Verified</span>
          </div>
        </div>

        <div className="transport-stat-card">
          <div className="flex justify-between items-start">
            <div className="transport-stat-icon-wrapper">
              <Icon name="route" className="text-[28px]" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
            Total Routes
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
              18
            </h3>
            <span className="text-sm font-medium text-amber-500">
              across network
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Master Configurations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="transport-quick-action"
                onClick={() =>
                  navigate(
                    '/transport-management/admin-login/vehicle-registration'
                  )
                }
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Icon name="airport_shuttle" className="text-[24px]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Register Vehicle
                  </h4>
                  <p className="text-xs text-slate-500">
                    Add new bus or transport vehicle
                  </p>
                </div>
              </div>

              <div
                className="transport-quick-action"
                onClick={() =>
                  navigate(
                    '/transport-management/admin-login/transporter-registration'
                  )
                }
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Icon name="business" className="text-[24px]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Transporters
                  </h4>
                  <p className="text-xs text-slate-500">
                    Manage 3rd party transport partners
                  </p>
                </div>
              </div>

              <div
                className="transport-quick-action"
                onClick={() =>
                  navigate(
                    '/transport-management/admin-login/vehicle-college-mapping'
                  )
                }
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Icon name="lan" className="text-[24px]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    College Allocation
                  </h4>
                  <p className="text-xs text-slate-500">
                    Map vehicles to specific colleges
                  </p>
                </div>
              </div>

              <div
                className="transport-quick-action"
                onClick={() =>
                  navigate(
                    '/transport-management/admin-login/vehicle-insurance'
                  )
                }
              >
                <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Icon name="verified_user" className="text-[24px]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Insurance Logs
                  </h4>
                  <p className="text-xs text-slate-500">
                    Update insurance & compliance docs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="gavel" className="text-indigo-500" />
            Compliance & Approvals
          </h3>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-red-500 bg-red-100 dark:bg-red-500/20 p-2 rounded-lg">
                  <Icon name="warning" className="text-[20px]" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    Insurance Expiring
                  </p>
                  <p className="text-xs text-slate-500">Within next 30 days</p>
                </div>
              </div>
              <span className="font-black text-lg text-red-600">2</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-amber-500 bg-amber-100 dark:bg-amber-500/20 p-2 rounded-lg">
                  <Icon name="fact_check" className="text-[20px]" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    Maintenance Approval
                  </p>
                  <p className="text-xs text-slate-500">
                    Awaiting admin sign-off
                  </p>
                </div>
              </div>
              <span className="font-black text-lg text-amber-600">3</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-blue-600 bg-blue-100 dark:bg-blue-500/20 p-2 rounded-lg">
                  <Icon name="assignment" className="text-[20px]" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    Pending Bills
                  </p>
                  <p className="text-xs text-slate-500">
                    Transporter bill uploads
                  </p>
                </div>
              </div>
              <span className="font-black text-lg text-blue-600">5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
