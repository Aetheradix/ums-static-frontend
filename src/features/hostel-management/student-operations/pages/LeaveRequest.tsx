import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';
export default function LeaveRequest() {
  const {
    leaveRequests,
    setLeaveRequests,
    roomAllotments,
    triggerNotification,
  } = useHostel();
  // Mock logged in student
  const loggedInStudentId = 'STU-101';
  const currentAllotment = roomAllotments.find(
    a => a.studentId === loggedInStudentId && a.status === 'CHECKED_IN'
  );

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [parentConsent, setParentConsent] = useState(false);

  const myLeaves = leaveRequests.filter(l => l.studentId === loggedInStudentId);

  const handleSubmit = () => {
    if (!currentAllotment) {
      triggerNotification(
        'You must be checked into a hostel to request leave.',
        'error'
      );
      return;
    }
    if (!fromDate || !toDate || !reason || !contactNumber) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }
    if (!parentConsent) {
      triggerNotification(
        'Parental consent is mandatory for leave requests.',
        'error'
      );
      return;
    }

    const newLeave: HostelManagement.LeaveRequest = {
      id: `LR-${Date.now()}`,
      studentId: loggedInStudentId,
      studentName: currentAllotment.studentName,
      hostelId: currentAllotment.hostelId,
      roomId: currentAllotment.roomId,
      fromDate,
      toDate,
      reason,
      contactNumber,
      parentConsent,
      status: 'PENDING',
    };

    setLeaveRequests([...leaveRequests, newLeave]);
    triggerNotification('Leave request submitted successfully', 'success');

    setFromDate('');
    setToDate('');
    setReason('');
    setContactNumber('');
    setParentConsent(false);
  };

  return (
    <FormPage
      title="Leave / Outing Request"
      description="Apply for a long-term leave or overnight outing from the hostel"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Operations',
          to: '/hostel-management/student-operations/gate-pass',
        },
        { label: 'Leave Request' },
      ]}
    >
      <FormCard title="New Leave Request" icon="flight_takeoff">
        <FormGrid columns={2}>
          <TextBox
            label="From Date *"
            type="date"
            value={fromDate}
            onChange={setFromDate}
          />
          <TextBox
            label="To Date *"
            type="date"
            value={toDate}
            onChange={setToDate}
          />

          <TextBox
            label="Emergency Contact Number *"
            value={contactNumber}
            onChange={setContactNumber}
            placeholder="Phone number during leave"
          />
          <TextBox
            label="Reason for Leave *"
            value={reason}
            onChange={setReason}
            placeholder="State the reason clearly..."
          />
        </FormGrid>

        <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
          <label className="flex items-center gap-2 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={parentConsent}
              onChange={e => setParentConsent(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              I confirm that my parents/guardians are aware of and consent to
              this leave. *
            </span>
          </label>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            label="Submit Request"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="My Leave History" icon="history">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Leave ID</th>
                  <th className="p-2">From Date</th>
                  <th className="p-2">To Date</th>
                  <th className="p-2">Reason</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {myLeaves.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      You have no leave history.
                    </td>
                  </tr>
                )}
                {myLeaves.map(lr => (
                  <tr
                    key={lr.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">{lr.id}</td>
                    <td className="p-2">{lr.fromDate}</td>
                    <td className="p-2">{lr.toDate}</td>
                    <td className="p-2">{lr.reason}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          lr.status === 'APPROVED'
                            ? 'bg-green-100 text-green-700'
                            : lr.status === 'REJECTED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {lr.status}
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
