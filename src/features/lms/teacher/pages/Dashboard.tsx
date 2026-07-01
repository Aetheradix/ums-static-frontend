import { FormPage, FormCard } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { Chart } from 'primereact/chart';
import { learningUrls } from '../../urls';
import { recentActivities } from '../../mocks';

export default function TeacherDashboard() {
  const studentPerformanceData = {
    labels: ['Unit 1 Test', 'Unit 2 Quiz', 'Assignment 1', 'Mid-Term Exam'],
    datasets: [
      {
        label: 'Class Average Score (%)',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        data: [82, 75, 88, 79],
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const assignmentStatusData = {
    labels: ['Graded', 'Submitted (Pending)', 'Not Submitted'],
    datasets: [
      {
        data: [118, 32, 10],
        backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
      },
    ],
  };

  const kpis = [
    { label: 'Assigned Courses', value: '4', icon: 'menu_book', bg: 'bg-green-50 text-green-600' },
    { label: 'Assigned Modules', value: '12', icon: 'view_module', bg: 'bg-blue-50 text-blue-600' },
    { label: 'Total Students', value: '150', icon: 'people', bg: 'bg-purple-50 text-purple-600' },
    { label: 'Pending Assessments', value: '15', icon: 'pending_actions', bg: 'bg-orange-50 text-orange-600' },
    { label: 'Submitted Assignments', value: '32', icon: 'assignment', bg: 'bg-indigo-50 text-indigo-600' },
    { label: 'Average Student Progress', value: '78%', icon: 'trending_up', bg: 'bg-teal-50 text-teal-600' },
  ];

  return (
    <FormPage
      title="Teacher Dashboard"
      description="Monitor class learning activities, grade assignments and view course statuses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Learning Management System', to: learningUrls.portal },
        { label: 'Teacher Portal', to: learningUrls.teacher.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pb-6">
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
        <FormCard title="Class Average Progress Trend">
          <div className="card flex justify-center">
            <Chart
              type="line"
              data={studentPerformanceData}
              options={{ scales: { y: { beginAtZero: true, max: 100 } } }}
              className="w-full"
            />
          </div>
        </FormCard>

        <FormCard title="Assignment Submission Status">
          <div className="card flex justify-center">
            <Chart
              type="pie"
              data={assignmentStatusData}
              className="w-full md:w-[25rem]"
            />
          </div>
        </FormCard>

        <FormCard title="Recent Activities" className="lg:col-span-2">
          <div className="space-y-4">
            {recentActivities
              .filter(act => act.role === 'Student' || act.role === 'Faculty')
              .map(act => (
                <div
                  key={act.id}
                  className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full text-gray-600 flex items-center justify-center">
                      <Icon name={act.role === 'Faculty' ? 'school' : 'person'} />
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
