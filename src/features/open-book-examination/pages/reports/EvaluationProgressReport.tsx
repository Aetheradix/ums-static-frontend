import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel, StatCard } from 'shared/new-components';
import { mockEvaluations, mockExams } from '../../data';

export default function EvaluationProgressReport() {
  const [examFilter, setExamFilter] = useState<string>('all');
  const evaluations =
    examFilter === 'all'
      ? mockEvaluations
      : mockEvaluations.filter(e => e.examId === Number(examFilter));

  const pending = evaluations.filter(e => e.status === 'pending').length;
  const inProgress = evaluations.filter(e => e.status === 'in_progress').length;
  const completed = evaluations.filter(e => e.status === 'completed').length;

  return (
    <FormPage
      title="Evaluation Progress Report"
      description="Overall evaluation status"
    >
      <div className="grid grid-cols-3 gap-4 mb-6">
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
        title="Evaluation Details"
        data={evaluations}
        columns={[
          {
            field: 'evaluatedByName',
            header: 'Evaluator',
            cell: row => <>{row.evaluatedByName || '-'}</>,
          },
          { field: 'examTitle', header: 'Exam' },
          { field: 'studentName', header: 'Student' },
          {
            field: 'marksAwarded',
            header: 'Score',
            cell: row => (
              <>
                {row.marksAwarded}/{row.totalMarks}
              </>
            ),
          },
          {
            field: 'status',
            header: 'Status',
            cell: row => (
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  row.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : row.status === 'in_progress'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {row.status.replace(/_/g, ' ')}
              </span>
            ),
          },
          {
            field: 'evaluatedAt',
            header: 'Evaluated At',
            cell: row => (
              <span className="text-xs">
                {row.evaluatedAt
                  ? new Date(row.evaluatedAt).toLocaleString()
                  : '-'}
              </span>
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
