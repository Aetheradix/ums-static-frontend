import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
import { useNavigate } from 'react-router-dom';

export default function RoomChangeRequest() {
  const {
    hostels,
    roomTypes,
    roomAllotments,
    roomChangeRequests,
    setRoomChangeRequests,
    triggerNotification,
  } = useHostel();
  const navigate = useNavigate();

  // For mock purposes, assume the logged in student is STU-101
  const loggedInStudentId = 'STU-101';

  // Find current allotment for this student
  const currentAllotment = roomAllotments.find(
    r => r.studentId === loggedInStudentId && r.status === 'CHECKED_IN'
  );

  // Find any existing pending request
  const existingRequest = roomChangeRequests.find(
    r => r.studentId === loggedInStudentId && r.status === 'PENDING'
  );

  const [requestedHostelId, setRequestedHostelId] = useState('');
  const [requestedRoomTypeId, setRequestedRoomTypeId] = useState('');
  const [reason, setReason] = useState('');

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));
  const roomTypeOptions = roomTypes.map(rt => ({
    id: rt.id,
    text: rt.roomTypeName,
  }));

  const handleSubmit = () => {
    if (!currentAllotment) {
      triggerNotification(
        'You do not have an active room allotment to change.',
        'error'
      );
      return;
    }
    if (!reason) {
      triggerNotification(
        'Please provide a reason for the change request.',
        'error'
      );
      return;
    }

    const newReq: HostelManagement.RoomChangeRequest = {
      id: `RCR-${Date.now()}`,
      studentId: loggedInStudentId,
      studentName: currentAllotment.studentName,
      currentHostelId: currentAllotment.hostelId,
      currentRoomId: currentAllotment.roomId,
      requestedHostelId: requestedHostelId || undefined,
      requestedRoomTypeId: requestedRoomTypeId || undefined,
      reason,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };

    setRoomChangeRequests([...roomChangeRequests, newReq]);
    triggerNotification(
      'Room change request submitted successfully',
      'success'
    );
  };

  if (!currentAllotment) {
    return (
      <FormPage
        title="Room Change Request"
        description="Submit a request to change your current room"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Hostel Management', to: '/hostel-management/admin' },
          {
            label: 'Room Management',
            to: '/hostel-management/room-management/allotment-config',
          },
          { label: 'Room Change Request' },
        ]}
      >
        <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded shadow">
          You currently do not have an active room allotment (checked-in) to
          request a change for.
        </div>
      </FormPage>
    );
  }

  if (existingRequest) {
    return (
      <FormPage
        title="Room Change Request"
        description="Submit a request to change your current room"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Hostel Management', to: '/hostel-management/admin' },
          {
            label: 'Room Management',
            to: '/hostel-management/room-management/allotment-config',
          },
          { label: 'Room Change Request' },
        ]}
      >
        <FormCard title="Existing Request Status" icon="sync">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded text-yellow-700 dark:text-yellow-400">
            You already have a pending room change request submitted on{' '}
            <strong>{existingRequest.requestDate}</strong>.
            <br />
            Please wait for the administration to process it.
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Room Change Request"
      description="Submit a request to change your current room"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Room Management',
          to: '/hostel-management/room-management/allotment-config',
        },
        { label: 'Room Change Request' },
      ]}
    >
      <FormCard title="Current Allocation" icon="home">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-slate-500 block">Hostel Name</span>
            <span className="font-semibold">{currentAllotment.hostelName}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Room Number</span>
            <span className="font-semibold">{currentAllotment.roomNumber}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Bed Number</span>
            <span className="font-semibold">{currentAllotment.bedNumber}</span>
          </div>
        </div>
      </FormCard>

      <FormCard title="Change Preferences" icon="sync">
        <FormGrid columns={2}>
          <OptionDropDown
            label="Preferred Hostel (Optional)"
            data={[{ id: '', text: 'No Preference' }, ...hostelOptions]}
            value={requestedHostelId}
            onChange={(v: any) => setRequestedHostelId(v)}
            textField="text"
            valueField="id"
          />
          <OptionDropDown
            label="Preferred Room Type (Optional)"
            data={[{ id: '', text: 'No Preference' }, ...roomTypeOptions]}
            value={requestedRoomTypeId}
            onChange={(v: any) => setRequestedRoomTypeId(v)}
            textField="text"
            valueField="id"
          />
          <div className="col-span-2">
            <TextBox
              label="Reason for Change *"
              value={reason}
              onChange={setReason}
              placeholder="Explain why you are requesting a room change..."
            />
          </div>
        </FormGrid>

        <div className="flex gap-3 mt-4">
          <Button
            label="Submit Request"
            variant="primary"
            onClick={handleSubmit}
          />
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate('/home')}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
