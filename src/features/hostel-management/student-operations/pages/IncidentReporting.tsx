import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import OptionDropDown from '../../OptionDropDown';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { useHostel } from '../../context';

export default function IncidentReporting() {
  const { hostels, incidentReports, setIncidentReports, triggerNotification } =
    useHostel();

  const [hostelId, setHostelId] = useState('');
  const [incidentType, setIncidentType] = useState('OTHER');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const hostelOptions = hostels.map(h => ({ id: h.id, text: h.hostelName }));

  const handleSubmit = () => {
    if (!hostelId || !date || !time || !description) {
      triggerNotification('Please fill all mandatory fields', 'error');
      return;
    }

    const newIncident: HostelManagement.IncidentReport = {
      id: `IR-${Date.now()}`,
      hostelId,
      reportedBy: 'Admin (Mock)',
      title: 'New Incident',
      incidentType: incidentType as any,
      date,
      time,
      description,
      severity: 'MEDIUM',
      status: 'OPEN',
    };

    setIncidentReports([...incidentReports, newIncident]);
    triggerNotification(
      'Incident reported successfully. Authorities will investigate.',
      'success'
    );

    setHostelId('');
    setIncidentType('OTHER');
    setDate('');
    setTime('');
    setDescription('');
  };

  return (
    <FormPage
      title="Incident Reporting"
      description="Report a non-disciplinary incident (e.g. theft, fight, medical emergency) occurring in the hostel premises."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        {
          label: 'Operations',
          to: '/hostel-management/student-operations/gate-pass',
        },
        { label: 'Incident Reporting' },
      ]}
    >
      <FormCard title="Report an Incident" icon="report_problem">
        <FormGrid columns={2}>
          <OptionDropDown
            label="Select Hostel *"
            data={hostelOptions}
            value={hostelId}
            onChange={(v: any) => setHostelId(v)}
            textField="text"
            valueField="id"
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Incident Type *
            </label>
            <select
              value={incidentType}
              onChange={e => setIncidentType(e.target.value)}
              className="w-full border p-2 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            >
              <option value="THEFT">Theft</option>
              <option value="FIGHT">Fight / Altercation</option>
              <option value="DAMAGE">Property Damage</option>
              <option value="MEDICAL">Medical Emergency</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <TextBox
            label="Date of Incident *"
            type="date"
            value={date}
            onChange={setDate}
          />
          <TextBox
            label="Time of Incident *"
            type="time"
            value={time}
            onChange={setTime}
          />

          <div className="col-span-2">
            <TextBox
              label="Description of Incident *"
              value={description}
              onChange={setDescription}
              placeholder="Provide clear details of what occurred..."
            />
          </div>
        </FormGrid>

        <div className="flex gap-3 mt-4">
          <Button
            label="Submit Report"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>
      </FormCard>

      <div className="mt-8">
        <FormCard title="Reported Incidents" icon="history">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                  <th className="p-2">Report ID</th>
                  <th className="p-2">Date & Time</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {incidentReports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      No incidents reported.
                    </td>
                  </tr>
                )}
                {incidentReports.map(inc => (
                  <tr
                    key={inc.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">{inc.id}</td>
                    <td className="p-2">
                      {inc.date} {inc.time}
                    </td>
                    <td className="p-2 font-medium">{inc.incidentType}</td>
                    <td
                      className="p-2 max-w-xs truncate"
                      title={inc.description}
                    >
                      {inc.description}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          inc.status === 'OPEN'
                            ? 'bg-red-100 text-red-700'
                            : inc.status === 'INVESTIGATING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {inc.status}
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
