import { useState } from 'react';
import {
  useHostelContext,
  useHostelRole,
  MOCK_STUDENT_ID,
  MOCK_STUDENT_NAME,
} from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function LeaveOutpass() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const { isStudent, isWarden, isAdmin, activePortal } = useHostelRole();

  const initialForm = {
    leaveType: 'Leave' as 'Leave' | 'Outpass',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    reason: '',
  };

  const [form, setForm] = useState(initialForm);

  const handleSubmit = () => {
    if (!form.reason) {
      alert('Please fill in reason for leave/outpass.');
      return;
    }

    addRecord('leaves', {
      id: `LV${Date.now()}`,
      studentId: MOCK_STUDENT_ID,
      studentName: MOCK_STUDENT_NAME,
      leaveType: form.leaveType,
      fromDate: form.fromDate,
      toDate: form.toDate,
      reason: form.reason,
      approvalStatus: 'Pending',
      approvedBy: '',
    });

    setForm(initialForm);
  };

  // Filter data based on role
  const filteredLeaves = isStudent
    ? data.leaves.filter(l => l.studentId === MOCK_STUDENT_ID)
    : data.leaves;

  const portalLabel =
    activePortal === 'student'
      ? 'Student Portal'
      : activePortal === 'warden'
        ? 'Warden Portal'
        : 'Admin Portal';
  const portalPath = `/hostel-services/${activePortal}`;

  return (
    <FormPage
      title={isStudent ? 'My Leave & Outpass' : 'Leave & Outpass'}
      description={
        isStudent
          ? 'Apply for leave or outpass and track your approval status.'
          : 'Review and approve/reject student leave and outpass requests.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
        { label: portalLabel, to: portalPath },
        { label: 'Leave & Outpass' },
      ]}
    >
      {/* Form is only shown to Students to apply for leave */}
      {isStudent && (
        <FormCard title="Apply Leave/Outpass" icon="directions_walk">
          <FormGrid columns={3}>
            <DropDownList
              label="Type"
              data={[
                { id: 'Leave', text: 'Leave' },
                { id: 'Outpass', text: 'Outpass' },
              ]}
              textField="text"
              valueField="id"
              value={form.leaveType}
              onChange={v => setForm({ ...form, leaveType: v as any })}
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
            <div className="col-span-3">
              <TextBox
                label="Reason *"
                value={form.reason}
                onChange={v => setForm({ ...form, reason: v })}
              />
            </div>
          </FormGrid>
          <div className="mt-4 flex gap-3">
            <Button
              label="Submit Request"
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

      {/* Admin / Warden only sees the leaves list with Approve/Reject actions */}
      <FormCard
        title={isStudent ? 'My Leaves & Outpasses' : 'Leaves & Outpasses List'}
        icon="list"
      >
        <GridPanel
          data={filteredLeaves}
          columns={[
            ...(!isStudent
              ? [{ field: 'studentId', header: 'Student ID' }]
              : []),
            ...(!isStudent
              ? [{ field: 'studentName', header: 'Student Name' }]
              : []),
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
            // Warden/Admin can approve or reject
            ...(isWarden || isAdmin
              ? [
                  {
                    header: 'Action',
                    sortable: false,
                    cell: (item: any) => (
                      <div className="flex gap-2">
                        {item.approvalStatus === 'Pending' && (
                          <>
                            <Button
                              label="Approve"
                              variant="primary"
                              size="small"
                              icon="check"
                              onClick={() =>
                                updateRecord('leaves', item.id, {
                                  ...item,
                                  approvalStatus: 'Approved',
                                  approvedBy: isWarden ? 'Warden' : 'Admin',
                                })
                              }
                            />
                            <Button
                              label="Reject"
                              variant="danger"
                              size="small"
                              icon="close"
                              onClick={() =>
                                updateRecord('leaves', item.id, {
                                  ...item,
                                  approvalStatus: 'Rejected',
                                })
                              }
                            />
                          </>
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
