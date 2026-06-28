import { Chart } from 'primereact/chart';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel, StatCard } from 'shared/new-components';
import {
  mockAttempts,
  mockEvaluations,
  mockExams,
  mockQuestions,
  mockStudyMaterials,
} from '../../data';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const teacherId = 2;

  const myExams = mockExams.filter(e => e.createdBy === teacherId);
  const myExamIds = myExams.map(e => e.id);
  const draftExams = myExams.filter(e => e.status === 'draft');
  const publishedExams = myExams.filter(e =>
    ['published', 'registration_open', 'result_published'].includes(e.status)
  );
  const questionBank = mockQuestions.filter(q => q.createdBy === teacherId);
  const pendingEval = mockEvaluations.filter(
    e => myExamIds.includes(e.examId) && e.status === 'pending'
  ).length;
  const inProgressEval = mockEvaluations.filter(
    e => myExamIds.includes(e.examId) && e.status === 'in_progress'
  ).length;
  const completedEval = mockEvaluations.filter(
    e => myExamIds.includes(e.examId) && e.status === 'completed'
  ).length;
  const totalEvaluations = pendingEval + inProgressEval + completedEval;
  const pendingApprovals = mockStudyMaterials.filter(
    m => m.status === 'pending' && myExamIds.includes(m.examId)
  ).length;
  const studentSubmissions = mockAttempts.filter(
    a => myExamIds.includes(a.examId) && a.status === 'submitted'
  ).length;

  const upcomingDeadlines = myExams.filter(e =>
    ['published', 'registration_open'].includes(e.status)
  );

  const evalProgressData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Evaluations',
        backgroundColor: ['#f59e0b', '#3b82f6', '#22c55e'],
        borderRadius: 6,
        data: [pendingEval, inProgressEval, completedEval],
      },
    ],
  };

  const evalProgressOptions = {
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#94a3b8', padding: 16, font: { size: 12 } },
      },
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

  return (
    <FormPage
      title="Teacher Dashboard"
      description="Overview of your examinations, resources, and evaluation tasks"
      breadcrumbs={[
        { label: 'Open Book Examination' },
        { label: 'Teacher Dashboard' },
      ]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="My Exams"
            value={myExams.length}
            icon="assignment"
            colorScheme="blue"
            subtitle="Total exams created"
          />
          <StatCard
            title="Draft Exams"
            value={draftExams.length}
            icon="edit_note"
            colorScheme="orange"
            subtitle="Not yet published"
          />
          <StatCard
            title="Published"
            value={publishedExams.length}
            icon="publish"
            colorScheme="green"
            subtitle="Live or completed"
          />
          <StatCard
            title="Question Bank"
            value={questionBank.length}
            icon="quiz"
            colorScheme="purple"
            subtitle="Questions created"
          />
          <StatCard
            title="Pending Eval"
            value={pendingEval}
            icon="grading"
            colorScheme="red"
            subtitle="Awaiting your review"
          />
          <StatCard
            title="Completed Eval"
            value={completedEval}
            icon="check_circle"
            colorScheme="green"
            subtitle={`of ${totalEvaluations} total`}
          />
          <StatCard
            title="Student Submissions"
            value={studentSubmissions}
            icon="file_upload"
            colorScheme="teal"
            subtitle="Answers submitted"
          />
          <StatCard
            title="Pending Approvals"
            value={pendingApprovals}
            icon="how_to_reg"
            colorScheme="indigo"
            subtitle="Student resources"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FormCard
            title="Evaluation Progress"
            icon="bar_chart"
            subtitle="Breakdown of evaluation status across your exams"
          >
            <div className="w-full h-72">
              <Chart
                type="bar"
                data={evalProgressData}
                options={evalProgressOptions}
                className="w-full h-full"
              />
            </div>
          </FormCard>

          <FormCard title="Quick Actions" icon="bolt">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  label="Create Exam"
                  icon="plus"
                  onClick={() =>
                    navigate('/open-book-examination/teacher/exams/create')
                  }
                />
                <Button
                  label="Question Bank"
                  icon="quiz"
                  onClick={() =>
                    navigate('/open-book-examination/teacher/question-bank')
                  }
                />
                <Button
                  label="Evaluation"
                  icon="grading"
                  onClick={() =>
                    navigate('/open-book-examination/teacher/evaluation')
                  }
                />
                <Button
                  label="Resources"
                  icon="folder"
                  onClick={() =>
                    navigate('/open-book-examination/teacher/resources')
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  label="Student Approvals"
                  icon="how_to_reg"
                  onClick={() =>
                    navigate('/open-book-examination/teacher/approvals')
                  }
                />
                <Button
                  label="Re-evaluation"
                  icon="refresh"
                  onClick={() =>
                    navigate('/open-book-examination/teacher/re-evaluation')
                  }
                />
                <Button
                  label="Rubrics"
                  icon="checklist"
                  onClick={() =>
                    navigate('/open-book-examination/teacher/rubrics')
                  }
                />
                <Button
                  label="My Exams"
                  icon="assignment"
                  onClick={() =>
                    navigate('/open-book-examination/teacher/exams')
                  }
                />
              </div>
            </div>
          </FormCard>
        </div>

        <GridPanel
          title="Upcoming Deadlines"
          data={upcomingDeadlines}
          columns={[
            { field: 'title', header: 'Exam' },
            { field: 'subjectName', header: 'Subject' },
            { field: 'scheduledDate', header: 'Date' },
            {
              field: 'status',
              header: 'Status',
              cell: row => (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${row.status === 'published' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {row.status.replace(/_/g, ' ')}
                </span>
              ),
            },
            {
              field: 'durationMinutes',
              header: 'Duration',
              cell: row => <span>{row.durationMinutes} min</span>,
            },
          ]}
          dataKey="id"
          searchBox
          pagination={{ rows: 5 }}
        />
      </div>
    </FormPage>
  );
}
