import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { SectionNote } from '../components/ui';
import {
  MOCK_STUDENT_ID,
  MOCK_WARDEN_HOSTEL_ID,
  MOCK_WARDEN_NAME,
  today,
  uid,
  useHms,
  useHmsRole,
} from '../context/HmsContext';
import type { Attendance as AttendanceRecord } from '../context/HmsContext';
import { hmsBreadcrumbs } from '../utils/breadcrumbs';

const STATUS_VARIANT = {
  Present: 'success',
  Absent: 'danger',
  'On Leave': 'info',
  'Night Out': 'warning',
} as const;

const STATUS_OPTIONS = [
  { id: 'Present', text: 'Present' },
  { id: 'Absent', text: 'Absent' },
  { id: 'On Leave', text: 'On Leave' },
  { id: 'Night Out', text: 'Night Out' },
];

export default function Attendance() {
  const { data, add } = useHms();
  const { isStudent, activePortal } = useHmsRole();

  const [form, setForm] = useState({
    studentId: '',
    date: today(),
    status: 'Present' as AttendanceRecord['status'],
    remarks: '',
  });

  const residents = useMemo(
    () =>
      data.allocations
        .filter(
          a => a.hostelId === MOCK_WARDEN_HOSTEL_ID && a.status === 'Active'
        )
        .map(a => ({
          id: a.studentId,
          text: `${a.studentName} (${a.studentId})`,
        })),
    [data.allocations]
  );

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
      marked: rows.length,
      present,
      absent: rows.filter(a => a.status === 'Absent').length,
      rate: rows.length ? Math.round((present / rows.length) * 100) : 0,
    };
  }, [rows]);

  const handleMark = () => {
    const name =
      residents.find(r => r.id === form.studentId)?.text.split(' (')[0] ??
      'Unnamed Student';
    add('attendance', {
      id: uid('ATT'),
      studentId: form.studentId,
      studentName: name,
      hostelId: MOCK_WARDEN_HOSTEL_ID,
      date: form.date,
      status: form.status,
      markedBy: MOCK_WARDEN_NAME,
      remarks: form.remarks,
    });
    setForm({ ...form, studentId: '', remarks: '' });
    ToastService.success('Attendance marked — the student can see it now.');
  };

  const markAllPresent = () => {
    const entries = residents.map(r => ({
      id: uid(`ATT${r.id}`),
      studentId: r.id,
      studentName: r.text.split(' (')[0],
      hostelId: MOCK_WARDEN_HOSTEL_ID,
      date: form.date,
      status: 'Present' as const,
      markedBy: MOCK_WARDEN_NAME,
      remarks: 'Marked in bulk roll call',
    }));
    entries.forEach(e => add('attendance', e));
    ToastService.success(
      `${entries.length} resident${entries.length === 1 ? '' : 's'} marked present for ${form.date}.`
    );
  };

  return (
    <FormPage
      title={isStudent ? 'My Attendance' : 'Daily Attendance'}
      description={
        isStudent
          ? 'Your daily hostel attendance as marked by the warden, with your present percentage.'
          : 'Mark daily attendance for your residents. Every entry appears on the student portal immediately.'
      }
      breadcrumbs={hmsBreadcrumbs(activePortal, 'Attendance')}
    >
      <FormGrid columns={4}>
        <StatCard
          title="Entries"
          value={stats.marked}
          icon="fact_check"
          colorScheme="blue"
        />
        <StatCard
          title="Present"
          value={stats.present}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard
          title="Absent"
          value={stats.absent}
          icon="cancel"
          colorScheme="red"
        />
        <StatCard
          title="Present %"
          value={`${stats.rate}%`}
          icon="bar_chart"
          colorScheme="teal"
        />
      </FormGrid>

      {isStudent && stats.rate < 75 && stats.marked > 0 && (
        <SectionNote tone="warning" title="Attendance below 75%">
          Hostel rules require 75% presence at night roll call. Speak to your
          warden if any of these entries look wrong.
        </SectionNote>
      )}

      {!isStudent && (
        <FormCard
          title="Mark Attendance"
          subtitle="Mark one resident, or take the whole roll call in one go."
          icon="calendar-plus"
        >
          <FormGrid columns={4}>
            <DropDownList
              label="Student"
              data={residents}
              textField="text"
              valueField="id"
              filter
              value={form.studentId}
              onChange={v =>
                setForm({ ...form, studentId: (v as string) ?? '' })
              }
            />
            <TextBox
              label="Date"
              type="date"
              value={form.date}
              onChange={v => setForm({ ...form, date: v })}
            />
            <DropDownList
              label="Status"
              data={STATUS_OPTIONS}
              textField="text"
              valueField="id"
              value={form.status}
              onChange={v =>
                setForm({
                  ...form,
                  status: (v as AttendanceRecord['status']) ?? 'Present',
                })
              }
            />
            <TextBox
              label="Remarks"
              placeholder="Optional note"
              value={form.remarks}
              onChange={v => setForm({ ...form, remarks: v })}
            />
          </FormGrid>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              label="Mark Attendance"
              icon="check"
              variant="primary"
              onClick={handleMark}
            />
            <Button
              label={`Mark All ${residents.length} Present`}
              icon="users"
              variant="outlined"
              onClick={markAllPresent}
            />
          </div>
        </FormCard>
      )}

      <FormCard
        title={isStudent ? 'My Attendance History' : 'Attendance Register'}
        icon="list"
      >
        <GridPanel<AttendanceRecord>
          data={rows}
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
                    width: 180,
                    cell: (item: AttendanceRecord) => (
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {item.studentName}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {item.studentId}
                        </span>
                      </div>
                    ),
                  },
                ]),
            { field: 'date', header: 'Date', width: 130 },
            {
              field: 'status',
              header: 'Status',
              width: 130,
              cell: item => (
                <StatusBadge
                  label={item.status}
                  variant={STATUS_VARIANT[item.status]}
                />
              ),
            },
            { field: 'markedBy', header: 'Marked By', width: 165 },
            {
              field: 'remarks',
              header: 'Remarks',
              width: 260,
              cell: item => <>{item.remarks || '—'}</>,
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
