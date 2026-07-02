import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { FormPage, FormCard } from 'shared/new-components';
import { ToastService } from 'services';

interface MeritRule {
  id: string;
  name: string;
  programCode: string;
  academicWeightage: number;
  entranceWeightage: number;
  interviewWeightage: number;
  status: 'Active' | 'Inactive';
}

const mockRules: MeritRule[] = [
  {
    id: 'MR-01',
    name: 'B.Tech Standard Admission',
    programCode: 'BTECH-CSE',
    academicWeightage: 60,
    entranceWeightage: 40,
    interviewWeightage: 0,
    status: 'Active',
  },
  {
    id: 'MR-02',
    name: 'MBA Holistic Selection',
    programCode: 'MBA-FIN',
    academicWeightage: 40,
    entranceWeightage: 30,
    interviewWeightage: 30,
    status: 'Active',
  },
];

export default function MeritRuleConfig() {
  const [rules, setRules] = useState<MeritRule[]>(mockRules);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Partial<MeritRule>>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const statusTemplate = (rowData: MeritRule) => {
    return (
      <Tag
        value={rowData.status}
        severity={rowData.status === 'Active' ? 'success' : 'danger'}
      />
    );
  };

  const actionTemplate = (rowData: MeritRule) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        aria-label="Edit"
        tooltip="Edit Rule"
        onClick={() => {
          setSelectedRule({ ...rowData });
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

  const handleSave = () => {
    if (selectedRule.id) {
      setRules(
        rules.map(r =>
          r.id === selectedRule.id
            ? ({ ...r, ...selectedRule } as MeritRule)
            : r
        )
      );
      ToastService.success('Rule updated successfully.');
    } else {
      const newRule: MeritRule = {
        ...(selectedRule as MeritRule),
        id: `MR-0${Math.floor(Math.random() * 10) + 3}`,
        status: selectedRule.status || 'Active',
      };
      setRules([newRule, ...rules]);
      ToastService.success('Rule created successfully.');
    }
    setShowDialog(false);
    setSelectedRule({});
  };

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search merit rules..."
          className="w-full md:w-80"
          onChange={e => setGlobalFilter(e.target.value)}
        />
      </span>
      <Button
        label="New Rule"
        icon="pi pi-plus"
        onClick={() => {
          setSelectedRule({
            academicWeightage: 50,
            entranceWeightage: 50,
            interviewWeightage: 0,
          });
          setShowDialog(true);
        }}
      />
    </div>
  );

  const totalWeightage =
    (selectedRule.academicWeightage || 0) +
    (selectedRule.entranceWeightage || 0) +
    (selectedRule.interviewWeightage || 0);

  const dialogFooter = (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        severity="secondary"
        onClick={() => setShowDialog(false)}
      />
      <Button
        label="Save Rule"
        icon="pi pi-check"
        onClick={handleSave}
        disabled={totalWeightage !== 100}
        autoFocus
      />
    </div>
  );

  return (
    <FormPage
      title="Merit Rule Config"
      description="Define weightage rules for generating program-wise admission merit lists"
    >
      <FormCard>
        <DataTable
          value={rules}
          paginator
          rows={10}
          header={header}
          globalFilter={globalFilter}
          emptyMessage="No merit rules found."
          stripedRows
          rowHover
          className="p-datatable-sm"
        >
          <Column
            field="name"
            header="Rule Name"
            sortable
            className="font-semibold text-gray-800"
          ></Column>
          <Column field="programCode" header="Program" sortable></Column>
          <Column
            field="academicWeightage"
            header="Academic %"
            sortable
          ></Column>
          <Column
            field="entranceWeightage"
            header="Entrance %"
            sortable
          ></Column>
          <Column
            field="interviewWeightage"
            header="Interview %"
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
        style={{ width: '90vw', maxWidth: '600px' }}
        header={selectedRule.id ? 'Edit Merit Rule' : 'New Merit Rule'}
        modal
        className="p-fluid"
        onHide={() => setShowDialog(false)}
        footer={dialogFooter}
      >
        <div className="grid grid-cols-1 gap-6 mt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-bold text-gray-700">
              Rule Name <span className="text-red-500">*</span>
            </label>
            <InputText
              id="name"
              value={selectedRule.name || ''}
              onChange={e =>
                setSelectedRule({ ...selectedRule, name: e.target.value })
              }
              placeholder="e.g. B.Tech Standard Admission"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="programCode" className="font-bold text-gray-700">
              Applies To Program <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="programCode"
              value={selectedRule.programCode}
              options={[
                { label: 'BTECH-CSE', value: 'BTECH-CSE' },
                { label: 'MBA-FIN', value: 'MBA-FIN' },
                { label: 'PHD-PHY', value: 'PHD-PHY' },
              ]}
              onChange={e =>
                setSelectedRule({ ...selectedRule, programCode: e.value })
              }
              placeholder="Select Program"
            />
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">
              Weightage Distribution (Must equal 100%)
            </h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label
                  htmlFor="academic"
                  className="text-sm font-bold text-gray-600"
                >
                  Past Academics
                </label>
                <InputNumber
                  id="academic"
                  value={selectedRule.academicWeightage || 0}
                  onValueChange={e =>
                    setSelectedRule({
                      ...selectedRule,
                      academicWeightage: e.value as number,
                    })
                  }
                  min={0}
                  max={100}
                  suffix=" %"
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label
                  htmlFor="entrance"
                  className="text-sm font-bold text-gray-600"
                >
                  Entrance Test
                </label>
                <InputNumber
                  id="entrance"
                  value={selectedRule.entranceWeightage || 0}
                  onValueChange={e =>
                    setSelectedRule({
                      ...selectedRule,
                      entranceWeightage: e.value as number,
                    })
                  }
                  min={0}
                  max={100}
                  suffix=" %"
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label
                  htmlFor="interview"
                  className="text-sm font-bold text-gray-600"
                >
                  Interview
                </label>
                <InputNumber
                  id="interview"
                  value={selectedRule.interviewWeightage || 0}
                  onValueChange={e =>
                    setSelectedRule({
                      ...selectedRule,
                      interviewWeightage: e.value as number,
                    })
                  }
                  min={0}
                  max={100}
                  suffix=" %"
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-700">Total Weightage:</span>
                <span
                  className={`px-2 py-1 rounded ${totalWeightage === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {totalWeightage}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="font-bold text-gray-700">
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
              placeholder="Select Current Status"
            />
          </div>
        </div>
      </Dialog>
    </FormPage>
  );
}
