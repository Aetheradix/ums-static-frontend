import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface CBCSRule {
  id: string;
  ruleName: string;
  programType: string;
  minCreditsSemester: number;
  maxCreditsSemester: number;
  allowOpenElectives: boolean;
  status: 'Active' | 'Inactive';
}

const mockRules: CBCSRule[] = [
  {
    id: 'CBCS-01',
    ruleName: 'B.Tech Standard Rule',
    programType: 'Undergraduate',
    minCreditsSemester: 16,
    maxCreditsSemester: 24,
    allowOpenElectives: true,
    status: 'Active',
  },
  {
    id: 'CBCS-02',
    ruleName: 'MBA Intensive',
    programType: 'Postgraduate',
    minCreditsSemester: 12,
    maxCreditsSemester: 18,
    allowOpenElectives: false,
    status: 'Active',
  },
];

export default function CBCSConfiguration() {
  const [rules, setRules] = useState<CBCSRule[]>(mockRules);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Partial<CBCSRule>>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const statusTemplate = (rowData: CBCSRule) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Active' ? 'approved' : 'neutral'}
      />
    );
  };

  const electivesTemplate = (rowData: CBCSRule) => {
    return rowData.allowOpenElectives ? (
      <i className="pi pi-check text-green-500 font-bold"></i>
    ) : (
      <i className="pi pi-times text-gray-400"></i>
    );
  };

  const actionTemplate = (rowData: CBCSRule) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        aria-label="Edit"
        onClick={() => {
          setSelectedRule({ ...rowData });
          setShowDialog(true);
        }}
      />
    </div>
  );

  const handleSave = () => {
    if (selectedRule.id) {
      setRules(
        rules.map(r =>
          r.id === selectedRule.id ? ({ ...r, ...selectedRule } as CBCSRule) : r
        )
      );
    } else {
      const newRule: CBCSRule = {
        ...(selectedRule as CBCSRule),
        id: `CBCS-0${Math.floor(Math.random() * 10) + 3}`,
        status: selectedRule.status || 'Active',
        allowOpenElectives: selectedRule.allowOpenElectives || false,
      };
      setRules([newRule, ...rules]);
    }
    setShowDialog(false);
    setSelectedRule({});
  };

  const header = (
    <div className="flex justify-between items-center">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search CBCS rules..."
          onChange={e => setGlobalFilter(e.target.value)}
        />
      </span>
      <Button
        label="New Rule"
        icon="pi pi-plus"
        onClick={() => {
          setSelectedRule({
            minCreditsSemester: 12,
            maxCreditsSemester: 24,
            allowOpenElectives: true,
          });
          setShowDialog(true);
        }}
      />
    </div>
  );

  return (
    <FormPage
      title="CBCS Configuration"
      description="Configure Choice Based Credit System rules and limits"
    >
      <FormCard>
        <DataTable
          value={rules}
          paginator
          rows={10}
          header={header}
          globalFilter={globalFilter}
          emptyMessage="No CBCS rules found."
        >
          <Column field="ruleName" header="Rule Name" sortable></Column>
          <Column field="programType" header="Program Level" sortable></Column>
          <Column
            field="minCreditsSemester"
            header="Min Credits / Sem"
            sortable
          ></Column>
          <Column
            field="maxCreditsSemester"
            header="Max Credits / Sem"
            sortable
          ></Column>
          <Column
            field="allowOpenElectives"
            header="Open Electives"
            body={electivesTemplate}
            sortable
          ></Column>
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
            style={{ minWidth: '8rem' }}
          ></Column>
        </DataTable>
      </FormCard>

      <Dialog
        visible={showDialog}
        style={{ width: '550px' }}
        header={selectedRule.id ? 'Edit CBCS Rule' : 'New CBCS Rule'}
        modal
        onHide={() => setShowDialog(false)}
      >
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="ruleName" className="font-semibold">
              Rule Name
            </label>
            <InputText
              id="ruleName"
              value={selectedRule.ruleName || ''}
              onChange={e =>
                setSelectedRule({ ...selectedRule, ruleName: e.target.value })
              }
              placeholder="e.g. B.Tech Standard Rule"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="programType" className="font-semibold">
              Applies To Level
            </label>
            <Dropdown
              id="programType"
              value={selectedRule.programType}
              options={[
                { label: 'Undergraduate', value: 'Undergraduate' },
                { label: 'Postgraduate', value: 'Postgraduate' },
                { label: 'Doctoral', value: 'Doctoral' },
              ]}
              onChange={e =>
                setSelectedRule({ ...selectedRule, programType: e.value })
              }
              placeholder="Select Level"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="minCredits" className="font-semibold">
                Min Credits / Semester
              </label>
              <InputNumber
                id="minCredits"
                value={selectedRule.minCreditsSemester || 0}
                onValueChange={e =>
                  setSelectedRule({
                    ...selectedRule,
                    minCreditsSemester: e.value as number,
                  })
                }
                min={0}
                max={50}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="maxCredits" className="font-bold text-gray-700">
                Max Credits <span className="text-red-500">*</span>
              </label>
              <InputNumber
                id="maxCredits"
                value={selectedRule.maxCreditsSemester || 0}
                onValueChange={e =>
                  setSelectedRule({
                    ...selectedRule,
                    maxCreditsSemester: e.value as number,
                  })
                }
                min={0}
                max={50}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              inputId="openElectives"
              checked={selectedRule.allowOpenElectives || false}
              onChange={e =>
                setSelectedRule({
                  ...selectedRule,
                  allowOpenElectives: e.checked || false,
                })
              }
            />
            <label
              htmlFor="openElectives"
              className="font-semibold cursor-pointer"
            >
              Allow students to pick Open Electives across departments
            </label>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label htmlFor="status" className="font-semibold">
              Status
            </label>
            <Dropdown
              id="status"
              value={selectedRule.status}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
              ]}
              onChange={e =>
                setSelectedRule({ ...selectedRule, status: e.value })
              }
              placeholder="Select Status"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            label="Cancel"
            icon="pi pi-times"
            outlined
            onClick={() => setShowDialog(false)}
          />
          <Button
            label="Save"
            icon="pi pi-check"
            onClick={handleSave}
            disabled={
              selectedRule.minCreditsSemester !== undefined &&
              selectedRule.maxCreditsSemester !== undefined &&
              selectedRule.minCreditsSemester > selectedRule.maxCreditsSemester
            }
          />
        </div>
      </Dialog>
    </FormPage>
  );
}
