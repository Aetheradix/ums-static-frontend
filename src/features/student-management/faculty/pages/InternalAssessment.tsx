import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { ToastService } from 'services';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';

interface StudentMark {
  id: string;
  studentId: string;
  studentName: string;
  assignment1: number | null;
  assignment2: number | null;
  midTerm: number | null;
  totalMarks: number;
  status: 'Draft' | 'Submitted';
}

const mockMarks: StudentMark[] = [
  {
    id: 'SM-01',
    studentId: 'STU2023001',
    studentName: 'John Doe',
    assignment1: 18,
    assignment2: 19,
    midTerm: 25,
    totalMarks: 62,
    status: 'Draft',
  },
  {
    id: 'SM-02',
    studentId: 'STU2023002',
    studentName: 'Jane Smith',
    assignment1: 20,
    assignment2: 20,
    midTerm: 28,
    totalMarks: 68,
    status: 'Submitted',
  },
  {
    id: 'SM-03',
    studentId: 'STU2023003',
    studentName: 'Alice Johnson',
    assignment1: null,
    assignment2: null,
    midTerm: null,
    totalMarks: 0,
    status: 'Draft',
  },
];

export default function InternalAssessment() {
  const [marks, setMarks] = useState<StudentMark[]>(mockMarks);
  const [selectedSubject, setSelectedSubject] = useState<string>('CS-301');

  const calculateTotal = (row: StudentMark) => {
    return (row.assignment1 || 0) + (row.assignment2 || 0) + (row.midTerm || 0);
  };

  const handleMarkChange = (
    id: string,
    field: keyof StudentMark,
    value: number | null
  ) => {
    setMarks(
      marks.map(m => {
        if (m.id === id) {
          const updated = { ...m, [field]: value };
          updated.totalMarks = calculateTotal(updated as StudentMark);
          return updated as StudentMark;
        }
        return m;
      })
    );
  };

  const submitAllMarks = () => {
    setMarks(marks.map(m => ({ ...m, status: 'Submitted' })));
    ToastService.success('Internal marks submitted to Exam Cell successfully');
  };

  const markEditorTemplate = (field: keyof StudentMark, maxMarks: number) => {
    return (rowData: StudentMark) => {
      if (rowData.status === 'Submitted') {
        return (
          <span className="font-semibold text-gray-700">
            {rowData[field] !== null ? rowData[field] : '-'}
          </span>
        );
      }
      return (
        <InputNumber
          value={rowData[field] as number}
          onValueChange={e =>
            handleMarkChange(rowData.id, field, e.value ?? null)
          }
          min={0}
          max={maxMarks}
          className="w-24 border-gray-300 rounded shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-shadow"
          inputClassName="w-full text-center font-semibold"
        />
      );
    };
  };

  const statusTemplate = (rowData: StudentMark) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={rowData.status === 'Submitted' ? 'approved' : 'pending'}
      />
    );
  };

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-4 border-b border-gray-200 gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
        <label className="font-bold text-gray-700 whitespace-nowrap">
          Select Subject:
        </label>
        <Dropdown
          value={selectedSubject}
          options={[
            {
              label: 'CS-301: Advanced Algorithms (BTECH-CSE-SEM3-A)',
              value: 'CS-301',
            },
            {
              label: 'CS-302: Machine Learning (BTECH-CSE-SEM3-A)',
              value: 'CS-302',
            },
          ]}
          onChange={e => setSelectedSubject(e.value)}
          placeholder="Select Subject"
          className="w-full md:w-[28rem] shadow-sm border-gray-300"
        />
      </div>
      <Button
        label="Submit to Exam Cell"
        icon="pi pi-lock"
        severity="success"
        onClick={submitAllMarks}
        disabled={
          marks.every(m => m.status === 'Submitted') ||
          marks.some(m => m.assignment1 === null || m.midTerm === null)
        }
        className="w-full md:w-auto shadow-md font-bold"
      />
    </div>
  );

  return (
    <FormPage
      title="Internal Assessment Marks Entry"
      description="Enter and submit continuous evaluation marks for your assigned subjects"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Faculty Portal', to: studentManagementUrls.faculty.root },
        { label: 'Internal Assessment' },
      ]}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <FormCard className="p-0 overflow-hidden shadow-md border-t-4 border-t-indigo-500">
          <DataTable
            value={marks}
            header={header}
            emptyMessage="No students mapped to this subject."
            responsiveLayout="scroll"
            stripedRows
            rowHover
            className="p-datatable-sm"
          >
            <Column
              field="studentId"
              header="Student ID"
              style={{ width: '15%' }}
              className="font-mono text-gray-700"
            ></Column>
            <Column
              field="studentName"
              header="Student Name"
              style={{ width: '25%' }}
              className="font-bold text-gray-900"
            ></Column>
            <Column
              header="Assign. 1 (20)"
              body={markEditorTemplate('assignment1', 20)}
              style={{ width: '15%', textAlign: 'center' }}
              headerClassName="text-center"
            ></Column>
            <Column
              header="Assign. 2 (20)"
              body={markEditorTemplate('assignment2', 20)}
              style={{ width: '15%', textAlign: 'center' }}
              headerClassName="text-center"
            ></Column>
            <Column
              header="Mid Term (30)"
              body={markEditorTemplate('midTerm', 30)}
              style={{ width: '15%', textAlign: 'center' }}
              headerClassName="text-center"
            ></Column>
            <Column
              field="totalMarks"
              header="Total (70)"
              style={{ width: '10%', textAlign: 'center' }}
              body={rowData => (
                <span className="font-black text-indigo-700 text-lg">
                  {rowData.totalMarks}
                </span>
              )}
              headerClassName="text-center"
            ></Column>
            <Column
              field="status"
              header="Status"
              body={statusTemplate}
              style={{ width: '10%', textAlign: 'center' }}
              headerClassName="text-center"
            ></Column>
          </DataTable>
        </FormCard>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 flex items-start gap-4 shadow-sm">
          <i className="pi pi-info-circle text-2xl text-blue-500 mt-1"></i>
          <div>
            <h4 className="font-bold text-blue-900 mb-2">
              Important Instructions
            </h4>
            <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
              <li>
                Marks once submitted to Exam Cell cannot be modified through
                this portal.
              </li>
              <li>
                Please ensure all assessment components are entered before final
                submission.
              </li>
              <li>
                For any corrections after submission, please contact the COE
                office.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
