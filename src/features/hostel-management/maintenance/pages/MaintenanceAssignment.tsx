import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function MaintenanceAssignment() {
  const {
    maintenanceRequests,
    setMaintenanceRequests,
    hostelStaff,
    triggerNotification,
  } = useHostel();

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [selectedStaffId, setSelectedStaffId] = useState('');

  const openRequests = maintenanceRequests.filter(
    m => m.status === 'OPEN' || m.status === 'ASSIGNED'
  );
  const selectedRequest = maintenanceRequests.find(
    m => m.id === selectedRequestId
  );

  // Filter staff based on the issue type
  const availableStaff = hostelStaff.filter(s => {
    if (!selectedRequest) return true;
    if (selectedRequest.issueType === 'ELECTRICAL' && s.role !== 'ELECTRICIAN')
      return false;
    if (selectedRequest.issueType === 'PLUMBING' && s.role !== 'PLUMBER')
      return false;
    if (selectedRequest.issueType === 'CLEANING' && s.role !== 'CLEANER')
      return false;
    return s.status === 'ACTIVE';
  });

  const handleAssign = () => {
    if (!selectedRequestId || !selectedStaffId) {
      triggerNotification(
        'Please select a request and a staff member.',
        'error'
      );
      return;
    }

    setMaintenanceRequests(prev =>
      prev.map(m =>
        m.id === selectedRequestId
          ? { ...m, assignedTo: selectedStaffId, status: 'ASSIGNED' }
          : m
      )
    );

    triggerNotification('Maintenance task assigned successfully.', 'success');
    setSelectedRequestId(null);
    setSelectedStaffId('');
  };

  return (
    <FormPage
      title="Maintenance Task Assignment"
      description="Assign pending maintenance requests to the appropriate maintenance staff."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        { label: 'Maintenance', to: '/hostel-management/maintenance/requests' },
        { label: 'Assignment' },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <FormCard title="Pending Requests" icon="list">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-2">Request ID</th>
                    <th className="p-2">Issue Type</th>
                    <th className="p-2">Priority</th>
                    <th className="p-2">Current Assignee</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {openRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-center text-slate-500"
                      >
                        No open maintenance requests.
                      </td>
                    </tr>
                  )}
                  {openRequests.map(req => (
                    <tr
                      key={req.id}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-2">{req.id}</td>
                      <td className="p-2 font-medium">{req.issueType}</td>
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
                      <td className="p-2 text-slate-500">
                        {req.assignedTo
                          ? hostelStaff.find(s => s.id === req.assignedTo)
                              ?.name || req.assignedTo
                          : 'Unassigned'}
                      </td>
                      <td className="p-2">
                        <Button
                          label="Assign"
                          variant={
                            selectedRequestId === req.id
                              ? 'primary'
                              : 'outlined'
                          }
                          onClick={() => {
                            setSelectedRequestId(req.id);
                            setSelectedStaffId(req.assignedTo || '');
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
            <FormCard title="Task Assignment" icon="assignment_ind">
              <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Hostel / Room
                  </span>
                  <span className="font-semibold">
                    {selectedRequest.hostelId} - Room {selectedRequest.roomId}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Description
                  </span>
                  <span className="font-semibold">
                    {selectedRequest.description}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-slate-500 block">
                    Date Reported
                  </span>
                  <span className="font-semibold">
                    {selectedRequest.requestDate}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select Staff *
                </label>
                <select
                  value={selectedStaffId}
                  onChange={e => setSelectedStaffId(e.target.value)}
                  className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                >
                  <option value="">-- Select Staff --</option>
                  {availableStaff.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>

                <div className="flex gap-2 mt-4">
                  <Button
                    label="Assign Task"
                    variant="primary"
                    onClick={handleAssign}
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
