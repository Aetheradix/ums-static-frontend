import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
export default function GatePassRequest() {
  const { gatePasses, setGatePasses, roomAllotments, triggerNotification } =
    useHostel();
  // Mock logged in student
  const loggedInStudentId = 'STU-101';
  const currentAllotment = roomAllotments.find(
    a => a.studentId === loggedInStudentId && a.status === 'CHECKED_IN'
  );

  const [outTime, setOutTime] = useState('');
  const [expectedInTime, setExpectedInTime] = useState('');
  const [purpose, setPurpose] = useState('');

  const myGatePasses = gatePasses.filter(
    g => g.studentId === loggedInStudentId
  );

  const handleSubmit = () => {
    if (!currentAllotment) {
      triggerNotification(
        'You must be checked into a hostel to request a gate pass.',
        'error'
      );
      return;
    }
    if (!outTime || !expectedInTime || !purpose) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const newGatePass: HostelManagement.GatePass = {
      id: `GP-${Date.now()}`,
      studentId: loggedInStudentId,
      studentName: currentAllotment.studentName,
      hostelId: currentAllotment.hostelId,
      roomId: currentAllotment.roomId,
      outTime,
      expectedInTime,
      purpose,
      status: 'PENDING',
    };

    setGatePasses([...gatePasses, newGatePass]);
    triggerNotification('Gate Pass request submitted successfully', 'success');

    setOutTime('');
    setExpectedInTime('');
    setPurpose('');
  };

  return (
    <FormPage
      title="Gate Pass Request"
      description="Apply for a short-term out-pass from the hostel"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Operations',
          to: '/hostel-management/student-operations/gate-pass',
        },
        { label: 'Gate Pass Request' },
      ]}
    >
      <FormCard title="New Gate Pass Request" icon="directions_walk">
        <FormGrid columns={2}>
          <TextBox
            label="Expected Out Time *"
            type="datetime-local"
            value={outTime}
            onChange={setOutTime}
          />
          <TextBox
            label="Expected In Time *"
            type="datetime-local"
            value={expectedInTime}
            onChange={setExpectedInTime}
          />
          <div className="col-span-2">
            <TextBox
              label="Purpose of Outing *"
              value={purpose}
              onChange={setPurpose}
              placeholder="State the reason clearly..."
            />
          </div>
        </FormGrid>
        <div className="flex gap-3 mt-4">
          <Button
            label="Submit Request"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="My Gate Passes" icon="history">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Pass ID</th>
                  <th className="p-2">Out Time</th>
                  <th className="p-2">Expected In Time</th>
                  <th className="p-2">Purpose</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {myGatePasses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      You have not requested any gate passes yet.
                    </td>
                  </tr>
                )}
                {myGatePasses.map(gp => (
                  <tr
                    key={gp.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">{gp.id}</td>
                    <td className="p-2">
                      {new Date(gp.outTime).toLocaleString()}
                    </td>
                    <td className="p-2">
                      {new Date(gp.expectedInTime).toLocaleString()}
                    </td>
                    <td className="p-2">{gp.purpose}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          gp.status === 'APPROVED' || gp.status === 'ISSUED'
                            ? 'bg-green-100 text-green-700'
                            : gp.status === 'REJECTED'
                              ? 'bg-red-100 text-red-700'
                              : gp.status === 'RETURNED'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {gp.status}
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
