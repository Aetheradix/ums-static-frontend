import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { useResidentialAllocation } from '../context';
import { RESIDENTIAL_ALLOCATION_URLS } from '../urls';

export default function Dashboard() {
  const navigate = useNavigate();
  const { estates, applications, checkedInList } = useResidentialAllocation();

  const pendingCount = useMemo(
    () => applications.filter(a => a.status === 'Pending').length,
    [applications]
  );
  const totalCapacity = useMemo(
    () => estates.reduce((acc, curr) => acc + curr.flatsCount, 0),
    [estates]
  );
  const totalOccupancy = useMemo(
    () => estates.reduce((acc, curr) => acc + curr.occupancy, 0),
    [estates]
  );

  return (
    <FormPage
      title="Quarter Allocations Command Centre"
      description="Real-time dashboard of campus accommodation units, staff pay grade clearances, applications, and check-in key registries"
      breadcrumbs={[
        {
          label: 'Residential Allocation',
          to: RESIDENTIAL_ALLOCATION_URLS.dashboard,
        },
        { label: 'Dashboard' },
      ]}
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 font-black text-9xl">
            STU
          </div>
          <div className="space-y-2 relative z-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              STU Housing Command Centre
            </h2>
            <p className="text-slate-300 text-sm max-w-xl">
              Monitor estate occupancy rates, evaluate faculty seniority intake
              queues, and streamline physical key releases.
            </p>
          </div>
          <Button
            label="Start Quarter Application +"
            variant="primary"
            onClick={() => navigate(RESIDENTIAL_ALLOCATION_URLS.staffApply)}
          />
        </div>

        {/* Stats Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Registered Quarters
              </span>
              <h3 className="text-3xl font-black text-slate-900">
                {estates.length}
              </h3>
            </div>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl text-2xl">
              <i className="pi pi-building text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Occupied Flats
              </span>
              <h3 className="text-3xl font-black text-indigo-700">
                {totalOccupancy}{' '}
                <span className="text-xs text-slate-400 font-normal">
                  / {totalCapacity} units
                </span>
              </h3>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl text-2xl">
              <i className="pi pi-users text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Screener Queue
              </span>
              <h3 className="text-3xl font-black text-rose-600">
                {pendingCount}
              </h3>
            </div>
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-2xl">
              <i className="pi pi-check-square text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Quarter Handover
              </span>
              <h3 className="text-3xl font-black text-emerald-600">
                {checkedInList.length}
              </h3>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-2xl">
              <i className="pi pi-user-check text-2xl" />
            </div>
          </div>
        </div>

        {/* Breakdown Data Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Estates Breakdown */}
          <FormCard title="Campus Estates Breakdown" icon="building">
            <div className="space-y-4">
              {estates.map(h => {
                const occupancyRate =
                  h.flatsCount > 0
                    ? Math.round((h.occupancy / h.flatsCount) * 100)
                    : 0;
                return (
                  <div
                    key={h.code}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3"
                  >
                    <div className="flex justify-between items-center text-sm font-sans">
                      <span className="font-bold text-slate-800">{h.name}</span>
                      <span className="text-slate-500东 font-medium">
                        {h.occupancy} / {h.flatsCount} Flats Occupied
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          occupancyRate > 85 ? 'bg-rose-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>
                        Admin Estate Warden:{' '}
                        <strong className="text-slate-700">
                          {h.wardenName}
                        </strong>
                      </span>
                      <span>{occupancyRate}% Full</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </FormCard>

          {/* Recent Applications Grid */}
          <FormCard title="Recent Seniority Applications" icon="list">
            <GridPanel
              data={applications.slice(0, 5)}
              columns={[
                { field: 'name', header: 'Staff Name' },
                { field: 'designation', header: 'Role' },
                { field: 'payLevel', header: 'Pay Band' },
                {
                  field: 'status',
                  header: 'Status',
                  cell: (
                    item: ResidentialAllocationManagement.StaffApplication
                  ) => (
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        item.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : item.status === 'Sent Back'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {item.status === 'Sent Back'
                        ? 'Correction Req.'
                        : item.status}
                    </span>
                  ),
                },
              ]}
            />
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
