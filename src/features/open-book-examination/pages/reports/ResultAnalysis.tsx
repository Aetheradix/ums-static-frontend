import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { FormPage, GridPanel, StatCard } from 'shared/new-components';
import { mockExams, mockResults } from '../../data';

export default function ResultAnalysisReport() {
  const [examFilter, setExamFilter] = useState<string>('all');
  const results =
    examFilter === 'all'
      ? mockResults
      : mockResults.filter(r => r.examId === Number(examFilter));

  const passed = results.filter(r => r.isPassed).length;
  const failed = results.filter(r => !r.isPassed).length;
  const avgPct =
    results.length > 0
      ? results.reduce((s, r) => s + r.percentage, 0) / results.length
      : 0;

  return (
    <FormPage title="Result Analysis" description="Exam result statistics">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total"
          value={results.length}
          icon="assessment"
          colorScheme="blue"
        />
        <StatCard
          title="Pass"
          value={passed}
          icon="check_circle"
          colorScheme="green"
        />
        <StatCard title="Fail" value={failed} icon="cancel" colorScheme="red" />
        <StatCard
          title="Avg %"
          value={`${avgPct.toFixed(1)}%`}
          icon="trending_up"
          colorScheme="purple"
        />
      </div>
      <GridPanel
        title="Result Details"
        data={results}
        columns={[
          { field: 'studentName', header: 'Student' },
          { field: 'examTitle', header: 'Exam' },
          {
            field: 'totalMarksObtained',
            header: 'Score',
            cell: row => (
              <>
                {row.totalMarksObtained}/{row.totalMarks}
              </>
            ),
          },
          {
            field: 'percentage',
            header: '%',
            cell: row => <>{row.percentage.toFixed(1)}%</>,
          },
          {
            field: 'grade',
            header: 'Grade',
            cell: row => <span className="font-bold">{row.grade}</span>,
          },
          {
            field: 'isPassed',
            header: 'Status',
            cell: row => (
              <span
                className={`px-2 py-0.5 rounded text-xs ${row.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {row.isPassed ? 'Pass' : 'Fail'}
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
