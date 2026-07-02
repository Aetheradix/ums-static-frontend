import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { FormPage, FormCard } from 'shared/new-components';

interface GradeRecord {
  code: string;
  subject: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

const mockGrades: GradeRecord[] = [
  {
    code: 'CS-201',
    subject: 'Data Structures and Algorithms',
    credits: 4,
    grade: 'A',
    gradePoint: 9,
  },
  {
    code: 'CS-202',
    subject: 'Computer Organization',
    credits: 3,
    grade: 'B+',
    gradePoint: 8,
  },
  {
    code: 'CS-203',
    subject: 'Object Oriented Programming',
    credits: 3,
    grade: 'A+',
    gradePoint: 10,
  },
  {
    code: 'MA-201',
    subject: 'Engineering Mathematics III',
    credits: 4,
    grade: 'B',
    gradePoint: 7,
  },
  {
    code: 'CS-201P',
    subject: 'Data Structures Lab',
    credits: 2,
    grade: 'A+',
    gradePoint: 10,
  },
  {
    code: 'CS-203P',
    subject: 'OOPs Lab',
    credits: 2,
    grade: 'A',
    gradePoint: 9,
  },
];

export default function GradeCard() {
  const [selectedSemester, setSelectedSemester] = useState('Semester 2');

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'B+':
      case 'B':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'C+':
      case 'C':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'F':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const gradeTemplate = (rowData: GradeRecord) => {
    return (
      <div
        className={`inline-flex items-center justify-center w-8 h-8 rounded border font-bold ${getGradeColor(rowData.grade)}`}
      >
        {rowData.grade}
      </div>
    );
  };

  const header = (
    <div className="flex justify-between items-center bg-gray-50 p-4 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <label className="font-semibold text-gray-700">Select Semester:</label>
        <Dropdown
          value={selectedSemester}
          options={['Semester 1', 'Semester 2']}
          onChange={e => setSelectedSemester(e.value)}
          className="w-64"
        />
      </div>
      <Button
        label="Download Official Transcript"
        icon="pi pi-download"
        severity="secondary"
        outlined
      />
    </div>
  );

  return (
    <FormPage
      title="Grade Card & Transcript"
      description="View your academic performance, SGPA, and CGPA"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            SGPA (Sem 2)
          </span>
          <span className="text-4xl font-black text-blue-700">8.66</span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Cumulative CGPA
          </span>
          <span className="text-4xl font-black text-purple-700">8.82</span>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Total Earned Credits
          </span>
          <span className="text-4xl font-black text-green-700">42</span>
        </div>
      </div>

      <FormCard className="p-0 overflow-hidden">
        <DataTable
          value={mockGrades}
          header={header}
          emptyMessage="No grades published for this semester."
          responsiveLayout="scroll"
          stripedRows
        >
          <Column
            field="code"
            header="Course Code"
            style={{ width: '15%', fontWeight: 'bold' }}
          ></Column>
          <Column
            field="subject"
            header="Course Title"
            style={{ width: '40%' }}
          ></Column>
          <Column
            field="credits"
            header="Credits"
            style={{ textAlign: 'center', width: '15%' }}
          ></Column>
          <Column
            field="grade"
            header="Grade Awarded"
            body={gradeTemplate}
            style={{ textAlign: 'center', width: '15%' }}
          ></Column>
          <Column
            field="gradePoint"
            header="Grade Points"
            style={{ textAlign: 'center', width: '15%' }}
          ></Column>
        </DataTable>

        <div className="bg-gray-50 p-4 border-t border-gray-200 text-sm text-gray-500 text-center">
          This is a computer-generated document. For official purposes, please
          download the verified transcript.
        </div>
      </FormCard>
    </FormPage>
  );
}
