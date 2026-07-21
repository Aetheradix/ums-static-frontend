import { useMemo } from 'react';
import { FormPage, StatCard, FormCard } from 'shared/new-components';
import { useHostel } from '../../context';
import { Link } from 'react-router-dom';
import { Chart } from 'primereact/chart';

// ─── Mock Data & Chart Configs ───────────────────────────────────────────────

const REVENUE_TREND = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  fees: [120000, 150000, 110000, 180000, 210000, 190000],
  fines: [5000, 3000, 7000, 2000, 4000, 6000],
};

const MAINTENANCE_STATUS = {
  labels: ['Plumbing', 'Electrical', 'Carpentry', 'IT/Network'],
  open: [12, 8, 5, 15],
  resolved: [45, 30, 25, 60],
};

const revenueChartData = {
  labels: REVENUE_TREND.months,
  datasets: [
    {
      label: 'Fee Collection',
      data: REVENUE_TREND.fees,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.15)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Fines Collected',
      data: REVENUE_TREND.fines,
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239,68,68,0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const maintenanceChartData = {
  labels: MAINTENANCE_STATUS.labels,
  datasets: [
    {
      label: 'Open',
      data: MAINTENANCE_STATUS.open,
      backgroundColor: 'rgba(245, 158, 11, 0.85)',
      borderRadius: 4,
    },
    {
      label: 'Resolved',
      data: MAINTENANCE_STATUS.resolved,
      backgroundColor: 'rgba(59, 130, 246, 0.85)',
      borderRadius: 4,
    },
  ],
};

const commonOptions = {
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: '#94a3b8', padding: 16, font: { size: 12 } },
    },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(148,163,184,0.1)' },
      ticks: { color: '#94a3b8' },
    },
  },
  maintainAspectRatio: false,
};

const doughnutOptions = {
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: '#94a3b8',
        padding: 16,
        font: { size: 12 },
        boxWidth: 12,
        borderRadius: 4,
      },
    },
  },
  cutout: '65%',
  maintainAspectRatio: false,
};

export default function AdminDashboard() {
  const {
    hostels,
    roomAllotments,
    maintenanceRequests,
    gatePasses,
    disciplinaryActions,
    items,
  } = useHostel();
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

  const occupancyChartData = useMemo(() => {
    const vacant = Math.max(0, metrics.totalCapacity - metrics.occupiedBeds);
    return {
      labels: ['Occupied', 'Vacant'],
      datasets: [
        {
          data: [metrics.occupiedBeds, vacant],
          backgroundColor: ['#3b82f6', '#e2e8f0'],
          hoverOffset: 4,
          borderWidth: 0,
        },
      ],
    };
  }, [metrics]);

  // SVG Gauge calculations removed as they are no longer used with StatCard

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Link to="/hostel-management/reports/occupancy">
          <StatCard
            title="Total Occupancy"
            value={`${metrics.occupancyRate}%`}
            icon="apartment"
            colorScheme="blue"
            subtitle={`${metrics.occupiedBeds} / ${metrics.totalCapacity} Beds occupied`}
          />
        </Link>
        <Link to="/hostel-management/maintenance/assignment">
          <StatCard
            title="Pending Maintenance"
            value={metrics.pendingMaintenance}
            icon="build"
            colorScheme="orange"
            subtitle="Assign Tasks →"
          />
        </Link>
        <Link to="/hostel-management/student/gate-pass">
          <StatCard
            title="Students Out"
            value={metrics.activeGatePasses}
            icon="directions_run"
            colorScheme="green"
            subtitle="View Active Passes →"
          />
        </Link>
        <StatCard
          title="Critical Alerts"
          value={metrics.lowStockItems + metrics.openDisciplinary}
          icon="warning"
          colorScheme="red"
          subtitle={
            metrics.lowStockItems === 0 && metrics.openDisciplinary === 0
              ? 'All systems normal'
              : 'Action required'
          }
        />
      </div>

      {/* ─── Analytics Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FormCard
          title="Revenue & Fines Trend"
          icon="payments"
          className="lg:col-span-2"
        >
          <div className="h-[250px] w-full">
            <Chart
              type="line"
              data={revenueChartData}
              options={commonOptions}
              className="h-full w-full"
            />
          </div>
        </FormCard>
        <FormCard title="Occupancy Distribution" icon="donut_large">
          <div className="h-[250px] w-full flex items-center justify-center">
            <Chart
              type="doughnut"
              data={occupancyChartData}
              options={doughnutOptions}
              className="h-full w-full"
            />
          </div>
        </FormCard>
      </div>

      {/* ─── Main Breakdown & Quick Actions Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <FormCard title="Maintenance Status" icon="build">
            <div className="h-[250px] w-full">
              <Chart
                type="bar"
                data={maintenanceChartData}
                options={commonOptions}
                className="h-full w-full"
              />
            </div>
          </FormCard>

          <FormCard title="Hostel Occupancy status" icon="apartment">
            <div className="space-y-6">
              {hostels.map(hostel => {
                const allocated = roomAllotments.filter(
                  a =>
                    a.hostelId === hostel.id &&
                    (a.status === 'PENDING_CHECKIN' ||
                      a.status === 'CHECKED_IN')
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
          </FormCard>
        </div>

        {/* Quick Actions (Right 1 column) */}
        <div className="flex flex-col">
          <FormCard
            title="Quick Actions"
            icon="bolt"
            className="flex-1 flex flex-col justify-between"
          >
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

            <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-700/50 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
              <span>Need more tools?</span>
              <Link
                to="/hostel-management/masters/basic-facility"
                className="font-semibold text-primary-600 hover:underline"
              >
                Go to Master Configs
              </Link>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
