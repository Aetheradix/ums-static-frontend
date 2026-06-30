import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel, StatCard } from 'shared/new-components';
import { mockExams, mockRegistrations, mockResults } from '../../data';

import { InfoBanner } from '../../components';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const studentId = 8;
  const myRegs = mockRegistrations.filter(r => r.studentId === studentId);
  const registeredExamIds = myRegs.map(r => r.examId);
  const registeredExams = mockExams.filter(e =>
    registeredExamIds.includes(e.id)
  );
  const upcoming = registeredExams.filter(e =>
    ['published', 'registration_open'].includes(e.status)
  );
  const completedResults = mockResults.filter(r => r.studentId === studentId);
  const pendingResults = registeredExams.filter(
    e => e.status !== 'result_published'
  );
  const avgPercentage =
    completedResults.length > 0
      ? Math.round(
          completedResults.reduce((a, r) => a + r.percentage, 0) /
            completedResults.length
        )
      : 0;
  const myPassRate =
    completedResults.length > 0
      ? Math.round(
          (completedResults.filter(r => r.isPassed).length /
            completedResults.length) *
            100
        )
      : 0;

  const gradeCounts: Record<string, number> = {};
  completedResults.forEach(r => {
    gradeCounts[r.grade] = (gradeCounts[r.grade] || 0) + 1;
  });
  const gradeLabels = Object.keys(gradeCounts);
  const gradeData = Object.values(gradeCounts);
  const gradeColors: Record<string, string> = {
    O: '#22c55e',
    A: '#3b82f6',
    B: '#f59e0b',
    C: '#f97316',
    D: '#ef4444',
  };

  const performanceData = {
    labels: gradeLabels,
    datasets: [
      {
        data: gradeData,
        backgroundColor: gradeLabels.map(g => gradeColors[g] || '#94a3b8'),
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

  return (
    <FormPage
      title="Student Dashboard"
      description="Overview of your examinations and results"
      breadcrumbs={[
        {
          label: 'Open Book Examination',
          to: '/home/sub-menu/open-book-examination',
        },
        { label: 'Student Dashboard' },
      ]}
    >
      <InfoBanner message="View your examination schedule and latest updates here." />
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Registered"
            value={myRegs.length}
            icon="assignment"
            colorScheme="blue"
            subtitle="Exams registered"
          />
          <StatCard
            title="Upcoming"
            value={upcoming.length}
            icon="calendar_today"
            colorScheme="orange"
            subtitle="Yet to be taken"
          />
          <StatCard
            title="Completed"
            value={completedResults.length}
            icon="check_circle"
            colorScheme="green"
            subtitle="Results published"
          />
          <StatCard
            title="Pending Results"
            value={pendingResults.length}
            icon="hourglass_empty"
            colorScheme="purple"
            subtitle="Awaiting publication"
          />
          <StatCard
            title="Avg Percentage"
            value={`${avgPercentage}%`}
            icon="trending_up"
            colorScheme="teal"
            subtitle="Across all results"
          />
          <StatCard
            title="Pass Rate"
            value={`${myPassRate}%`}
            icon="emoji_events"
            colorScheme="green"
            subtitle="Exams passed"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormCard
            title="My Performance"
            icon="chart-pie"
            subtitle="Grade distribution across completed exams"
          >
            <div className="w-full h-64">
              <Chart
                type="doughnut"
                data={performanceData}
                options={doughnutOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>

          <FormCard title="Quick Actions" icon="bolt">
            <div className="grid grid-cols-2 gap-3">
              <Button
                label="Exam Schedule"
                icon="calendar_month"
                onClick={() =>
                  navigate('/open-book-examination/student/schedule')
                }
              />
              <Button
                label="My Results"
                icon="fact_check"
                onClick={() =>
                  navigate('/open-book-examination/student/results')
                }
              />
              <Button
                label="Register for Exam"
                icon="how_to_reg"
                onClick={() =>
                  navigate('/open-book-examination/student/registration')
                }
              />
              <Button
                label="Revaluation"
                icon="refresh"
                onClick={() =>
                  navigate('/open-book-examination/student/revaluation')
                }
              />
            </div>
          </FormCard>
        </div>

        <GridPanel
          title="Upcoming Exams"
          data={upcoming}
          columns={[
            { field: 'title', header: 'Exam' },
            { field: 'subjectName', header: 'Subject' },
            { field: 'scheduledDate', header: 'Date' },
            { field: 'startTime', header: 'Start' },
            {
              field: 'durationMinutes',
              header: 'Duration',
              cell: row => <span>{row.durationMinutes} min</span>,
            },
            {
              field: 'isOpenBook',
              header: 'Open Book',
              cell: row => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${row.isOpenBook ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {row.isOpenBook ? 'Yes' : 'No'}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: row => (
                <Button
                  label="View"
                  icon="visibility"
                  size="small"
                  onClick={() =>
                    navigate(
                      `/open-book-examination/student/exam/${row.id}/instructions`
                    )
                  }
                />
              ),
            },
          ]}
          dataKey="id"
          searchBox
          pagination={{ rows: 5 }}
        />

        <GridPanel
          title="Recent Results"
          data={completedResults.slice().reverse()}
          columns={[
            { field: 'examTitle', header: 'Exam' },
            {
              header: 'Score',
              cell: row => (
                <span>
                  {row.totalMarksObtained}/{row.totalMarks} (
                  {row.percentage.toFixed(1)}%)
                </span>
              ),
            },
            { field: 'grade', header: 'Grade' },
            {
              field: 'isPassed',
              header: 'Status',
              cell: row => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${row.isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {row.isPassed ? 'Passed' : 'Failed'}
                </span>
              ),
            },
            {
              header: 'Actions',
              cell: row => (
                <Button
                  label="View"
                  icon="visibility"
                  size="small"
                  onClick={() =>
                    navigate(`/open-book-examination/student/results/${row.id}`)
                  }
                />
              ),
            },
          ]}
          dataKey="id"
          pagination={{ rows: 5 }}
        />
      </div>
    </FormPage>
  );
}
