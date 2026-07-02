import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { Chart } from 'primereact/chart';
import { FormPage, FormCard, StatusBadge } from 'shared/new-components';

interface SubjectAttendance {
  subject: string;
  code: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  status: 'Safe' | 'Warning' | 'Shortage';
}

const mockAttendance: SubjectAttendance[] = [
  {
    subject: 'Advanced Algorithms',
    code: 'CS-301',
    totalClasses: 45,
    attendedClasses: 40,
    percentage: 88.8,
    status: 'Safe',
  },
  {
    subject: 'Database Systems',
    code: 'CS-302',
    totalClasses: 42,
    attendedClasses: 38,
    percentage: 90.4,
    status: 'Safe',
  },
  {
    subject: 'Machine Learning',
    code: 'CS-303',
    totalClasses: 40,
    attendedClasses: 28,
    percentage: 70.0,
    status: 'Warning',
  },
  {
    subject: 'Computer Networks',
    code: 'CS-304',
    totalClasses: 38,
    attendedClasses: 22,
    percentage: 57.8,
    status: 'Shortage',
  },
];

export default function Attendance() {
  const [attendanceData] = useState<SubjectAttendance[]>(mockAttendance);

  const statusTemplate = (rowData: SubjectAttendance) => {
    return (
      <StatusBadge
        label={rowData.status}
        variant={
          rowData.status === 'Safe'
            ? 'approved'
            : rowData.status === 'Shortage'
              ? 'rejected'
              : 'pending'
        }
      />
    );
  };

  const progressTemplate = (rowData: SubjectAttendance) => {
    const value = rowData.percentage;
    return (
      <div className="flex flex-col gap-1 w-full">
        <span className="text-xs font-semibold text-gray-600 text-right">
          {value.toFixed(1)}%
        </span>
        <ProgressBar
          value={value}
          showValue={false}
          style={{ height: '6px' }}
          color={value >= 75 ? '#22c55e' : value >= 60 ? '#f59e0b' : '#ef4444'}
        ></ProgressBar>
      </div>
    );
  };

  const chartData = {
    labels: ['Attended', 'Missed'],
    datasets: [
      {
        data: [128, 37],
        backgroundColor: ['#3b82f6', '#e5e7eb'],
        hoverBackgroundColor: ['#2563eb', '#d1d5db'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: '75%',
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <FormPage
      title="My Attendance"
      description="Track your subject-wise attendance and ensure you meet the minimum 75% requirement"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center relative">
          <h4 className="text-gray-500 font-medium mb-4 uppercase tracking-wider text-sm">
            Overall Attendance
          </h4>
          <div className="relative w-32 h-32">
            <Chart
              type="doughnut"
              data={chartData}
              options={chartOptions}
              className="w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-black text-gray-800">77.5%</span>
            </div>
          </div>
        </div>

        <div className="col-span-3 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
                <i className="pi pi-check-circle"></i>
              </div>
              <div>
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wider block mb-1">
                  Total Classes Attended
                </span>
                <span className="text-3xl font-black text-gray-800">
                  128{' '}
                  <span className="text-lg text-gray-400 font-medium">
                    / 165
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">
                <i className="pi pi-times-circle"></i>
              </div>
              <div>
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wider block mb-1">
                  Total Classes Missed
                </span>
                <span className="text-3xl font-black text-gray-800">37</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormCard title="Subject-wise Breakdown" className="p-0 overflow-hidden">
        <DataTable
          value={attendanceData}
          emptyMessage="No attendance records found."
          responsiveLayout="scroll"
        >
          <Column field="code" header="Code" style={{ width: '15%' }}></Column>
          <Column
            field="subject"
            header="Subject"
            style={{ width: '30%' }}
          ></Column>
          <Column
            field="totalClasses"
            header="Total"
            style={{ textAlign: 'center' }}
          ></Column>
          <Column
            field="attendedClasses"
            header="Attended"
            style={{ textAlign: 'center' }}
          ></Column>
          <Column
            header="Percentage"
            body={progressTemplate}
            style={{ width: '25%' }}
          ></Column>
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            style={{ textAlign: 'center' }}
          ></Column>
        </DataTable>
      </FormCard>
    </FormPage>
  );
}
