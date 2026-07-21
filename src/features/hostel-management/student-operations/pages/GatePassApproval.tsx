import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function GatePassApproval() {
  const { gatePasses, setGatePasses, triggerNotification } = useHostel();

  const [selectedPassId, setSelectedPassId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');

  const pendingPasses = gatePasses.filter(g => g.status === 'PENDING');
  const selectedPass = gatePasses.find(g => g.id === selectedPassId);

  const handleAction = (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedPassId) return;
    if (status === 'REJECTED' && !remarks) {
      triggerNotification('Please provide remarks for rejection', 'error');
      return;
    }

    setGatePasses(prev =>
      prev.map(g =>
        g.id === selectedPassId
          ? { ...g, status, remarks, approvedBy: 'Warden' }
          : g
      )
    );

    triggerNotification(
      `Gate Pass ${status.toLowerCase()} successfully`,
      'success'
    );
    setSelectedPassId(null);
    setRemarks('');
  };

  return (
    <FormPage
      title="Gate Pass Approvals"
      description="Review and approve/reject gate pass requests from students"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Operations',
          to: '/hostel-management/student-operations/gate-pass',
        },
        { label: 'Approvals' },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <FormCard title="Pending Requests" icon="list">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-2">Pass ID</th>
                    <th className="p-2">Student</th>
                    <th className="p-2">Expected Out</th>
                    <th className="p-2">Expected In</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPasses.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-center text-slate-500"
                      >
                        No pending gate pass requests.
                      </td>
                    </tr>
                  )}
                  {pendingPasses.map(gp => (
                    <tr
                      key={gp.id}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-2">{gp.id}</td>
                      <td className="p-2 font-medium">{gp.studentName}</td>
                      <td className="p-2">
                        {new Date(gp.outTime).toLocaleString()}
                      </td>
                      <td className="p-2">
                        {new Date(gp.expectedInTime).toLocaleString()}
                      </td>
                      <td className="p-2">
                        <Button
                          label="Review"
                          variant={
                            selectedPassId === gp.id ? 'primary' : 'outlined'
                          }
                          onClick={() => {
                            setSelectedPassId(gp.id);
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

        {selectedPass && (
          <div className="w-full lg:w-1/3">
            <FormCard title="Request Details" icon="info">
              <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Student Name
                  </span>
                  <span className="font-semibold">
                    {selectedPass.studentName}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Hostel / Room
                  </span>
                  <span className="font-semibold">
                    {selectedPass.hostelId} / {selectedPass.roomId}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">Purpose</span>
                  <span className="font-semibold">{selectedPass.purpose}</span>
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
