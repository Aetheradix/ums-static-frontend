import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DropDownList, TextBox } from 'shared/components/forms';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function Revaluation() {
  const [form, setForm] = useState({
    student: '',
    subject: '',
    reason: '',
    status: 'Pending',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      student: 'John Doe',
      subject: 'CS101',
      reason: 'Marks calculation error',
      status: 'Pending',
    },
    {
      id: 2,
      student: 'Jane Smith',
      subject: 'CS102',
      reason: 'Recheck answer 4',
      status: 'Approved',
    },
    {
      id: 3,
      student: 'Alice Johnson',
      subject: 'CS101',
      reason: 'Missing marks for assignment',
      status: 'Rejected',
    },
  ]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.student || !form.subject) {
      alert('Please select Student and Subject!');
      return;
    }

    const newRecord = {
      id: records.length + 1,
      student: form.student,
      subject: form.subject,
      reason: form.reason,
      status: form.status || 'Pending',
    };

    setRecords([newRecord, ...records]);

    // Clear form after save
    setForm({
      student: '',
      subject: '',
      reason: '',
      status: 'Pending',
    });
  };

  const handleClear = () => {
    setForm({
      student: '',
      subject: '',
      reason: '',
      status: 'Pending',
    });
  };

  return (
    <FormPage
      title="Revaluation"
      description="Manage Revaluation Requests"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Revaluation' },
      ]}
    >
      <FormCard title="New Revaluation Request">
        <FormGrid columns={4}>
          <DropDownList
            label="Student"
            value={form.student}
            onChange={(v: any) => handleChange('student', v)}
            data={[
              { text: 'John Doe', value: 'John Doe' },
              { text: 'Jane Smith', value: 'Jane Smith' },
              { text: 'Alice Johnson', value: 'Alice Johnson' },
            ]}
            placeholder="Select Student"
          />
          <DropDownList
            label="Subject"
            value={form.subject}
            onChange={(v: any) => handleChange('subject', v)}
            data={[
              { text: 'CS101 (Data Structures)', value: 'CS101' },
              { text: 'CS102 (Database Systems)', value: 'CS102' },
            ]}
            placeholder="Select Subject"
          />
          <TextBox
            label="Reason"
            value={form.reason}
            onChange={(v: any) => handleChange('reason', v)}
            placeholder="Enter Reason"
          />
          <DropDownList
            label="Status"
            value={form.status}
            onChange={(v: any) => handleChange('status', v)}
            data={[
              { text: 'Pending', value: 'Pending' },
              { text: 'Approved', value: 'Approved' },
              { text: 'Rejected', value: 'Rejected' },
            ]}
            placeholder="Select Status"
          />
        </FormGrid>
        <FormActions onSave={handleSave} onReset={handleClear} />
      </FormCard>

      <FormCard title="Revaluation Requests List" className="mt-8">
        <DataTable
          value={records}
          stripedRows
          paginator
          rows={5}
          className="w-full"
        >
          <Column field="id" header="ID" />
          <Column field="student" header="Student" />
          <Column field="subject" header="Subject" />
          <Column field="reason" header="Reason" />
          <Column field="status" header="Status" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
