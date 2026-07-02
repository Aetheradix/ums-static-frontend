import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { FormPage, FormCard } from 'shared/new-components';
import { admissionsUrls } from '../../urls';
import { ToastService } from 'services';

interface EligibilityRule {
  id: string;
  program: string;
  minPercentage: number;
  requiredSubjects: string[];
  entranceExam: string;
  status: 'Active' | 'Inactive';
}

const mockPrograms = [
  { label: 'B.Tech CSE', value: 'B.Tech CSE' },
  { label: 'B.Tech ECE', value: 'B.Tech ECE' },
  { label: 'MBA Finance', value: 'MBA Finance' },
  { label: 'B.Sc Physics', value: 'B.Sc Physics' },
];

const mockSubjects = [
  { label: 'Physics', value: 'Physics' },
  { label: 'Chemistry', value: 'Chemistry' },
  { label: 'Mathematics', value: 'Mathematics' },
  { label: 'Biology', value: 'Biology' },
  { label: 'English', value: 'English' },
];

const mockExams = [
  { label: 'JEE Main', value: 'JEE Main' },
  { label: 'CAT', value: 'CAT' },
  { label: 'State CET', value: 'State CET' },
  { label: 'None (Direct)', value: 'None' },
];

const mockRules: EligibilityRule[] = [
  {
    id: '1',
    program: 'B.Tech CSE',
    minPercentage: 60,
    requiredSubjects: ['Physics', 'Mathematics'],
    entranceExam: 'JEE Main',
    status: 'Active',
  },
  {
    id: '2',
    program: 'MBA Finance',
    minPercentage: 55,
    requiredSubjects: ['English'],
    entranceExam: 'CAT',
    status: 'Active',
  },
];

