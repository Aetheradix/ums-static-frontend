import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel } from 'shared/new-components';
import { mockAttempts, mockEvaluations, mockExams } from '../../data';
import { InfoBanner } from '../../components';

export default function EvaluationProgress() {
  const navigate = useNavigate();
  const [examFilter, setExamFilter] = useState<string>('all');

  const filteredExams =
    examFilter === 'all'
      ? mockExams
      : mockExams.filter(e => e.id === Number(examFilter));

  const data = useMemo(
    () =>
      filteredExams.flatMap(exam =>
        mockAttempts
          .filter(a => a.examId === exam.id)
          .map(attempt => {
            const evalRec = mockEvaluations.find(
              e => e.attemptId === attempt.id
            );
            return {
              id: attempt.id,
              studentName: attempt.studentName,
              rollNo: attempt.rollNo,
              examTitle: attempt.examTitle,
              status: attempt.status,
              evalStatus: evalRec ? evalRec.status : 'pending',
              marksDisplay: evalRec
                ? `${evalRec.marksAwarded}/${evalRec.totalMarks}`
                : '-',
              attemptId: attempt.id,
            };
          })
      ),
    [filteredExams]
  );

  return (
    <FormPage
      title="Evaluation Progress"
      description="Track evaluation status across exams and students"
    >
      <InfoBanner
        title="About Evaluation Progress"
        message="Track detailed metrics on your evaluation speed and completion rates to ensure all grading deadlines are met efficiently."
      />
      <GridPanel
        data={data}
        columns={[
          { field: 'studentName', header: 'Student' },
          { field: 'rollNo', header: 'Roll No' },
          { field: 'examTitle', header: 'Exam' },
          {
            field: 'status',
            header: 'Attempt Status',
            cell: row => (
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  row.status === 'submitted'
                    ? 'bg-blue-100 text-blue-700'
                    : row.status === 'timed_out'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {row.status.replace(/_/g, ' ')}
              </span>
            ),
          },
          {
            field: 'evalStatus',
            header: 'Evaluation',
            cell: row => (
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  row.evalStatus === 'pending'
                    ? 'bg-gray-100 text-gray-600'
                    : row.evalStatus === 'in_progress'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                }`}
              >
                {row.evalStatus.replace(/_/g, ' ')}
              </span>
            ),
          },
          { field: 'marksDisplay', header: 'Score' },
          {
            header: 'Actions',
            cell: row => (
              <Button
                label="View"
                icon="visibility"
                onClick={() =>
                  navigate(
                    `/open-book-examination/teacher/evaluation/${row.attemptId}`
                  )
                }
              />
            ),
          },
        ]}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        toolbar={
          <DropDownList
            value={examFilter}
            onChange={v => setExamFilter(v as string)}
            data={[
              { value: 'all', label: 'All Exams' },
              ...mockExams.map(e => ({ value: String(e.id), label: e.title })),
            ]}
            textField="label"
            valueField="value"
          />
        }
      />
    </FormPage>
  );
}
