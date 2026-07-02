import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {
  TextBox,
  DropDownList,
  DatePicker,
  NumberBox,
} from 'shared/components/forms';

export default function MarksVerification() {
  const [form, setForm] = useState({
    student: '',
    subject: '',
    marks: undefined,
    verifiedBy: '',
    verifiedDate: undefined,
    status: '',
    remarks: undefined,
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      student: 'Mock student 1',
      subject: 'Mock subject 1',
      marks: 10,
      verifiedBy: 'Mock verifiedBy 1',
      verifiedDate: '01/01/2024',
      status: 'Active',
      remarks: 10,
    },
    {
      id: 2,
      student: 'Mock student 2',
      subject: 'Mock subject 2',
      marks: 20,
      verifiedBy: 'Mock verifiedBy 2',
      verifiedDate: '01/01/2024',
      status: 'Active',
      remarks: 20,
    },
    {
      id: 3,
      student: 'Mock student 3',
      subject: 'Mock subject 3',
      marks: 30,
      verifiedBy: 'Mock verifiedBy 3',
      verifiedDate: '01/01/2024',
      status: 'Active',
      remarks: 30,
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      student: '',
      subject: '',
      marks: undefined,
      verifiedBy: '',
      verifiedDate: undefined,
      status: '',
      remarks: undefined,
    });
  };

  const handleClear = () => {
    setForm({
      student: '',
      subject: '',
      marks: undefined,
      verifiedBy: '',
      verifiedDate: undefined,
      status: '',
      remarks: undefined,
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Marks Verification"
      description="Manage Marks Verification"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Marks Verification' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Student"
            value={form.student}
            onChange={(v: any) => handleChange('student', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Student"
          />
          <DropDownList
            label="Subject"
            value={form.subject}
            onChange={(v: any) => handleChange('subject', v)}
            data={[
              { text: 'Option 1', value: '1' },
              { text: 'Option 2', value: '2' },
            ]}
            placeholder="Select Subject"
          />
          <NumberBox
            label="Marks"
            value={form.marks}
            onChange={(v: any) => handleChange('marks', v)}
            placeholder="Enter Marks"
          />
          <TextBox
            label="Verified By"
            value={form.verifiedBy}
            onChange={(v: any) => handleChange('verifiedBy', v)}
            placeholder="Enter Verified By"
          />
          <DatePicker
            label="Verified Date"
            value={form.verifiedDate}
            onChange={(v: any) => handleChange('verifiedDate', v)}
            placeholder="Select Verified Date"
          />
          <DropDownList
            label="Status"
            value={form.status}
            onChange={(v: any) => handleChange('status', v)}
            data={[
              { text: 'Active', value: 'active' },
              { text: 'Inactive', value: 'inactive' },
            ]}
            placeholder="Select Status"
          />
          <NumberBox
            label="Remarks"
            value={form.remarks}
            onChange={(v: any) => handleChange('remarks', v)}
            placeholder="Enter Remarks"
          />
        </FormGrid>
        <FormActions onSave={handleSave} onReset={handleClear} />
      </FormCard>

      <FormCard title="Records List" className="mt-8">
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
          <Column field="marks" header="Marks" />
          <Column field="verifiedBy" header="Verified By" />
          <Column field="verifiedDate" header="Verified Date" />
          <Column field="status" header="Status" />
          <Column field="remarks" header="Remarks" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
