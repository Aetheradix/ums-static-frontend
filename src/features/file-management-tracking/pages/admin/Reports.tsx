import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'shared/components/Icon/Icon';
import { FormPage } from 'shared/new-components';
import { InfoBanner } from '../../components';
import { mockDepartments, mockFiles } from '../../data';

export default function AdminReports() {
  const navigate = useNavigate();

  const totalFiles = mockFiles.length;
  const pendingFiles = mockFiles.filter(
    f => f.currentStatus === 'Under Review' || f.currentStatus === 'Forwarded'
  ).length;
  const approvedFiles = mockFiles.filter(
    f => f.currentStatus === 'Approved' || f.currentStatus === 'Closed'
  ).length;
  const rejectedFiles = mockFiles.filter(
    f => f.currentStatus === 'Rejected'
  ).length;
  const draftFiles = mockFiles.filter(f => f.currentStatus === 'Draft').length;

  const depts = mockDepartments.filter(d => d.isActive).map(d => d.name);
  const counts = depts.map(
    d => mockFiles.filter(f => f.departmentName === d).length
  );

  const pieChartData = {
    labels: ['Draft', 'Pending Review', 'Approved/Closed', 'Rejected'],
    datasets: [
      {
        data: [draftFiles, pendingFiles, approvedFiles, rejectedFiles],
        backgroundColor: ['#94a3b8', '#f59e0b', '#10b981', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 11 }, color: '#64748b' },
      },
    },
  };

  const barChartData = {
    labels: depts,
    datasets: [
      {
        label: 'Files',
        data: counts,
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#94a3b8' },
        grid: { color: 'rgba(148,163,184,0.1)' },
      },
      x: {
        ticks: { color: '#94a3b8', font: { size: 10 } },
        grid: { display: false },
      },
    },
  };

  return (
    <FormPage
      breadcrumbs={[
        {
          label: 'File Management Tracking',
          to: '/home/sub-menu/file-management-tracking',
        },
        { label: 'Admin' },
        { label: 'Reports & Analytics' },
      ]}
      title="Reports & Analytics"
      description="Central access to all FMTS reports"
    >
      <InfoBanner
        title="About Reports & Analytics"
        message="View and manage reports & analytics efficiently. Ensure all information is accurate and fully up to date."
      />
      {/* Top Row KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Total Files"
          value={totalFiles}
          color="blue"
          icon="folder"
        />
        <KpiCard
          label="Pending Review"
          value={pendingFiles}
          color="orange"
          icon="hourglass_empty"
        />
        <KpiCard
          label="Approved / Closed"
          value={approvedFiles}
          color="green"
          icon="check_circle"
        />
        <KpiCard
          label="Rejected"
          value={rejectedFiles}
          color="red"
          icon="cancel"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Icon name="pie_chart" className="text-[18px]" />
            </div>
            File Status Overview
          </h3>
          <div className="w-full h-72">
            <Chart
              type="doughnut"
              data={pieChartData}
              options={pieChartOptions}
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 opacity-80" />
          <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <Icon name="business" className="text-[18px]" />
            </div>
            Files by Department
          </h3>
          <div className="w-full h-72">
            <Chart
              type="bar"
              data={barChartData}
              options={barChartOptions}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Icon name="grid_view" className="text-blue-600" /> Report Library
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <ReportTile
            title="File Movement"
            desc="Track the full journey and lifecycle of files"
            icon="swap_horiz"
            color="blue"
            onClick={() =>
              navigate('/file-management-tracking/reports/file-movement')
            }
          />
          <ReportTile
            title="Avg Approval Time"
            desc="Analyze processing speeds and SLAs"
            icon="timer"
            color="orange"
            onClick={() =>
              navigate('/file-management-tracking/reports/avg-approval-time')
            }
          />
          <ReportTile
            title="Pending Files"
            desc="View bottlenecks in the system"
            icon="hourglass_empty"
            color="purple"
            onClick={() =>
              navigate('/file-management-tracking/reports/pending-files')
            }
          />
          <ReportTile
            title="Employee Productivity"
            desc="Review individual staff metrics"
            icon="person"
            color="teal"
            onClick={() =>
              navigate(
                '/file-management-tracking/reports/employee-productivity'
              )
            }
          />
          <ReportTile
            title="SLA Violations"
            desc="Identify overdue deadlines"
            icon="warning"
            color="red"
            onClick={() =>
              navigate('/file-management-tracking/reports/sla-violations')
            }
          />
          <ReportTile
            title="Rejection Rate"
            desc="Analyze reasons for rejections"
            icon="cancel"
            color="pink"
            onClick={() =>
              navigate('/file-management-tracking/reports/rejection-rate')
            }
          />
          <ReportTile
            title="Audit Log Export"
            desc="Download complete system logs"
            icon="history"
            color="slate"
            onClick={() =>
              navigate('/file-management-tracking/reports/audit-log-export')
            }
          />
        </div>
      </div>
    </FormPage>
  );
}

/* ── Sub-components ── */

const KPI_COLORS: Record<
  string,
  { bg: string; border: string; text: string; iconBg: string; iconText: string }
> = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600',
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    iconBg: 'bg-teal-100',
    iconText: 'text-teal-600',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    iconBg: 'bg-red-100',
    iconText: 'text-red-600',
  },
  pink: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
    iconBg: 'bg-pink-100',
    iconText: 'text-pink-600',
  },
  slate: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    iconBg: 'bg-slate-200',
    iconText: 'text-slate-600',
  },
};

function KpiCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string | number;
  color: string;
  icon: string;
}) {
  const c = KPI_COLORS[color] || KPI_COLORS.blue;
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-transform hover:-translate-y-1 relative overflow-hidden ${c.bg} ${c.border}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div
          className={`text-xs font-bold uppercase tracking-wider ${c.text} opacity-80`}
        >
          {label}
        </div>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.iconBg} ${c.iconText}`}
        >
          <Icon name={icon} className="text-lg" />
        </div>
      </div>
      <div
        className={`text-3xl sm:text-4xl font-black tracking-tight ${c.text}`}
      >
        {value}
      </div>
    </div>
  );
}

function ReportTile({
  title,
  desc,
  icon,
  color,
  onClick,
}: {
  title: string;
  desc: string;
  icon: string;
  color: string;
  onClick: () => void;
}) {
  const c = KPI_COLORS[color] || KPI_COLORS.blue;
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col h-full relative overflow-hidden"
    >
      <div
        className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-transform ${c.iconBg} ${c.iconText} group-hover:scale-110 duration-300 shadow-sm`}
      >
        <Icon name={icon} className="text-2xl" />
      </div>
      <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
        {title}
      </h4>
      <p className="text-sm text-gray-500 mb-4 flex-1">{desc}</p>
      <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mt-auto">
        Generate <Icon name="arrow_forward" className="text-[16px]" />
      </div>

      {/* Decorative background element */}
      <div
        className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none ${c.text.replace('text-', 'bg-')}`}
      />
    </div>
  );
}
