import { FormPage, GridPanel, StatCard } from 'shared/new-components';
import { mockQuestions, mockStudentAnswers } from '../../data';

export default function QuestionAnalysisReport() {
  const answeredQuestions = mockStudentAnswers.filter(
    a => a.marksObtained !== undefined
  );
  const avgMarks =
    answeredQuestions.length > 0
      ? (
          answeredQuestions.reduce((s, a) => s + (a.marksObtained || 0), 0) /
          answeredQuestions.length
        ).toFixed(1)
      : '0';

  const flaggedCount = mockStudentAnswers.filter(a => a.isFlagged).length;

  const data = mockQuestions.map(q => {
    const answers = mockStudentAnswers.filter(
      a => a.questionId === q.id && a.marksObtained !== undefined
    );
    const avg =
      answers.length > 0
        ? (
            answers.reduce((s, a) => s + (a.marksObtained || 0), 0) /
            answers.length
          ).toFixed(1)
        : '-';
    const flagged = mockStudentAnswers.filter(
      a => a.questionId === q.id && a.isFlagged
    ).length;
    return { ...q, avg, flagged };
  });

  return (
    <FormPage
      title="Question Analysis"
      description="Performance analysis per question"
    >
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Questions"
          value={mockQuestions.length}
          icon="quiz"
          colorScheme="blue"
        />
        <StatCard
          title="Avg Marks"
          value={avgMarks}
          icon="trending_up"
          colorScheme="green"
        />
        <StatCard
          title="Flagged"
          value={flaggedCount}
          icon="flag"
          colorScheme="red"
        />
      </div>
      <GridPanel
        title="Question-wise Analysis"
        data={data}
        columns={[
          {
            field: 'questionText',
            header: 'Question',
            cell: row => (
              <span className="text-xs max-w-xs truncate block">
                {row.questionText}
              </span>
            ),
          },
          {
            field: 'type',
            header: 'Type',
            cell: row => (
              <span className="text-xs">{row.type.replace(/_/g, ' ')}</span>
            ),
          },
          { field: 'marks', header: 'Max Marks' },
          { field: 'avg', header: 'Avg Obtained' },
          {
            field: 'flagged',
            header: 'Flagged',
            cell: row => (
              <>
                {row.flagged > 0 ? (
                  <span className="text-red-600">{row.flagged}</span>
                ) : (
                  '-'
                )}
              </>
            ),
          },
        ]}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
      />
    </FormPage>
  );
}
