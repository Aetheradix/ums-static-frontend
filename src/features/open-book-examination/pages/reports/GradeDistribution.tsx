import { GridPanel, StatCard } from 'shared/new-components';
import { Chart } from 'primereact/chart';
import { mockResults } from '../../data';
import { ReportLayout } from '../../components';

export default function GradeDistributionReport() {
  const grades = ['O', 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'];
  const distribution = grades.map(grade => ({
    grade,
    count: mockResults.filter(r => r.grade === grade).length,
  }));

  const total = mockResults.length;
  const avgGradePoint =
    total > 0
      ? (mockResults.reduce((s, r) => s + r.gradePoint, 0) / total).toFixed(2)
      : '0';

  const chartData = {
    labels: distribution.map(d => d.grade),
    datasets: [
      {
        label: 'Number of Students',
        data: distribution.map(d => d.count),
        backgroundColor: [
          '#3b82f6',
          '#60a5fa',
          '#93c5fd',
          '#10b981',
          '#34d399',
          '#f59e0b',
          '#f97316',
          '#ef4444',
        ],
      },
    ],
  };

  return (
    <ReportLayout
      title="Grade Distribution"
      description="Visual analysis of letter grade distribution across all examinations."
    >
      <div className="grid grid-cols-4 gap-4 mb-2">
        <StatCard
          title="Total Results"
          value={total}
          icon="assessment"
          colorScheme="blue"
        />
        <StatCard
          title="Avg GPA"
          value={avgGradePoint}
          icon="star"
          colorScheme="green"
        />
        <StatCard
          title="Highest"
          value={grades.find(g => mockResults.some(r => r.grade === g)) || '-'}
          icon="arrow_upward"
          colorScheme="purple"
        />
        <StatCard
          title="Pass %"
          value={
            total > 0
              ? `${Math.round((mockResults.filter(r => r.isPassed).length / total) * 100)}%`
              : '0%'
          }
          icon="check_circle"
          colorScheme="orange"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold mb-4">Grade Frequency</h2>
        <div className="flex justify-center h-[350px]">
          <Chart
            type="bar"
            data={chartData}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            }}
            className="w-full h-full"
          />
        </div>
      </div>

      <GridPanel
        title="Grade-wise Distribution"
        data={distribution}
        columns={[
          {
            field: 'grade',
            header: 'Grade',
            cell: row => <span className="font-bold">{row.grade}</span>,
          },
          { field: 'count', header: 'Count' },
          {
            header: 'Percentage',
            cell: row => (
              <>{total > 0 ? ((row.count / total) * 100).toFixed(1) : 0}%</>
            ),
          },
        ]}
        dataKey="grade"
        pagination={{ rows: 10 }}
        searchBox
      />
    </ReportLayout>
  );
}
