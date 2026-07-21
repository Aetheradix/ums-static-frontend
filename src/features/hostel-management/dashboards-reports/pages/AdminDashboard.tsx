import { useMemo } from 'react';
import { FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const {
    hostels,
    roomAllotments,
    maintenanceRequests,
    gatePasses,
    disciplinaryActions,
    items,
  } = useHostel();
  const navigate = useNavigate();

  // Metrics calculation
  const metrics = useMemo(() => {
    const totalCapacity = hostels.reduce((sum, h) => sum + h.totalCapacity, 0);
    const occupiedBeds = roomAllotments.filter(
      a => a.status === 'PENDING_CHECKIN' || a.status === 'CHECKED_IN'
    ).length;
    const occupancyRate = totalCapacity
      ? Math.round((occupiedBeds / totalCapacity) * 100)
      : 0;

    const pendingMaintenance = maintenanceRequests.filter(
      m =>
        m.status === 'OPEN' ||
        m.status === 'ASSIGNED' ||
        m.status === 'IN_PROGRESS'
    ).length;
    const activeGatePasses = gatePasses.filter(
      g => g.status === 'APPROVED' && !g.actualInTime
    ).length;

    // Low stock items
    const lowStockItems = items.filter(i => {
      // Mocking current balance randomly for demo, in reality we calculate from stockTransactions
      const mockBalance = Math.floor(Math.random() * 20);
      return mockBalance <= i.reorderLevel;
    }).length;

    const openDisciplinary = disciplinaryActions.filter(
      d => d.status === 'OPEN'
    ).length;

    return {
      totalCapacity,
      occupiedBeds,
      occupancyRate,
      pendingMaintenance,
      activeGatePasses,
      lowStockItems,
      openDisciplinary,
    };
  }, [
    hostels,
    roomAllotments,
    maintenanceRequests,
    gatePasses,
    disciplinaryActions,
    items,
  ]);

  // SVG Gauge calculations
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (metrics.occupancyRate / 100) * circumference;

  return (
    <FormPage
      title="Admin Master Dashboard"
      description="Overview of key metrics across all hostel operations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Dashboards',
          to: '/hostel-management/reports/admin-dashboard',
        },
        { label: 'Master Dashboard' },
      ]}
    >
      {/* ─── Top Level KPIs Row ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* KPI 1: Occupancy with Radial SVG Chart */}
        <div
          onClick={() => navigate('/hostel-management/reports/occupancy')}
          className="group relative overflow-hidden bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 border border-indigo-100/50 dark:border-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-800 rounded-2xl shadow-sm hover:shadow-indigo-100 dark:hover:shadow-none p-6 flex items-center justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1"
        >
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
              Total Occupancy
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                {metrics.occupancyRate}%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {metrics.occupiedBeds} / {metrics.totalCapacity} Beds occupied
            </p>
          </div>
          <div className="relative flex items-center justify-center h-16 w-16">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-indigo-100 dark:text-indigo-950"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Foreground Progress */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-indigo-600 dark:text-indigo-400 transition-all duration-500 ease-out"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
              {metrics.occupancyRate}%
            </span>
          </div>
        </div>

        {/* KPI 2: Pending Maintenance */}
        <div
          onClick={() => navigate('/hostel-management/maintenance/assignment')}
          className="group bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 border border-amber-100/50 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-800 rounded-2xl shadow-sm hover:shadow-amber-100 dark:hover:shadow-none p-6 flex items-center justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Pending Maintenance
            </span>
            <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              {metrics.pendingMaintenance}
            </h2>
            <span className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-semibold group-hover:underline">
              Assign Tasks
              <span className="material-symbols-rounded text-sm transform transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-rounded text-2xl">build</span>
          </div>
        </div>

        {/* KPI 3: Students Out */}
        <div
          onClick={() => navigate('/hostel-management/student/gate-pass')}
          className="group bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border border-emerald-100/50 dark:border-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-800 rounded-2xl shadow-sm hover:shadow-emerald-100 dark:hover:shadow-none p-6 flex items-center justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Students Out
            </span>
            <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              {metrics.activeGatePasses}
            </h2>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-semibold group-hover:underline">
              View Active Passes
              <span className="material-symbols-rounded text-sm transform transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-rounded text-2xl">
              directions_run
            </span>
          </div>
        </div>

        {/* KPI 4: Critical Alerts with Flashing Dot */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-50/50 to-white dark:from-rose-950/20 dark:to-slate-900 border border-rose-100/50 dark:border-rose-900/30 rounded-2xl shadow-sm p-6 flex flex-col justify-center transition-all duration-300 hover:border-rose-300 dark:hover:border-rose-800 hover:-translate-y-1">
          {/* Glowing Pulse Dot */}
          {(metrics.lowStockItems > 0 || metrics.openDisciplinary > 0) && (
            <span className="absolute top-4 right-4 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}

          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
            Critical Alerts
          </span>
          <div className="flex flex-col gap-2">
            {metrics.lowStockItems > 0 && (
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold bg-rose-500/5 dark:bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-rose-200/50 dark:border-rose-800/30">
                <span className="material-symbols-rounded text-base">
                  inventory_2
                </span>
                <span>{metrics.lowStockItems} Items low on stock</span>
              </div>
            )}
            {metrics.openDisciplinary > 0 && (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold bg-amber-500/5 dark:bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                <span className="material-symbols-rounded text-base">
                  warning
                </span>
                <span>{metrics.openDisciplinary} Open disciplinary case</span>
              </div>
            )}
            {metrics.lowStockItems === 0 && metrics.openDisciplinary === 0 && (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-500/5 dark:bg-emerald-500/10 px-2.5 py-1.5 rounded-lg">
                <span className="material-symbols-rounded text-base">
                  check_circle
                </span>
                <span>All systems normal</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Breakdown & Quick Actions Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Hostel Breakdown (Left 3 columns) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="material-symbols-rounded text-primary-600">
                apartment
              </span>
              Hostel Occupancy status
            </h3>
            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full font-medium border border-slate-200 dark:border-slate-650">
              Live updates
            </span>
          </div>

          <div className="space-y-6">
            {hostels.map(hostel => {
              const allocated = roomAllotments.filter(
                a =>
                  a.hostelId === hostel.id &&
                  (a.status === 'PENDING_CHECKIN' || a.status === 'CHECKED_IN')
              ).length;
              const pct = hostel.totalCapacity
                ? Math.round((allocated / hostel.totalCapacity) * 100)
                : 0;
              const isGirls =
                hostel.isGirlsHostel || hostel.hostelType === 'GIRLS';

              return (
                <div
                  key={hostel.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-700/30 bg-slate-50/50 dark:bg-slate-900/10 hover:shadow-xs transition-shadow"
                >
                  {/* Title & Stats */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                          {hostel.hostelName}
                        </span>
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isGirls
                              ? 'bg-pink-50 text-pink-700 dark:bg-pink-950/20 dark:text-pink-400 border border-pink-100 dark:border-pink-900/30'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30'
                          }`}
                        >
                          <span className="material-symbols-rounded text-xs">
                            {isGirls ? 'female' : 'male'}
                          </span>
                          {hostel.hostelType}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        Code: {hostel.hostelCode} • Rooms: {hostel.totalRooms}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                        {allocated} / {hostel.totalCapacity}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                        ({pct}%)
                      </span>
                    </div>
                  </div>

                  {/* Premium Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700/70 rounded-full h-3.5 relative overflow-hidden p-0.5 shadow-inner">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-1000 ease-out shadow-sm ${
                        pct > 90
                          ? 'bg-gradient-to-r from-rose-500 to-red-600'
                          : pct > 75
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                            : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    >
                      {/* Highlight reflection stripe inside the progress bar */}
                      <div className="w-full h-full bg-white/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions (Right 2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/50 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <span className="material-symbols-rounded text-primary-600">
                bolt
              </span>
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {/* Action 1: New Application */}
              <Link
                to="/hostel-management/student/application"
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-150 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-800 bg-white dark:bg-slate-800 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-rounded text-xl">
                      person_add
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      New Application
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      Register new hostel students
                    </span>
                  </div>
                </div>
                <span className="material-symbols-rounded text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transform transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </Link>

              {/* Action 2: Room Allotment */}
              <Link
                to="/hostel-management/student/allotment"
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-150 dark:border-slate-700/60 hover:border-emerald-400 dark:hover:border-emerald-800 bg-white dark:bg-slate-800 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-rounded text-xl">
                      room_preferences
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      Room Allotment
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      Allocate rooms and beds
                    </span>
                  </div>
                </div>
                <span className="material-symbols-rounded text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transform transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </Link>

              {/* Action 3: Stock Entry */}
              <Link
                to="/hostel-management/stock/procurement"
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-150 dark:border-slate-700/60 hover:border-amber-400 dark:hover:border-amber-800 bg-white dark:bg-slate-800 hover:bg-amber-50/20 dark:hover:bg-amber-950/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-rounded text-xl">
                      inventory
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      Stock Entry
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      Log inventory and assets
                    </span>
                  </div>
                </div>
                <span className="material-symbols-rounded text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transform transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </Link>

              {/* Action 4: Log Emergency */}
              <Link
                to="/hostel-management/health/emergency-log"
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-150 dark:border-slate-700/60 hover:border-rose-400 dark:hover:border-rose-800 bg-white dark:bg-slate-800 hover:bg-rose-50/20 dark:hover:bg-rose-950/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-rounded text-xl">
                      medical_services
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      Log Emergency
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      Report immediate medical incidents
                    </span>
                  </div>
                </div>
                <span className="material-symbols-rounded text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transform transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-700/50 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
            <span>Need more tools?</span>
            <Link
              to="/hostel-management/masters/basic-facility"
              className="font-semibold text-primary-600 hover:underline"
            >
              Go to Master Configs
            </Link>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
