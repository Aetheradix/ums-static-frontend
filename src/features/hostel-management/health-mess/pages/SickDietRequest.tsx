import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function SickDietRequest() {
  const {
    hostels,
    studentApplications,
    sickDietRequests,
    setSickDietRequests,
    triggerNotification,
  } = useHostel();

  const [studentId, setStudentId] = useState('');
  const [hostelId, setHostelId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dietRequirements, setDietRequirements] = useState('');

  const activeStudents = studentApplications.filter(
    s => s.status === 'APPROVED'
  );
  const studentOptions = activeStudents.map(s => ({
    id: s.id,
    text: `${s.studentName} (${s.id})`,
  }));
  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));

  const handleSubmit = () => {
    if (
      !studentId ||
      !hostelId ||
      !startDate ||
      !endDate ||
      !dietRequirements
    ) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const student = activeStudents.find(s => s.id === studentId);
    if (!student) return;

    const newRequest: HostelManagement.SickDietRequest = {
      id: `SDR-${Date.now()}`,
      studentId,
      studentName: student?.studentName || 'Unknown',
      hostelId,
      startDate,
      endDate,
      dietRequirements,
      status: 'PENDING',
    };

    setSickDietRequests([newRequest, ...sickDietRequests]);
    triggerNotification('Sick diet request submitted successfully.', 'success');

    setStudentId('');
    setStartDate('');
    setEndDate('');
    setDietRequirements('');
  };

  const handleUpdateStatus = (
    id: string,
    status: 'APPROVED' | 'REJECTED' | 'COMPLETED'
  ) => {
    setSickDietRequests((prev: HostelManagement.SickDietRequest[]) =>
      prev.map((r: HostelManagement.SickDietRequest) =>
        r.id === id
          ? {
              ...r,
              status,
              approvedBy: status === 'APPROVED' ? 'Warden' : r.approvedBy,
            }
          : r
      )
    );
    triggerNotification(`Request marked as ${status}.`, 'success');
  };

  return (
    <FormPage
      title="Sick Diet Requests"
      description="Manage special dietary requirements for students who are unwell."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Health & Mess',
          to: '/hostel-management/health/emergency-log',
        },
        { label: 'Sick Diet' },
      ]}
    >
      <FormCard title="New Sick Diet Request" icon="local_dining">
        <FormGrid columns={2}>
          <OptionDropDown
            label="Select Student *"
            data={studentOptions}
            value={studentId}
            onChange={(v: any) => setStudentId(v)}
            textField="text"
            valueField="id"
          />
          <OptionDropDown
            label="Select Hostel *"
            data={hostelOptions}
            value={hostelId}
            onChange={(v: any) => setHostelId(v)}
            textField="text"
            valueField="id"
          />

          <TextBox
            label="Start Date *"
            type="date"
            value={startDate}
            onChange={setStartDate}
          />
          <TextBox
            label="End Date *"
            type="date"
            value={endDate}
            onChange={setEndDate}
          />

          <div className="col-span-2">
            <TextBox
              label="Diet Requirements *"
              value={dietRequirements}
              onChange={setDietRequirements}
              placeholder="E.g., Khichdi, Boiled vegetables, Soup only"
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
        <FormCard title="Sick Diet Requests" icon="list_alt">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Request ID</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Duration</th>
                  <th className="p-2">Diet Requirements</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sickDietRequests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-500">
                      No sick diet requests found.
                    </td>
                  </tr>
                )}
                {sickDietRequests.map(
                  (req: HostelManagement.SickDietRequest) => (
                    <tr
                      key={req.id}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-2 font-medium">{req.id}</td>
                      <td className="p-2">
                        <div className="font-medium">{req.studentName}</div>
                        <div className="text-xs text-slate-500">
                          {req.studentId}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-xs">From: {req.startDate}</div>
                        <div className="text-xs">To: {req.endDate}</div>
                      </td>
                      <td className="p-2">{req.dietRequirements}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            req.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : req.status === 'APPROVED'
                                ? 'bg-blue-100 text-blue-700'
                                : req.status === 'COMPLETED'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-2">
                        {req.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              label="Approve"
                              variant="outlined"
                              onClick={() =>
                                handleUpdateStatus(req.id, 'APPROVED')
                              }
                            />
                            <Button
                              label="Reject"
                              variant="outlined"
                              onClick={() =>
                                handleUpdateStatus(req.id, 'REJECTED')
                              }
                            />
                          </div>
                        )}
                        {req.status === 'APPROVED' && (
                          <Button
                            label="Mark Completed"
                            variant="outlined"
                            onClick={() =>
                              handleUpdateStatus(req.id, 'COMPLETED')
                            }
                          />
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
