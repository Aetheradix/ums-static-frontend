import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';

interface StudentProgress {
  id: string;
  studentId: string;
  studentName: string;
  attendancePct: number;
  assignmentCompletion: number;
  averageMarks: number;
  riskStatus: 'On Track' | 'At Risk' | 'Needs Attention';
}

const mockProgress: StudentProgress[] = [
  {
    id: 'SP-01',
    studentId: 'STU2023001',
    studentName: 'John Doe',
    attendancePct: 85,
    assignmentCompletion: 100,
    averageMarks: 72,
    riskStatus: 'On Track',
  },
  {
    id: 'SP-02',
    studentId: 'STU2023002',
    studentName: 'Jane Smith',
    attendancePct: 92,
    assignmentCompletion: 100,
    averageMarks: 88,
    riskStatus: 'On Track',
  },
  {
    id: 'SP-03',
    studentId: 'STU2023003',
    studentName: 'Alice Johnson',
    attendancePct: 65,
    assignmentCompletion: 50,
    averageMarks: 45,
    riskStatus: 'At Risk',
  },
  {
    id: 'SP-04',
    studentId: 'STU2023004',
    studentName: 'Bob Williams',
    attendancePct: 76,
    assignmentCompletion: 75,
    averageMarks: 58,
    riskStatus: 'Needs Attention',
  },
];

export default function StudentProgress() {
  const [progressData] = useState<StudentProgress[]>(mockProgress);
  const [globalFilter, setGlobalFilter] = useState('');

  const riskStatusTemplate = (rowData: StudentProgress) => {
    return (
      <StatusBadge
        label={rowData.riskStatus}
        variant={
          rowData.riskStatus === 'On Track'
            ? 'approved'
            : rowData.riskStatus === 'At Risk'
              ? 'rejected'
              : 'pending'
        }
      />
    );
  };

  const progressTemplate = (value: number) => {
    return (
      <div className="flex flex-col gap-1 w-full max-w-[12rem]">
        <div className="flex justify-between items-center text-xs font-bold text-gray-600 mb-1">
          <span>{value}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${value >= 75 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const actionTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-eye"
        rounded
        text
        severity="info"
        tooltip="View Full Profile"
        tooltipOptions={{ position: 'top' }}
      />
      <Button
        icon="pi pi-envelope"
        rounded
        text
        severity="warning"
        tooltip="Message Student"
        tooltipOptions={{ position: 'top' }}
      />
    </div>
  );

  const header = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-2">
      <h3 className="text-lg font-bold text-gray-800 m-0 flex items-center gap-2">
        <i className="pi pi-users text-indigo-600"></i>
        Detailed Student Metrics
      </h3>
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search students..."
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-full md:w-64"
        />
      </span>
    </div>
  );

  const chartData = {
    labels: ['On Track', 'Needs Attention', 'At Risk'],
    datasets: [
      {
        data: [2, 1, 1],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
        hoverBackgroundColor: ['#16a34a', '#d97706', '#dc2626'],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20 },
      },
    },
    cutout: '70%',
    layout: { padding: 10 },
  };

  return (
    <FormPage
      title="Student Progress Tracking"
      description="Monitor the academic progress, attendance, and risk factors of your assigned students"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Faculty Portal', to: studentManagementUrls.faculty.root },
        { label: 'Student Progress' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <FormCard className="col-span-1 flex flex-col items-center justify-center p-6 shadow-sm border-t-4 border-indigo-500">
          <div className="text-center w-full mb-6">
            <h4 className="text-gray-900 font-bold text-lg mb-1">
              Class Risk Distribution
            </h4>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              CS301 - Section A
            </p>
          </div>
          <div className="relative w-full flex justify-center">
            <Chart
              type="doughnut"
              data={chartData}
              options={chartOptions}
              className="w-full max-w-[200px]"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center mt-[-15px]">
              <span className="text-3xl font-black text-gray-800">4</span>
              <span className="text-xs text-gray-500 font-semibold uppercase">
                Students
              </span>
            </div>
          </div>
        </FormCard>

        <FormCard className="col-span-3 shadow-sm border-t-4 border-blue-500">
          <DataTable
            value={progressData}
            header={header}
            emptyMessage="No student data available."
            responsiveLayout="scroll"
            paginator
            rows={5}
            globalFilter={globalFilter}
            stripedRows
            rowHover
            className="p-datatable-sm"
          >
            <Column
              field="studentId"
              header="Student ID"
              sortable
              className="font-mono text-gray-700 font-medium"
            ></Column>
            <Column
              field="studentName"
              header="Name"
              sortable
              className="font-bold text-gray-900"
            ></Column>
            <Column
              header="Attendance"
              body={rowData => progressTemplate(rowData.attendancePct)}
              sortable
              sortField="attendancePct"
              style={{ width: '20%' }}
            ></Column>
            <Column
              header="Assignments"
              body={rowData => progressTemplate(rowData.assignmentCompletion)}
              sortable
              sortField="assignmentCompletion"
              style={{ width: '20%' }}
            ></Column>
            <Column
              header="Avg Marks"
              body={rowData => progressTemplate(rowData.averageMarks)}
              sortable
              sortField="averageMarks"
              style={{ width: '20%' }}
            ></Column>
            <Column
              field="riskStatus"
              header="Risk Status"
              body={riskStatusTemplate}
              sortable
            ></Column>
            <Column
              body={actionTemplate}
              header="Actions"
              exportable={false}
              align="center"
            ></Column>
          </DataTable>
        </FormCard>
      </div>
    </FormPage>
  );
}
