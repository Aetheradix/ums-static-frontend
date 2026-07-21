import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function LeaveOutpass() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    studentId: '',
    studentName: '',
    leaveType: 'Leave',
    fromDate: '',
    toDate: '',
    reason: '',
    approvalStatus: 'Pending',
  });

  return (
    <FormPage
      title="Leave & Outpass"
      description="Manage student leaves and weekend outpasses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Transactions',
          to: '/hostel-services/transactions/leave-outpass',
        },
        { label: 'Leave & Outpass' },
      ]}
    >
      <FormCard title="Apply Leave/Outpass" icon="directions_walk">
        <FormGrid columns={3}>
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
            label="Type"
            data={[
              { id: 'Leave', text: 'Leave' },
              { id: 'Outpass', text: 'Outpass' },
            ]}
            textField="text"
            valueField="id"
            value={form.leaveType}
            onChange={v => setForm({ ...form, leaveType: v as string })}
          />

          <TextBox
            label="From Date"
            type="date"
            value={form.fromDate}
            onChange={v => setForm({ ...form, fromDate: v })}
          />
          <TextBox
            label="To Date"
            type="date"
            value={form.toDate}
            onChange={v => setForm({ ...form, toDate: v })}
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

      <FormCard title="Leaves & Outpasses List" icon="list">
        <GridPanel
          data={data.leaves}
          columns={[
            { field: 'studentId', header: 'Student ID' },
            { field: 'studentName', header: 'Student Name' },
            {
              field: 'leaveType',
              header: 'Type',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.leaveType === 'Leave'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {item.leaveType}
                </span>
              ),
            },
            { field: 'fromDate', header: 'From Date' },
            { field: 'toDate', header: 'To Date' },
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
