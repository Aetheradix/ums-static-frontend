import { useGrievance } from '../context';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
} from 'shared/new-components';
import { Dropdown } from 'primereact/dropdown';
import { SIMULATED_ROLES } from '../data';

export default function Dashboard() {
  const { grievances, activeRole, setActiveRole, triggerNotification } =
    useGrievance();

  // Stats Calculations
  const total = grievances.length;
  const reported = grievances.filter(g => g.status === 'Reported').length;
  const pending = grievances.filter(g => g.status === 'Pending').length;
  const resolved = grievances.filter(g => g.status === 'Resolved').length;

  // Breakdown Calculations
  const categoryCounts = grievances.reduce((acc: Record<string, number>, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1;
    return acc;
  }, {});

  const priorityCounts = grievances.reduce((acc: Record<string, number>, g) => {
    acc[g.priority] = (acc[g.priority] || 0) + 1;
    return acc;
  }, {});

  const levelCounts = grievances.reduce((acc: Record<string, number>, g) => {
    acc[g.level] = (acc[g.level] || 0) + 1;
    return acc;
  }, {});

  const headerAction = (
    <div className="flex items-center gap-3 bg-white p-2 rounded shadow-sm border border-slate-200">
      <span className="text-xs font-bold text-slate-600 pl-2">
        Act As Role:
      </span>
      <Dropdown
        value={activeRole}
        options={SIMULATED_ROLES}
        optionLabel="text"
        optionValue="id"
        onChange={e => {
          setActiveRole(e.value);
          triggerNotification(
            `Switched role simulation to: ${SIMULATED_ROLES.find(r => r.id === e.value)?.text}`
          );
        }}
        className="p-inputtext-sm text-sm"
      />
    </div>
  );

  return (
    <FormPage
      title="Grievance Redressal Dashboard"
      description="Real-time status overview and classification statistics of complaints"
      breadcrumbs={[
        {
          label: 'Grievance Management',
          to: '/grievance-management/dashboard',
        },
        { label: 'Dashboard' },
      ]}
      headerAction={headerAction}
    >
      {/* ── Stat Cards Grid ── */}
      <FormGrid columns={4}>
        <StatCard
          title="Total Reported"
          value={total}
          icon="description"
          colorScheme="blue"
        />
        <StatCard
          title="New Complaints"
          value={reported}
          icon="campaign"
          colorScheme="amber"
        />
        <StatCard
          title="Pending Review"
          value={pending}
          icon="hourglass_empty"
          colorScheme="orange"
        />
        <StatCard
          title="Resolved Cases"
          value={resolved}
          icon="task_alt"
          colorScheme="green"
        />
      </FormGrid>

      {/* ── Statistics Breakdown Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <FormCard title="Grievance by Level" icon="priority_high">
          <div className="space-y-4">
            {['Severe', 'Mild', 'Routine'].map(level => {
              const count = levelCounts[level] || 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const barColor =
                level === 'Severe'
                  ? 'bg-red-500'
                  : level === 'Mild'
                    ? 'bg-orange-400'
                    : 'bg-green-400';
              return (
                <div key={level} className="space-y-1">
                  <div className="flex justify-between text-sm font-semibold text-gray-700">
                    <span>{level}</span>
                    <span>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${barColor} h-2.5 rounded-full`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </FormCard>

        <FormCard title="Grievance by Priority" icon="bolt">
          <div className="space-y-4">
            {['High', 'Medium', 'Low'].map(priority => {
              const count = priorityCounts[priority] || 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const barColor =
                priority === 'High'
                  ? 'bg-rose-500'
                  : priority === 'Medium'
                    ? 'bg-amber-500'
                    : 'bg-sky-400';
              return (
                <div key={priority} className="space-y-1">
                  <div className="flex justify-between text-sm font-semibold text-gray-700">
                    <span>{priority}</span>
                    <span>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${barColor} h-2.5 rounded-full`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </FormCard>

        <FormCard title="Category Breakdown" icon="category">
          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div
                  key={cat}
                  className="flex justify-between text-sm text-gray-700 py-1 border-b border-gray-100 last:border-b-0"
                >
                  <span className="truncate pr-2 font-medium">{cat}</span>
                  <span className="font-bold text-gray-900 shrink-0">
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
            {Object.keys(categoryCounts).length === 0 && (
              <p className="text-gray-500 text-center text-sm">
                No category data recorded yet.
              </p>
            )}
          </div>
        </FormCard>
      </div>

      {/* ── Recent Grievances List ── */}
      <div className="mt-6">
        <FormCard title="Recent Grievances Awaiting Action" icon="list">
          <GridPanel
            data={grievances.slice(0, 5)}
            columns={[
              { field: 'id', header: 'Grievance ID', width: '100px' },
              { field: 'member', header: 'Complainant' },
              { field: 'category', header: 'Category' },
              {
                field: 'level',
                header: 'Level',
                cell: (item: any) => (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      item.level === 'Severe'
                        ? 'bg-red-100 text-red-700'
                        : item.level === 'Mild'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.level}
                  </span>
                ),
              },
              {
                field: 'priority',
                header: 'Priority',
                cell: (item: any) => (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      item.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : item.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    {item.priority}
                  </span>
                ),
              },
              {
                field: 'status',
                header: 'Status',
                cell: (item: any) => (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      item.status === 'Reported'
                        ? 'bg-amber-100 text-amber-700'
                        : item.status === 'Pending'
                          ? 'bg-orange-100 text-orange-700'
                          : item.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.status}
                  </span>
                ),
              },
              { field: 'reportedDate', header: 'Date Reported' },
            ]}
            searchBox={false}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
