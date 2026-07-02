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
  NumberBox,
  Checkbox,
  TextArea,
} from 'shared/components/forms';

export default function AssessmentTypeMaster() {
  const [form, setForm] = useState({
    assessmentCode: '',
    assessmentName: '',
    assessmentCategory: '',
    theory: false,
    practical: false,
    viva: false,
    assignment: false,
    attendance: false,
    project: false,
    seminar: false,
    isAggregate: false,
    displayOrder: undefined,
    status: '',
    description: '',
  });

  const [records, setRecords] = useState<any[]>([
    {
      id: 1,
      assessmentCode: 'Mock assessmentCode 1',
      assessmentName: 'Mock assessmentName 1',
      assessmentCategory: 'Mock assessmentCategory 1',
      theory: true,
      practical: true,
      viva: true,
      assignment: true,
      attendance: true,
      project: true,
      seminar: true,
      isAggregate: true,
      displayOrder: 10,
      status: 'Active',
      description: 'Mock description 1',
    },
    {
      id: 2,
      assessmentCode: 'Mock assessmentCode 2',
      assessmentName: 'Mock assessmentName 2',
      assessmentCategory: 'Mock assessmentCategory 2',
      theory: true,
      practical: true,
      viva: true,
      assignment: true,
      attendance: true,
      project: true,
      seminar: true,
      isAggregate: true,
      displayOrder: 20,
      status: 'Active',
      description: 'Mock description 2',
    },
    {
      id: 3,
      assessmentCode: 'Mock assessmentCode 3',
      assessmentName: 'Mock assessmentName 3',
      assessmentCategory: 'Mock assessmentCategory 3',
      theory: true,
      practical: true,
      viva: true,
      assignment: true,
      attendance: true,
      project: true,
      seminar: true,
      isAggregate: true,
      displayOrder: 30,
      status: 'Active',
      description: 'Mock description 3',
    },
  ]);

  const handleSave = () => {
    const newRecord = { id: records.length + 1, ...form };
    setRecords([newRecord, ...records]);
    setForm({
      assessmentCode: '',
      assessmentName: '',
      assessmentCategory: '',
      theory: false,
      practical: false,
      viva: false,
      assignment: false,
      attendance: false,
      project: false,
      seminar: false,
      isAggregate: false,
      displayOrder: undefined,
      status: '',
      description: '',
    });
  };

  const handleClear = () => {
    setForm({
      assessmentCode: '',
      assessmentName: '',
      assessmentCategory: '',
      theory: false,
      practical: false,
      viva: false,
      assignment: false,
      attendance: false,
      project: false,
      seminar: false,
      isAggregate: false,
      displayOrder: undefined,
      status: '',
      description: '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormPage
      title="Assessment Type Master"
      description="Manage Assessment Type Master"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Evaluation & Grading', to: '/evaluation-grading' },
        { label: 'Assessment Type Master' },
      ]}
    >
      <FormCard title="Details">
        <FormGrid columns={4}>
          <TextBox
            label="Assessment Code"
            value={form.assessmentCode}
            onChange={v => handleChange('assessmentCode', v)}
            placeholder="Enter Assessment Code"
          />
          <TextBox
            label="Assessment Name"
            value={form.assessmentName}
            onChange={v => handleChange('assessmentName', v)}
            placeholder="Enter Assessment Name"
          />
          <DropDownList
            label="Assessment Category"
            value={form.assessmentCategory}
            onChange={v => handleChange('assessmentCategory', v)}
            data={[
              { text: 'Internal', value: 'internal' },
              { text: 'External', value: 'external' },
              { text: 'Practical', value: 'practical' },
              { text: 'Seminar', value: 'seminar' },
            ]}
            placeholder="Select Category"
          />
          <NumberBox
            label="Display Order"
            value={form.displayOrder}
            onChange={v => handleChange('displayOrder', v)}
            placeholder="Enter Display Order"
          />
          <DropDownList
            label="Status"
            value={form.status}
            onChange={v => handleChange('status', v)}
            data={[
              { text: 'Active', value: 'active' },
              { text: 'Inactive', value: 'inactive' },
            ]}
            placeholder="Select Status"
          />
          <div className="col-span-4 lg:col-span-3">
            <TextArea
              label="Description"
              value={form.description}
              onChange={(v: any) => handleChange('description', v)}
              placeholder="Enter Description"
            />
          </div>

          {/* Boolean fields as checkboxes */}
          <div className="col-span-4 grid grid-cols-4 lg:grid-cols-8 gap-4 pt-4">
            <div className="flex items-center">
              <Checkbox
                label="Theory"
                checked={Boolean(form.theory)}
                onChange={(e: any) => handleChange('theory', e.target.checked)}
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                label="Practical"
                checked={Boolean(form.practical)}
                onChange={(e: any) =>
                  handleChange('practical', e.target.checked)
                }
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                label="Viva"
                checked={Boolean(form.viva)}
                onChange={(e: any) => handleChange('viva', e.target.checked)}
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                label="Assignment"
                checked={Boolean(form.assignment)}
                onChange={(e: any) =>
                  handleChange('assignment', e.target.checked)
                }
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                label="Attendance"
                checked={Boolean(form.attendance)}
                onChange={(e: any) =>
                  handleChange('attendance', e.target.checked)
                }
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                label="Project"
                checked={Boolean(form.project)}
                onChange={(e: any) => handleChange('project', e.target.checked)}
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                label="Seminar"
                checked={Boolean(form.seminar)}
                onChange={(e: any) => handleChange('seminar', e.target.checked)}
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                label="Is Aggregate"
                checked={Boolean(form.isAggregate)}
                onChange={(e: any) =>
                  handleChange('isAggregate', e.target.checked)
                }
              />
            </div>
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
          <Column field="assessmentCode" header="Assessment Code" />
          <Column field="assessmentName" header="Assessment Name" />
          <Column field="assessmentCategory" header="Assessment Category" />
          <Column field="theory" header="Theory" />
          <Column field="practical" header="Practical" />
          <Column field="viva" header="Viva" />
          <Column field="assignment" header="Assignment" />
          <Column field="attendance" header="Attendance" />
          <Column field="project" header="Project" />
          <Column field="seminar" header="Seminar" />
          <Column field="isAggregate" header="Is Aggregate" />
          <Column field="displayOrder" header="Display Order" />
          <Column field="status" header="Status" />
          <Column field="description" header="Description" />
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
