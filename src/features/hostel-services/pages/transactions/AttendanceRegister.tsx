import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function AttendanceRegister() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    studentId: '',
    studentName: '',
    hostelId: '',
    date: '',
    inTime: '',
    outTime: '',
    status: 'Present',
  });

  return (
    <FormPage
      title="Attendance & In-Out Register"
      description="Track daily student attendance and hostel timings."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Transactions',
          to: '/hostel-services/transactions/attendance',
        },
        { label: 'Attendance' },
      ]}
    >
      <FormCard title="Manual Entry" icon="event_available">
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
          <DropDownList
            label="Hostel *"
            data={data.hostels.map(h => ({ id: h.id, text: h.name }))}
            textField="text"
            valueField="id"
            value={form.hostelId}
            onChange={v => setForm({ ...form, hostelId: v as string })}
          />
          <TextBox
            label="Date"
            type="date"
            value={form.date}
            onChange={v => setForm({ ...form, date: v })}
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
            onChange={v => setForm({ ...form, status: v as string })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button
            label="Mark Attendance"
            variant="primary"
            onClick={() => {}}
          />
          <Button label="Clear" variant="outlined" onClick={() => {}} />
        </div>
      </FormCard>

      <FormCard title="Attendance Logs" icon="list">
        <GridPanel
          data={data.attendance}
          columns={[
            { field: 'studentId', header: 'Student ID' },
            { field: 'studentName', header: 'Student Name' },
            {
              field: 'hostelId',
              header: 'Hostel',
              cell: (item: any) => (
                <>{data.hostels.find(h => h.id === item.hostelId)?.name}</>
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
