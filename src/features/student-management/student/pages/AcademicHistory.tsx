import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';

interface AcademicSemester {
  id: string;
  semester: string;
  totalCredits: number;
  earnedCredits: number;
  sgpa: number;
  cgpa: number;
  status: 'Pass' | 'Fail' | 'Promoted with Backlogs';
}

const mockHistory: AcademicSemester[] = [
  {
    id: 'SEM-01',
    semester: 'Semester 1',
    totalCredits: 22,
    earnedCredits: 22,
    sgpa: 8.5,
    cgpa: 8.5,
    status: 'Pass',
  },
  {
    id: 'SEM-02',
    semester: 'Semester 2',
    totalCredits: 24,
    earnedCredits: 20,
    sgpa: 7.2,
    cgpa: 7.8,
    status: 'Promoted with Backlogs',
  },
];

export default function AcademicHistory() {
  const statusTemplate = (rowData: AcademicSemester) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={
          rowData.status === 'Pass'
            ? 'approved'
            : rowData.status === 'Fail'
              ? 'rejected'
              : 'pending'
        }
      />
    );
  };

  const sgpaTemplate = (rowData: AcademicSemester) => {
    const value = rowData.sgpa * 10;
    return (
      <div className="flex flex-col gap-1 w-24">
        <span className="font-bold text-gray-800">
          {rowData.sgpa.toFixed(2)}
        </span>
        <ProgressBar
          value={value}
          showValue={false}
          style={{ height: '4px' }}
          color={value > 75 ? '#22c55e' : value > 50 ? '#f59e0b' : '#ef4444'}
        ></ProgressBar>
      </div>
    );
  };

  const cgpaTemplate = (rowData: AcademicSemester) => {
    const value = rowData.cgpa * 10;
    return (
      <div className="flex flex-col gap-1 w-24">
        <span className="font-bold text-indigo-700">
          {rowData.cgpa.toFixed(2)}
        </span>
        <ProgressBar
          value={value}
          showValue={false}
          style={{ height: '4px' }}
          color="#4f46e5"
        ></ProgressBar>
      </div>
    );
  };

  const actionTemplate = () => (
    <Button
      icon="pi pi-download"
      rounded
      text
      severity="secondary"
      tooltip="Download Grade Card"
      tooltipOptions={{ position: 'top' }}
    />
  );

  const currentCgpa = 7.8;

  const header = (
    <div className="flex justify-between items-center py-2">
      <h3 className="text-lg font-bold text-gray-800 m-0">
        Semester-wise Performance
      </h3>
      <Button
        label="Download Full Transcript"
        icon="pi pi-download"
        outlined
        size="small"
      />
    </div>
  );

  return (
    <FormPage
      title="Academic History"
      description="View your past academic performance, grades, and progression"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Portal', to: studentManagementUrls.student.root },
        { label: 'Academic History' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110"></div>
          <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2 relative z-10">
            Current CGPA
          </span>
          <span className="text-5xl font-black text-blue-600 relative z-10">
            {currentCgpa.toFixed(2)}
          </span>
          <div className="w-full mt-6 bg-gray-100 rounded-full h-2 relative z-10">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${currentCgpa * 10}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110"></div>
          <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2 relative z-10">
            Total Credits Earned
          </span>
          <span className="text-5xl font-black text-green-600 relative z-10">
            42 <span className="text-2xl text-gray-400 font-medium">/ 46</span>
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-0 top-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110"></div>
          <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2 relative z-10">
            Active Backlogs
          </span>
          <span className="text-5xl font-black text-orange-500 relative z-10">
            1
          </span>
        </div>
      </div>

      <FormCard className="p-0 overflow-hidden shadow-sm border-t-4 border-indigo-500">
        <DataTable
          value={mockHistory}
          header={header}
          emptyMessage="No academic history found."
          responsiveLayout="scroll"
          stripedRows
          rowHover
          className="p-datatable-sm"
        >
          <Column
            field="semester"
            header="Semester"
            sortable
            className="font-bold text-gray-800"
          ></Column>
          <Column
            field="totalCredits"
            header="Total Credits"
            className="text-center font-medium text-gray-600"
            headerClassName="text-center"
          ></Column>
          <Column
            field="earnedCredits"
            header="Earned Credits"
            className="text-center font-bold text-gray-800"
            headerClassName="text-center"
          ></Column>
          <Column
            field="sgpa"
            header="SGPA"
            body={sgpaTemplate}
            sortable
          ></Column>
          <Column
            field="cgpa"
            header="Cumulative CGPA"
            body={cgpaTemplate}
            sortable
          ></Column>
          <Column
            field="status"
            header="Progression Status"
            body={statusTemplate}
          ></Column>
          <Column
            body={actionTemplate}
            header="Grade Card"
            exportable={false}
            align="center"
          ></Column>
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
