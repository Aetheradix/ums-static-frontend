import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel, StatCard } from 'shared/new-components';
import {
  mockAttempts,
  mockAuditLogs,
  mockEvaluations,
  mockExams,
  mockRegistrations,
  mockResults,
  mockStudents,
  mockUsers,
} from '../../data';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  published: 'Published',
  registration_open: 'Registration Open',
  evaluation: 'Evaluation',
  result_published: 'Result Published',
};

const STATUS_COLORS: Record<string, string> = {
  draft: '#94a3b8',
  published: '#3b82f6',
  registration_open: '#f59e0b',
  evaluation: '#8b5cf6',
  result_published: '#22c55e',
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const totalExams = mockExams.length;
  const activeExams = mockExams.filter(e =>
    ['in_progress', 'evaluation'].includes(e.status)
  ).length;
  const totalStudents = mockStudents.length;
  const totalTeachers = mockUsers.filter(u => u.role === 'teacher').length;
  const registeredStudents = new Set(mockRegistrations.map(r => r.studentId))
    .size;
  const submittedCount = mockAttempts.filter(
    a => a.status === 'submitted'
  ).length;
  const pendingEvaluation = mockEvaluations.filter(
    e => e.status === 'pending'
  ).length;
  const publishedResults = mockResults.length;
  const passed = mockResults.filter(r => r.isPassed).length;
  const failed = mockResults.filter(r => !r.isPassed).length;
  const passRate =
    mockResults.length > 0
      ? Math.round((passed / mockResults.length) * 100)
      : 0;

  const statusKeys = [
    'draft',
    'published',
    'registration_open',
    'evaluation',
    'result_published',
  ];
  const statusCounts = statusKeys.map(
    s => mockExams.filter(e => e.status === s).length
  );

  const examsByStatusData = {
    labels: statusKeys.map(s => STATUS_LABELS[s]),
    datasets: [
      {
        label: 'Exams',
        backgroundColor: statusKeys.map(s => STATUS_COLORS[s]),
        borderRadius: 6,
        data: statusCounts,
      },
    ],
  };

  const examsByStatusOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#94a3b8' },
        grid: { color: 'rgba(148,163,184,0.1)' },
      },
    },
    maintainAspectRatio: false,
  };

  const passFailData = {
    labels: ['Pass', 'Fail'],
    datasets: [
      {
        data: [passed, failed],
        backgroundColor: ['#22c55e', '#ef4444'],
        hoverOffset: 8,
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#94a3b8',
          padding: 16,
          font: { size: 12 },
          boxWidth: 12,
          borderRadius: 4,
        },
      },
    },
    cutout: '65%',
    maintainAspectRatio: false,
  };

  const openBookCount = mockExams.filter(e => e.isOpenBook).length;
  const closedBookCount = mockExams.filter(e => !e.isOpenBook).length;

  const examTypeData = {
    labels: ['Open Book', 'Closed Book'],
    datasets: [
      {
        data: [openBookCount, closedBookCount],
        backgroundColor: ['#8b5cf6', '#94a3b8'],
        hoverOffset: 8,
        borderWidth: 0,
      },
    ],
  };

  const recentActivity = [...mockAuditLogs]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 10);

  const actionBadge = (action: string) => {
    const map: Record<string, string> = {
      INSERT: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-2 py-0.5 rounded text-xs font-medium ${map[action] || 'bg-gray-100 text-gray-800'}`}
      >
        {action}
      </span>
    );
  };

  return (
    <FormPage
      title="Admin Dashboard"
      description="System-wide overview of the Open Book Examination platform"
      breadcrumbs={[
        { label: 'Open Book Examination' },
        { label: 'Admin Dashboard' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Exams"
            value={totalExams}
            icon="assignment"
            colorScheme="blue"
            subtitle="Across all courses"
          />
          <StatCard
            title="Active Exams"
            value={activeExams}
            icon="play_circle"
            colorScheme="green"
            subtitle="In progress or evaluation"
          />
          <StatCard
            title="Total Students"
            value={totalStudents}
            icon="people"
            colorScheme="pink"
            subtitle="Enrolled students"
          />
          <StatCard
            title="Total Teachers"
            value={totalTeachers}
            icon="school"
            colorScheme="purple"
            subtitle="Faculty members"
          />
          <StatCard
            title="Registered"
            value={registeredStudents}
            icon="how_to_reg"
            colorScheme="indigo"
            subtitle="Students with registrations"
          />
          <StatCard
            title="Submitted"
            value={submittedCount}
            icon="file_upload"
            colorScheme="teal"
            subtitle="Answers submitted"
          />
          <StatCard
            title="Pending Eval"
            value={pendingEvaluation}
            icon="grading"
            colorScheme="orange"
            subtitle="Awaiting evaluation"
          />
          <StatCard
            title="Pass Rate"
            value={`${passRate}%`}
            icon="trending_up"
            colorScheme="green"
            subtitle={`${passed} passed of ${publishedResults} results`}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <FormCard
            title="Exams by Status"
            icon="bar_chart"
            className="xl:col-span-2"
          >
            <div className="w-full h-72">
              <Chart
                type="bar"
                data={examsByStatusData}
                options={examsByStatusOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>
          <div className="flex flex-col gap-6">
            <FormCard title="Pass / Fail" icon="pie_chart">
              <div className="w-full h-48">
                <Chart
                  type="doughnut"
                  data={passFailData}
                  options={doughnutOptions}
                  className="w-full h-full"
                />
              </div>
            </FormCard>
            <FormCard title="Exam Type" icon="book">
              <div className="w-full h-48">
                <Chart
                  type="doughnut"
                  data={examTypeData}
                  options={doughnutOptions}
                  className="w-full h-full"
                />
              </div>
            </FormCard>
          </div>
        </div>

        <GridPanel
          title="Recent Activity"
          data={recentActivity}
          columns={[
            {
              field: 'timestamp',
              header: 'Date',
              cell: row => (
                <span>{new Date(row.timestamp).toLocaleDateString()}</span>
              ),
            },
            {
              field: 'action',
              header: 'Action',
              cell: row => actionBadge(row.action),
            },
            {
              field: 'tableName',
              header: 'Module',
              cell: row => <span>{row.tableName.replace(/_/g, ' ')}</span>,
            },
            { field: 'performedByName', header: 'User' },
          ]}
          dataKey="id"
          searchBox
          pagination={{ rows: 5 }}
        />

        <FormCard title="Quick Actions" icon="bolt">
          <div className="flex flex-wrap gap-3">
            <Button
              label="Courses"
              icon="book"
              onClick={() => navigate('/open-book-examination/admin/courses')}
            />
            <Button
              label="Users"
              icon="people"
              onClick={() => navigate('/open-book-examination/admin/users')}
            />
            <Button
              label="Evaluators"
              icon="grading"
              onClick={() =>
                navigate('/open-book-examination/admin/evaluators')
              }
            />
            <Button
              label="Result Publishing"
              icon="fact_check"
              onClick={() =>
                navigate('/open-book-examination/admin/result-publishing')
              }
            />
            <Button
              label="Audit Logs"
              icon="history"
              onClick={() =>
                navigate('/open-book-examination/admin/audit-logs')
              }
            />
            <Button
              label="Eligibility"
              icon="checklist"
              onClick={() =>
                navigate('/open-book-examination/admin/eligibility')
              }
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
