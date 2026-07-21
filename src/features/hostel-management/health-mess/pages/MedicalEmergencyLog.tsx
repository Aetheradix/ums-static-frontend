import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function MedicalEmergencyLog() {
  const {
    hostels,
    studentApplications,
    medicalEmergencies,
    setMedicalEmergencies,
    triggerNotification,
  } = useHostel();

  const [studentId, setStudentId] = useState('');
  const [hostelId, setHostelId] = useState('');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [hospitalReferred, setHospitalReferred] = useState(false);
  const [hospitalName, setHospitalName] = useState('');

  const activeStudents = studentApplications.filter(
    s => s.status === 'APPROVED'
  );
  const studentOptions = activeStudents.map(s => ({
    id: s.id,
    text: `${s.studentName} (${s.id})`,
  }));
  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));

  const handleSubmit = () => {
    if (!studentId || !hostelId || !description || !actionTaken) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const student = activeStudents.find(s => s.id === studentId);
    if (!student) return;

    const newLog: HostelManagement.MedicalEmergency = {
      id: `MED-${Date.now()}`,
      studentId,
      studentName: student?.studentName || 'Unknown',
      hostelId,
      reportedBy: 'Admin', // In a real app, logged-in user
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      description,
      actionTaken,
      hospitalReferred,
      hospitalName: hospitalReferred ? hospitalName : undefined,
      status: 'OPEN',
    };

    setMedicalEmergencies([newLog, ...medicalEmergencies]);
    triggerNotification('Medical emergency logged successfully.', 'success');

    setStudentId('');
    setDescription('');
    setActionTaken('');
    setHospitalReferred(false);
    setHospitalName('');
  };

  const handleResolve = (id: string) => {
    setMedicalEmergencies((prev: HostelManagement.MedicalEmergency[]) =>
      prev.map((m: HostelManagement.MedicalEmergency) =>
        m.id === id ? { ...m, status: 'RESOLVED' } : m
      )
    );
    triggerNotification('Emergency marked as resolved.', 'success');
  };

  return (
    <FormPage
      title="Medical Emergency Log"
      description="Record and track medical emergencies for hostel residents."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Health & Mess',
          to: '/hostel-management/health/emergency-log',
        },
        { label: 'Emergency Log' },
      ]}
    >
      <FormCard title="Log New Emergency" icon="medical_services">
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

          <div className="col-span-2">
            <TextBox
              label="Description of Emergency *"
              value={description}
              onChange={setDescription}
              placeholder="E.g., High fever, Injury"
            />
          </div>

          <div className="col-span-2">
            <TextBox
              label="Action Taken / First Aid *"
              value={actionTaken}
              onChange={setActionTaken}
              placeholder="E.g., Provided paracetamol, called ambulance"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={hospitalReferred}
                onChange={e => setHospitalReferred(e.target.checked)}
                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              Referred to Hospital?
            </label>
            {hospitalReferred && (
              <TextBox
                label="Hospital Name"
                value={hospitalName}
                onChange={setHospitalName}
                placeholder="Enter hospital name"
              />
            )}
          </div>
        </FormGrid>

        <div className="flex gap-3 mt-4">
          <Button
            label="Log Emergency"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="Emergency History" icon="history">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Date/Time</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Action Taken</th>
                  <th className="p-2">Hospital</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicalEmergencies.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-500">
                      No emergencies logged.
                    </td>
                  </tr>
                )}
                {medicalEmergencies.map(
                  (med: HostelManagement.MedicalEmergency) => (
                    <tr
                      key={med.id}
                      className="border-b border-slate-200 dark:border-slate-700"
                    >
                      <td className="p-2 whitespace-nowrap">
                        <div className="font-medium">{med.date}</div>
                        <div className="text-xs text-slate-500">{med.time}</div>
                      </td>
                      <td className="p-2 font-medium">
                        {med.studentName}
                        <div className="text-xs text-slate-500">
                          {med.studentId}
                        </div>
                      </td>
                      <td className="p-2 text-red-600 font-semibold">
                        {med.description}
                      </td>
                      <td className="p-2">{med.actionTaken}</td>
                      <td className="p-2">
                        {med.hospitalReferred ? med.hospitalName : '-'}
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            med.status === 'OPEN'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {med.status}
                        </span>
                      </td>
                      <td className="p-2">
                        {med.status === 'OPEN' && (
                          <Button
                            label="Resolve"
                            variant="outlined"
                            onClick={() => handleResolve(med.id)}
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
