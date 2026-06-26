import { FormPage, FormCard } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { Chart } from 'primereact/chart';

export default function AdminDashboard() {
  const progressData = {
    labels: ['BCA', 'B.Com', 'MBA', 'B.Tech'],
    datasets: [
      {
        label: 'Average Course Progress (%)',
        backgroundColor: '#4f46e5',
        data: [75, 60, 85, 45],
      },
    ],
  };

  const contentDistributionData = {
    labels: ['Video', 'PDF', 'PPT', 'Assignments'],
    datasets: [
      {
        data: [300, 150, 100, 292],
        backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'],
      },
    ],
  };

  const teacherSubjectData = {
    labels: ['Amit Sir', 'Rahul Sir', 'Priya Maam', 'Ravi Sir'],
    datasets: [
      {
        label: 'Subjects Assigned',
        backgroundColor: '#f59e0b',
        data: [4, 3, 5, 2],
      },
    ],
  };

  const certificateData = {
    labels: ['Generated', 'Pending'],
    datasets: [
      {
        data: [450, 120],
        backgroundColor: ['#10b981', '#f43f5e'],
      },
    ],
  };

  return (
    <FormPage
      title="LMS Dashboard"
      description="Overview of Learning Management System statistics."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
        <FormCard className="flex items-center gap-4">
          <div className="bg-orange-100 text-orange-600 p-3 rounded-lg flex items-center justify-center">
            <Icon name="people" />
          </div>
          <div>
            <div className="text-gray-500 text-sm">Total Enrollments</div>
            <div className="text-2xl font-bold text-gray-800">5,230</div>
          </div>
        </FormCard>

        <FormCard className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-lg flex items-center justify-center">
            <Icon name="menu_book" />
          </div>
          <div>
            <div className="text-gray-500 text-sm">Total Topics</div>
            <div className="text-2xl font-bold text-gray-800">145</div>
          </div>
        </FormCard>

        <FormCard className="flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-lg flex items-center justify-center">
            <Icon name="cloud_upload" />
          </div>
          <div>
            <div className="text-gray-500 text-sm">Total Upload Content</div>
            <div className="text-2xl font-bold text-gray-800">842</div>
          </div>
        </FormCard>

        <FormCard className="flex items-center gap-4">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-lg flex items-center justify-center">
            <Icon name="workspace_premium" />
          </div>
          <div>
            <div className="text-gray-500 text-sm">Certificates Generated</div>
            <div className="text-2xl font-bold text-gray-800">450</div>
          </div>
        </FormCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormCard title="Course Wise Student Progress">
          <div className="card flex justify-center">
            <Chart
              type="bar"
              data={progressData}
              options={{ scales: { y: { beginAtZero: true, max: 100 } } }}
              className="w-full"
            />
          </div>
        </FormCard>

        <FormCard title="Content Distribution">
          <div className="card flex justify-center">
            <Chart
              type="pie"
              data={contentDistributionData}
              className="w-full md:w-[25rem]"
            />
          </div>
        </FormCard>

        <FormCard title="Subjects per Teacher">
          <div className="card flex justify-center">
            <Chart type="bar" data={teacherSubjectData} className="w-full" />
          </div>
        </FormCard>

        <FormCard title="Certificate Status (Generated vs Pending)">
          <div className="card flex justify-center">
            <Chart
              type="doughnut"
              data={certificateData}
              className="w-full md:w-[25rem]"
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
