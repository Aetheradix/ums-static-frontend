import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { mockResults, mockStudentAnswers } from '../../data';

import { InfoBanner } from '../../components';

export default function ResultDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const result = mockResults.find(r => r.id === Number(id));

  if (!result) {
    return (
      <FormPage title="Result Detail">
        <InfoBanner message="View the detailed breakdown of your examination result." />
        <p className="text-gray-500">Result not found.</p>
      </FormPage>
    );
  }

  const answers = mockStudentAnswers.filter(
    a => a.attemptId === result.attemptId
  );

  return (
    <FormPage
      title="Result Detail"
      description={`${result.examTitle} — ${result.subjectName}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FormCard>
          <p className="text-sm text-gray-500">Total Score</p>
          <p className="text-2xl font-bold">
            {result.totalMarksObtained}/{result.totalMarks}
          </p>
        </FormCard>
        <FormCard>
          <p className="text-sm text-gray-500">Percentage</p>
          <p className="text-2xl font-bold">{result.percentage.toFixed(1)}%</p>
        </FormCard>
        <FormCard>
          <p className="text-sm text-gray-500">Grade</p>
          <p className="text-2xl font-bold">
            {result.grade} ({result.gradePoint})
          </p>
        </FormCard>
      </div>
      <GridPanel
        title="Answer-wise Breakdown"
        data={answers}
        columns={[
          {
            header: '#',
            cell: (_row, { rowIndex }) => <span>{rowIndex + 1}</span>,
          },
          { field: 'questionText', header: 'Question' },
          {
            field: 'questionType',
            header: 'Type',
            cell: row => <span>{row.questionType.replace(/_/g, ' ')}</span>,
          },
          {
            header: 'Marks',
            cell: row =>
              row.marksObtained !== undefined ? (
                <span
                  className={
                    row.marksObtained === row.maxMarks
                      ? 'text-green-600'
                      : row.marksObtained === 0
                        ? 'text-red-600'
                        : 'text-orange-600'
                  }
                >
                  {row.marksObtained}/{row.maxMarks}
                </span>
              ) : (
                <span className="text-gray-400">Pending</span>
              ),
          },
          {
            field: 'remarks',
            header: 'Remarks',
            cell: row => <span>{row.remarks || '-'}</span>,
          },
        ]}
        dataKey="id"
        pagination={{ rows: 10 }}
      />
      <div className="flex justify-end gap-2 mt-4">
        <Button
          label="Back to Results"
          icon="arrow_back"
          variant="outlined"
          onClick={() => navigate('/open-book-examination/student/results')}
        />
        {result.isPassed === false && (
          <Button
            label="Request Revaluation"
            icon="rate_review"
            onClick={() =>
              navigate('/open-book-examination/student/revaluation')
            }
          />
        )}
      </div>
    </FormPage>
  );
}
