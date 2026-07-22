import { useState } from 'react';
import {
  useHostelContext,
  useHostelRole,
  MOCK_STUDENT_ID,
  MOCK_WARDEN_HOSTEL_ID,
} from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function RoomAllocation() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const { isStudent, isWarden, isAdmin, activePortal } = useHostelRole();

  const initialForm = {
    hostelId: '',
    buildingId: 'B1',
    roomId: '',
    studentId: '',
    studentName: '',
    validFrom: new Date().toISOString().split('T')[0],
    validTill: '2027-05-31',
    status: 'Active' as const,
  };

  const [form, setForm] = useState(initialForm);

  const handleSubmit = () => {
    if (
      !form.studentId ||
      !form.studentName ||
      !form.hostelId ||
      !form.roomId
    ) {
      alert(
        'Please fill in all required fields (Student ID, Name, Hostel, and Room).'
      );
      return;
    }

    addRecord('allocations', {
      id: `AL${Date.now()}`,
      studentId: form.studentId,
      studentName: form.studentName,
      hostelId: form.hostelId,
      buildingId: form.buildingId,
      roomId: form.roomId,
      validFrom: form.validFrom,
      validTill: form.validTill,
      status: form.status,
    });

    setForm(initialForm);
  };

  // Filter data based on role
  const filteredAllocations = isStudent
    ? data.allocations.filter(a => a.studentId === MOCK_STUDENT_ID)
    : isWarden
      ? data.allocations.filter(a => a.hostelId === MOCK_WARDEN_HOSTEL_ID)
      : data.allocations;

  const portalLabel =
    activePortal === 'student'
      ? 'Student Portal'
      : activePortal === 'warden'
        ? 'Warden Portal'
        : 'Admin Portal';
  const portalPath = `/hostel-services/${activePortal}`;

  return (
    <FormPage
      title={isStudent ? 'My Room Allocation' : 'Room & Bed Allocation'}
      description={
        isStudent
          ? 'View your allocated room and bed details.'
          : 'Allocate rooms and beds to students.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
        { label: portalLabel, to: portalPath },
        { label: isStudent ? 'My Room' : 'Room Allocation' },
      ]}
    >
      {/* Only Admin can create new allocations */}
      {isAdmin && (
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
                .filter(r => !form.hostelId || r.hostelId === form.hostelId)
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
              onChange={v => setForm({ ...form, status: v as any })}
            />
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Allocate Room"
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

      <FormCard
        title={isStudent ? 'My Allocation Details' : 'Allocations List'}
        icon="list"
      >
        <GridPanel
          data={filteredAllocations}
          columns={[
            ...(!isStudent
              ? [{ field: 'studentId', header: 'Student ID' }]
              : []),
            ...(!isStudent
              ? [{ field: 'studentName', header: 'Student Name' }]
              : []),
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
            {
              field: 'roomId',
              header: 'Room No',
              cell: (item: any) => (
                <>
                  {data.rooms.find(r => r.id === item.roomId)?.roomNumber ||
                    item.roomId}
                </>
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
            // Admin actions
            ...(isAdmin
              ? [
                  {
                    header: 'Action',
                    sortable: false,
                    cell: (item: any) => (
                      <div className="flex gap-2">
                        {item.status === 'Active' ? (
                          <Button
                            label="Terminate"
                            variant="danger"
                            size="small"
                            icon="cancel"
                            onClick={() =>
                              updateRecord('allocations', item.id, {
                                ...item,
                                status: 'Terminated',
                              })
                            }
                          />
                        ) : (
                          <Button
                            label="Activate"
                            variant="primary"
                            size="small"
                            icon="check"
                            onClick={() =>
                              updateRecord('allocations', item.id, {
                                ...item,
                                status: 'Active',
                              })
                            }
                          />
                        )}
                      </div>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
