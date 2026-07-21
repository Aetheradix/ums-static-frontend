import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function RoomAllocation() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    hostelId: '',
    buildingId: '',
    roomId: '',
    studentId: '',
    studentName: '',
    validFrom: '',
    validTill: '',
    status: 'Active',
  });

  return (
    <FormPage
      title="Room & Bed Allocation"
      description="Allocate rooms and beds to students."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Transactions',
          to: '/hostel-services/transactions/allocation',
        },
        { label: 'Room Allocation' },
      ]}
    >
      <FormCard title="New Allocation" icon="how_to_reg">
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
          <DropDownList
            label="Room *"
            data={data.rooms
              .filter(r => r.hostelId === form.hostelId)
              .map(r => ({ id: r.id, text: r.roomNumber }))}
            textField="text"
            valueField="id"
            value={form.roomId}
            onChange={v => setForm({ ...form, roomId: v as string })}
          />

          <TextBox
            label="Valid From"
            type="date"
            value={form.validFrom}
            onChange={v => setForm({ ...form, validFrom: v })}
          />
          <TextBox
            label="Valid Till"
            type="date"
            value={form.validTill}
            onChange={v => setForm({ ...form, validTill: v })}
          />
          <DropDownList
            label="Status"
            data={[
              { id: 'Active', text: 'Active' },
              { id: 'Terminated', text: 'Terminated' },
            ]}
            textField="text"
            valueField="id"
            value={form.status}
            onChange={v => setForm({ ...form, status: v as string })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button label="Allocate Room" variant="primary" onClick={() => {}} />
          <Button label="Clear" variant="outlined" onClick={() => {}} />
        </div>
      </FormCard>

      <FormCard title="Allocations List" icon="list">
        <GridPanel
          data={data.allocations}
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
            {
              field: 'roomId',
              header: 'Room No',
              cell: (item: any) => (
                <>{data.rooms.find(r => r.id === item.roomId)?.roomNumber}</>
              ),
            },
            { field: 'validFrom', header: 'From Date' },
            { field: 'validTill', header: 'Till Date' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Action',
              sortable: false,
              cell: () => (
                <div className="flex gap-2">
                  <Button
                    label="Extend"
                    variant="outlined"
                    size="small"
                    icon="edit"
                    onClick={() => {}}
                  />
                  <Button
                    label="Terminate"
                    variant="danger"
                    size="small"
                    icon="cancel"
                    onClick={() => {}}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
