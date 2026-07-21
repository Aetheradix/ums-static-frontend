import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function DisciplinaryAction() {
  const {
    roomAllotments,
    disciplinaryActions,
    setDisciplinaryActions,
    triggerNotification,
  } = useHostel();

  const [studentId, setStudentId] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [severity, setSeverity] = useState('LOW');

  // We need to list active students to pick from
  const activeStudents = roomAllotments
    .filter(a => a.status === 'CHECKED_IN')
    .map(a => ({
      id: a.studentId,
      text: `${a.studentName} (${a.studentId}) - Room ${a.roomNumber}`,
    }));

  const handleSubmit = () => {
    if (!studentId || !incidentDate || !description || !actionTaken) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const student = roomAllotments.find(a => a.studentId === studentId);
    if (!student) return;

    const newAction: HostelManagement.DisciplinaryAction = {
      id: `DA-${Date.now()}`,
      hostelId: 'mock-hostel-1',
      studentId: studentId,
      studentName: student.studentName,
      incidentDate,
      description,
      actionTaken,
      severity: severity as any,
      reportedBy: 'System Admin',
      status: 'OPEN',
    };

    setDisciplinaryActions([...disciplinaryActions, newAction]);
    triggerNotification('Disciplinary record added successfully', 'success');

    setStudentId('');
    setIncidentDate('');
    setDescription('');
    setActionTaken('');
    setSeverity('LOW');
  };

  return (
    <FormPage
      title="Disciplinary Action"
      description="Record disciplinary actions against students for hostel rule violations"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Operations',
          to: '/hostel-management/student-operations/gate-pass',
        },
        { label: 'Disciplinary Action' },
      ]}
    >
      <FormCard title="Record New Action" icon="gavel">
        <FormGrid columns={2}>
          <OptionDropDown
            label="Select Student *"
            data={activeStudents}
            value={studentId}
            onChange={(v: any) => setStudentId(v)}
            textField="text"
            valueField="id"
          />
          <TextBox
            label="Incident Date *"
            type="date"
            value={incidentDate}
            onChange={setIncidentDate}
          />

          <div className="col-span-2">
            <TextBox
              label="Incident Description *"
              value={description}
              onChange={setDescription}
              placeholder="Describe what happened..."
            />
          </div>

          <div className="col-span-2">
            <TextBox
              label="Action Taken *"
              value={actionTaken}
              onChange={setActionTaken}
              placeholder="e.g. Warning letter issued, Fine imposed..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Severity *
            </label>
            <select
              value={severity}
              onChange={e => setSeverity(e.target.value)}
              className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </FormGrid>

        <div className="flex gap-3 mt-4">
          <Button
            label="Save Record"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="Disciplinary Log" icon="history">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Date</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Action Taken</th>
                  <th className="p-2">Severity</th>
                </tr>
              </thead>
              <tbody>
                {disciplinaryActions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      No disciplinary actions recorded.
                    </td>
                  </tr>
                )}
                {disciplinaryActions.map(da => (
                  <tr
                    key={da.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">{da.incidentDate}</td>
                    <td className="p-2 font-medium">{da.studentName}</td>
                    <td
                      className="p-2 max-w-xs truncate"
                      title={da.description}
                    >
                      {da.description}
                    </td>
                    <td className="p-2">{da.actionTaken}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          da.severity === 'HIGH'
                            ? 'bg-red-100 text-red-700'
                            : da.severity === 'MEDIUM'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {da.severity}
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
