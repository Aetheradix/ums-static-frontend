import { FormPage, GridPanel } from 'shared/new-components';
import { mockExams, mockResults } from '../../data';

export default function HistoricalComparisonReport() {
  const sessions = [...new Set(mockExams.map(e => e.sessionName))].sort();
  const sessionData = sessions.map(session => {
    const sessionExamIds = mockExams
      .filter(e => e.sessionName === session)
      .map(e => e.id);
    const sessionResults = mockResults.filter(r =>
      sessionExamIds.includes(r.examId)
    );
    const passed = sessionResults.filter(r => r.isPassed).length;
    return {
      session,
      total: sessionResults.length,
      passed,
      passPct:
        sessionResults.length > 0
          ? Math.round((passed / sessionResults.length) * 100)
          : 0,
    };
  });

  return (
    <FormPage
      title="Historical Comparison"
      description="Compare exam performance across academic sessions"
    >
      <GridPanel
        title="Session-wise Comparison"
        data={sessionData}
        columns={[
          { field: 'session', header: 'Academic Session' },
          { field: 'total', header: 'Total Results' },
          {
            field: 'passed',
            header: 'Pass',
            cell: row => <span className="text-green-600">{row.passed}</span>,
          },
          {
            field: 'passPct',
            header: 'Pass %',
            cell: row => <span className="font-bold">{row.passPct}%</span>,
          },
        ]}
        dataKey="session"
        pagination={{ rows: 10 }}
        searchBox
      />
    </FormPage>
  );
}
