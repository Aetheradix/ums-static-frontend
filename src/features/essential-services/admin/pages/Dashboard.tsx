import { FormCard, FormGrid, FormPage, StatCard } from 'shared/new-components';
import { essentialServicesUrls } from '../../urls';
import {
  initialParkingRequests,
  initialConferenceBookings,
  initialGuestHouseBookings,
  initialTransportBookings,
  initialSystemLogs,
} from '../../data';

export default function Dashboard() {
  const parkingCount = initialParkingRequests.length;
  const conferenceCount = initialConferenceBookings.length;
  const guestHouseCount = initialGuestHouseBookings.length;
  const transportCount = initialTransportBookings.length;
  const totalBookings =
    parkingCount + conferenceCount + guestHouseCount + transportCount;

  const distribution = [
    { name: 'Parking Space', count: parkingCount, color: 'bg-teal-500' },
    { name: 'Conference Halls', count: conferenceCount, color: 'bg-green-500' },
    { name: 'Guest Lodging', count: guestHouseCount, color: 'bg-amber-500' },
    { name: 'Transport Fleet', count: transportCount, color: 'bg-orange-500' },
  ];
  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  return (
    <FormPage
      title="Essential Services Dashboard"
      description="Unified overview of all booking requests, approval statistics, and facility parameters."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Essential Services', to: essentialServicesUrls.portal },
        { label: 'Admin Portal', to: essentialServicesUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* ── Stat Cards Grid ── */}
      <FormGrid columns={4}>
        <StatCard
          title="Parking Bookings"
          value={parkingCount}
          icon="local_parking"
          colorScheme="teal"
          subtitle="Active vehicle allocations"
        />
        <StatCard
          title="Conference Bookings"
          value={conferenceCount}
          icon="co_present"
          colorScheme="green"
          subtitle="Scheduled hall slots"
        />
        <StatCard
          title="Guest House stays"
          value={guestHouseCount}
          icon="hotel"
          colorScheme="amber"
          subtitle="Checked-in lodging logs"
        />
        <StatCard
          title="Transport Requests"
          value={transportCount}
          icon="directions_bus"
          colorScheme="orange"
          subtitle="Assigned drivers & cars"
        />
      </FormGrid>

      {/* ── Charts & Activities row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <FormCard title="Facility Request Distribution" icon="chart-bar">
          <div className="space-y-4">
            {distribution.map(d => {
              const pct = (d.count / maxCount) * 100;
              const overallPct =
                totalBookings > 0
                  ? Math.round((d.count / totalBookings) * 100)
                  : 0;
              return (
                <div key={d.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>{d.name}</span>
                    <span className="text-gray-950 font-bold">
                      {d.count} ({overallPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${d.color} h-2.5 rounded-full`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </FormCard>

        <FormCard title="Recent Process Action Logs" icon="list">
          <div className="space-y-3">
            {initialSystemLogs.map(l => (
              <div
                key={l.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-start text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded text-xxs uppercase">
                      {l.service}
                    </span>
                    <span className="text-slate-400">{l.timestamp}</span>
                  </div>
                  <p className="font-bold text-slate-700">
                    {l.subjectOrAction}
                  </p>
                  <p className="text-slate-600">{l.contentOrRemarks}</p>
                </div>
                <span className="text-slate-400 font-semibold italic">
                  {l.recipientOrUser}
                </span>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
