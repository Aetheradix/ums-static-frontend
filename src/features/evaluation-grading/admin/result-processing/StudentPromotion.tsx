import { useState } from 'react';
import {
  FormActions,
  FormPage,
  FormCard,
  FormGrid,
} from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TextBox, Checkbox } from 'shared/components/forms';

export default function StudentPromotion() {
  const [form, setForm] = useState({
    currentSemester: '',
    nextSemester: '',
    promote: false,
    hold: false,
    detain: false,
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      currentSemester: 'Mock currentSemester 1',
      nextSemester: 'Mock nextSemester 1',
      promote: true,
      hold: true,
      detain: true,
    },
    {
      id: 2,
      currentSemester: 'Mock currentSemester 2',
      nextSemester: 'Mock nextSemester 2',
      promote: true,
      hold: true,
      detain: true,
    },
    {
      id: 3,
      currentSemester: 'Mock currentSemester 3',
      nextSemester: 'Mock nextSemester 3',
      promote: true,
      hold: true,
      detain: true,
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      currentSemester: '',
      nextSemester: '',
      promote: false,
      hold: false,
      detain: false,
    });
  };

  const handleClear = () => {
    setForm({
      currentSemester: '',
      nextSemester: '',
      promote: false,
      hold: false,
      detain: false,
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Student Promotion"
      description="Manage Student Promotion"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Student Promotion' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Current Semester"
            value={form.currentSemester}
            onChange={(v: any) => handleChange('currentSemester', v)}
            placeholder="Enter Current Semester"
          />
          <TextBox
            label="Next Semester"
            value={form.nextSemester}
            onChange={(v: any) => handleChange('nextSemester', v)}
            placeholder="Enter Next Semester"
          />
          <div className="flex items-center pt-6">
            <Checkbox
              label="Promote"
              checked={Boolean(form.promote)}
              onChange={(e: any) => handleChange('promote', e.target.checked)}
            />
          </div>
          <div className="flex items-center pt-6">
            <Checkbox
              label="Hold"
              checked={Boolean(form.hold)}
              onChange={(e: any) => handleChange('hold', e.target.checked)}
            />
          </div>
          <div className="flex items-center pt-6">
            <Checkbox
              label="Detain"
              checked={Boolean(form.detain)}
              onChange={(e: any) => handleChange('detain', e.target.checked)}
            />
          </div>
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
          <Column field="currentSemester" header="Current Semester" />
          <Column field="nextSemester" header="Next Semester" />
          <Column field="promote" header="Promote" />
          <Column field="hold" header="Hold" />
          <Column field="detain" header="Detain" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
