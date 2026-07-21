import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function StudentApplicationForm() {
  const {
    hostels,
    roomTypes,
    studentApplications,
    setStudentApplications,
    triggerNotification,
  } = useHostel();

  const [studentId] = useState('STU-100');
  const [enrollmentNo] = useState('ENR2026100');
  const [studentName] = useState('John Doe');
  const [course] = useState('B.Tech CS');
  const [semester] = useState('5th Sem');
  const [gender] = useState('MALE');

  const [hostelId, setHostelId] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [distanceFromCity, setDistanceFromCity] = useState('');
  const [hasMedicalCondition, setHasMedicalCondition] = useState(false);
  const [medicalDetails, setMedicalDetails] = useState('');

  const [hasApplied, setHasApplied] = useState(false);

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));
  const roomTypeOptions = roomTypes.map(r => ({
    id: r.id,
    text: r.roomTypeName,
  }));

  const handleSubmit = () => {
    if (!hostelId || !roomTypeId || !distanceFromCity) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }
    const h = hostels.find(h => h.id === hostelId);
    const rt = roomTypes.find(r => r.id === roomTypeId);

    const newApp: HostelManagement.StudentApplication = {
      id: `APP-${Date.now()}`,
      studentId,
      enrollmentNo,
      studentName,
      course,
      semester,
      gender: gender as any,
      hostelId,
      hostelName: h?.hostelName || '',
      roomTypeId,
      roomTypeName: rt?.roomTypeName || '',
      applicationDate: new Date().toISOString().split('T')[0],
      distanceFromCity: parseFloat(distanceFromCity),
      hasMedicalCondition,
      medicalDetails,
      status: 'SUBMITTED',
    };
    setStudentApplications([...studentApplications, newApp]);
    triggerNotification('Application submitted successfully!');
    setHasApplied(true);
  };

  if (hasApplied) {
    return (
      <FormPage
        title="Hostel Application"
        description="Apply for university hostel accommodation"
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Hostel Management', to: '/hostel-management/admin' },
          {
            label: 'Student Application',
            to: '/hostel-management/student-application/apply',
          },
        ]}
      >
        <FormCard title="Application Status" icon="check_circle">
          <div className="p-4 text-center">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Application Submitted Successfully
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Your application is now under scrutiny. You will be notified once
              it is approved and a room is allotted.
            </p>
            <Button
              label="View Application Status"
              variant="primary"
              onClick={() =>
                triggerNotification('Navigating to Status Page...')
              }
            />
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Hostel Application Form"
      description="Apply for university hostel accommodation"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Student Application',
          to: '/hostel-management/student-application/apply',
        },
      ]}
    >
      <FormCard title="Student Profile (Auto-filled)" icon="person">
        <FormGrid columns={3}>
          <TextBox
            label="Enrollment No"
            value={enrollmentNo}
            onChange={() => {}}
            disabled
          />
          <TextBox
            label="Student Name"
            value={studentName}
            onChange={() => {}}
            disabled
          />
          <TextBox label="Course" value={course} onChange={() => {}} disabled />
          <TextBox
            label="Semester"
            value={semester}
            onChange={() => {}}
            disabled
          />
          <TextBox label="Gender" value={gender} onChange={() => {}} disabled />
        </FormGrid>
      </FormCard>

      <FormCard title="Application Details" icon="assignment">
        <FormGrid columns={2}>
          <OptionDropDown
            label="Preferred Hostel *"
            data={hostelOptions}
            value={hostelId}
            onChange={(v: any) => setHostelId(v)}
            textField="text"
            valueField="id"
          />
          <OptionDropDown
            label="Preferred Room Type *"
            data={roomTypeOptions}
            value={roomTypeId}
            onChange={(v: any) => setRoomTypeId(v)}
            textField="text"
            valueField="id"
          />
          <TextBox
            label="Distance from Home to City (Km) *"
            type="number"
            value={distanceFromCity}
            onChange={setDistanceFromCity}
          />
        </FormGrid>

        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
          <label className="flex items-center gap-2 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={hasMedicalCondition}
              onChange={e => setHasMedicalCondition(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Do you have any medical condition requiring special accommodation?
            </span>
          </label>

          {hasMedicalCondition && (
            <FormGrid columns={1}>
              <TextBox
                label="Medical Details"
                value={medicalDetails}
                onChange={setMedicalDetails}
                placeholder="Briefly describe the condition and requirements..."
              />
            </FormGrid>
          )}
        </div>
      </FormCard>

      <div className="flex gap-3 mt-4">
        <Button
          label="Submit Application"
          variant="primary"
          onClick={handleSubmit}
        />
        <Button label="Cancel" variant="outlined" />
      </div>
    </FormPage>
  );
}
