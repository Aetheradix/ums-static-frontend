import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel } from 'shared/new-components';
import { mockAttempts, mockExams } from '../../data';

export default function SubmissionStatusReport() {
  const [examFilter, setExamFilter] = useState<string>('all');
  const attempts =
    examFilter === 'all'
      ? mockAttempts
      : mockAttempts.filter(a => a.examId === Number(examFilter));

  return (
    <FormPage
      title="Submission Status Report"
      description="Track exam submission status of students"
    >
      <GridPanel
        title="Submission Status"
        data={attempts}
        columns={[
          { field: 'studentName', header: 'Student' },
          { field: 'rollNo', header: 'Roll No' },
          { field: 'examTitle', header: 'Exam' },
          {
            field: 'startTime',
            header: 'Started',
            cell: row => (
              <span className="text-xs">
                {new Date(row.startTime).toLocaleString()}
              </span>
            ),
          },
          {
            field: 'submittedAt',
            header: 'Submitted',
            cell: row => (
              <span className="text-xs">
                {row.submittedAt
                  ? new Date(row.submittedAt).toLocaleString()
                  : '-'}
              </span>
            ),
          },
          {
            field: 'status',
            header: 'Status',
            cell: row => (
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  row.status === 'submitted'
                    ? 'bg-green-100 text-green-700'
                    : row.status === 'timed_out'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {row.status.replace(/_/g, ' ')}
              </span>
            ),
          },
          { field: 'tabSwitchCount', header: 'Tab Switches' },
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
