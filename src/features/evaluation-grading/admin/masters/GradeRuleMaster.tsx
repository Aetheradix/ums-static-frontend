import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DropDownList, NumberBox } from 'shared/components/forms';

export default function GradeRuleMaster() {
  const [form, setForm] = useState({
    gradeGroup: '',
    fromMarks: undefined,
    toMarks: undefined,
    gradeLetter: '',
    gradePoint: undefined,
    resultStatus: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      gradeGroup: 'Mock gradeGroup 1',
      fromMarks: 10,
      toMarks: 10,
      gradeLetter: 'Mock gradeLetter 1',
      gradePoint: 'Mock gradePoint 1',
      resultStatus: 'Active',
    },
    {
      id: 2,
      gradeGroup: 'Mock gradeGroup 2',
      fromMarks: 20,
      toMarks: 20,
      gradeLetter: 'Mock gradeLetter 2',
      gradePoint: 'Mock gradePoint 2',
      resultStatus: 'Active',
    },
    {
      id: 3,
      gradeGroup: 'Mock gradeGroup 3',
      fromMarks: 30,
      toMarks: 30,
      gradeLetter: 'Mock gradeLetter 3',
      gradePoint: 'Mock gradePoint 3',
      resultStatus: 'Active',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      gradeGroup: '',
      fromMarks: undefined,
      toMarks: undefined,
      gradeLetter: '',
      gradePoint: undefined,
      resultStatus: '',
    });
  };

  const handleClear = () => {
    setForm({
      gradeGroup: '',
      fromMarks: undefined,
      toMarks: undefined,
      gradeLetter: '',
      gradePoint: undefined,
      resultStatus: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Grade Rule Master"
      description="Manage Grade Rule Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Grade Rule Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <DropDownList
            label="Grade Group"
            value={form.gradeGroup}
            onChange={v => handleChange('gradeGroup', v)}
            data={[
              { text: 'Undergraduate', value: 'UG' },
              { text: 'Postgraduate', value: 'PG' },
              { text: 'Diploma', value: 'DIP' },
              { text: 'Doctorate', value: 'PHD' },
            ]}
            placeholder="Select Group"
          />
          <NumberBox
            label="From Marks"
            value={form.fromMarks}
            onChange={v => handleChange('fromMarks', v)}
            placeholder="From Marks"
          />
          <NumberBox
            label="To Marks"
            value={form.toMarks}
            onChange={v => handleChange('toMarks', v)}
            placeholder="To Marks"
          />
          <DropDownList
            label="Grade Letter"
            value={form.gradeLetter}
            onChange={v => handleChange('gradeLetter', v)}
            data={[
              { text: 'O', value: 'O' },
              { text: 'A+', value: 'A+' },
              { text: 'A', value: 'A' },
              { text: 'B+', value: 'B+' },
              { text: 'B', value: 'B' },
              { text: 'C', value: 'C' },
              { text: 'P', value: 'P' },
              { text: 'F', value: 'F' },
            ]}
            placeholder="Select Letter"
          />
          <NumberBox
            label="Grade Point"
            value={form.gradePoint}
            onChange={v => handleChange('gradePoint', v)}
            placeholder="Enter Grade Point"
          />
          <DropDownList
            label="Result Status"
            value={form.resultStatus}
            onChange={v => handleChange('resultStatus', v)}
            data={[
              { text: 'Pass', value: 'pass' },
              { text: 'Fail', value: 'fail' },
              { text: 'Promoted', value: 'promoted' },
            ]}
            placeholder="Select Status"
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
          <Column field="gradeGroup" header="Grade Group" />
          <Column field="fromMarks" header="From Marks" />
          <Column field="toMarks" header="To Marks" />
          <Column field="gradeLetter" header="Grade Letter" />
          <Column field="gradePoint" header="Grade Point" />
          <Column field="resultStatus" header="Result Status" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
