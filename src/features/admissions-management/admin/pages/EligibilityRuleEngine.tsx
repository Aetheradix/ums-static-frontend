import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { FormPage, FormCard } from 'shared/new-components';
import { Modal } from 'shared/components/popups';
import {
  DropDownList,
  MultiSelectList,
  NumberBox,
} from 'shared/components/forms';
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

  // Footer is now inline in Modal
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

      <Modal
        visible={showDialog}
        size="medium"
        header={editingRule?.id ? 'Edit Eligibility Rule' : 'Create New Rule'}
        onHide={hideDialog}
      >
        <div className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <DropDownList
                label="Program *"
                value={editingRule?.program || null}
                data={mockPrograms}
                textField="label"
                valueField="value"
                onChange={(v: any) =>
                  setEditingRule({ ...editingRule, program: v })
                }
                defaultOptionText="Select Program"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <NumberBox
                label="Minimum Qualifying Percentage (%) *"
                value={editingRule?.minPercentage}
                onChange={v =>
                  setEditingRule({ ...editingRule, minPercentage: Number(v) })
                }
                placeholder="e.g. 60"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <MultiSelectList
                label="Compulsory Subjects in 10+2 / UG"
                value={editingRule?.requiredSubjects as any}
                data={mockSubjects as any}
                textField="label"
                onChange={(v: any) => {
                  setEditingRule({ ...editingRule, requiredSubjects: v });
                }}
              />
            </div>

            <div className="col-span-1">
              <DropDownList
                label="Entrance Exam Required"
                value={editingRule?.entranceExam || null}
                data={mockExams}
                textField="label"
                valueField="value"
                onChange={(v: any) =>
                  setEditingRule({ ...editingRule, entranceExam: v })
                }
                defaultOptionText="Select Exam"
              />
            </div>

            <div className="col-span-1">
              <DropDownList
                label="Status"
                value={editingRule?.status || 'Active'}
                data={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                ]}
                textField="label"
                valueField="value"
                onChange={(v: any) =>
                  setEditingRule({
                    ...editingRule,
                    status: v as 'Active' | 'Inactive',
                  })
                }
                defaultOptionText="Select Status"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
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
        </div>
      </Modal>
    </FormPage>
  );
}
