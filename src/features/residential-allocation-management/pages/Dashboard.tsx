import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import '../residential.css';
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
        { label: 'Home', to: '/home' },
        {
          label: 'Residential Allocation',
          to: RESIDENTIAL_ALLOCATION_URLS.dashboard,
        },
        { label: 'Dashboard' },
      ]}
    >
      <div className="space-y-6">
        {/* Hero Banner */}
        <div className="ram-hero">
          <div className="ram-hero-orb" />
          <div className="ram-hero-content">
            <h2 className="ram-hero-title">STU Housing Command Centre</h2>
            <p className="ram-hero-desc">
              Monitor estate occupancy rates, evaluate faculty seniority intake
              queues, and streamline physical key releases.
            </p>
          </div>
          <div className="ram-hero-action">
            <Button
              label="Start Quarter Application +"
              variant="primary"
              onClick={() => navigate(RESIDENTIAL_ALLOCATION_URLS.staffApply)}
            />
          </div>
        </div>

        {/* Stats Analytics Grid */}
        <div className="ram-stats-grid">
          <div className="ram-stat-card ram-stat-card--amber">
            <div>
              <div className="ram-stat-label">Registered Quarters</div>
              <div className="ram-stat-value" style={{ color: '#92400e' }}>
                {estates.length}
              </div>
            </div>
            <div className="ram-stat-icon ram-stat-icon--amber">
              <i className="pi pi-building" />
            </div>
          </div>

          <div className="ram-stat-card ram-stat-card--indigo">
            <div>
              <div className="ram-stat-label">Occupied Flats</div>
              <div className="ram-stat-value" style={{ color: '#3730a3' }}>
                {totalOccupancy}
                <span className="ram-stat-sub"> / {totalCapacity} units</span>
              </div>
            </div>
            <div className="ram-stat-icon ram-stat-icon--indigo">
              <i className="pi pi-users" />
            </div>
          </div>

          <div className="ram-stat-card ram-stat-card--rose">
            <div>
              <div className="ram-stat-label">Screener Queue</div>
              <div className="ram-stat-value" style={{ color: '#9f1239' }}>
                {pendingCount}
              </div>
            </div>
            <div className="ram-stat-icon ram-stat-icon--rose">
              <i className="pi pi-check-square" />
            </div>
          </div>

          <div className="ram-stat-card ram-stat-card--emerald">
            <div>
              <div className="ram-stat-label">Quarter Handover</div>
              <div className="ram-stat-value" style={{ color: '#065f46' }}>
                {checkedInList.length}
              </div>
            </div>
            <div className="ram-stat-icon ram-stat-icon--emerald">
              <i className="pi pi-user-check" />
            </div>
          </div>
        </div>

        {/* Breakdown Data Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Estates Breakdown */}
          <FormCard title="Campus Estates Breakdown" icon="building">
            <div className="space-y-3">
              {estates.map(h => {
                const occupancyRate =
                  h.flatsCount > 0
                    ? Math.round((h.occupancy / h.flatsCount) * 100)
                    : 0;
                return (
                  <div key={h.code} className="ram-estate-item">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-800">
                        {h.name}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {h.occupancy} / {h.flatsCount} Flats
                      </span>
                    </div>
                    <div className="ram-progress-bar-track">
                      <div
                        className={`ram-progress-bar-fill ${occupancyRate > 85 ? 'ram-progress-bar-fill--critical' : 'ram-progress-bar-fill--normal'}`}
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>
                        Warden:{' '}
                        <strong className="text-slate-700">
                          {h.wardenName}
                        </strong>
                      </span>
                      <span
                        className={`font-bold ${occupancyRate > 85 ? 'text-rose-600' : 'text-indigo-600'}`}
                      >
                        {occupancyRate}% Full
                      </span>
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
                  ) => {
                    const cls =
                      item.status === 'Approved'
                        ? 'ram-badge--approved'
                        : item.status === 'Pending'
                          ? 'ram-badge--pending'
                          : item.status === 'Sent Back'
                            ? 'ram-badge--sent-back'
                            : 'ram-badge--rejected';
                    return (
                      <span className={`ram-badge ${cls}`}>
                        {item.status === 'Sent Back'
                          ? 'Correction Req.'
                          : item.status}
                      </span>
                    );
                  },
                },
              ]}
            />
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}


