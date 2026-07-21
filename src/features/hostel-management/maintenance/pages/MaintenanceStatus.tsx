import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function MaintenanceStatus() {
  const {
    maintenanceRequests,
    setMaintenanceRequests,
    hostelStaff,
    triggerNotification,
  } = useHostel();

  // Mock logged in staff member (e.g. Electrician)
  const loggedInStaffId = 'STF-101'; // Ramesh Singh, ELECTRICIAN
  const staffMember = hostelStaff.find(s => s.id === loggedInStaffId);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [resolutionRemarks, setResolutionRemarks] = useState('');

  // Find requests assigned to the logged-in staff member
  const myTasks = maintenanceRequests.filter(
    m => m.assignedTo === loggedInStaffId
  );
  const selectedTask = myTasks.find(m => m.id === selectedRequestId);

  const handleUpdateStatus = (status: 'IN_PROGRESS' | 'RESOLVED') => {
    if (!selectedRequestId) return;

    if (status === 'RESOLVED' && !resolutionRemarks) {
      triggerNotification(
        'Please provide resolution remarks when resolving a task.',
        'error'
      );
      return;
    }

    setMaintenanceRequests(prev =>
      prev.map(m =>
        m.id === selectedRequestId
          ? {
              ...m,
              status,
              resolutionRemarks:
                status === 'RESOLVED' ? resolutionRemarks : m.resolutionRemarks,
            }
          : m
      )
    );

    triggerNotification(
      `Task marked as ${status.replace('_', ' ')}`,
      'success'
    );

    if (status === 'RESOLVED') {
      setSelectedRequestId(null);
      setResolutionRemarks('');
    }
  };

  return (
    <FormPage
      title="My Maintenance Tasks"
      description={`Manage and update the status of your assigned tasks. Logged in as: ${staffMember?.name || 'Unknown'}`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        { label: 'Maintenance', to: '/hostel-management/maintenance/requests' },
        { label: 'My Tasks' },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <FormCard title="Assigned Tasks" icon="handyman">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-2">Task ID</th>
                    <th className="p-2">Location</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Priority</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myTasks.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-slate-500"
                      >
                        You have no assigned tasks.
                      </td>
                    </tr>
                  )}
                  {myTasks.map(task => (
                    <tr
                      key={task.id}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-2 font-medium">{task.id}</td>
                      <td className="p-2">
                        {task.hostelId} - Room {task.roomId}
                      </td>
                      <td
                        className="p-2 max-w-xs truncate"
                        title={task.description}
                      >
                        {task.description}
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            task.priority === 'URGENT' ||
                            task.priority === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : task.priority === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            task.status === 'RESOLVED' ||
                            task.status === 'CLOSED'
                              ? 'bg-green-100 text-green-700'
                              : task.status === 'IN_PROGRESS'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-2">
                        {task.status !== 'RESOLVED' &&
                          task.status !== 'CLOSED' && (
                            <Button
                              label="Update"
                              variant={
                                selectedRequestId === task.id
                                  ? 'primary'
                                  : 'outlined'
                              }
                              onClick={() => {
                                setSelectedRequestId(task.id);
                                setResolutionRemarks(
                                  task.resolutionRemarks || ''
                                );
                              }}
                            />
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormCard>
        </div>

        {selectedTask &&
          (selectedTask.status === 'ASSIGNED' ||
            selectedTask.status === 'IN_PROGRESS') && (
            <div className="w-full lg:w-1/3">
              <FormCard title="Update Task Status" icon="update">
                <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="mb-2">
                    <span className="text-xs text-slate-500 block">
                      Description
                    </span>
                    <span className="font-semibold">
                      {selectedTask.description}
                    </span>
                  </div>
                </div>

                <div>
                  <TextBox
                    label="Resolution Remarks"
                    value={resolutionRemarks}
                    onChange={setResolutionRemarks}
                    placeholder="What was done to fix the issue?"
                  />

                  <div className="flex gap-2 mt-4">
                    {selectedTask.status === 'ASSIGNED' && (
                      <Button
                        label="Start Work (In Progress)"
                        variant="outlined"
                        onClick={() => handleUpdateStatus('IN_PROGRESS')}
                      />
                    )}
                    <Button
                      label="Mark as Resolved"
                      variant="primary"
                      onClick={() => handleUpdateStatus('RESOLVED')}
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
