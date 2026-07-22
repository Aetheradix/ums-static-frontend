import { useState } from 'react';
import {
  useHostelContext,
  useHostelRole,
  MOCK_WARDEN_HOSTEL_ID,
} from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function AttendanceRegister() {
  const { data, addRecord } = useHostelContext();
  const { isWarden, activePortal } = useHostelRole();

  const initialForm = {
    studentId: '',
    studentName: '',
    hostelId: MOCK_WARDEN_HOSTEL_ID,
    date: new Date().toISOString().split('T')[0],
    inTime: '18:00',
    outTime: '08:00',
    status: 'Present' as 'Present' | 'Absent' | 'Night-Out',
  };

  const [form, setForm] = useState(initialForm);

  const handleSubmit = () => {
    if (!form.studentId || !form.studentName) {
      alert('Please fill in required fields (Student ID, Student Name).');
      return;
    }

    addRecord('attendance', {
      id: `ATT${Date.now()}`,
      studentId: form.studentId,
      studentName: form.studentName,
      hostelId: MOCK_WARDEN_HOSTEL_ID,
      date: form.date,
      inTime: form.inTime,
      outTime: form.outTime,
      status: form.status,
    });

    setForm(initialForm);
  };

  // Filter data based on role — warden sees only their assigned hostel, admin sees all
  const filteredAttendance = isWarden
    ? data.attendance.filter(a => a.hostelId === MOCK_WARDEN_HOSTEL_ID)
    : data.attendance;

  const portalLabel =
    activePortal === 'warden' ? 'Warden Portal' : 'Admin Portal';
  const portalPath = `/hostel-services/${activePortal}`;

  return (
    <FormPage
      title="Attendance & In-Out Register"
      description={
        isWarden
          ? 'Mark and review daily in/out attendance for your assigned hostel.'
          : 'View daily attendance logs maintained by hostel wardens.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
        { label: portalLabel, to: portalPath },
        { label: 'Attendance' },
      ]}
    >
      {/* Attendance entry form is ONLY shown to Wardens to mark attendance */}
      {isWarden && (
        <FormCard title="Mark Daily Attendance" icon="event_available">
          <FormGrid columns={4}>
            <TextBox
              label="Student ID *"
              value={form.studentId}
              onChange={v => setForm({ ...form, studentId: v })}
            />
            <TextBox
              label="Student Name *"
              value={form.studentName}
              onChange={v => setForm({ ...form, studentName: v })}
            />
            <TextBox
              label="Date"
              type="date"
              value={form.date}
              onChange={v => setForm({ ...form, date: v })}
            />

            <DropDownList
              label="Status"
              data={[
                { id: 'Present', text: 'Present' },
                { id: 'Absent', text: 'Absent' },
                { id: 'Night-Out', text: 'Night-Out' },
              ]}
              textField="text"
              valueField="id"
              value={form.status}
              onChange={v => setForm({ ...form, status: v as any })}
            />

            <TextBox
              label="In-Time"
              type="time"
              value={form.inTime}
              onChange={v => setForm({ ...form, inTime: v })}
            />
            <TextBox
              label="Out-Time"
              type="time"
              value={form.outTime}
              onChange={v => setForm({ ...form, outTime: v })}
            />
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Mark Attendance"
              variant="primary"
              onClick={handleSubmit}
            />
            <Button
              label="Clear"
              variant="outlined"
              onClick={() => setForm(initialForm)}
            />
          </div>
        </FormCard>
      )}

      {/* Attendance Logs List — Admin views all hostel attendance logs; Warden views assigned hostel logs */}
      <FormCard
        title={
          isWarden ? 'My Hostel Attendance Logs' : 'All Hostels Attendance Logs'
        }
        icon="list"
      >
        <GridPanel
          data={filteredAttendance}
          columns={[
            { field: 'studentId', header: 'Student ID' },
            { field: 'studentName', header: 'Student Name' },
            {
              field: 'hostelId',
              header: 'Hostel',
              cell: (item: any) => (
                <>
                  {data.hostels.find(h => h.id === item.hostelId)?.name ||
                    item.hostelId}
                </>
              ),
            },
            { field: 'date', header: 'Date' },
            { field: 'inTime', header: 'In-Time' },
            { field: 'outTime', header: 'Out-Time' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.status === 'Present'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'Absent'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
