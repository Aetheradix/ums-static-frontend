import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormCard, FormGrid, FormPage, StatCard } from 'shared/new-components';
import {
  EmptyState,
  FacilityChip,
  OccupancyBar,
  SectionNote,
} from '../components/ui';
import {
  MOCK_WARDEN_HOSTEL_ID,
  hostelOccupancy,
  today,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';
import { hmsUrls } from '../urls';

export default function WardenDashboard() {
  const { data } = useHms();
  const { activePortal } = useHmsRole();
  const navigate = useNavigate();

  const hostel = data.hostels.find(h => h.id === MOCK_WARDEN_HOSTEL_ID);

  const occ = useMemo(
    () =>
      hostel ? hostelOccupancy(hostel, data.rooms, data.allocations) : null,
    [hostel, data.rooms, data.allocations]
  );

  const counts = useMemo(
    () => ({
      pendingAdmissions: data.applications.filter(
        a =>
          a.status === 'Pending' &&
          a.preferredHostelId === MOCK_WARDEN_HOSTEL_ID
      ).length,
      pendingLeave: data.leaveRequests.filter(
        l => l.hostelId === MOCK_WARDEN_HOSTEL_ID && l.status === 'Pending'
      ).length,
      out: data.inOutEntries.filter(
        e => e.hostelId === MOCK_WARDEN_HOSTEL_ID && e.status !== 'Returned'
      ).length,
      openGrievances: data.grievances.filter(
        g =>
          g.hostelId === MOCK_WARDEN_HOSTEL_ID &&
          g.status !== 'Resolved' &&
          g.status !== 'Closed'
      ).length,
      roomChange: data.roomChangeRequests.filter(
        r => r.hostelId === MOCK_WARDEN_HOSTEL_ID && r.status === 'Pending'
      ).length,
      newFeedback: data.messFeedback.filter(
        f => f.hostelId === MOCK_WARDEN_HOSTEL_ID && f.status === 'New'
      ).length,
      presentToday: data.attendance.filter(
        a =>
          a.hostelId === MOCK_WARDEN_HOSTEL_ID &&
          a.date === today() &&
          a.status === 'Present'
      ).length,
    }),
    [data]
  );

  const facilities = (hostel?.facilityIds ?? [])
    .map(id => data.facilityOptions.find(f => f.id === id))
    .filter(Boolean);

  const actions = [
    {
      label: 'Admission Requests',
      count: counts.pendingAdmissions,
      path: hmsUrls.warden.admissionRequests,
      icon: 'how_to_reg',
    },
    {
      label: 'Leave Requests',
      count: counts.pendingLeave,
      path: hmsUrls.warden.leaveRequests,
      icon: 'directions_walk',
    },
    {
      label: 'Room Change Requests',
      count: counts.roomChange,
      path: hmsUrls.warden.roomChangeRequests,
      icon: 'swap_calls',
    },
    {
      label: 'Open Grievances',
      count: counts.openGrievances,
      path: hmsUrls.warden.grievances,
      icon: 'flag',
    },
    {
      label: 'New Mess Feedback',
      count: counts.newFeedback,
      path: hmsUrls.warden.messFeedback,
      icon: 'rate_review',
    },
    {
      label: 'Students Out',
      count: counts.out,
      path: hmsUrls.warden.inOutEntry,
      icon: 'logout',
    },
  ];

  return (
    <FormPage
      title="Warden Dashboard"
      description={
        hostel
          ? `${hostel.nameEn} · ${hostel.type} hostel · ${hostel.address}`
          : 'Your hostel at a glance.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Dashboard')}
    >
      <FormGrid columns={4}>
        <StatCard
          title="Beds Configured"
          value={occ?.configuredBeds ?? 0}
          icon="bed"
          colorScheme="blue"
          subtitle={`${occ?.totalRooms ?? 0} rooms`}
        />
        <StatCard
          title="Beds Allotted"
          value={occ?.allottedBeds ?? 0}
          icon="how_to_reg"
          colorScheme="green"
        />
        <StatCard
          title="Beds Available"
          value={occ?.availableBeds ?? 0}
          icon="event_seat"
          colorScheme="teal"
        />
        <StatCard
          title="Present Today"
          value={counts.presentToday}
          icon="event_available"
          colorScheme="purple"
        />
      </FormGrid>

      <FormCard
        title="Occupancy"
        subtitle="Beds allotted against the beds you have configured as rooms."
        icon="chart-bar"
      >
        {occ ? (
          <div className="flex flex-col gap-4">
            <OccupancyBar
              allotted={occ.allottedBeds}
              total={occ.configuredBeds}
            />
            {occ.configuredBeds < occ.declaredCapacity && (
              <SectionNote tone="warning" title="Rooms still to configure">
                Your hostel is sanctioned for {occ.declaredCapacity} seats but
                only {occ.configuredBeds} beds are configured as rooms. Add the
                rest under Room Configuration.
              </SectionNote>
            )}
          </div>
        ) : (
          <EmptyState title="No hostel linked to this warden" />
        )}
      </FormCard>

      <FormCard
        title="Needs Your Attention"
        subtitle="Everything waiting on a decision from you."
        icon="bell"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map(a => (
            <button
              key={a.label}
              type="button"
              onClick={() => navigate(a.path)}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-all hover:border-blue-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                  <span className="material-symbols-outlined text-[18px] text-slate-600 dark:text-slate-300">
                    {a.icon}
                  </span>
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {a.label}
                </span>
              </span>
              <span
                className={`min-w-[28px] rounded-full px-2 py-0.5 text-center text-xs font-bold ${
                  a.count > 0
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {a.count}
              </span>
            </button>
          ))}
        </div>
      </FormCard>

      <FormCard title="Hostel Facilities" icon="checklist">
        {facilities.length === 0 ? (
          <EmptyState
            icon="checklist"
            title="No facilities configured"
            hint="Pick the facilities your hostel provides under Hostel Facilities."
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {facilities.map(f => (
              <FacilityChip key={f!.id} icon={f!.icon} name={f!.name} />
            ))}
          </div>
        )}
      </FormCard>
    </FormPage>
  );
}
