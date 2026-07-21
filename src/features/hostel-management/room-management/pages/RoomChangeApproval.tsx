import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function RoomChangeApproval() {
  const { roomChangeRequests, setRoomChangeRequests, triggerNotification } =
    useHostel();

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [remarks, setRemarks] = useState('');

  const pendingRequests = roomChangeRequests.filter(
    r => r.status === 'PENDING'
  );
  const selectedRequest = roomChangeRequests.find(
    r => r.id === selectedRequestId
  );

  const handleAction = (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedRequestId) return;
    if (status === 'REJECTED' && !remarks) {
      triggerNotification('Please provide remarks for rejection', 'error');
      return;
    }

    setRoomChangeRequests(prev =>
      prev.map(r =>
        r.id === selectedRequestId
          ? {
              ...r,
              status,
              approvalRemarks: remarks,
              approvedBy: 'Admin',
              approvalDate: new Date().toISOString(),
            }
          : r
      )
    );

    triggerNotification(
      `Room change request ${status.toLowerCase()} successfully`,
      'success'
    );
    setSelectedRequestId(null);
    setRemarks('');
  };

  return (
    <FormPage
      title="Room Change Approvals"
      description="Review and approve/reject room change requests from students"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Room Management',
          to: '/hostel-management/room-management/allotment-config',
        },
        { label: 'Room Change Approvals' },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <FormCard title="Pending Requests" icon="list">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-2">Date</th>
                    <th className="p-2">Student</th>
                    <th className="p-2">Current Room</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-slate-500"
                      >
                        No pending room change requests.
                      </td>
                    </tr>
                  )}
                  {pendingRequests.map(req => (
                    <tr
                      key={req.id}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-2">{req.requestDate}</td>
                      <td className="p-2">{req.studentName}</td>
                      <td className="p-2">{req.currentRoomId}</td>
                      <td className="p-2">
                        <Button
                          label="Review"
                          variant={
                            selectedRequestId === req.id
                              ? 'primary'
                              : 'outlined'
                          }
                          onClick={() => {
                            setSelectedRequestId(req.id);
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

        {selectedRequest && (
          <div className="w-full lg:w-1/3">
            <FormCard title="Request Details" icon="info">
              <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Student Name
                  </span>
                  <span className="font-semibold">
                    {selectedRequest.studentName}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Current Location
                  </span>
                  <span className="font-semibold">
                    {selectedRequest.currentHostelId} - Room{' '}
                    {selectedRequest.currentRoomId}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Requested Location Preference
                  </span>
                  <span className="font-semibold">
                    {selectedRequest.requestedHostelId
                      ? `Hostel: ${selectedRequest.requestedHostelId}`
                      : 'Any Hostel'}
                    <br />
                    {selectedRequest.requestedRoomTypeId
                      ? `Room Type: ${selectedRequest.requestedRoomTypeId}`
                      : 'Any Room Type'}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">Reason</span>
                  <span className="font-semibold">
                    {selectedRequest.reason}
                  </span>
                </div>
              </div>

              <div>
                <TextBox
                  label="Approval / Rejection Remarks"
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
