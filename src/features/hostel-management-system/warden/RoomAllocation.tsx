import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import {
  EmptyState,
  KeyValueTile,
  OccupancyBar,
  SectionNote,
} from '../components/ui';
import {
  MOCK_WARDEN_HOSTEL_ID,
  MOCK_WARDEN_NAME,
  ROOM_TYPES,
  roomOccupancy,
  today,
  uid,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Allocation, Room, RoomType } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

export default function RoomAllocation() {
  const { data, add, update } = useHms();
  const { activePortal } = useHmsRole();

  const hostelId = MOCK_WARDEN_HOSTEL_ID;

  const rooms = useMemo(
    () => data.rooms.filter(r => r.hostelId === hostelId),
    [data.rooms, hostelId]
  );

  /** Occupancy for every room, recomputed whenever an allotment changes. */
  const occupancyByRoom = useMemo(
    () =>
      new Map(
        rooms.map(r => [r.id, roomOccupancy(r, data.allocations)] as const)
      ),
    [rooms, data.allocations]
  );

  const allottedStudentIds = useMemo(
    () =>
      new Set(
        data.allocations
          .filter(a => a.status === 'Active')
          .map(a => a.studentId)
      ),
    [data.allocations]
  );

  /** Approved applicants for this hostel who don't hold a room yet. */
  const awaitingAllotment = useMemo(
    () =>
      data.applications.filter(
        a =>
          a.status === 'Approved' &&
          a.preferredHostelId === hostelId &&
          a.erpLoginId &&
          !allottedStudentIds.has(a.erpLoginId)
      ),
    [data.applications, hostelId, allottedStudentIds]
  );

  const [form, setForm] = useState({
    applicationId: '',
    roomType: '' as RoomType | '',
    roomId: '',
  });

  const selectedApplication = data.applications.find(
    a => a.id === form.applicationId
  );

  /** Rooms of the chosen type, labelled with the beds still free. */
  const roomOptions = useMemo(() => {
    if (!form.roomType) return [];
    return rooms
      .filter(r => r.roomType === form.roomType && r.status === 'Available')
      .map(r => {
        const occ = occupancyByRoom.get(r.id);
        const available = occ?.available ?? r.beds;
        return {
          id: r.id,
          text: `${r.roomNumber} — ${available} of ${r.beds} bed${r.beds === 1 ? '' : 's'} available · ${r.floor}, ${r.wing}`,
          disabled: available === 0,
        };
      });
  }, [rooms, form.roomType, occupancyByRoom]);

  const selectedRoom = rooms.find(r => r.id === form.roomId);
  const selectedRoomOccupancy = selectedRoom
    ? occupancyByRoom.get(selectedRoom.id)
    : undefined;

  const stats = useMemo(() => {
    const configuredBeds = rooms.reduce((s, r) => s + r.beds, 0);
    const allotted = data.allocations.filter(
      a => a.hostelId === hostelId && a.status === 'Active'
    ).length;
    return {
      configuredBeds,
      allotted,
      available: Math.max(configuredBeds - allotted, 0),
      awaiting: awaitingAllotment.length,
    };
  }, [rooms, data.allocations, hostelId, awaitingAllotment]);

  const applicationOptions = awaitingAllotment.map(a => ({
    id: a.id,
    text: `${a.studentName} (${a.erpLoginId}) — prefers ${a.preferredRoomType || 'no preference'}`,
  }));

  const handleAllot = () => {
    if (!selectedApplication || !selectedRoom) {
      ToastService.success(
        'Pick a student and a room number to record the allotment.'
      );
      return;
    }

    const allocation: Allocation = {
      id: uid('AL'),
      applicationId: selectedApplication.id,
      studentId: selectedApplication.erpLoginId,
      studentName: selectedApplication.studentName,
      hostelId,
      roomId: selectedRoom.id,
      roomType: selectedRoom.roomType,
      allottedOn: today(),
      allottedBy: MOCK_WARDEN_NAME,
      status: 'Active',
    };

    add('allocations', allocation);
    setForm({ applicationId: '', roomType: '', roomId: '' });
    ToastService.success(
      `Room ${selectedRoom.roomNumber} allotted to ${selectedApplication.studentName}.`
    );
  };

  const handleVacate = (allocation: Allocation) => {
    update('allocations', allocation.id, {
      ...allocation,
      status: 'Vacated',
    });
    ToastService.success(`${allocation.studentName} vacated.`);
  };

  const roomLabel = (roomId: string) =>
    rooms.find(r => r.id === roomId)?.roomNumber ?? roomId;

  const activeAllocations = data.allocations.filter(
    a => a.hostelId === hostelId
  );

  return (
    <FormPage
      title="Room Allotment"
      description="Allot a room to an approved student. Pick the room type, then a room number — each option shows how many beds are still free."
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Room Allotment')}
    >
      <FormGrid columns={4}>
        <StatCard
          title="Beds Configured"
          value={stats.configuredBeds}
          icon="bed"
          colorScheme="blue"
        />
        <StatCard
          title="Beds Allotted"
          value={stats.allotted}
          icon="how_to_reg"
          colorScheme="green"
        />
        <StatCard
          title="Beds Available"
          value={stats.available}
          icon="event_seat"
          colorScheme="teal"
        />
        <StatCard
          title="Awaiting Allotment"
          value={stats.awaiting}
          icon="hourglass_top"
          colorScheme="amber"
          subtitle="Approved, no room yet"
        />
      </FormGrid>

      <FormCard
        title="Allot a Room"
        subtitle="The student's preference from their application is shown — you can allot a different room type."
        icon="bed"
      >
        {awaitingAllotment.length === 0 ? (
          <EmptyState
            icon="task_alt"
            title="Every approved student has a room"
            hint="New allotments appear here once you approve an admission request."
          />
        ) : (
          <>
            <FormGrid columns={3}>
              <DropDownList
                label="Student"
                data={applicationOptions}
                textField="text"
                valueField="id"
                filter
                value={form.applicationId}
                onChange={v => {
                  const id = (v as string) ?? '';
                  const app = data.applications.find(a => a.id === id);
                  setForm({
                    applicationId: id,
                    // Start from what the student asked for; the warden can change it.
                    roomType: (app?.preferredRoomType as RoomType) || '',
                    roomId: '',
                  });
                }}
              />
              <DropDownList
                label="Room Type"
                data={ROOM_TYPES.map(t => ({ id: t, text: t }))}
                textField="text"
                valueField="id"
                value={form.roomType}
                onChange={v =>
                  setForm(f => ({
                    ...f,
                    roomType: ((v as RoomType) ?? '') as RoomType,
                    roomId: '',
                  }))
                }
              />
              <DropDownList
                label="Room Number"
                data={roomOptions}
                textField="text"
                valueField="id"
                filter
                value={form.roomId}
                onChange={v =>
                  setForm(f => ({ ...f, roomId: (v as string) ?? '' }))
                }
              />
            </FormGrid>

            {selectedApplication && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <KeyValueTile
                  label="Student"
                  value={selectedApplication.studentName}
                />
                <KeyValueTile
                  label="ERP Login"
                  value={selectedApplication.erpLoginId}
                  mono
                />
                <KeyValueTile
                  label="Programme"
                  value={`${selectedApplication.programme} · ${selectedApplication.branch}`}
                />
                <KeyValueTile
                  label="Preferred Room Type"
                  value={selectedApplication.preferredRoomType}
                  tone={
                    form.roomType &&
                    form.roomType !== selectedApplication.preferredRoomType
                      ? 'warning'
                      : 'neutral'
                  }
                />
              </div>
            )}

            {selectedRoom && selectedRoomOccupancy && (
              <div className="mt-4 rounded-xl border border-slate-200 px-5 py-4 dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      Room {selectedRoom.roomNumber} · {selectedRoom.roomType}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedRoom.floor} · {selectedRoom.wing}
                    </p>
                  </div>
                  <OccupancyBar
                    allotted={selectedRoomOccupancy.allotted}
                    total={selectedRoom.beds}
                  />
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {selectedRoomOccupancy.available === 0
                    ? 'This room is full — pick another room number.'
                    : `After this allotment ${selectedRoomOccupancy.available - 1} bed${selectedRoomOccupancy.available - 1 === 1 ? '' : 's'} will remain free in this room.`}
                </p>
              </div>
            )}

            {form.roomType &&
              selectedApplication &&
              form.roomType !== selectedApplication.preferredRoomType && (
                <div className="mt-4">
                  <SectionNote tone="warning" title="Different from preference">
                    {selectedApplication.studentName} asked for a{' '}
                    {selectedApplication.preferredRoomType || 'unspecified'}{' '}
                    room. Allotting a {form.roomType} instead is fine — the
                    student sees the room you allot on their portal.
                  </SectionNote>
                </div>
              )}

            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                label="Allot Room"
                variant="primary"
                icon="check"
                onClick={handleAllot}
              />
              <Button
                label="Clear"
                variant="outlined"
                onClick={() =>
                  setForm({ applicationId: '', roomType: '', roomId: '' })
                }
              />
            </div>
          </>
        )}
      </FormCard>

      <FormCard
        title="Room Occupancy"
        subtitle="Every room in your hostel and how many beds are still free."
        icon="th-large"
      >
        <GridPanel<Room>
          data={rooms}
          // Occupancy and residents come from allocations rather than the room
          // row, so a memoized cell would keep showing the pre-allotment count.
          cellMemo={false}
          searchBox
          searchPlaceholder="Search by room number, floor or wing..."
          searchFields={['roomNumber', 'floor', 'wing']}
          pagination
          emptyMessage="No rooms configured yet — set them up under Room Configuration."
          columns={[
            { field: 'roomNumber', header: 'Room No.', width: 110 },
            { field: 'roomType', header: 'Room Type', width: 140 },
            { field: 'floor', header: 'Floor', width: 130 },
            { field: 'wing', header: 'Wing / Block', width: 130 },
            {
              field: 'beds',
              header: 'Occupancy',
              width: 200,
              cell: room => (
                <OccupancyBar
                  allotted={occupancyByRoom.get(room.id)?.allotted ?? 0}
                  total={room.beds}
                />
              ),
            },
            {
              header: 'Residents',
              sortable: false,
              cell: room => {
                const names = data.allocations
                  .filter(a => a.roomId === room.id && a.status === 'Active')
                  .map(a => a.studentName);
                return (
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {names.length ? names.join(', ') : '—'}
                  </span>
                );
              },
            },
            {
              field: 'status',
              header: 'Status',
              width: 130,
              cell: room => {
                const available = occupancyByRoom.get(room.id)?.available ?? 0;
                if (room.status === 'Under Maintenance') {
                  return <StatusBadge label="Maintenance" variant="warning" />;
                }
                return available === 0 ? (
                  <StatusBadge label="Full" variant="danger" />
                ) : (
                  <StatusBadge label={`${available} free`} variant="success" />
                );
              },
            },
          ]}
        />
      </FormCard>

      <FormCard
        title="Allotment Register"
        subtitle="Who holds which room, and who has vacated."
        icon="list"
      >
        <GridPanel<Allocation>
          data={activeAllocations}
          searchBox
          searchPlaceholder="Search by student or room..."
          searchFields={['studentName', 'studentId']}
          pagination
          emptyMessage="No rooms allotted yet."
          columns={[
            {
              field: 'studentName',
              header: 'Student',
              cell: a => (
                <div className="flex flex-col">
                  <span className="font-semibold">{a.studentName}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {a.studentId}
                  </span>
                </div>
              ),
            },
            {
              field: 'roomId',
              header: 'Room',
              cell: a => <>{roomLabel(a.roomId)}</>,
            },
            { field: 'roomType', header: 'Room Type' },
            { field: 'allottedOn', header: 'Allotted On' },
            { field: 'allottedBy', header: 'Allotted By' },
            {
              field: 'status',
              header: 'Status',
              cell: a => (
                <StatusBadge
                  label={a.status}
                  variant={a.status === 'Active' ? 'success' : 'muted'}
                />
              ),
            },
            {
              header: 'Action',
              sortable: false,
              cell: a =>
                a.status === 'Active' ? (
                  <Button
                    label="Vacate"
                    icon="logout"
                    variant="outlined"
                    size="small"
                    onClick={() => handleVacate(a)}
                  />
                ) : (
                  <span className="text-xs text-slate-400">Closed</span>
                ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
