import { useMemo } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  EmptyState,
  FacilityChip,
  KeyValueTile,
  OccupancyBar,
  SectionNote,
} from '../components/ui';
import {
  MOCK_STUDENT_ID,
  roomOccupancy,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Allocation } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

export default function MyRoom() {
  const { data } = useHms();
  const { activePortal } = useHmsRole();

  const allocation = data.allocations.find(
    a => a.studentId === MOCK_STUDENT_ID && a.status === 'Active'
  );
  const room = data.rooms.find(r => r.id === allocation?.roomId);
  const hostel = data.hostels.find(h => h.id === allocation?.hostelId);

  const occ = room ? roomOccupancy(room, data.allocations) : null;

  const roommates = useMemo(
    () =>
      data.allocations.filter(
        a =>
          a.roomId === allocation?.roomId &&
          a.status === 'Active' &&
          a.studentId !== MOCK_STUDENT_ID
      ),
    [data.allocations, allocation]
  );

  const facilities = (hostel?.facilityIds ?? [])
    .map(id => data.facilityOptions.find(f => f.id === id))
    .filter(Boolean);

  if (!allocation || !room || !hostel) {
    return (
      <FormPage
        title="My Room"
        description="Your hostel room allotment."
        breadcrumbs={hmsBreadcrumbs(activePortal, 'My Room')}
      >
        <FormCard>
          <EmptyState
            icon="bed"
            title="No room allotted yet"
            hint="Your warden allots a room once your admission is approved and the hostel fee and caution money are paid."
          />
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="My Room"
      description={`${hostel.nameEn} · ${hostel.address}`}
      breadcrumbs={hmsBreadcrumbs(activePortal, 'My Room')}
    >
      <FormCard title="Allotment Details" icon="bed">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KeyValueTile
            label="Room Number"
            value={room.roomNumber}
            tone="info"
          />
          <KeyValueTile label="Room Type" value={room.roomType} />
          <KeyValueTile label="Floor" value={room.floor} />
          <KeyValueTile label="Wing / Block" value={room.wing} />
          <KeyValueTile label="Allotted On" value={allocation.allottedOn} />
          <KeyValueTile label="Allotted By" value={allocation.allottedBy} />
          <KeyValueTile label="Hostel Type" value={hostel.type} />
          <KeyValueTile label="Warden" value={hostel.wardenName} />
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 px-5 py-4 dark:border-slate-700">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Room occupancy
          </p>
          <OccupancyBar allotted={occ?.allotted ?? 0} total={room.beds} />
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
            {occ?.available === 0
              ? 'This room is full.'
              : `${occ?.available} bed${occ?.available === 1 ? '' : 's'} still free in this room.`}
          </p>
        </div>
      </FormCard>

      <FormCard title="Roommates" icon="users">
        {roommates.length === 0 ? (
          <EmptyState
            icon="person"
            title="You have the room to yourself for now"
          />
        ) : (
          <GridPanel<Allocation>
            data={roommates}
            pagination={false}
            columns={[
              { field: 'studentName', header: 'Name' },
              { field: 'studentId', header: 'Enrollment' },
              { field: 'allottedOn', header: 'Allotted On' },
              {
                field: 'status',
                header: 'Status',
                cell: r => <StatusBadge label={r.status} variant="success" />,
              },
            ]}
          />
        )}
      </FormCard>

      <FormCard title="Hostel Facilities" icon="checklist">
        {facilities.length === 0 ? (
          <EmptyState icon="checklist" title="No facilities listed yet" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {facilities.map(f => (
              <FacilityChip key={f!.id} icon={f!.icon} name={f!.name} />
            ))}
          </div>
        )}
      </FormCard>

      <SectionNote tone="info">
        Need a different room? Raise a request under Room Change Request and the
        warden will review it.
      </SectionNote>
    </FormPage>
  );
}
