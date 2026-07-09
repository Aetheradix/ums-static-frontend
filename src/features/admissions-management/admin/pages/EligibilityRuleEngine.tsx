import { useState } from 'react';
import {
  FormPage,
  FormCard,
  StatusBadge,
  GridPanel,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
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

  const statusTemplate = (rowData: EligibilityRule) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Active' ? 'success' : 'danger'}
      />
    );
  };

  const subjectsTemplate = (rowData: EligibilityRule) => {
    return rowData.requiredSubjects?.length ? (
      <div className="flex flex-wrap gap-1">
        {rowData.requiredSubjects.map(sub => (
          <StatusBadge key={sub} label={sub} variant="info" />
        ))}
      </div>
    ) : (
      <span>None</span>
    );
  };

  // Footer is now inline in Modal
  const toolbar = (
    <Button label="New Rule" icon="pi pi-plus" onClick={openNew} />
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
        <GridPanel
          data={rules}
          searchBox={true}
          searchFields={['program', 'entranceExam', 'status']}
          toolbar={toolbar}
          onEdit={(rowData: EligibilityRule) => {
            setEditingRule({ ...rowData });
            setShowDialog(true);
          }}
          onRemove={(rowData: EligibilityRule) => {
            setRules(rules.filter(r => r.id !== rowData.id));
            ToastService.success('Rule removed successfully.');
          }}
          columns={[
            { field: 'program', header: 'Program', sortable: true },
            {
              field: 'minPercentage',
              header: 'Min. Percentage',
              cell: row => <span>{row.minPercentage}%</span>,
              sortable: true,
            },
            {
              field: 'requiredSubjects',
              header: 'Compulsory Subjects',
              cell: subjectsTemplate,
            },
            { field: 'entranceExam', header: 'Required Exam', sortable: true },
            {
              field: 'status',
              header: 'Status',
              cell: statusTemplate,
              sortable: true,
            },
          ]}
        />
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
              variant="outlined"
              onClick={hideDialog}
            />
            <Button
              label="Save Rule"
              icon="pi pi-check"
              variant="primary"
              onClick={saveRule}
              disabled={!editingRule?.program || !editingRule?.minPercentage}
            />
          </div>
        </div>
      </Modal>
    </FormPage>
  );
}
