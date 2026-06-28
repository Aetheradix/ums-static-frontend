import { FormPage, GridPanel, StatCard } from 'shared/new-components';
import { mockResults } from '../../data';

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

  return (
    <FormPage
      title="Grade Distribution"
      description="Analysis of grade distribution across exams"
    >
      <div className="grid grid-cols-4 gap-4 mb-6">
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
    </FormPage>
  );
}
