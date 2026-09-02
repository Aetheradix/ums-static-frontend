import { useMemo, useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { EmptyState, OccupancyBar, SectionNote } from '../components/ui';
import {
  hostelOccupancy,
  ROOM_TYPES,
  roomOccupancy,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { RoomType } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

interface HostelRow {
  id: string;
  hostel: string;
  code: string;
  type: string;
  district: string;
  declaredCapacity: number;
  rooms: number;
  configuredBeds: number;
  allottedBeds: number;
  availableBeds: number;
  occupancyRate: number;
}

interface TypeRow {
  id: string;
  hostel: string;
  roomType: RoomType;
  rooms: number;
  beds: number;
  allotted: number;
  available: number;
}

export default function SeatMonitoring() {
  const { data } = useHms();
  const { activePortal } = useHmsRole();
  const [hostelFilter, setHostelFilter] = useState('All');

  const hostels = useMemo(
    () =>
      hostelFilter === 'All'
        ? data.hostels
        : data.hostels.filter(h => h.id === hostelFilter),
    [data.hostels, hostelFilter]
  );

  const hostelRows: HostelRow[] = useMemo(
    () =>
      hostels.map(h => {
        const o = hostelOccupancy(h, data.rooms, data.allocations);
        return {
          id: h.id,
          hostel: h.nameEn,
          code: h.code,
          type: h.type,
          district:
            data.districts.find(d => d.id === h.districtId)?.name ?? '—',
          declaredCapacity: h.capacity,
          rooms: o.totalRooms,
          configuredBeds: o.configuredBeds,
          allottedBeds: o.allottedBeds,
          availableBeds: o.availableBeds,
          occupancyRate: o.occupancyRate,
        };
      }),
    [hostels, data.rooms, data.allocations, data.districts]
  );

  const typeRows: TypeRow[] = useMemo(() => {
    const rows: TypeRow[] = [];
    hostels.forEach(h => {
      ROOM_TYPES.forEach(rt => {
        const rooms = data.rooms.filter(
          r => r.hostelId === h.id && r.roomType === rt
        );
        if (rooms.length === 0) return;
        const beds = rooms.reduce((s, r) => s + r.beds, 0);
        const allotted = rooms.reduce(
          (s, r) => s + roomOccupancy(r, data.allocations).allotted,
          0
        );
        rows.push({
          id: `${h.id}-${rt}`,
          hostel: h.nameEn,
          roomType: rt,
          rooms: rooms.length,
          beds,
          allotted,
          available: Math.max(beds - allotted, 0),
        });
      });
    });
    return rows;
  }, [hostels, data.rooms, data.allocations]);

  const totals = useMemo(
    () => ({
      beds: hostelRows.reduce((s, r) => s + r.configuredBeds, 0),
      allotted: hostelRows.reduce((s, r) => s + r.allottedBeds, 0),
      available: hostelRows.reduce((s, r) => s + r.availableBeds, 0),
      full: hostelRows.filter(
        r => r.availableBeds === 0 && r.configuredBeds > 0
      ).length,
    }),
    [hostelRows]
  );

  return (
    <FormPage
      title="Seat Monitoring"
      description="Hostel-wise seats remaining, with a room-type breakdown so you can see exactly where capacity is left."
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Seat Monitoring')}
    >
      <FormGrid columns={4}>
        <StatCard
          title="Beds Configured"
          value={totals.beds}
          icon="bed"
          colorScheme="blue"
        />
        <StatCard
          title="Beds Allotted"
          value={totals.allotted}
          icon="how_to_reg"
          colorScheme="green"
        />
        <StatCard
          title="Seats Remaining"
          value={totals.available}
          icon="event_seat"
          colorScheme="teal"
        />
        <StatCard
          title="Hostels Full"
          value={totals.full}
          icon="do_not_disturb_on"
          colorScheme="red"
          subtitle="No beds left"
        />
      </FormGrid>

      <FormCard
        title="Hostel-wise Seats"
        subtitle="Declared capacity against the beds wardens have actually configured."
        icon="chart-bar"
      >
        <FormGrid columns={4}>
          <DropDownList
            label="Filter by Hostel"
            data={[
              { id: 'All', text: 'All Hostels' },
              ...data.hostels.map(h => ({ id: h.id, text: h.nameEn })),
            ]}
            textField="text"
            valueField="id"
            value={hostelFilter}
            onChange={v => setHostelFilter((v as string) ?? 'All')}
          />
        </FormGrid>

        <GridPanel<HostelRow>
          data={hostelRows}
          pagination
          searchBox
          searchPlaceholder="Search by hostel or code..."
          searchFields={['hostel', 'code']}
          emptyMessage="No hostels match this filter."
          columns={[
            {
              field: 'hostel',
              header: 'Hostel',
              width: 230,
              cell: item => (
                <div className="flex flex-col">
                  <span className="font-semibold">{item.hostel}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {item.code} · {item.district}
                  </span>
                </div>
              ),
            },
            {
              field: 'type',
              header: 'Type',
              width: 95,
              cell: item => (
                <StatusBadge
                  label={item.type}
                  variant={item.type === 'Girls' ? 'info' : 'neutral'}
                />
              ),
            },
            { field: 'declaredCapacity', header: 'Sanctioned', width: 115 },
            { field: 'rooms', header: 'Rooms', width: 90 },
            { field: 'configuredBeds', header: 'Beds', width: 90 },
            { field: 'allottedBeds', header: 'Allotted', width: 100 },
            {
              field: 'availableBeds',
              header: 'Remaining',
              width: 125,
              cell: item => (
                <StatusBadge
                  label={`${item.availableBeds} free`}
                  variant={
                    item.configuredBeds === 0
                      ? 'muted'
                      : item.availableBeds === 0
                        ? 'danger'
                        : item.availableBeds <= 3
                          ? 'warning'
                          : 'success'
                  }
                />
              ),
            },
            {
              field: 'occupancyRate',
              header: 'Occupancy',
              width: 200,
              cell: item => (
                <OccupancyBar
                  allotted={item.allottedBeds}
                  total={item.configuredBeds}
                />
              ),
            },
          ]}
        />
      </FormCard>

      <FormCard
        title="Room-type Breakdown"
        subtitle="Where the free beds actually are, by room type within each hostel."
        icon="th-large"
      >
        {typeRows.length === 0 ? (
          <EmptyState
            icon="meeting_room"
            title="No rooms configured"
            hint="Wardens configure rooms from the Hostel Warden portal; the breakdown appears once they do."
          />
        ) : (
          <GridPanel<TypeRow>
            data={typeRows}
            pagination
            emptyMessage="No rooms configured."
            columns={[
              { field: 'hostel', header: 'Hostel', width: 230 },
              {
                field: 'roomType',
                header: 'Room Type',
                width: 150,
                cell: item => (
                  <span className="font-semibold">{item.roomType}</span>
                ),
              },
              { field: 'rooms', header: 'Rooms', width: 95 },
              { field: 'beds', header: 'Beds', width: 90 },
              { field: 'allotted', header: 'Allotted', width: 100 },
              {
                field: 'available',
                header: 'Available',
                width: 120,
                cell: item => (
                  <StatusBadge
                    label={String(item.available)}
                    variant={
                      item.available === 0
                        ? 'danger'
                        : item.available <= 2
                          ? 'warning'
                          : 'success'
                    }
                  />
                ),
              },
              {
                header: 'Fill',
                sortable: false,
                width: 190,
                cell: item => (
                  <OccupancyBar allotted={item.allotted} total={item.beds} />
                ),
              },
            ]}
          />
        )}
      </FormCard>

      <SectionNote tone="info" title="How these numbers are derived">
        Beds come from the rooms a warden has configured (single 1, double 2,
        triple 3, dormitory 8). Allotted beds come from active room allotments.
        The sanctioned figure is what the admin declared at registration, and
        the two can legitimately differ while a hostel is still being set up.
      </SectionNote>
    </FormPage>
  );
}
