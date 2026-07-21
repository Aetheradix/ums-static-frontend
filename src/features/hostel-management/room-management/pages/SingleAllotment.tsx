import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function SingleAllotment() {
  const {
    studentApplications,
    hostels,
    roomAllotments,
    setRoomAllotments,
    setStudentApplications,
    triggerNotification,
  } = useHostel();

  const [applicationId, setApplicationId] = useState('');
  const [hostelId, setHostelId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [bedId, setBedId] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTill, setValidTill] = useState('');

  const approvedApplications = studentApplications.filter(
    a => a.status === 'APPROVED'
  );
  const applicationOptions = approvedApplications.map(a => ({
    id: a.id,
    text: `${a.studentName} (${a.enrollmentNo})`,
  }));
  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));

  // In reality, roomOptions and bedOptions would depend on the selected hostel and its current availability
  const roomOptions = [
    { id: 'R-1', text: 'Room 101 (2 Beds Available)' },
    { id: 'R-2', text: 'Room 102 (1 Bed Available)' },
  ];
  const bedOptions = [
    { id: 'BED-1', text: 'Bed A' },
    { id: 'BED-2', text: 'Bed B' },
  ];

  const handleAllot = () => {
    if (
      !applicationId ||
      !hostelId ||
      !roomId ||
      !bedId ||
      !validFrom ||
      !validTill
    ) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const app = studentApplications.find(a => a.id === applicationId);
    const hostel = hostels.find(h => h.id === hostelId);

    if (app && hostel) {
      const newAllotment: HostelManagement.RoomAllotment = {
        id: `ALOT-${Date.now()}`,
        applicationId,
        studentId: app.studentId,
        studentName: app.studentName,
        hostelId,
        hostelName: hostel.hostelName,
        roomId,
        roomNumber:
          roomOptions.find(r => r.id === roomId)?.text.split(' ')[1] || '',
        bedId,
        bedNumber: bedOptions.find(b => b.id === bedId)?.text || '',
        allotmentDate: new Date().toISOString().split('T')[0],
        allottedBy: 'Admin',
        validFrom,
        validTill,
        status: 'PENDING_CHECKIN',
      };

      setRoomAllotments([...roomAllotments, newAllotment]);
      setStudentApplications(prev =>
        prev.map(a =>
          a.id === applicationId ? { ...a, status: 'ALLOTTED' } : a
        )
      );

      triggerNotification('Room successfully allotted!');
      setApplicationId('');
      setHostelId('');
      setRoomId('');
      setBedId('');
    }
  };

  return (
    <FormPage
      title="Single Student Room Allotment"
      description="Manually allot a room to an approved student application"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Room Management',
          to: '/hostel-management/room-management/allotment-config',
        },
        { label: 'Single Allotment' },
      ]}
    >
      <FormCard title="Select Application" icon="person">
        <FormGrid columns={1}>
          <OptionDropDown
            label="Approved Student Application *"
            data={applicationOptions}
            value={applicationId}
            onChange={(v: any) => setApplicationId(v)}
            textField="text"
            valueField="id"
          />
        </FormGrid>
      </FormCard>

      {applicationId && (
        <FormCard title="Allotment Details" icon="hotel">
          <FormGrid columns={3}>
            <OptionDropDown
              label="Select Hostel *"
              data={hostelOptions}
              value={hostelId}
              onChange={(v: any) => setHostelId(v)}
              textField="text"
              valueField="id"
            />
            <OptionDropDown
              label="Select Room *"
              data={roomOptions}
              value={roomId}
              onChange={(v: any) => setRoomId(v)}
              textField="text"
              valueField="id"
            />
            <OptionDropDown
              label="Select Bed *"
              data={bedOptions}
              value={bedId}
              onChange={(v: any) => setBedId(v)}
              textField="text"
              valueField="id"
            />

            <TextBox
              label="Valid From *"
              type="date"
              value={validFrom}
              onChange={setValidFrom}
            />
            <TextBox
              label="Valid Till *"
              type="date"
              value={validTill}
              onChange={setValidTill}
            />
          </FormGrid>

          <div className="flex gap-3 mt-6">
            <Button
              label="Confirm Allotment"
              variant="primary"
              onClick={handleAllot}
            />
          </div>
        </FormCard>
      )}
    </FormPage>
  );
}
