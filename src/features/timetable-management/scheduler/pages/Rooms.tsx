import { useMemo } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { rooms, timetableEntries, type Room } from '../../mocks';
import { timetableUrls } from '../../urls';

interface RoomRow extends Room {
  allocatedSlots: number;
}

export default function Rooms() {
  const rows = useMemo<RoomRow[]>(
    () =>
      rooms.map(r => ({
        ...r,
        allocatedSlots: timetableEntries.filter(e => e.roomId === r.id).length,
      })),
    []
  );

  return (
    <FormPage
      title="Room Allocation"
      description="Rooms, their capacities and the number of allocated slots."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Scheduler', to: timetableUrls.scheduler.portal },
        { label: 'Room Allocation' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={rows}
          searchBox
          searchPlaceholder="Search by room name, code or type..."
          columns={[
            {
              header: 'S.No',
              width: '60px',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
            },
            { field: 'name', header: 'Room', sortable: true },
            { field: 'code', header: 'Code' },
            { field: 'type', header: 'Type' },
            { field: 'capacity', header: 'Capacity' },
            { field: 'allocatedSlots', header: 'Allocated Slots' },
            {
              header: 'Utilisation',
              cell: (r: RoomRow) => {
                const busy = r.allocatedSlots > 0;
                return (
                  <StatusBadge
                    label={busy ? 'In Use' : 'Free'}
                    variant={busy ? 'info' : 'muted'}
                  />
                );
              },
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
