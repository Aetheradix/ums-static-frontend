import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';

interface SectionAllocation {
  id: string;
  semesterCode: string;
  programCode: string;
  sectionName: string;
  maxCapacity: number;
  assignedStudents: number;
  status: 'Active' | 'Full';
}

const mockSections: SectionAllocation[] = [
  {
    id: 'SEC-01',
    semesterCode: 'SEM-1',
    programCode: 'BTECH-CSE',
    sectionName: 'A',
    maxCapacity: 60,
    assignedStudents: 60,
    status: 'Full',
  },
  {
    id: 'SEC-02',
    semesterCode: 'SEM-1',
    programCode: 'BTECH-CSE',
    sectionName: 'B',
    maxCapacity: 60,
    assignedStudents: 45,
    status: 'Active',
  },
];

export default function SectionAllocation() {
  const [sections, setSections] = useState<SectionAllocation[]>(mockSections);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState<
    Partial<SectionAllocation>
  >({});
  const [globalFilter, setGlobalFilter] = useState('');

  const statusTemplate = (rowData: SectionAllocation) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Active' ? 'approved' : 'pending'}
      />
    );
  };

  const actionTemplate = (rowData: SectionAllocation) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        aria-label="Edit"
        tooltip="Edit Section"
        tooltipOptions={{ position: 'top' }}
        onClick={() => {
          setSelectedSection({ ...rowData });
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

  const capacityTemplate = (rowData: SectionAllocation) => {
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
    if (selectedSection.id) {
      setSections(
        sections.map(s =>
          s.id === selectedSection.id
            ? ({ ...s, ...selectedSection } as SectionAllocation)
            : s
        )
      );
    } else {
      const newSection: SectionAllocation = {
        ...(selectedSection as SectionAllocation),
        id: `SEC-0${Math.floor(Math.random() * 10) + 3}`,
        assignedStudents: selectedSection.assignedStudents || 0,
        status:
          selectedSection.assignedStudents === selectedSection.maxCapacity
            ? 'Full'
            : 'Active',
      };
      setSections([newSection, ...sections]);
    }
    setShowDialog(false);
    setSelectedSection({});
  };

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search sections..."
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-full md:w-64"
        />
      </div>
      <Button
        label="Create Section"
        icon="pi pi-plus"
        onClick={() => {
          setSelectedSection({});
          setShowDialog(true);
        }}
        className="w-full md:w-auto shadow-sm"
      />
    </div>
  );

  return (
    <FormPage
      title="Section Allocation"
      description="Manage sections and student capacities for each program semester"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Department Portal',
          to: studentManagementUrls.department.root,
        },
        { label: 'Section Allocation' },
      ]}
    >
      <FormCard>
        <DataTable
          value={sections}
          paginator
          rows={10}
          header={header}
          globalFilter={globalFilter}
          emptyMessage="No sections found."
          className="p-datatable-sm shadow-sm border border-gray-200 rounded-lg overflow-hidden"
          stripedRows
          rowHover
        >
          <Column
            field="programCode"
            header="Program"
            sortable
            className="font-bold text-gray-800"
          ></Column>
          <Column
            field="semesterCode"
            header="Semester"
            sortable
            className="font-medium text-blue-700"
          ></Column>
          <Column
            field="sectionName"
            header="Section"
            sortable
            className="font-bold text-indigo-700"
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
        header={
          selectedSection.id ? 'Edit Section Allocation' : 'Create New Section'
        }
        modal
        onHide={() => setShowDialog(false)}
        className="p-fluid"
      >
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="programCode" className="font-bold text-gray-700">
                Program <span className="text-red-500">*</span>
              </label>
              <Dropdown
                id="programCode"
                value={selectedSection.programCode}
                options={[
                  { label: 'BTECH-CSE', value: 'BTECH-CSE' },
                  { label: 'MBA-FIN', value: 'MBA-FIN' },
                ]}
                onChange={e =>
                  setSelectedSection({
                    ...selectedSection,
                    programCode: e.value,
                  })
                }
                placeholder="Select Program"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="semesterCode" className="font-bold text-gray-700">
                Semester <span className="text-red-500">*</span>
              </label>
              <Dropdown
                id="semesterCode"
                value={selectedSection.semesterCode}
                options={[
                  { label: 'Semester 1', value: 'SEM-1' },
                  { label: 'Semester 2', value: 'SEM-2' },
                  { label: 'Semester 3', value: 'SEM-3' },
                ]}
                onChange={e =>
                  setSelectedSection({
                    ...selectedSection,
                    semesterCode: e.value,
                  })
                }
                placeholder="Select Semester"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="sectionName" className="font-bold text-gray-700">
              Section Name <span className="text-red-500">*</span>
            </label>
            <InputText
              id="sectionName"
              value={selectedSection.sectionName || ''}
              onChange={e =>
                setSelectedSection({
                  ...selectedSection,
                  sectionName: e.target.value,
                })
              }
              placeholder="e.g. A, B, C1"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="maxCapacity" className="font-bold text-gray-700">
                Max Capacity <span className="text-red-500">*</span>
              </label>
              <InputNumber
                id="maxCapacity"
                value={selectedSection.maxCapacity || 0}
                onValueChange={e =>
                  setSelectedSection({
                    ...selectedSection,
                    maxCapacity: e.value as number,
                  })
                }
                min={1}
                max={200}
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
                value={selectedSection.assignedStudents || 0}
                onValueChange={e =>
                  setSelectedSection({
                    ...selectedSection,
                    assignedStudents: e.value as number,
                  })
                }
                min={0}
                max={selectedSection.maxCapacity || 200}
                disabled={!selectedSection.id}
                className="w-full"
              />
              {!selectedSection.id && (
                <small className="text-gray-500 italic">
                  Auto-calculated upon creation.
                </small>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label htmlFor="status" className="font-bold text-gray-700">
              Status
            </label>
            <Dropdown
              id="status"
              value={selectedSection.status || 'Active'}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Full', value: 'Full' },
              ]}
              onChange={e =>
                setSelectedSection({ ...selectedSection, status: e.value })
              }
              placeholder="Select Status"
              disabled
            />
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
            label="Save Section"
            icon="pi pi-check"
            onClick={handleSave}
            disabled={
              !selectedSection.programCode ||
              !selectedSection.semesterCode ||
              !selectedSection.sectionName ||
              !selectedSection.maxCapacity
            }
            className="shadow-sm"
          />
        </div>
      </Dialog>
    </FormPage>
  );
}
