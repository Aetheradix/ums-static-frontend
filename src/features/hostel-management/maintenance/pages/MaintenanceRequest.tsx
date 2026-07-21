import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function MaintenanceRequest() {
  const {
    roomAllotments,
    maintenanceRequests,
    setMaintenanceRequests,
    triggerNotification,
  } = useHostel();

  // Mock logged in student
  const loggedInStudentId = 'STU-101';
  const currentAllotment = roomAllotments.find(
    a => a.studentId === loggedInStudentId && a.status === 'CHECKED_IN'
  );

  const [issueType, setIssueType] = useState('ELECTRICAL');
  const [priority, setPriority] = useState('LOW');
  const [description, setDescription] = useState('');

  const myRequests = maintenanceRequests.filter(
    m => m.reportedBy === loggedInStudentId
  );

  const handleSubmit = () => {
    if (!currentAllotment) {
      triggerNotification(
        'You must be checked into a room to raise a maintenance request.',
        'error'
      );
      return;
    }
    if (!description) {
      triggerNotification(
        'Please provide a description of the issue.',
        'error'
      );
      return;
    }

    const newReq: HostelManagement.MaintenanceRequest = {
      id: `MR-${Date.now()}`,
      hostelId: currentAllotment.hostelId,
      roomId: currentAllotment.roomId,
      reportedBy: loggedInStudentId,
      issueType: issueType as any,
      description,
      priority: priority as any,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'OPEN',
    };

    setMaintenanceRequests([...maintenanceRequests, newReq]);
    triggerNotification(
      'Maintenance request submitted successfully.',
      'success'
    );
    setDescription('');
  };

  return (
    <FormPage
      title="Maintenance Request"
      description="Report an issue in your room or hostel premises for maintenance staff to resolve."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        { label: 'Maintenance', to: '/hostel-management/maintenance/requests' },
        { label: 'New Request' },
      ]}
    >
      <FormCard title="Raise a New Issue" icon="build">
        <FormGrid columns={2}>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Issue Type *
            </label>
            <select
              value={issueType}
              onChange={e => setIssueType(e.target.value)}
              className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            >
              <option value="ELECTRICAL">Electrical</option>
              <option value="PLUMBING">Plumbing</option>
              <option value="CARPENTRY">Carpentry</option>
              <option value="CLEANING">Cleaning / Housekeeping</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Priority *
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="col-span-2">
            <TextBox
              label="Description *"
              value={description}
              onChange={setDescription}
              placeholder="Explain the exact issue..."
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
        <FormCard title="My Maintenance Requests" icon="history">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Request ID</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Priority</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-500">
                      You have not raised any maintenance requests.
                    </td>
                  </tr>
                )}
                {myRequests.map(req => (
                  <tr
                    key={req.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2 font-medium">{req.id}</td>
                    <td className="p-2">{req.requestDate}</td>
                    <td className="p-2">{req.issueType}</td>
                    <td
                      className="p-2 max-w-xs truncate"
                      title={req.description}
                    >
                      {req.description}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          req.priority === 'URGENT' || req.priority === 'HIGH'
                            ? 'bg-red-100 text-red-700'
                            : req.priority === 'MEDIUM'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          req.status === 'CLOSED' || req.status === 'RESOLVED'
                            ? 'bg-green-100 text-green-700'
                            : req.status === 'IN_PROGRESS' ||
                                req.status === 'ASSIGNED'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.status.replace('_', ' ')}
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
