import { useState } from 'react';
import { useHostelContext } from '../../context/HostelContext';
import { FormPage, FormCard, FormGrid, GridPanel } from 'shared/new-components';
import { TextBox } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';

export default function VisitorLog() {
  const { data } = useHostelContext();
  const [form, setForm] = useState({
    visitorName: '',
    studentVisited: '',
    relation: '',
    purpose: '',
    timeIn: '',
    timeOut: '',
    idProofType: '',
  });

  return (
    <FormPage
      title="Visitor Entry/Exit Log"
      description="Register visitors for students in the hostel."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Services', to: '/hostel-services' },
        {
          label: 'Transactions',
          to: '/hostel-services/transactions/visitor-log',
        },
        { label: 'Visitor Log' },
      ]}
    >
      <FormCard title="New Visitor Entry" icon="badge">
        <FormGrid columns={4}>
          <TextBox
            label="Visitor Name *"
            value={form.visitorName}
            onChange={v => setForm({ ...form, visitorName: v })}
          />
          <TextBox
            label="Student Visited *"
            value={form.studentVisited}
            onChange={v => setForm({ ...form, studentVisited: v })}
          />
          <TextBox
            label="Relation"
            value={form.relation}
            onChange={v => setForm({ ...form, relation: v })}
            placeholder="e.g. Father, Mother"
          />
          <TextBox
            label="Purpose"
            value={form.purpose}
            onChange={v => setForm({ ...form, purpose: v })}
          />

          <TextBox
            label="ID Proof Type"
            value={form.idProofType}
            onChange={v => setForm({ ...form, idProofType: v })}
            placeholder="e.g. Aadhar, Driving License"
          />
          <TextBox
            label="Time-In"
            type="time"
            value={form.timeIn}
            onChange={v => setForm({ ...form, timeIn: v })}
          />
          <TextBox
            label="Time-Out"
            type="time"
            value={form.timeOut}
            onChange={v => setForm({ ...form, timeOut: v })}
          />
        </FormGrid>
        <div className="mt-4 flex gap-3">
          <Button label="Save Entry" variant="primary" onClick={() => {}} />
          <Button label="Clear" variant="outlined" onClick={() => {}} />
        </div>
      </FormCard>

      <FormCard title="Visitor Logs" icon="list">
        <GridPanel
          data={data.visitorLogs}
          columns={[
            { field: 'visitorName', header: 'Visitor Name' },
            { field: 'studentVisited', header: 'Student Visited' },
            { field: 'relation', header: 'Relation' },
            { field: 'purpose', header: 'Purpose' },
            { field: 'idProofType', header: 'ID Proof' },
            { field: 'timeIn', header: 'Time In' },
            { field: 'timeOut', header: 'Time Out' },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
