import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard } from 'shared/new-components';
import { studentManagementUrls } from '../../urls';

export default function DepartmentDashboard() {
  const navigate = useNavigate();

  const chartData = {
    labels: ['Section A', 'Section B', 'Section C', 'Section D'],
    datasets: [
      {
        label: 'Allocated Students',
        backgroundColor: '#6366f1',
        borderRadius: 6,
        data: [60, 58, 62, 55],
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1.5,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { border: { dash: [4, 4] } },
    },
  };

  return (
    <FormPage
      title="Department Dashboard"
      description="Manage students, batches, and academic progress across your department."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Department Portal',
          to: studentManagementUrls.department.root,
        },
        { label: 'Dashboard' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Total Students
                </p>
                <h2 className="text-3xl font-black text-gray-900">1,240</h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                <i className="pi pi-users text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Active Batches
                </p>
                <h2 className="text-3xl font-black text-gray-900">12</h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                <i className="pi pi-th-large text-xl"></i>
              </div>
            </div>
            <Button
              label="Manage Batches"
              text
              size="small"
              onClick={() =>
                navigate(studentManagementUrls.department.batchAllocation)
              }
              className="p-0 font-bold text-blue-600 relative z-10"
            />
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Pending Sections
                </p>
                <h2 className="text-3xl font-black text-red-600">2</h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-inner">
                <i className="pi pi-list text-xl"></i>
              </div>
            </div>
            <Button
              label="Allocate Sections"
              text
              size="small"
              onClick={() =>
                navigate(studentManagementUrls.department.sectionAllocation)
              }
              className="p-0 font-bold text-red-600 relative z-10"
            />
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Promotions Due
                </p>
                <h2 className="text-3xl font-black text-gray-900">310</h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
                <i className="pi pi-arrow-up-right text-xl"></i>
              </div>
            </div>
            <Button
              label="Review Promotions"
              text
              size="small"
              onClick={() =>
                navigate(studentManagementUrls.department.promotion)
              }
              className="p-0 font-bold text-green-600 relative z-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormCard
            title="Current Semester Section Sizes (B.Tech CSE)"
            className="h-full"
          >
            <div className="h-[280px] w-full pt-4">
              <Chart
                type="bar"
                data={chartData}
                options={chartOptions}
                className="h-full w-full"
              />
            </div>
          </FormCard>

          <FormCard title="Quick Actions" className="h-full">
            <div className="grid grid-cols-2 gap-4 mt-2">
              <button
                className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all group shadow-sm hover:shadow"
                onClick={() =>
                  navigate(studentManagementUrls.department.subjectMapping)
                }
              >
                <i className="pi pi-sitemap text-3xl text-gray-400 group-hover:text-indigo-600 transition-colors"></i>
                <span className="font-semibold text-gray-700 group-hover:text-indigo-800 text-sm md:text-base">
                  Subject Mapping
                </span>
              </button>
              <button
                className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all group shadow-sm hover:shadow"
                onClick={() => navigate(studentManagementUrls.admin.directory)}
              >
                <i className="pi pi-users text-3xl text-gray-400 group-hover:text-blue-600 transition-colors"></i>
                <span className="font-semibold text-gray-700 group-hover:text-blue-800 text-sm md:text-base">
                  Student Directory
                </span>
              </button>
              <button
                className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all group shadow-sm hover:shadow"
                onClick={() =>
                  navigate(studentManagementUrls.department.batchAllocation)
                }
              >
                <i className="pi pi-clone text-3xl text-gray-400 group-hover:text-purple-600 transition-colors"></i>
                <span className="font-semibold text-gray-700 group-hover:text-purple-800 text-sm md:text-base">
                  Batch Allocation
                </span>
              </button>
              <button
                className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700 transition-all group shadow-sm hover:shadow"
                onClick={() =>
                  navigate(studentManagementUrls.department.promotion)
                }
              >
                <i className="pi pi-angle-double-up text-3xl text-gray-400 group-hover:text-green-600 transition-colors"></i>
                <span className="font-semibold text-gray-700 group-hover:text-green-800 text-sm md:text-base">
                  Semester Promotion
                </span>
              </button>
            </div>
          </FormCard>
        </div>
      </div>
    </FormPage>
  );
}
