import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, NumberBox, TextBox } from 'shared/components/forms';
import {
  ConfirmDialog,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { EmptyState, OccupancyBar, SectionNote } from '../components/ui';
import {
  MOCK_WARDEN_HOSTEL_ID,
  ROOM_TYPE_BEDS,
  ROOM_TYPES,
  roomOccupancy,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Room, RoomType } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const FLOORS = [
  'Ground Floor',
  'First Floor',
  'Second Floor',
  'Third Floor',
  'Fourth Floor',
].map(f => ({ id: f, text: f }));

/** A room number being captured, before it is saved into the hostel. */
interface DraftRoom {
  key: string;
  roomType: RoomType;
  roomNumber: string;
  floor: string;
  wing: string;
}

const ROOM_TYPE_TONE: Record<
  RoomType,
  'info' | 'success' | 'warning' | 'neutral'
> = {
  'Single Seater': 'info',
  'Double Seater': 'success',
  'Triple Seater': 'warning',
  Dormitory: 'neutral',
};

export default function RoomConfiguration() {
  const { data, addMany, update, remove } = useHms();
  const { activePortal } = useHmsRole();

  const hostelId = MOCK_WARDEN_HOSTEL_ID;
  const hostel = data.hostels.find(h => h.id === hostelId);
  const rooms = useMemo(
    () => data.rooms.filter(r => r.hostelId === hostelId),
    [data.rooms, hostelId]
  );

  /**
   * Step 1 captures one room type at a time — the warden picks a type, fills
   * that type's room numbers, saves, then moves to the next. Opening every
   * type at once produced a page-long grid.
   */
  const [activeType, setActiveType] = useState<RoomType>('Single Seater');
  const [count, setCount] = useState(0);

  /**
   * Single/double/triple rooms have a fixed bed count, but a dormitory's size
   * varies from hostel to hostel — so the warden declares it here and every
   * dormitory captured in this batch is saved with that many beds.
   */
  const [dormBeds, setDormBeds] = useState(ROOM_TYPE_BEDS.Dormitory);
  const isDormitory = activeType === 'Dormitory';
  const bedsPerRoom = isDormitory ? dormBeds : ROOM_TYPE_BEDS[activeType];

  // ── Step 2: the room numbers being captured for `activeType` ─────────────
  const [drafts, setDrafts] = useState<DraftRoom[]>([]);

  // Auto-fill helper — always scoped to the type being captured.
  const [autoFill, setAutoFill] = useState({
    prefix: 'A-',
    startNumber: 101,
    floor: 'Ground Floor',
    wing: 'A Wing',
  });

  const [editing, setEditing] = useState<Room | null>(null);
  const [editForm, setEditForm] = useState({
    roomNumber: '',
    floor: '',
    wing: '',
    status: 'Available' as Room['status'],
  });
  const [pendingDelete, setPendingDelete] = useState<Room | null>(null);

  const declaredRooms = count;
  const declaredBeds = count * bedsPerRoom;

  /** Rooms already saved per type, so the warden can see what is left to do. */
  const savedByType = ROOM_TYPES.reduce<Record<RoomType, number>>(
    (acc, t) => {
      acc[t] = rooms.filter(r => r.roomType === t).length;
      return acc;
    },
    {
      'Single Seater': 0,
      'Double Seater': 0,
      'Triple Seater': 0,
      Dormitory: 0,
    }
  );

  const configuredBeds = rooms.reduce((s, r) => s + r.beds, 0);
  const allottedBeds = rooms.reduce(
    (s, r) => s + roomOccupancy(r, data.allocations).allotted,
    0
  );

  const generateDrafts = () => {
    if (count <= 0) {
      ToastService.success(
        `Set how many ${activeType} rooms this hostel has, then generate the entries.`
      );
      return;
    }

    const next: DraftRoom[] = Array.from({ length: count }, (_, i) => ({
      key: `${activeType}-${i}-${Date.now()}`,
      roomType: activeType,
      roomNumber: '',
      floor: '',
      wing: '',
    }));

    setDrafts(next);
    ToastService.success(
      `${next.length} ${activeType} ${next.length === 1 ? 'entry' : 'entries'} ready — fill in the room numbers.`
    );
  };

  const setDraft = (key: string, patch: Partial<DraftRoom>) =>
    setDrafts(prev => prev.map(d => (d.key === key ? { ...d, ...patch } : d)));

  const applyAutoFill = () => {
    let seq = autoFill.startNumber;
    setDrafts(prev =>
      prev.map(d => {
        const filled = {
          ...d,
          roomNumber: `${autoFill.prefix}${seq}`,
          floor: autoFill.floor,
          wing: autoFill.wing,
        };
        seq += 1;
        return filled;
      })
    );
    ToastService.success(`Room numbers filled for all ${activeType} entries.`);
  };

  const saveDrafts = () => {
    const existingNumbers = new Set(rooms.map(r => r.roomNumber.toLowerCase()));
    const toSave: Room[] = [];
    let skipped = 0;

    drafts.forEach((d, index) => {
      const number =
        d.roomNumber.trim() ||
        `${d.roomType.charAt(0)}-${String(rooms.length + index + 1).padStart(3, '0')}`;
      if (existingNumbers.has(number.toLowerCase())) {
        skipped += 1;
        return;
      }
      existingNumbers.add(number.toLowerCase());
      toSave.push({
        id: `R-${hostelId}-${number}-${index}`,
        hostelId,
        roomNumber: number,
        roomType: d.roomType,
        floor: d.floor || 'Ground Floor',
        wing: d.wing || 'Main Block',
        beds:
          d.roomType === 'Dormitory' ? dormBeds : ROOM_TYPE_BEDS[d.roomType],
        status: 'Available',
      });
    });

    if (toSave.length > 0) addMany('rooms', toSave);
    setDrafts([]);
    setCount(0);
    ToastService.success(
      `${toSave.length} room${toSave.length === 1 ? '' : 's'} added to ${hostel?.nameEn ?? 'the hostel'}` +
        (skipped ? ` · ${skipped} skipped as duplicate room numbers` : '')
    );
  };

  const handleUpdateRoom = () => {
    if (!editing) return;
    update('rooms', editing.id, {
      ...editing,
      roomNumber: editForm.roomNumber || editing.roomNumber,
      floor: editForm.floor,
      wing: editForm.wing,
      status: editForm.status,
    });
    setEditing(null);
    ToastService.success('Room updated.');
  };

  const typeSummary = ROOM_TYPES.map(type => {
    const typeRooms = rooms.filter(r => r.roomType === type);
    const beds = typeRooms.reduce((s, r) => s + r.beds, 0);
    const allotted = typeRooms.reduce(
      (s, r) => s + roomOccupancy(r, data.allocations).allotted,
      0
    );
    // Dormitories can differ room to room, so report the real average rather
    // than the constant.
    const bedsPerRoom = typeRooms.length
      ? Math.round(beds / typeRooms.length)
      : ROOM_TYPE_BEDS[type];
    return { type, rooms: typeRooms.length, beds, allotted, bedsPerRoom };
  });

  return (
    <FormPage
      title="Room Configuration"
      description={`Set up the rooms in ${hostel?.nameEn ?? 'your hostel'} — declare how many rooms of each type there are, then record every room number with its floor and wing.`}
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Room Configuration')}
    >
      <FormGrid columns={4}>
        <StatCard
          title="Rooms Configured"
          value={rooms.length}
          icon="meeting_room"
          colorScheme="blue"
        />
        <StatCard
          title="Beds Configured"
          value={configuredBeds}
          icon="bed"
          colorScheme="indigo"
        />
        <StatCard
          title="Beds Allotted"
          value={allottedBeds}
          icon="how_to_reg"
          colorScheme="green"
        />
        <StatCard
          title="Beds Free"
          value={Math.max(configuredBeds - allottedBeds, 0)}
          icon="event_seat"
          colorScheme="teal"
        />
      </FormGrid>

      {/* ── Step 1 ── */}
      <FormCard
        title="Step 1 · Pick a Room Type"
        subtitle="Configure one room type at a time — set the count, capture those room numbers, save, then move to the next type."
        icon="calculator"
      >
        {/* Type selector doubling as a progress strip */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {ROOM_TYPES.map(type => {
            const isActive = type === activeType;
            const saved = savedByType[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setActiveType(type);
                  setCount(0);
                  setDrafts([]);
                }}
                className={`flex flex-col gap-1 rounded-xl border px-4 py-3 text-left transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-950/40'
                    : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={`text-sm font-bold ${
                      isActive
                        ? 'text-blue-700 dark:text-blue-200'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {type}
                  </span>
                  {saved > 0 && (
                    <span className="material-symbols-outlined text-[18px] text-green-600 dark:text-green-400">
                      check_circle
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {type === 'Dormitory'
                    ? 'beds per room vary'
                    : `${ROOM_TYPE_BEDS[type]} ${
                        ROOM_TYPE_BEDS[type] === 1 ? 'bed' : 'beds'
                      } per room`}{' '}
                  · {saved} configured
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <FormGrid columns={4}>
            <NumberBox
              label={`How many ${activeType} rooms?`}
              min={0}
              max={200}
              value={count}
              onChange={v => setCount(v ?? 0)}
            />
            {isDormitory && (
              <NumberBox
                label="Beds in each dormitory room"
                subLabel="Varies by hostel"
                min={1}
                max={50}
                value={dormBeds}
                onChange={v => setDormBeds(v && v > 0 ? v : 1)}
              />
            )}
          </FormGrid>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Rooms to capture
              </p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {declaredRooms}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Beds these add
              </p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {declaredBeds}
              </p>
            </div>
          </div>
          <Button
            label={`Generate ${activeType} Entries`}
            icon="arrow-right"
            variant="primary"
            onClick={generateDrafts}
          />
        </div>
      </FormCard>

      {/* ── Step 2 ── */}
      {drafts.length > 0 && (
        <FormCard
          title={`Step 2 · ${activeType} Room Numbers (${drafts.length})`}
          subtitle="Give every room its number, floor and wing. Anything left blank is auto-numbered on save."
          icon="pencil"
          headerAction={
            <div className="flex gap-2">
              <Button
                label="Discard"
                icon="times"
                variant="outlined"
                size="small"
                onClick={() => setDrafts([])}
              />
              <Button
                label={`Save ${drafts.length} Rooms`}
                icon="check"
                variant="primary"
                size="small"
                onClick={saveDrafts}
              />
            </div>
          }
        >
          <SectionNote
            tone="info"
            title={`Fill all ${drafts.length} entries at once`}
          >
            Set a number prefix and a starting number — every {activeType} entry
            below gets numbered in sequence with the same floor and wing. You
            can still edit any row afterwards.
          </SectionNote>

          <FormGrid columns={3}>
            <TextBox
              label="Number Prefix"
              placeholder="e.g. A-"
              value={autoFill.prefix}
              onChange={v => setAutoFill({ ...autoFill, prefix: v })}
            />
            <NumberBox
              label="Start From"
              min={0}
              value={autoFill.startNumber}
              onChange={v => setAutoFill({ ...autoFill, startNumber: v ?? 0 })}
            />
            <DropDownList
              label="Floor"
              data={FLOORS}
              textField="text"
              valueField="id"
              value={autoFill.floor}
              onChange={v =>
                setAutoFill({ ...autoFill, floor: (v as string) ?? '' })
              }
            />
            <TextBox
              label="Wing / Block"
              placeholder="e.g. A Wing"
              value={autoFill.wing}
              onChange={v => setAutoFill({ ...autoFill, wing: v })}
            />
          </FormGrid>
          <div className="mb-6">
            <Button
              label="Apply to this Room Type"
              icon="bolt"
              variant="outlined"
              onClick={applyAutoFill}
            />
          </div>

          <div className="flex flex-col gap-3">
            {ROOM_TYPES.filter(type =>
              drafts.some(d => d.roomType === type)
            ).map(type => (
              <div
                key={type}
                className="rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <StatusBadge label={type} variant={ROOM_TYPE_TONE[type]} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {drafts.filter(d => d.roomType === type).length} rooms ·{' '}
                      {type === 'Dormitory' ? dormBeds : ROOM_TYPE_BEDS[type]}{' '}
                      beds each
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  {drafts
                    .filter(d => d.roomType === type)
                    .map((d, index) => (
                      <div
                        key={d.key}
                        className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[40px_1fr_1fr_1fr]"
                      >
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                          {index + 1}.
                        </span>
                        <TextBox
                          placeholder="Room number, e.g. A-101"
                          value={d.roomNumber}
                          onChange={v => setDraft(d.key, { roomNumber: v })}
                        />
                        <DropDownList
                          data={FLOORS}
                          textField="text"
                          valueField="id"
                          placeholder="Floor"
                          value={d.floor}
                          onChange={v =>
                            setDraft(d.key, { floor: (v as string) ?? '' })
                          }
                        />
                        <TextBox
                          placeholder="Wing / Block"
                          value={d.wing}
                          onChange={v => setDraft(d.key, { wing: v })}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button
              label="Discard"
              variant="outlined"
              onClick={() => setDrafts([])}
            />
            <Button
              label={`Save ${drafts.length} Rooms`}
              icon="check"
              variant="primary"
              onClick={saveDrafts}
            />
          </div>
        </FormCard>
      )}

      {/* ── Summary ── */}
      <FormCard
        title="Room Type Summary"
        subtitle="What this hostel currently offers, by room type."
        icon="th-large"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {typeSummary.map(s => (
            <div
              key={s.type}
              className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {s.type}
                </p>
                <StatusBadge
                  label={`${s.rooms} rooms`}
                  variant={s.rooms ? 'info' : 'muted'}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {s.bedsPerRoom} beds per room
              </p>
              <div className="mt-3">
                <OccupancyBar allotted={s.allotted} total={s.beds} />
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      {/* ── Configured rooms ── */}
      <FormCard
        title="Configured Rooms"
        subtitle="Every room in this hostel, with its floor, wing and current occupancy."
        icon="list"
      >
        {rooms.length === 0 ? (
          <EmptyState
            icon="meeting_room"
            title="No rooms configured yet"
            hint="Declare your room counts above and generate the entries to record each room number."
          />
        ) : (
          <GridPanel<Room>
            data={rooms}
            // The occupancy column reads allocations, not the room row, so a
            // memoized cell would go stale the moment a room is allotted.
            cellMemo={false}
            searchBox
            searchPlaceholder="Search by room number, floor or wing..."
            searchFields={['roomNumber', 'floor', 'wing']}
            pagination
            columns={[
              {
                field: 'roomNumber',
                header: 'Room No.',
                width: 130,
                cell: item => (
                  <span className="font-mono font-semibold">
                    {item.roomNumber}
                  </span>
                ),
              },
              {
                field: 'roomType',
                header: 'Room Type',
                width: 155,
                cell: item => (
                  <StatusBadge
                    label={item.roomType}
                    variant={ROOM_TYPE_TONE[item.roomType]}
                  />
                ),
              },
              { field: 'floor', header: 'Floor', width: 140 },
              { field: 'wing', header: 'Wing / Block', width: 150 },
              { field: 'beds', header: 'Beds', width: 85 },
              {
                header: 'Occupancy',
                sortable: false,
                width: 190,
                cell: item => {
                  const o = roomOccupancy(item, data.allocations);
                  return (
                    <OccupancyBar allotted={o.allotted} total={item.beds} />
                  );
                },
              },
              {
                header: 'Availability',
                sortable: false,
                width: 140,
                cell: item => {
                  const o = roomOccupancy(item, data.allocations);
                  return (
                    <StatusBadge
                      label={
                        item.status === 'Under Maintenance'
                          ? 'Maintenance'
                          : o.available === 0
                            ? 'Full'
                            : `${o.available} free`
                      }
                      variant={
                        item.status === 'Under Maintenance'
                          ? 'muted'
                          : o.available === 0
                            ? 'danger'
                            : 'success'
                      }
                    />
                  );
                },
              },
            ]}
            onEdit={room => {
              setEditing(room);
              setEditForm({
                roomNumber: room.roomNumber,
                floor: room.floor,
                wing: room.wing,
                status: room.status,
              });
            }}
            onRemove={room => setPendingDelete(room)}
          />
        )}
      </FormCard>

      <FormPopup
        visible={Boolean(editing)}
        onHide={() => setEditing(null)}
        title="Edit Room"
        subtitle={editing ? `${editing.roomNumber} · ${editing.roomType}` : ''}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setEditing(null)}
            />
            <Button
              label="Update"
              variant="primary"
              onClick={handleUpdateRoom}
            />
          </div>
        }
      >
        <FormGrid columns={2}>
          <TextBox
            label="Room Number"
            value={editForm.roomNumber}
            onChange={v => setEditForm({ ...editForm, roomNumber: v })}
          />
          <DropDownList
            label="Floor"
            data={FLOORS}
            textField="text"
            valueField="id"
            value={editForm.floor}
            onChange={v =>
              setEditForm({ ...editForm, floor: (v as string) ?? '' })
            }
          />
          <TextBox
            label="Wing / Block"
            value={editForm.wing}
            onChange={v => setEditForm({ ...editForm, wing: v })}
          />
          <DropDownList
            label="Status"
            data={[
              { id: 'Available', text: 'Available' },
              { id: 'Under Maintenance', text: 'Under Maintenance' },
            ]}
            textField="text"
            valueField="id"
            value={editForm.status}
            onChange={v =>
              setEditForm({
                ...editForm,
                status: (v as Room['status']) ?? 'Available',
              })
            }
          />
        </FormGrid>
      </FormPopup>

      <ConfirmDialog
        visible={Boolean(pendingDelete)}
        onHide={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) remove('rooms', pendingDelete.id);
          setPendingDelete(null);
          ToastService.success('Room removed.');
        }}
        title="Remove Room"
        message={`Remove room ${pendingDelete?.roomNumber ?? ''} from this hostel? Any allotment against it stays on record.`}
        confirmLabel="Remove"
        variant="danger"
      />
    </FormPage>
  );
}
