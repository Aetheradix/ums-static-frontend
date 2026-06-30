import { FormPage, GridPanel } from 'shared/new-components';
import { mockQuestions } from '../../data';

export default function CoPoAttainmentReport() {
  const coDistribution: Record<string, number> = {};
  mockQuestions.forEach(q => {
    const co = q.coId ? `CO${q.coId}` : 'Unassigned';
    coDistribution[co] = (coDistribution[co] || 0) + q.marks;
  });

  const data = Object.entries(coDistribution).map(([co, marks]) => ({
    co,
    marks,
    weightage: (
      (marks / Object.values(coDistribution).reduce((a, b) => a + b, 0)) *
      100
    ).toFixed(1),
  }));

  return (
    <FormPage
      title="CO-PO Attainment"
      description="Course outcome and program outcome mapping"
    >
      <GridPanel
        title="CO-wise Question Distribution"
        data={data}
        columns={[
          { field: 'co', header: 'Course Outcome' },
          { field: 'marks', header: 'Total Marks' },
          {
            field: 'weightage',
            header: '% Weightage',
            cell: row => <>{row.weightage}%</>,
          },
        ]}
        dataKey="co"
        pagination={{ rows: 10 }}
      />
    </FormPage>
  );
}
