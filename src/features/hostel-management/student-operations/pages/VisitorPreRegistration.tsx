import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function VisitorPreRegistration() {
  const {
    visitorRecords,
    setVisitorRecords,
    roomAllotments,
    triggerNotification,
  } = useHostel();

  // Mock logged in student
  const loggedInStudentId = 'STU-101';
  const currentAllotment = roomAllotments.find(
    a => a.studentId === loggedInStudentId && a.status === 'CHECKED_IN'
  );

  const [visitorName, setVisitorName] = useState('');
  const [relation, setRelation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [purpose, setPurpose] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [expectedTime, setExpectedTime] = useState('');

  const myVisitors = visitorRecords.filter(
    v => v.studentId === loggedInStudentId
  );

  const handleSubmit = () => {
    if (!currentAllotment) {
      triggerNotification(
        'You must be checked into a hostel to pre-register visitors.',
        'error'
      );
      return;
    }
    if (
      !visitorName ||
      !relation ||
      !contactNumber ||
      !expectedDate ||
      !expectedTime
    ) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const newVisitor: HostelManagement.VisitorRecord = {
      id: `VIS-${Date.now()}`,
      studentId: loggedInStudentId,
      studentName: currentAllotment.studentName,
      visitorName,
      relation,
      contactNumber,
      purpose,
      expectedDate,
      expectedTime,
      status: 'PRE_REGISTERED',
    };

    setVisitorRecords([...visitorRecords, newVisitor]);
    triggerNotification('Visitor pre-registered successfully', 'success');

    setVisitorName('');
    setRelation('');
    setContactNumber('');
    setPurpose('');
    setExpectedDate('');
    setExpectedTime('');
  };

  return (
    <FormPage
      title="Visitor Pre-Registration"
      description="Pre-register your visitors to expedite their check-in process at the security gate"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Operations',
          to: '/hostel-management/student-operations/gate-pass',
        },
        { label: 'Visitor Registration' },
      ]}
    >
      <FormCard title="Register New Visitor" icon="person_add">
        <FormGrid columns={2}>
          <TextBox
            label="Visitor Name *"
            value={visitorName}
            onChange={setVisitorName}
          />
          <TextBox
            label="Relation *"
            value={relation}
            onChange={setRelation}
            placeholder="e.g. Father, Mother, Brother"
          />

          <TextBox
            label="Contact Number *"
            value={contactNumber}
            onChange={setContactNumber}
          />
          <TextBox
            label="Purpose of Visit"
            value={purpose}
            onChange={setPurpose}
          />

          <TextBox
            label="Expected Date *"
            type="date"
            value={expectedDate}
            onChange={setExpectedDate}
          />
          <TextBox
            label="Expected Time *"
            type="time"
            value={expectedTime}
            onChange={setExpectedTime}
          />
        </FormGrid>

        <div className="flex gap-3 mt-4">
          <Button
            label="Pre-Register Visitor"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="My Expected Visitors" icon="group">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Visitor Name</th>
                  <th className="p-2">Relation</th>
                  <th className="p-2">Expected Date & Time</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {myVisitors.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-500">
                      You have not pre-registered any visitors.
                    </td>
                  </tr>
                )}
                {myVisitors.map(v => (
                  <tr
                    key={v.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2 font-medium">{v.visitorName}</td>
                    <td className="p-2">{v.relation}</td>
                    <td className="p-2">
                      {v.expectedDate} at {v.expectedTime}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          v.status === 'PRE_REGISTERED'
                            ? 'bg-blue-100 text-blue-700'
                            : v.status === 'CHECKED_IN'
                              ? 'bg-green-100 text-green-700'
                              : v.status === 'CHECKED_OUT'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
