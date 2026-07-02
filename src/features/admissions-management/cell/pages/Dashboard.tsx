import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { admissionsUrls } from '../../urls';
import { FormPage, FormCard } from 'shared/new-components';

export default function CellDashboard() {
  const navigate = useNavigate();

  const chartData = {
    labels: ['B.Tech CSE', 'B.Tech ECE', 'MBA', 'BBA'],
    datasets: [
      {
        label: 'Allocated Seats',
        backgroundColor: '#4ade80',
        data: [120, 60, 45, 80],
      },
      {
        label: 'Pending Allocation',
        backgroundColor: '#f87171',
        data: [20, 15, 10, 30],
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: '#495057',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
      y: {
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
    },
  };

  return (
    <FormPage
      title="Admission Cell Dashboard"
      description="Track and manage the core admissions processes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Admissions', to: admissionsUrls.root },
        { label: 'Cell', to: admissionsUrls.cell.dashboard },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FormCard className="border-l-4 border-blue-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Docs to Verify
              </span>
              <span className="text-3xl font-bold text-gray-800">48</span>
            </div>
            <i className="pi pi-file-check text-4xl text-blue-200"></i>
          </div>
          <Button
            label="Go to Verification"
            icon="pi pi-arrow-right"
            text
            size="small"
            onClick={() => navigate(admissionsUrls.cell.documents)}
            className="mt-4 p-0 font-semibold"
          />
        </FormCard>

        <FormCard className="border-l-4 border-orange-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Merit Lists
              </span>
              <span className="text-3xl font-bold text-gray-800">2</span>
            </div>
            <i className="pi pi-list text-4xl text-orange-200"></i>
          </div>
          <Button
            label="Generate Lists"
            icon="pi pi-arrow-right"
            text
            size="small"
            onClick={() => navigate(admissionsUrls.cell.meritList)}
            className="mt-4 p-0 font-semibold"
          />
        </FormCard>

        <FormCard className="border-l-4 border-purple-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Seats Allocated
              </span>
              <span className="text-3xl font-bold text-gray-800">305</span>
            </div>
            <i className="pi pi-users text-4xl text-purple-200"></i>
          </div>
          <Button
            label="Manage Allocation"
            icon="pi pi-arrow-right"
            text
            size="small"
            onClick={() => navigate(admissionsUrls.cell.seatAllocation)}
            className="mt-4 p-0 font-semibold"
          />
        </FormCard>

        <FormCard className="border-l-4 border-teal-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Ready to Convert
              </span>
              <span className="text-3xl font-bold text-gray-800">180</span>
            </div>
            <i className="pi pi-sync text-4xl text-teal-200"></i>
          </div>
          <Button
            label="Convert Students"
            icon="pi pi-arrow-right"
            text
            size="small"
            onClick={() => navigate(admissionsUrls.cell.studentConversion)}
            className="mt-4 p-0 font-semibold"
          />
        </FormCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <FormCard title="Seat Allocation Progress">
          <div style={{ height: '300px' }}>
            <Chart
              type="bar"
              data={chartData}
              options={chartOptions}
              style={{ height: '100%' }}
            />
          </div>
        </FormCard>

        <FormCard title="Recent Activity">
          <ul className="flex flex-col gap-5 mt-2">
            <li className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shadow-sm"></div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-700 leading-tight">
                  <strong>System</strong> auto-verified 15 document sets.
                </span>
                <span className="text-xs text-gray-400 mt-1">10 min ago</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 shadow-sm"></div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-700 leading-tight">
                  <strong>Admin</strong> published the B.Tech CSE Merit List.
                </span>
                <span className="text-xs text-gray-400 mt-1">1 hour ago</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1.5 shadow-sm"></div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-700 leading-tight">
                  <strong>System</strong> allocated 45 seats in MBA program.
                </span>
                <span className="text-xs text-gray-400 mt-1">3 hours ago</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500 mt-1.5 shadow-sm"></div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-700 leading-tight">
                  <strong>Cell Officer</strong> converted 12 applicants to
                  students.
                </span>
                <span className="text-xs text-gray-400 mt-1">5 hours ago</span>
              </div>
            </li>
          </ul>
        </FormCard>
      </div>
    </FormPage>
  );
}
