import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, GridPanel, StatCard } from 'shared/new-components';
import { mockAttempts, mockEvaluations, mockExams } from '../../data';
import { InfoBanner } from '../../components';

export default function EvaluationDashboard() {
  const navigate = useNavigate();
  const pending = mockEvaluations.filter(e => e.status === 'pending').length;
  const inProgress = mockEvaluations.filter(
    e => e.status === 'in_progress'
  ).length;
  const completed = mockEvaluations.filter(
    e => e.status === 'completed'
  ).length;
  const totalAttempts = mockAttempts.length;

  const examsData = mockExams
    .filter(e => e.status === 'evaluation' || e.status === 'result_draft')
    .map(exam => {
      const attempts = mockAttempts.filter(a => a.examId === exam.id);
      const evaluated = mockEvaluations.filter(
        e => e.examId === exam.id && e.status === 'completed'
      ).length;
      return {
        ...exam,
        totalAttempts: attempts.length,
        evaluated,
        pendingAttempts: attempts.length - evaluated,
      };
    });

  const columns = [
    { field: 'title', header: 'Exam' },
    { field: 'subjectName', header: 'Subject' },
    { field: 'totalAttempts', header: 'Total Attempts' },
    { field: 'evaluated', header: 'Evaluated' },
    { field: 'pendingAttempts', header: 'Pending' },
    {
      header: 'Actions',
      cell: (_row: any) => (
        <Button
          label="Evaluate"
          icon="rate_review"
          onClick={() =>
            navigate('/open-book-examination/teacher/evaluation/progress')
          }
        />
      ),
    },
  ] as any;

  return (
    <FormPage
      title="Evaluation Dashboard"
      description="Overview of evaluation progress across exams"
    >
      <InfoBanner
        title="About Evaluation Dashboard"
        message="Access all your assigned evaluations in one place. Monitor your grading progress, view pending assignments, and access student submissions for grading."
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Attempts"
          value={totalAttempts}
          icon="assignment"
          colorScheme="blue"
        />
        <StatCard
          title="Pending"
          value={pending}
          icon="hourglass_empty"
          colorScheme="orange"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon="sync"
          colorScheme="purple"
        />
        <StatCard
          title="Completed"
          value={completed}
          icon="check_circle"
          colorScheme="green"
        />
      </div>
      <GridPanel
        title="Exams Requiring Evaluation"
        data={examsData}
        columns={columns}
        dataKey="id"
        pagination={{ rows: 10 }}
      />
    </FormPage>
  );
}
