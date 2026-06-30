import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel } from 'shared/new-components';
import { mockEvaluations, mockExams, mockUsers } from '../../data';
import { InfoBanner } from '../../components';

export default function Evaluators() {
  const [examId, setExamId] = useState<string>('');

  const teachers = mockUsers.filter(u => u.role === 'teacher');
  const examOptions = mockExams
    .filter(e => e.status === 'evaluation' || e.status === 'moderation')
    .map(e => ({ value: String(e.id), label: e.title }));
  const evals = examId
    ? mockEvaluations.filter(e => e.examId === Number(examId))
    : [];

  return (
    <FormPage
      title="Evaluator Assignment"
      description="Assign teachers to evaluate student answers"
    >
      <InfoBanner
        title="About Evaluator Assignment"
        message="Assign available teachers to evaluate exams that have concluded. You can auto-distribute assignments evenly or assign them manually to specific evaluators."
      />
      <div className="mb-4">
        <DropDownList
          label="Select Exam"
          value={examId}
          onChange={v => setExamId(v as string)}
          data={examOptions}
          textField="label"
          valueField="value"
        />
      </div>
      {examId && (
        <GridPanel
          title="Evaluations"
          data={evals}
          dataKey="id"
          pagination={{ rows: 10 }}
          searchBox
          toolbar={<Button label="Auto-Distribute" icon="sync" />}
          columns={
            [
              { field: 'studentName', header: 'Student' },
              {
                field: 'status',
                header: 'Status',
                cell: (row: { status: string }) => (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.status === 'completed' ? 'bg-green-100 text-green-800' : row.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {row.status}
                  </span>
                ),
              },
              {
                field: 'marksAwarded',
                header: 'Marks',
                cell: (row: {
                  status: string;
                  marksAwarded?: number;
                  totalMarks?: number;
                }) => (
                  <span>
                    {row.status === 'completed'
                      ? `${row.marksAwarded}/${row.totalMarks}`
                      : '-'}
                  </span>
                ),
              },
              {
                field: 'evaluatedByName',
                header: 'Evaluator',
                cell: (row: {
                  evaluatedByName?: string;
                  evaluatedBy?: number;
                }) => (
                  <span>
                    {row.evaluatedByName || (
                      <span className="text-gray-400 italic">Not assigned</span>
                    )}
                  </span>
                ),
              },
              {
                header: 'Actions',
                cell: () => (
                  <DropDownList
                    value=""
                    onChange={() => {}}
                    data={[
                      { value: '', label: 'Select...' },
                      ...teachers.map(t => ({
                        value: String(t.id),
                        label: t.name,
                      })),
                    ]}
                    textField="label"
                    valueField="value"
                  />
                ),
              },
            ] as any
          }
        />
      )}
    </FormPage>
  );
}
