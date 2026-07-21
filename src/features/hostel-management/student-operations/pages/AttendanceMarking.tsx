import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function AttendanceMarking() {
  const {
    hostels,
    roomAllotments,
    attendanceRecords,
    setAttendanceRecords,
    leaveRequests,
    triggerNotification,
  } = useHostel();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hostelId, setHostelId] = useState('');

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));

  // Find all students in this hostel
  const studentsInHostel = roomAllotments.filter(
    a => a.hostelId === hostelId && a.status === 'CHECKED_IN'
  );

  // Load existing record for today if it exists
  const existingRecord = attendanceRecords.find(
    r => r.hostelId === hostelId && r.date === date
  );

  // Initialize local state for attendance mapping
  const [attendanceMap, setAttendanceMap] = useState<
    Record<
      string,
      { status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE'; remarks: string }
    >
  >({});

  const handleFetch = () => {
    if (!hostelId || !date) return;

    if (existingRecord) {
      const map: any = {};
      existingRecord.records.forEach(
        r => (map[r.studentId] = { status: r.status, remarks: r.remarks || '' })
      );
      setAttendanceMap(map);
      triggerNotification('Loaded existing attendance record');
    } else {
      const map: any = {};
      studentsInHostel.forEach(student => {
        // Check if student is on approved leave today
        const onLeave = leaveRequests.some(
          l =>
            l.studentId === student.studentId &&
            l.status === 'APPROVED' &&
            l.fromDate <= date &&
            l.toDate >= date
        );
        map[student.studentId] = {
          status: onLeave ? 'ON_LEAVE' : 'PRESENT',
          remarks: '',
        };
      });
      setAttendanceMap(map);
      triggerNotification('Generated new attendance sheet');
    }
  };

  const handleSave = () => {
    if (!hostelId || !date) return;

    const records = studentsInHostel.map(s => ({
      studentId: s.studentId,
      studentName: s.studentName,
      roomId: s.roomId,
      status: attendanceMap[s.studentId]?.status || 'ABSENT',
      remarks: attendanceMap[s.studentId]?.remarks || '',
    }));

    if (existingRecord) {
      setAttendanceRecords(prev =>
        prev.map(r => (r.id === existingRecord.id ? { ...r, records } : r))
      );
    } else {
      const newRecord: HostelManagement.AttendanceRecord = {
        id: `ATT-${Date.now()}`,
        date,
        hostelId,
        markedBy: 'Warden',
        records,
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }

    triggerNotification('Attendance saved successfully!', 'success');
  };

  return (
    <FormPage
      title="Hostel Attendance"
      description="Mark daily attendance for students in the hostel"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Operations',
          to: '/hostel-management/student-operations/gate-pass',
        },
        { label: 'Attendance Marking' },
      ]}
    >
      <FormCard title="Select Details" icon="event">
        <FormGrid columns={3}>
          <TextBox label="Date *" type="date" value={date} onChange={setDate} />
          <OptionDropDown
            label="Select Hostel *"
            data={hostelOptions}
            value={hostelId}
            onChange={(v: any) => setHostelId(v)}
            textField="text"
            valueField="id"
          />
          <div className="flex items-end pb-1">
            <Button
              label="Fetch Roster"
              variant="primary"
              onClick={handleFetch}
            />
          </div>
        </FormGrid>
      </FormCard>

      {hostelId && Object.keys(attendanceMap).length > 0 && (
        <div className="mt-4">
          <FormCard
            title={`Attendance Sheet - ${hostels.find(h => h.id === hostelId)?.hostelName}`}
            icon="checklist"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-2">Student Name</th>
                    <th className="p-2">Room Number</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsInHostel.map(s => {
                    const status =
                      attendanceMap[s.studentId]?.status || 'PRESENT';
                    const isLeave = status === 'ON_LEAVE';
                    return (
                      <tr
                        key={s.studentId}
                        className="border-b border-slate-200 dark:border-slate-700"
                      >
                        <td className="p-2 font-medium">{s.studentName}</td>
                        <td className="p-2">Room {s.roomNumber}</td>
                        <td className="p-2">
                          <select
                            value={status}
                            disabled={isLeave}
                            onChange={e =>
                              setAttendanceMap({
                                ...attendanceMap,
                                [s.studentId]: {
                                  ...attendanceMap[s.studentId],
                                  status: e.target.value as any,
                                },
                              })
                            }
                            className={`border p-1 rounded ${isLeave ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-white dark:bg-slate-800'}`}
                          >
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="ON_LEAVE">On Leave</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={attendanceMap[s.studentId]?.remarks || ''}
                            onChange={e =>
                              setAttendanceMap({
                                ...attendanceMap,
                                [s.studentId]: {
                                  ...attendanceMap[s.studentId],
                                  remarks: e.target.value,
                                },
                              })
                            }
                            className="border p-1 w-full rounded bg-white dark:bg-slate-800"
                            placeholder="Optional remarks"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                label="Save Attendance"
                variant="primary"
                onClick={handleSave}
              />
            </div>
          </FormCard>
        </div>
      )}
    </FormPage>
  );
}
