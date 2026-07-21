import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function FirstAidManagement() {
  const {
    hostels,
    studentApplications,
    firstAidLogs,
    setFirstAidLogs,
    triggerNotification,
  } = useHostel();

  const [hostelId, setHostelId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [treatmentGiven, setTreatmentGiven] = useState('');

  const activeStudents = studentApplications.filter(
    s => s.status === 'APPROVED'
  );
  const studentOptions = activeStudents.map(s => ({
    id: s.id,
    text: `${s.studentName} (${s.id})`,
  }));
  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));

  const handleSubmit = () => {
    if (!hostelId || !studentId || !treatmentGiven) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const student = activeStudents.find(s => s.id === studentId);
    if (!student) return;

    const newLog: HostelManagement.FirstAidLog = {
      id: `FAL-${Date.now()}`,
      hostelId,
      date: new Date().toISOString().split('T')[0],
      studentId,
      studentName: student?.studentName || 'Unknown',
      treatmentGiven,
      administeredBy: 'Admin', // Should be logged in staff ID
    };

    setFirstAidLogs([newLog, ...firstAidLogs]);
    triggerNotification('First aid logged successfully.', 'success');

    setStudentId('');
    setTreatmentGiven('');
  };

  return (
    <FormPage
      title="First Aid Management"
      description="Maintain a log of first aid treatments administered to students."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Health & Mess',
          to: '/hostel-management/health/emergency-log',
        },
        { label: 'First Aid Logs' },
      ]}
    >
      <FormCard title="Log First Aid Treatment" icon="healing">
        <FormGrid columns={2}>
          <OptionDropDown
            label="Select Hostel *"
            data={hostelOptions}
            value={hostelId}
            onChange={(v: any) => setHostelId(v)}
            textField="text"
            valueField="id"
          />
          <OptionDropDown
            label="Select Student *"
            data={studentOptions}
            value={studentId}
            onChange={(v: any) => setStudentId(v)}
            textField="text"
            valueField="id"
          />

          <div className="col-span-2">
            <TextBox
              label="Treatment / Item Given *"
              value={treatmentGiven}
              onChange={setTreatmentGiven}
              placeholder="E.g., Bandage, Antiseptic cream, Painkiller"
            />
          </div>
        </FormGrid>

        <div className="flex gap-3 mt-4">
          <Button label="Save Log" variant="primary" onClick={handleSubmit} />
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="Recent First Aid Logs" icon="history">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Date</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Treatment Given</th>
                  <th className="p-2">Administered By</th>
                </tr>
              </thead>
              <tbody>
                {firstAidLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-500">
                      No first aid logs recorded.
                    </td>
                  </tr>
                )}
                {firstAidLogs.map((log: HostelManagement.FirstAidLog) => (
                  <tr
                    key={log.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2 font-medium">{log.date}</td>
                    <td className="p-2">
                      <div className="font-medium">{log.studentName}</div>
                      <div className="text-xs text-slate-500">
                        {log.studentId}
                      </div>
                    </td>
                    <td className="p-2">{log.treatmentGiven}</td>
                    <td className="p-2 text-slate-500">{log.administeredBy}</td>
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
