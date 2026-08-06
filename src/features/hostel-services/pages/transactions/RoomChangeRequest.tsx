import { useState } from 'react';
import {
  useHostelContext,
  useHostelRole,
  MOCK_STUDENT_NAME,
} from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function RoomChangeRequest() {
  const { data, addRecord, updateRecord } = useHostelContext();
  const { isStudent, isAdmin, isWarden, activePortal } = useHostelRole();

  const initialForm = {
    studentName: MOCK_STUDENT_NAME,
    currentRoom: '',
    requestedRoom: '',
    reason: '',
  };

  const [form, setForm] = useState(initialForm);

  const handleSubmit = () => {
    if (!form.currentRoom || !form.requestedRoom) {
      alert(
        'Please fill in required fields (Current Room and Requested Room).'
      );
      return;
    }

    addRecord('roomChangeRequests', {
      id: `RCR${Date.now()}`,
      studentName: MOCK_STUDENT_NAME,
      currentRoom: form.currentRoom,
      requestedRoom: form.requestedRoom,
      reason: form.reason,
      approvalStatus: 'Pending',
    });

    setForm(initialForm);
  };

  // Filter data based on role
  const filteredRequests = isStudent
    ? data.roomChangeRequests.filter(r => r.studentName === MOCK_STUDENT_NAME)
    : data.roomChangeRequests;

  const portalLabel =
    activePortal === 'student'
      ? 'Student Portal'
      : activePortal === 'warden'
        ? 'Warden Portal'
        : 'Admin Portal';
  const portalPath = `/hostel-services/${activePortal}`;

  return (
    <FormPage
      title={isStudent ? 'My Room Change Request' : 'Room Change Request'}
      description={
        isStudent
          ? 'Submit a request to change your room or bed allocation.'
          : 'Review and approve/reject student room change requests.'
      }
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/home/sub-menu/hostel-services' },
        { label: portalLabel, to: portalPath },
        { label: 'Room Change Request' },
      ]}
    >
      {/* Form is only shown to Students to submit requests */}
      {isStudent && (
        <FormCard title="Submit Room Change Request" icon="swap_calls">
          <FormGrid columns={3}>
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

      {/* Admin / Warden only sees the requests list with Approve/Reject actions */}
      <FormCard title={isStudent ? 'My Requests' : 'Requests List'} icon="list">
        <GridPanel
          data={filteredRequests}
          columns={[
            ...(!isStudent
              ? [{ field: 'studentName', header: 'Student Name' }]
              : []),
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
            // Admin & Warden can approve or reject
            ...(isAdmin || isWarden
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
                                updateRecord('roomChangeRequests', item.id, {
                                  ...item,
                                  approvalStatus: 'Approved',
                                })
                              }
                            />
                            <Button
                              label="Reject"
                              variant="danger"
                              size="small"
                              icon="close"
                              onClick={() =>
                                updateRecord('roomChangeRequests', item.id, {
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
