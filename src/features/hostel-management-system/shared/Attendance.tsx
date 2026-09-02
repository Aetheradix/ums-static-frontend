import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { TextBox } from 'shared/components/forms';
import {
  BulkSelectTable,
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import type { BulkAction } from 'shared/new-components';
import { EmptyState, SectionNote } from '../components/ui';
import {
  MOCK_STUDENT_ID,
  MOCK_WARDEN_HOSTEL_ID,
  MOCK_WARDEN_NAME,
  today,
  uid,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Attendance as Row } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const VARIANT = {
  Present: 'success',
  Absent: 'danger',
  'On Leave': 'info',
  'Night Out': 'warning',
} as const;

/** One resident on the roster the warden marks against. */
interface Resident {
  id: string;
  studentName: string;
  roomNumber: string;
  roomType: string;
}

export default function Attendance() {
  const { data, add, update } = useHms();
  const { isStudent, activePortal } = useHmsRole();

  const [markDate, setMarkDate] = useState(today());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  /** Every active resident of this hostel, with the room they hold. */
  const residents = useMemo<Resident[]>(
    () =>
      data.allocations
        .filter(
          a => a.hostelId === MOCK_WARDEN_HOSTEL_ID && a.status === 'Active'
        )
        .map(a => ({
          id: a.studentId,
          studentName: a.studentName,
          roomNumber:
            data.rooms.find(r => r.id === a.roomId)?.roomNumber ?? '—',
          roomType: a.roomType,
        }))
        .sort((x, y) => x.studentName.localeCompare(y.studentName)),
    [data.allocations, data.rooms]
  );

  const filteredResidents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return residents;
    return residents.filter(
      r =>
        r.studentName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.roomNumber.toLowerCase().includes(q)
    );
  }, [residents, search]);

  /** What each resident is already marked as on the chosen date. */
  const markedOn = useMemo(() => {
    const map = new Map<string, Row>();
    data.attendance
      .filter(a => a.hostelId === MOCK_WARDEN_HOSTEL_ID && a.date === markDate)
      .forEach(a => map.set(a.studentId, a));
    return map;
  }, [data.attendance, markDate]);

  const rows = useMemo(
    () =>
      isStudent
        ? data.attendance.filter(a => a.studentId === MOCK_STUDENT_ID)
        : data.attendance.filter(a => a.hostelId === MOCK_WARDEN_HOSTEL_ID),
    [data.attendance, isStudent]
  );

  const stats = useMemo(() => {
    const present = rows.filter(a => a.status === 'Present').length;
    return {
      present,
      absent: rows.filter(a => a.status === 'Absent').length,
      rate: rows.length ? `${Math.round((present / rows.length) * 100)}%` : '—',
      pendingToday: residents.filter(r => !markedOn.has(r.id)).length,
    };
  }, [rows, residents, markedOn]);

  const toggleOne = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(prev =>
      prev.size === filteredResidents.length
        ? new Set()
        : new Set(filteredResidents.map(r => r.id))
    );

  /**
   * Mark every checked resident at once. Re-marking someone already recorded
   * for the date updates that entry rather than adding a second one.
   */
  const markSelected = (status: Row['status']) => {
    if (selected.size === 0) {
      ToastService.success('Tick the students you want to mark first.');
      return;
    }

    selected.forEach(studentId => {
      const resident = residents.find(r => r.id === studentId);
      const existing = markedOn.get(studentId);

      if (existing) {
        update('attendance', existing.id, {
          ...existing,
          status,
          markedBy: MOCK_WARDEN_NAME,
        });
      } else {
        add('attendance', {
          id: uid('AT'),
          studentId,
          studentName: resident?.studentName ?? studentId,
          hostelId: MOCK_WARDEN_HOSTEL_ID,
          date: markDate,
          status,
          markedBy: MOCK_WARDEN_NAME,
          remarks: '',
        });
      }
    });

    ToastService.success(
      `${selected.size} student${selected.size === 1 ? '' : 's'} marked ${status.toLowerCase()} for ${markDate}.`
    );
    setSelected(new Set());
  };

  const bulkActions: BulkAction[] = [
    {
      label: 'Present',
      icon: 'check',
      variant: 'success',
      onClick: () => markSelected('Present'),
    },
    {
      label: 'Absent',
      icon: 'times',
      variant: 'danger',
      onClick: () => markSelected('Absent'),
    },
    {
      label: 'On Leave',
      icon: 'calendar',
      variant: 'outlined',
      onClick: () => markSelected('On Leave'),
    },
    {
      label: 'Night Out',
      icon: 'moon',
      variant: 'outlined',
      onClick: () => markSelected('Night Out'),
    },
  ];

  return (
    <FormPage
      title={isStudent ? 'My Attendance' : 'Daily Attendance'}
      description={
        isStudent
          ? 'Your daily hostel attendance as marked by the warden.'
          : 'Tick the residents on the roster and mark them all in one go. Marking again for the same date updates the entry.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Daily Attendance')}
    >
      <FormGrid columns={isStudent ? 3 : 4}>
        <StatCard
          title="Days Present"
          value={stats.present}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title="Days Absent"
          value={stats.absent}
          icon="cancel"
          colorScheme="red"
        />
        <StatCard
          title="Attendance Rate"
          value={stats.rate}
          icon="bar_chart"
          colorScheme="blue"
        />
        {!isStudent && (
          <StatCard
            title="Unmarked Today"
            value={stats.pendingToday}
            icon="hourglass_top"
            colorScheme="amber"
            subtitle={`Roster of ${residents.length}`}
          />
        )}
      </FormGrid>

      {!isStudent && (
        <FormCard
          title="Mark Attendance"
          subtitle="Pick the date, tick the students, then choose a status — the whole selection is marked at once."
          icon="calendar-plus"
        >
          <FormGrid columns={4}>
            <TextBox
              label="Attendance Date"
              type="date"
              value={markDate}
              onChange={v => {
                setMarkDate(v);
                setSelected(new Set());
              }}
            />
          </FormGrid>

          {residents.length === 0 ? (
            <EmptyState
              icon="groups"
              title="No residents yet"
              hint="Allot rooms to approved students and they appear on this roster."
            />
          ) : (
            <div className="mt-2">
              <BulkSelectTable<Resident>
                data={filteredResidents}
                selected={selected}
                onToggleOne={toggleOne}
                onToggleAll={toggleAll}
                onClearSelection={() => setSelected(new Set())}
                bulkActions={bulkActions}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search by name, enrollment or room..."
                selectionNoun="student"
                emptyMessage="No residents match that search."
                totalCount={residents.length}
                columns={[
                  {
                    header: 'Student',
                    cell: r => (
                      <div className="flex flex-col">
                        <span className="font-semibold">{r.studentName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {r.id}
                        </span>
                      </div>
                    ),
                  },
                  {
                    header: 'Room',
                    cell: r => (
                      <div className="flex flex-col">
                        <span>{r.roomNumber}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {r.roomType}
                        </span>
                      </div>
                    ),
                  },
                  {
                    header: `Marked on ${markDate}`,
                    cell: r => {
                      const entry = markedOn.get(r.id);
                      return entry ? (
                        <StatusBadge
                          label={entry.status}
                          variant={VARIANT[entry.status]}
                        />
                      ) : (
                        <StatusBadge label="Not marked" variant="muted" />
                      );
                    },
                  },
                ]}
              />
            </div>
          )}
        </FormCard>
      )}

      {isStudent && (
        <SectionNote tone="info">
          Attendance is marked by your warden. If something looks wrong, raise
          it under Grievances.
        </SectionNote>
      )}

      <FormCard
        title={isStudent ? 'My Attendance History' : 'Attendance Register'}
        icon="list"
      >
        <GridPanel<Row>
          data={rows}
          cellMemo={false}
          searchBox
          searchPlaceholder="Search by student..."
          searchFields={['studentName', 'studentId']}
          pagination
          emptyMessage="No attendance marked yet."
          columns={[
            ...(isStudent
              ? []
              : [
                  {
                    field: 'studentName' as const,
                    header: 'Student',
                    cell: (r: Row) => (
                      <div className="flex flex-col">
                        <span className="font-semibold">{r.studentName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {r.studentId}
                        </span>
                      </div>
                    ),
                  },
                ]),
            { field: 'date', header: 'Date', width: 130 },
            {
              field: 'status',
              header: 'Status',
              width: 140,
              cell: r => (
                <StatusBadge label={r.status} variant={VARIANT[r.status]} />
              ),
            },
            { field: 'markedBy', header: 'Marked By' },
            {
              field: 'remarks',
              header: 'Remarks',
              cell: r => <>{r.remarks || '—'}</>,
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
