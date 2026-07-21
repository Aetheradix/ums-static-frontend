import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function LeaveApproval() {
  const { leaveRequests, setLeaveRequests, triggerNotification } = useHostel();

  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');

  const pendingLeaves = leaveRequests.filter(l => l.status === 'PENDING');
  const selectedLeave = leaveRequests.find(l => l.id === selectedLeaveId);

  const handleAction = (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedLeaveId) return;
    if (status === 'REJECTED' && !remarks) {
      triggerNotification('Please provide remarks for rejection', 'error');
      return;
    }

    setLeaveRequests(prev =>
      prev.map(l =>
        l.id === selectedLeaveId
          ? { ...l, status, remarks, approvedBy: 'Warden' }
          : l
      )
    );

    triggerNotification(
      `Leave request ${status.toLowerCase()} successfully`,
      'success'
    );
    setSelectedLeaveId(null);
    setRemarks('');
  };

  return (
    <FormPage
      title="Leave Approvals"
      description="Review and approve/reject leave requests from students"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Operations',
          to: '/hostel-management/student-operations/gate-pass',
        },
        { label: 'Leave Approvals' },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <FormCard title="Pending Leave Requests" icon="list">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-2">Leave ID</th>
                    <th className="p-2">Student</th>
                    <th className="p-2">From</th>
                    <th className="p-2">To</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-center text-slate-500"
                      >
                        No pending leave requests.
                      </td>
                    </tr>
                  )}
                  {pendingLeaves.map(lr => (
                    <tr
                      key={lr.id}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-2">{lr.id}</td>
                      <td className="p-2 font-medium">{lr.studentName}</td>
                      <td className="p-2">{lr.fromDate}</td>
                      <td className="p-2">{lr.toDate}</td>
                      <td className="p-2">
                        <Button
                          label="Review"
                          variant={
                            selectedLeaveId === lr.id ? 'primary' : 'outlined'
                          }
                          onClick={() => {
                            setSelectedLeaveId(lr.id);
                            setRemarks('');
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormCard>
        </div>

        {selectedLeave && (
          <div className="w-full lg:w-1/3">
            <FormCard title="Leave Details" icon="info">
              <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Student Name
                  </span>
                  <span className="font-semibold">
                    {selectedLeave.studentName}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Hostel / Room
                  </span>
                  <span className="font-semibold">
                    {selectedLeave.hostelId} / {selectedLeave.roomId}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">Reason</span>
                  <span className="font-semibold">{selectedLeave.reason}</span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Contact During Leave
                  </span>
                  <span className="font-semibold">
                    {selectedLeave.contactNumber}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Parental Consent
                  </span>
                  <span
                    className={`font-semibold ${selectedLeave.parentConsent ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {selectedLeave.parentConsent
                      ? 'Confirmed'
                      : 'Not Confirmed'}
                  </span>
                </div>
              </div>

              <div>
                <TextBox
                  label="Remarks (Required for Rejection)"
                  value={remarks}
                  onChange={setRemarks}
                />

                <div className="flex gap-2 mt-4">
                  <Button
                    label="Approve"
                    variant="primary"
                    onClick={() => handleAction('APPROVED')}
                  />
                  <Button
                    label="Reject"
                    variant="outlined"
                    onClick={() => handleAction('REJECTED')}
                  />
                </div>
              </div>
            </FormCard>
          </div>
        )}
      </div>
    </FormPage>
  );
}
