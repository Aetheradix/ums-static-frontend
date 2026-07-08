import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { Modal } from 'shared/components/popups';
import {
  TextBox,
  DropDownList,
  MultiSelectList,
} from 'shared/components/forms';
import { studentManagementUrls } from '../../urls';

interface SubjectMapping {
  id: string;
  semesterCode: string;
  programCode: string;
  mappedSubjects: string[];
  status: 'Draft' | 'Finalized';
}

const mockMappings: SubjectMapping[] = [
  {
    id: 'SM-01',
    semesterCode: 'SEM-1',
    programCode: 'BTECH-CSE',
    mappedSubjects: ['CS-101', 'CS-102', 'MA-101'],
    status: 'Finalized',
  },
  {
    id: 'SM-02',
    semesterCode: 'SEM-2',
    programCode: 'BTECH-CSE',
    mappedSubjects: ['CS-201', 'PH-101'],
    status: 'Draft',
  },
];

export default function SubjectMapping() {
  const [mappings, setMappings] = useState<SubjectMapping[]>(mockMappings);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<
    Partial<SubjectMapping>
  >({});
  const [globalFilter, setGlobalFilter] = useState('');

  const statusTemplate = (rowData: SubjectMapping) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Finalized' ? 'approved' : 'pending'}
      />
    );
  };

  const subjectsTemplate = (rowData: SubjectMapping) => {
    return (
      <div className="flex flex-wrap gap-1 max-w-sm">
        {rowData.mappedSubjects.map(sub => (
          <span
            key={sub}
            className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono font-medium border border-gray-200"
          >
            {sub}
          </span>
        ))}
      </div>
    );
  };

  const actionTemplate = (rowData: SubjectMapping) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        aria-label="Edit"
        tooltip="Edit Mapping"
        tooltipOptions={{ position: 'top' }}
        onClick={() => {
          setSelectedMapping({ ...rowData });
          setShowDialog(true);
        }}
      />
    </div>
  );

  const handleSave = () => {
    if (selectedMapping.id) {
      setMappings(
        mappings.map(m =>
          m.id === selectedMapping.id
            ? ({ ...m, ...selectedMapping } as SubjectMapping)
            : m
        )
      );
    } else {
      const newMapping: SubjectMapping = {
        ...(selectedMapping as SubjectMapping),
        id: `SM-0${Math.floor(Math.random() * 10) + 3}`,
        status: selectedMapping.status || 'Draft',
        mappedSubjects: selectedMapping.mappedSubjects || [],
      };
      setMappings([newMapping, ...mappings]);
    }
    setShowDialog(false);
    setSelectedMapping({});
  };

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <TextBox
          placeholder="Search mappings..."
          onChange={v => setGlobalFilter(v as string)}
          className="w-full md:w-64"
        />
      </div>
      <Button
        label="Create Mapping"
        icon="pi pi-plus"
        onClick={() => {
          setSelectedMapping({});
          setShowDialog(true);
        }}
        className="w-full md:w-auto shadow-sm"
      />
    </div>
  );

  const subjectOptions = [
    { label: 'CS-101: Intro to Programming', value: 'CS-101' },
    { label: 'CS-102: Data Structures', value: 'CS-102' },
    { label: 'CS-201: Algorithms', value: 'CS-201' },
    { label: 'MA-101: Calculus', value: 'MA-101' },
    { label: 'PH-101: Physics', value: 'PH-101' },
  ];

  return (
    <FormPage
      title="Subject Mapping"
      description="Allocate academic subjects to specific semesters and programs"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Department Portal',
          to: studentManagementUrls.department.root,
        },
        { label: 'Subject Mapping' },
      ]}
    >
      <FormCard>
        <DataTable
          value={mappings}
          paginator
          rows={10}
          header={header}
          globalFilter={globalFilter}
          emptyMessage="No subject mappings found."
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
            field="mappedSubjects"
            header="Mapped Subjects"
            body={subjectsTemplate}
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
            style={{ minWidth: '6rem' }}
          ></Column>
        </DataTable>
      </FormCard>

      <Modal
        visible={showDialog}
        size="medium"
        header={
          selectedMapping.id ? 'Edit Subject Mapping' : 'New Subject Mapping'
        }
        onHide={() => setShowDialog(false)}
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex-1">
              <DropDownList
                label="Program *"
                value={selectedMapping.programCode}
                data={[
                  { label: 'BTECH-CSE', value: 'BTECH-CSE' },
                  { label: 'MBA-FIN', value: 'MBA-FIN' },
                ]}
                textField="label"
                valueField="value"
                onChange={v =>
                  setSelectedMapping({
                    ...selectedMapping,
                    programCode: v as string,
                  })
                }
                defaultOptionText="Select Program"
              />
            </div>
            <div className="flex-1">
              <DropDownList
                label="Semester *"
                value={selectedMapping.semesterCode}
                data={[
                  { label: 'Semester 1', value: 'SEM-1' },
                  { label: 'Semester 2', value: 'SEM-2' },
                  { label: 'Semester 3', value: 'SEM-3' },
                ]}
                textField="label"
                valueField="value"
                onChange={v =>
                  setSelectedMapping({
                    ...selectedMapping,
                    semesterCode: v as string,
                  })
                }
                defaultOptionText="Select Semester"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <MultiSelectList
              label="Map Subjects *"
              value={selectedMapping.mappedSubjects as any}
              data={subjectOptions}
              textField="label"
              valueField="value"
              onChange={(v: any) =>
                setSelectedMapping({
                  ...selectedMapping,
                  mappedSubjects: v,
                })
              }
              placeholder="Select Subjects"
            />
            <small className="text-gray-500 italic">
              Select all subjects applicable for this program semester.
            </small>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <DropDownList
              label="Status"
              value={selectedMapping.status}
              data={[
                { label: 'Draft', value: 'Draft' },
                { label: 'Finalized', value: 'Finalized' },
              ]}
              textField="label"
              valueField="value"
              onChange={v =>
                setSelectedMapping({ ...selectedMapping, status: v as any })
              }
              defaultOptionText="Select Status"
            />
            {selectedMapping.status === 'Finalized' && (
              <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md flex gap-2 text-sm text-orange-800">
                <i className="pi pi-exclamation-triangle mt-0.5 text-orange-500"></i>
                <p className="m-0 leading-tight">
                  Warning: Finalized mappings cannot be easily changed once
                  student registration begins.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
            <Button
              label="Cancel"
              icon="pi pi-times"
              outlined
              onClick={() => setShowDialog(false)}
            />
            <Button
              label="Save Mapping"
              icon="pi pi-check"
              onClick={handleSave}
              disabled={
                !selectedMapping.programCode ||
                !selectedMapping.semesterCode ||
                !selectedMapping.mappedSubjects?.length
              }
              className="shadow-sm"
            />
          </div>
        </div>
      </Modal>
    </FormPage>
  );
}