export default function EligibilityRuleEngine() {
  const [rules, setRules] = useState<EligibilityRule[]>(mockRules);
  const [showDialog, setShowDialog] = useState(false);
  const [editingRule, setEditingRule] =
    useState<Partial<EligibilityRule> | null>(null);

  const openNew = () => {
    setEditingRule({
      status: 'Active',
      requiredSubjects: [],
      entranceExam: 'None',
    });
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
    setEditingRule(null);
  };

  const saveRule = () => {
    if (editingRule?.program && editingRule?.minPercentage) {
      if (editingRule.id) {
        setRules(
          rules.map(r =>
            r.id === editingRule.id
              ? ({ ...r, ...editingRule } as EligibilityRule)
              : r
          )
        );
        ToastService.success('Eligibility rule updated successfully.');
      } else {
        const newRule = {
          ...editingRule,
          id: Math.random().toString(36).substr(2, 9),
        } as EligibilityRule;
        setRules([...rules, newRule]);
        ToastService.success('Eligibility rule created successfully.');
      }
      hideDialog();
    }
  };

  const actionTemplate = (rowData: EligibilityRule) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="info"
          aria-label="Edit"
          tooltip="Edit Rule"
          onClick={() => {
            setEditingRule({ ...rowData });
            setShowDialog(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          aria-label="Delete"
          tooltip="Delete Rule"
          onClick={() => {
            setRules(rules.filter(r => r.id !== rowData.id));
            ToastService.success('Rule removed successfully.');
          }}
        />
      </div>
    );
  };

  const statusTemplate = (rowData: EligibilityRule) => {
    return (
      <Tag
        value={rowData.status}
        severity={rowData.status === 'Active' ? 'success' : 'danger'}
      />
    );
  };

  const subjectsTemplate = (rowData: EligibilityRule) => {
    return rowData.requiredSubjects?.length ? (
      <div className="flex flex-wrap gap-1">
        {rowData.requiredSubjects.map(sub => (
          <Tag key={sub} value={sub} severity="info" />
        ))}
      </div>
    ) : (
      'None'
    );
  };

  const dialogFooter = (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        severity="secondary"
        onClick={hideDialog}
      />
      <Button
        label="Save Rule"
        icon="pi pi-check"
        onClick={saveRule}
        disabled={!editingRule?.program || !editingRule?.minPercentage}
        autoFocus
      />
    </div>
  );

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <h2 className="text-lg font-semibold text-gray-800 m-0">
        Eligibility Rules Configuration
      </h2>
      <Button label="New Rule" icon="pi pi-plus" onClick={openNew} />
    </div>
  );

  return (
    <FormPage
      title="Eligibility Rule Engine"
      description="Define academic and exam prerequisites for programs."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Admin', to: admissionsUrls.admin.dashboard },
        { label: 'Eligibility Rules' },
      ]}
    >
      <FormCard>
        <DataTable
          value={rules}
          paginator
          rows={10}
          dataKey="id"
          header={header}
          emptyMessage="No rules found."
          className="p-datatable-sm"
          stripedRows
          rowHover
        >
          <Column
            field="program"
            header="Program"
            sortable
            style={{ minWidth: '150px' }}
            className="font-semibold text-gray-800"
          ></Column>
          <Column
            field="minPercentage"
            header="Min. Percentage"
            body={row => `${row.minPercentage}%`}
            sortable
          ></Column>
          <Column
            field="requiredSubjects"
            header="Compulsory Subjects"
            body={subjectsTemplate}
          ></Column>
          <Column field="entranceExam" header="Required Exam" sortable></Column>
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            sortable
          ></Column>
          <Column
            body={actionTemplate}
            header="Actions"
            exportable={false}
            style={{ minWidth: '100px' }}
          ></Column>
        </DataTable>
      </FormCard>

      <Dialog
        visible={showDialog}
        style={{ width: '90vw', maxWidth: '600px' }}
        header={editingRule?.id ? 'Edit Eligibility Rule' : 'Create New Rule'}
        modal
        className="p-fluid"
        onHide={hideDialog}
        footer={dialogFooter}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
            <label htmlFor="program" className="font-bold text-gray-700">
              Program <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="program"
              value={editingRule?.program || null}
              options={mockPrograms}
              onChange={e =>
                setEditingRule({ ...editingRule, program: e.value })
              }
              placeholder="Select Program"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
            <label htmlFor="minPercentage" className="font-bold text-gray-700">
              Minimum Qualifying Percentage (%){' '}
              <span className="text-red-500">*</span>
            </label>
            <InputText
              id="minPercentage"
              type="number"
              step="1"
              value={editingRule?.minPercentage?.toString() || ''}
              onChange={e =>
                setEditingRule({
                  ...editingRule,
                  minPercentage: parseFloat(e.target.value),
                })
              }
              required
              placeholder="e.g. 60"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
            <label
              htmlFor="requiredSubjects"
              className="font-bold text-gray-700"
            >
              Compulsory Subjects in 10+2 / UG
            </label>
            <MultiSelect
              id="requiredSubjects"
              value={editingRule?.requiredSubjects || []}
              options={mockSubjects}
              onChange={e =>
                setEditingRule({ ...editingRule, requiredSubjects: e.value })
              }
              placeholder="Select Subjects"
              display="chip"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="entranceExam" className="font-bold text-gray-700">
              Entrance Exam Required
            </label>
            <Dropdown
              id="entranceExam"
              value={editingRule?.entranceExam || null}
              options={mockExams}
              onChange={e =>
                setEditingRule({ ...editingRule, entranceExam: e.value })
              }
              placeholder="Select Exam"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-2">
            <label htmlFor="status" className="font-bold text-gray-700">
              Status
            </label>
            <Dropdown
              id="status"
              value={editingRule?.status || 'Active'}
              options={['Active', 'Inactive']}
              onChange={e =>
                setEditingRule({
                  ...editingRule,
                  status: e.value as 'Active' | 'Inactive',
                })
              }
              placeholder="Select Status"
            />
          </div>
        </div>
      </Dialog>
    </FormPage>
  );
}
