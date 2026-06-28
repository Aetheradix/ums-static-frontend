import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, GridPanel } from 'shared/new-components';
import { mockResults } from '../../data';

export default function Results() {
  const navigate = useNavigate();
  const studentId = 8;
  const data = mockResults.filter(r => r.studentId === studentId);

  return (
    <FormPage title="My Results" description="View your examination results">
      <GridPanel
        data={data}
        columns={
          [
            { field: 'examTitle', header: 'Exam' },
            { field: 'subjectName', header: 'Subject' },
            {
              header: 'Score',
              cell: (row: any) => (
                <span>
                  {row.totalMarksObtained}/{row.totalMarks}
                </span>
              ),
            },
            {
              field: 'percentage',
              header: 'Percentage',
              cell: (row: any) => <span>{row.percentage.toFixed(1)}%</span>,
            },
            { field: 'grade', header: 'Grade' },
            {
              field: 'status',
              header: 'Status',
              cell: (row: any) => (
                <span
                  className={`px-2 py-0.5 rounded text-xs ${row.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {row.isPassed ? 'Pass' : 'Fail'}
                </span>
              ),
            },
            {
              field: 'publishedAt',
              header: 'Published',
              cell: (row: any) => <span>{row.publishedAt || '-'}</span>,
            },
            {
              header: 'Actions',
              cell: (row: any) => (
                <Button
                  label="Detail"
                  icon="visibility"
                  onClick={() =>
                    navigate(`/open-book-examination/student/results/${row.id}`)
                  }
                />
              ),
            },
          ] as any
        }
        dataKey="id"
        searchBox
        pagination={{ rows: 10 }}
      />
    </FormPage>
  );
}
