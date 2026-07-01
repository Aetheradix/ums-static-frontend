import { FormPage, FormCard } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { Chart } from 'primereact/chart';
import { learningUrls } from '../../urls';
import { recentActivities } from '../../mocks';

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

  const kpis = [
    { label: 'Total Courses', value: '24', icon: 'menu_book', bg: 'bg-blue-50 text-blue-600' },
    { label: 'Total Modules', value: '56', icon: 'view_module', bg: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Topics', value: '145', icon: 'tag', bg: 'bg-orange-50 text-orange-600' },
    { label: 'Total Faculty', value: '18', icon: 'school', bg: 'bg-teal-50 text-teal-600' },
    { label: 'Total Students', value: '1,250', icon: 'people', bg: 'bg-purple-50 text-purple-600' },
    { label: 'Total Enrollments', value: '5,230', icon: 'assignment_turned_in', bg: 'bg-blue-50 text-blue-600' },
    { label: 'Total Learning Contents', value: '842', icon: 'cloud_upload', bg: 'bg-green-50 text-green-600' },
    { label: 'Total Quizzes', value: '60', icon: 'quiz', bg: 'bg-yellow-50 text-yellow-600' },
    { label: 'Total Assignments', value: '120', icon: 'assignment', bg: 'bg-red-50 text-red-600' },
    { label: 'Total Certificates Generated', value: '450', icon: 'workspace_premium', bg: 'bg-purple-50 text-purple-600' },
    { label: 'Active Courses', value: '18', icon: 'play_circle', bg: 'bg-green-50 text-green-600' },
    { label: 'Completed Courses', value: '6', icon: 'check_circle', bg: 'bg-gray-50 text-gray-600' },
  ];

  return (
    <FormPage
      title="LMS Dashboard"
      description="Overview of Learning Management System statistics."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Admin Portal', to: learningUrls.admin.portal },
        { label: 'Dashboard' },
      ]}
    >
      {/* 12 KPI cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-6">
        {kpis.map((kpi, idx) => (
          <FormCard key={idx} className="flex items-center gap-4 p-4">
            <div className={`${kpi.bg} p-3 rounded-lg flex items-center justify-center`}>
              <Icon name={kpi.icon} />
            </div>
            <div>
              <div className="text-gray-500 text-xs font-medium">{kpi.label}</div>
              <div className="text-xl font-bold text-gray-800 mt-0.5">{kpi.value}</div>
            </div>
          </FormCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <FormCard title="Course Wise Enrollment & Student Progress">
          <div className="card flex justify-center">
            <Chart
              type="bar"
              data={progressData}
              options={{ scales: { y: { beginAtZero: true, max: 100 } } }}
              className="w-full"
            />
          </div>
        </FormCard>

        <FormCard title="Content Upload Summary (Distribution)">
          <div className="card flex justify-center">
            <Chart
              type="pie"
              data={contentDistributionData}
              className="w-full md:w-[25rem]"
            />
          </div>
        </FormCard>

        <FormCard title="Faculty Performance (Subjects per Teacher)">
          <div className="card flex justify-center">
            <Chart type="bar" data={teacherSubjectData} className="w-full" />
          </div>
        </FormCard>

        <FormCard title="Assessment Summary (Certificates Generated vs Pending)">
          <div className="card flex justify-center">
            <Chart
              type="doughnut"
              data={certificateData}
              className="w-full md:w-[25rem]"
            />
          </div>
        </FormCard>

        {/* Recent Activities */}
        <FormCard title="Recent Activities" className="lg:col-span-2">
          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full text-gray-600 flex items-center justify-center">
                    <Icon
                      name={
                        act.role === 'Faculty'
                          ? 'school'
                          : act.role === 'Admin'
                          ? 'admin_panel_settings'
                          : 'person'
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{act.user}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{act.action}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium">{act.time}</span>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
