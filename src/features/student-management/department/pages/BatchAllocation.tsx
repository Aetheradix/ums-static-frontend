import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';

interface BatchAllocation {
  id: string;
  sectionCode: string;
  batchName: string;
  batchType: 'Practical' | 'Tutorial' | 'Project';
  mappedSubjects: string[];
  maxCapacity: number;
  assignedStudents: number;
  status: 'Active' | 'Full';
}

const mockBatches: BatchAllocation[] = [
  {
    id: 'BATCH-01',
    sectionCode: 'BTECH-CSE-SEM1-A',
    batchName: 'B1',
    batchType: 'Practical',
    mappedSubjects: ['CS-101P'],
    maxCapacity: 30,
    assignedStudents: 30,
    status: 'Full',
  },
  {
    id: 'BATCH-02',
    sectionCode: 'BTECH-CSE-SEM1-A',
    batchName: 'B2',
    batchType: 'Practical',
    mappedSubjects: ['CS-101P'],
    maxCapacity: 30,
    assignedStudents: 25,
    status: 'Active',
  },
  {
    id: 'BATCH-03',
    sectionCode: 'BTECH-CSE-SEM1-A',
    batchName: 'T1',
    batchType: 'Tutorial',
    mappedSubjects: ['MA-101'],
    maxCapacity: 20,
    assignedStudents: 18,
    status: 'Active',
  },
];

