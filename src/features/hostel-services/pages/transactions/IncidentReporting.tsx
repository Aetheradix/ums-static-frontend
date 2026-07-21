import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function IncidentReporting() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    studentName: '',
    incidentDescription: '',
    reportedBy: '',
    date: '',
    status: 'Under Investigation',
  });

  return (
    <FormPage
      title="Incident Reporting"
      description="Report and track major incidents or violations within the hostel premises."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Transactions',
          to: '/hostel-services/transactions/incident-reporting',
        },
        { label: 'Incident Reporting' },
      ]}
    >
      <FormCard title="Report Incident" icon="report">
        <FormGrid columns={3}>
          <TextBox
            label="Involved Student (Optional)"
            value={form.studentName}
            onChange={v => setForm({ ...form, studentName: v })}
          />
          <TextBox
            label="Reported By *"
            value={form.reportedBy}
            onChange={v => setForm({ ...form, reportedBy: v })}
          />
          <TextBox
            label="Date of Incident *"
            type="date"
            value={form.date}
            onChange={v => setForm({ ...form, date: v })}
          />

          <div className="col-span-3">
            <TextBox
              label="Incident Description *"
              value={form.incidentDescription}
              onChange={v => setForm({ ...form, incidentDescription: v })}
            />
          </div>
          <DropDownList
            label="Status"
            data={[
              { id: 'Under Investigation', text: 'Under Investigation' },
              { id: 'Closed', text: 'Closed' },
            ]}
            textField="text"
            valueField="id"
            value={form.status}
            onChange={v => setForm({ ...form, status: v as string })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button
            label="Report Incident"
            variant="primary"
            onClick={() => {}}
          />
          <Button label="Clear" variant="outlined" onClick={() => {}} />
        </div>
      </FormCard>

      <FormCard title="Incident Logs" icon="list">
        <GridPanel
          data={data.incidents}
          columns={[
            { field: 'date', header: 'Date' },
            { field: 'incidentDescription', header: 'Description' },
            { field: 'studentName', header: 'Involved Student' },
            { field: 'reportedBy', header: 'Reported By' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    item.status === 'Closed'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
