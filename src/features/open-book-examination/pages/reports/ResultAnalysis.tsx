import { useState } from 'react';
import { DropDownList } from 'shared/components/forms';
import { GridPanel, StatCard } from 'shared/new-components';
import { Chart } from 'primereact/chart';
import { mockExams, mockResults } from '../../data';
import { ReportLayout } from '../../components';

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

  const pieData = {
    labels: ['Pass', 'Fail'],
    datasets: [
      {
        data: [passed, failed],
        backgroundColor: ['#22c55e', '#ef4444'],
        hoverBackgroundColor: ['#16a34a', '#dc2626'],
      },
    ],
  };

  const examIds = Array.from(new Set(results.map(r => r.examId)));
  const barData = {
    labels: examIds.map(
      id => mockExams.find(e => e.id === id)?.title || `Exam ${id}`
    ),
    datasets: [
      {
        label: 'Average %',
        data: examIds.map(id => {
          const examResults = results.filter(r => r.examId === id);
          return (
            examResults.reduce((s, r) => s + r.percentage, 0) /
            examResults.length
          );
        }),
        backgroundColor: examIds.map((_, i) => {
          const palettes = [
            '#6366f1',
            '#14b8a6',
            '#f43f5e',
            '#f59e0b',
            '#8b5cf6',
          ];
          return palettes[i % palettes.length];
        }),
        hoverBackgroundColor: examIds.map((_, i) => {
          const hoverPalettes = [
            '#4f46e5',
            '#0d9488',
            '#e11d48',
            '#d97706',
            '#7c3aed',
          ];
          return hoverPalettes[i % hoverPalettes.length];
        }),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  return (
    <ReportLayout
      title="Result Analysis"
      description="Comprehensive view of student performance across all examinations."
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
    >
      <div className="grid grid-cols-4 gap-4 mb-2">
        <StatCard
          title="Total Exams"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Pass / Fail Ratio
          </h2>
          <div className="flex justify-center h-[300px]">
            <Chart
              type="pie"
              data={pieData}
              options={{ maintainAspectRatio: false }}
              className="w-[300px] h-[300px]"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Average Score by Exam
          </h2>
          <div className="flex justify-center h-[300px]">
            <Chart
              type="bar"
              data={barData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      <GridPanel
        title="Detailed Results"
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
      />
    </ReportLayout>
  );
}
