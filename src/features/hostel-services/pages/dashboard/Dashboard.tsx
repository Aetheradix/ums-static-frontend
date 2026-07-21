import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';

const KPI_COLORS: Record<
  string,
  { bg: string; border: string; text: string; iconBg: string }
> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-800/50',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-700 dark:text-indigo-300',
    iconBg: 'bg-indigo-100 dark:bg-indigo-800/50',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300',
    iconBg: 'bg-purple-100 dark:bg-purple-800/50',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    iconBg: 'bg-green-100 dark:bg-green-800/50',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    border: 'border-teal-200 dark:border-teal-800',
    text: 'text-teal-700 dark:text-teal-300',
    iconBg: 'bg-teal-100 dark:bg-teal-800/50',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-700 dark:text-orange-300',
    iconBg: 'bg-orange-100 dark:bg-orange-800/50',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    iconBg: 'bg-red-100 dark:bg-red-800/50',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-800/50',
  },
};

function KpiCard({
  label,
  value,
  color = 'blue',
  icon,
}: {
  label: string;
  value: string | number;
  color?: string;
  icon?: string;
}) {
  const c = KPI_COLORS[color] ?? KPI_COLORS.blue;
  return (
    <div className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
      <div
        className={`flex items-center gap-1.5 text-xs font-medium mb-1 ${c.text} opacity-70`}
      >
        {icon && (
          <span className="material-symbols-outlined text-sm">{icon}</span>
        )}
        {label}
      </div>
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { role, selectedHostelId, data } = useHostelContext();

  const isWarden = role === 'Warden';

  // Filter logic
  const activeHostels =
    isWarden && selectedHostelId
      ? data.hostels.filter(h => h.id === selectedHostelId)
      : data.hostels;

  const totalHostels = activeHostels.length;
  const activeHostelIds = activeHostels.map(h => h.id);

  const activeRooms = data.rooms.filter(r =>
    activeHostelIds.includes(r.hostelId)
  );
  const totalBeds = activeRooms.reduce((sum, r) => sum + r.capacity, 0);

  const activeFacilities = data.hostelFacilities.filter(hf =>
    activeHostelIds.includes(hf.hostelId)
  );
  const totalFacilities = activeFacilities.length;

  const activeRequests = isWarden
    ? data.requests.filter(r => r.status === 'Open').length
    : data.requests.length;

  const activeAllocations = data.allocations.filter(
    a => activeHostelIds.includes(a.hostelId) && a.status === 'Active'
  );
  const totalAllocations = activeAllocations.length;

  const activeIncidents = isWarden
    ? data.incidents.filter(i => i.status === 'Closed').length
    : data.incidents.length;

  return (
    <FormPage
      title="Hostel Services Dashboard"
      description={
        isWarden
          ? 'View metrics for your assigned hostel.'
          : 'Overview of all hostels across the university.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {!isWarden && (
          <KpiCard
            label="Total Hostels"
            value={totalHostels}
            icon="apartment"
            color="blue"
          />
        )}
        <KpiCard
          label="Total Rooms"
          value={activeRooms.length}
          icon="meeting_room"
          color="indigo"
        />
        <KpiCard
          label="Total Beds Capacity"
          value={totalBeds}
          icon="bed"
          color="purple"
        />
        <KpiCard
          label="Active Allocations"
          value={totalAllocations}
          icon="how_to_reg"
          color="green"
        />
        <KpiCard
          label="Available Beds"
          value={totalBeds - totalAllocations}
          icon="check_circle"
          color="teal"
        />
        <KpiCard
          label="Total Facilities"
          value={totalFacilities}
          icon="local_convenience_store"
          color="orange"
        />
        <KpiCard
          label="Active Requests"
          value={activeRequests}
          icon="report_problem"
          color="red"
        />
        <KpiCard
          label="Total Incidents"
          value={activeIncidents}
          icon="gavel"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <FormCard title="Recent Applications">
          <GridPanel
            data={data.applications.slice(0, 5)}
            columns={[
              { field: 'studentName', header: 'Student Name' },
              { field: 'applicationDate', header: 'Date' },
              {
                field: 'status',
                header: 'Status',
                cell: (item: any) => (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      item.status === 'Approved'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : item.status === 'Pending'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}
                  >
                    {item.status}
                  </span>
                ),
              },
            ]}
          />
        </FormCard>

        <FormCard title="Pending Leaves & Outpasses">
          <GridPanel
            data={data.leaves
              .filter(l => l.approvalStatus === 'Pending')
              .slice(0, 5)}
            columns={[
              { field: 'studentName', header: 'Student' },
              { field: 'leaveType', header: 'Type' },
              {
                field: 'fromDate',
                header: 'Dates',
                cell: (item: any) => (
                  <>
                    {item.fromDate} to {item.toDate}
                  </>
                ),
              },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