export default function BatchAllocation() {
  const [batches, setBatches] = useState<BatchAllocation[]>(mockBatches);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Partial<BatchAllocation>>(
    {}
  );
  const [globalFilter, setGlobalFilter] = useState('');

  const statusTemplate = (rowData: BatchAllocation) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Active' ? 'approved' : 'pending'}
      />
    );
  };

  const typeTemplate = (rowData: BatchAllocation) => {
    const colorClass =
      rowData.batchType === 'Practical'
        ? 'text-blue-700 bg-blue-100 border-blue-200'
        : rowData.batchType === 'Tutorial'
          ? 'text-purple-700 bg-purple-100 border-purple-200'
          : 'text-green-700 bg-green-100 border-green-200';
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${colorClass}`}
      >
        {rowData.batchType}
      </span>
    );
  };

  const actionTemplate = (rowData: BatchAllocation) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        aria-label="Edit"
        tooltip="Edit Batch"
        tooltipOptions={{ position: 'top' }}
        onClick={() => {
          setSelectedBatch({ ...rowData });
          setShowDialog(true);
        }}
      />
      <Button
        icon="pi pi-users"
        rounded
        text
        severity="success"
        aria-label="Manage Students"
        tooltip="Manage Students"
        tooltipOptions={{ position: 'top' }}
      />
    </div>
  );

  const capacityTemplate = (rowData: BatchAllocation) => {
    const percentage = Math.round(
      (rowData.assignedStudents / rowData.maxCapacity) * 100
    );
    let color = 'bg-green-500';
    if (percentage > 80) color = 'bg-yellow-500';
    if (percentage >= 100) color = 'bg-red-500';

    return (
      <div className="flex flex-col gap-1 w-full max-w-[8rem]">
        <div className="flex justify-between text-xs font-medium text-gray-600">
          <span>
            {rowData.assignedStudents} / {rowData.maxCapacity}
          </span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const handleSave = () => {
    if (selectedBatch.id) {
      setBatches(
        batches.map(b =>
          b.id === selectedBatch.id
            ? ({ ...b, ...selectedBatch } as BatchAllocation)
            : b
        )
      );
    } else {
      const newBatch: BatchAllocation = {
        ...(selectedBatch as BatchAllocation),
        id: `BATCH-0${Math.floor(Math.random() * 10) + 3}`,
        assignedStudents: selectedBatch.assignedStudents || 0,
        status:
          selectedBatch.assignedStudents === selectedBatch.maxCapacity
            ? 'Full'
            : 'Active',
        mappedSubjects: selectedBatch.mappedSubjects || [],
      };
      setBatches([newBatch, ...batches]);
    }
    setShowDialog(false);
    setSelectedBatch({});
  };

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search batches..."
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-full md:w-64"
        />
      </div>
      <Button
        label="Create New Batch"
        icon="pi pi-plus"
        onClick={() => {
          setSelectedBatch({});
          setShowDialog(true);
        }}
        className="w-full md:w-auto shadow-sm"
      />
    </div>
  );

  const subjectOptions = [
    { label: 'CS-101P: Intro to Programming Lab', value: 'CS-101P' },
    { label: 'CS-102P: Data Structures Lab', value: 'CS-102P' },
    { label: 'PH-101P: Physics Lab', value: 'PH-101P' },
    { label: 'MA-101: Mathematics Tutorial', value: 'MA-101' },
  ];

  return (
    <FormPage
      title="Batch Allocation"
      description="Manage practical, tutorial, and project batches for class sections"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Department Portal',
          to: studentManagementUrls.department.root,
        },
        { label: 'Batch Allocation' },
      ]}
    >
      <FormCard>
        <DataTable
          value={batches}
          paginator
          rows={10}
          header={header}
          globalFilter={globalFilter}
          emptyMessage="No batches found."
          className="p-datatable-sm shadow-sm border border-gray-200 rounded-lg overflow-hidden"
          stripedRows
          rowHover
          showGridlines={false}
        >
          <Column
            field="sectionCode"
            header="Section"
            sortable
            className="font-medium text-gray-800"
          ></Column>
          <Column
            field="batchName"
            header="Batch Name"
            sortable
            className="font-bold text-blue-700"
          ></Column>
          <Column
            field="batchType"
            header="Type"
            body={typeTemplate}
            sortable
          ></Column>
          <Column
            header="Capacity"
            body={capacityTemplate}
            sortable
            field="assignedStudents"
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
            align="center"
            style={{ minWidth: '8rem' }}
          ></Column>
        </DataTable>
      </FormCard>

      <Dialog
        visible={showDialog}
        style={{ width: '550px' }}
        header={selectedBatch.id ? 'Edit Batch Allocation' : 'Create New Batch'}
        modal
        onHide={() => setShowDialog(false)}
        className="p-fluid"
      >
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="sectionCode" className="font-bold text-gray-700">
              Parent Section <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="sectionCode"
              value={selectedBatch.sectionCode}
              options={[
                { label: 'BTECH-CSE-SEM1-A', value: 'BTECH-CSE-SEM1-A' },
                { label: 'BTECH-CSE-SEM1-B', value: 'BTECH-CSE-SEM1-B' },
              ]}
              onChange={e =>
                setSelectedBatch({ ...selectedBatch, sectionCode: e.value })
              }
              placeholder="Select parent section"
              className="w-full"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="batchName" className="font-bold text-gray-700">
                Batch Name <span className="text-red-500">*</span>
              </label>
              <InputText
                id="batchName"
                value={selectedBatch.batchName || ''}
                onChange={e =>
                  setSelectedBatch({
                    ...selectedBatch,
                    batchName: e.target.value,
                  })
                }
                placeholder="e.g. B1, G1, T1"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="batchType" className="font-bold text-gray-700">
                Batch Type <span className="text-red-500">*</span>
              </label>
              <Dropdown
                id="batchType"
                value={selectedBatch.batchType}
                options={[
                  { label: 'Practical', value: 'Practical' },
                  { label: 'Tutorial', value: 'Tutorial' },
                  { label: 'Project', value: 'Project' },
                ]}
                onChange={e =>
                  setSelectedBatch({ ...selectedBatch, batchType: e.value })
                }
                placeholder="Select batch type"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="mappedSubjects" className="font-bold text-gray-700">
              Associated Subjects
            </label>
            <MultiSelect
              id="mappedSubjects"
              value={selectedBatch.mappedSubjects}
              options={subjectOptions}
              onChange={e =>
                setSelectedBatch({ ...selectedBatch, mappedSubjects: e.value })
              }
              placeholder="Select subjects mapped to this batch"
              display="chip"
              className="w-full"
            />
            <small className="text-gray-500">
              Only subjects matching the selected batch type will be available.
            </small>
          </div>

          <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="maxCapacity" className="font-bold text-gray-700">
                Max Capacity <span className="text-red-500">*</span>
              </label>
              <InputNumber
                id="maxCapacity"
                value={selectedBatch.maxCapacity || 0}
                onValueChange={e =>
                  setSelectedBatch({
                    ...selectedBatch,
                    maxCapacity: e.value as number,
                  })
                }
                min={1}
                max={100}
                className="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label
                htmlFor="assignedStudents"
                className="font-bold text-gray-700"
              >
                Currently Assigned
              </label>
              <InputNumber
                id="assignedStudents"
                value={selectedBatch.assignedStudents || 0}
                onValueChange={e =>
                  setSelectedBatch({
                    ...selectedBatch,
                    assignedStudents: e.value as number,
                  })
                }
                min={0}
                max={selectedBatch.maxCapacity || 100}
                disabled={!selectedBatch.id}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8 border-t border-gray-100 pt-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
            outlined
            onClick={() => setShowDialog(false)}
          />
          <Button
            label="Save Batch"
            icon="pi pi-check"
            onClick={handleSave}
            disabled={
              !selectedBatch.sectionCode ||
              !selectedBatch.batchName ||
              !selectedBatch.batchType ||
              !selectedBatch.maxCapacity
            }
            className="shadow-sm"
          />
        </div>
      </Dialog>
    </FormPage>
  );
}
