import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function RoomChangeRequest() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    studentName: '',
    currentRoom: '',
    requestedRoom: '',
    reason: '',
    approvalStatus: 'Pending',
  });

  return (
    <FormPage
      title="Room Change Request"
      description="Manage student requests for changing their allocated room."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Transactions',
          to: '/hostel-services/transactions/room-change-request',
        },
        { label: 'Room Change Request' },
      ]}
    >
      <FormCard title="New Request" icon="swap_calls">
        <FormGrid columns={3}>
          <TextBox
            label="Student Name *"
            value={form.studentName}
            onChange={v => setForm({ ...form, studentName: v })}
          />
          <TextBox
            label="Current Room *"
            value={form.currentRoom}
            onChange={v => setForm({ ...form, currentRoom: v })}
          />
          <TextBox
            label="Requested Room *"
            value={form.requestedRoom}
            onChange={v => setForm({ ...form, requestedRoom: v })}
          />

          <TextBox
            label="Reason"
            value={form.reason}
            onChange={v => setForm({ ...form, reason: v })}
          />
          <DropDownList
            label="Approval Status"
            data={[
              { id: 'Pending', text: 'Pending' },
              { id: 'Approved', text: 'Approved' },
              { id: 'Rejected', text: 'Rejected' },
            ]}
            textField="text"
            valueField="id"
            value={form.approvalStatus}
            onChange={v => setForm({ ...form, approvalStatus: v as string })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button label="Submit Request" variant="primary" onClick={() => {}} />
          <Button label="Clear" variant="outlined" onClick={() => {}} />
        </div>
      </FormCard>

      <FormCard title="Requests List" icon="list">
        <GridPanel
          data={data.roomChangeRequests}
          columns={[
            { field: 'studentName', header: 'Student Name' },
            { field: 'currentRoom', header: 'Current Room' },
            { field: 'requestedRoom', header: 'Requested Room' },
            { field: 'reason', header: 'Reason' },
            {
              field: 'approvalStatus',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.approvalStatus === 'Approved'
                      ? 'bg-green-100 text-green-800'
                      : item.approvalStatus === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {item.approvalStatus}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
