import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormPage, GridPanel } from 'shared/new-components';
import { mockExams, mockRegistrations } from '../../data';

export default function Schedule() {
  const navigate = useNavigate();
  const studentId = 8;
  const myRegs = mockRegistrations.filter(
    r => r.studentId === studentId && r.status === 'registered'
  );
  const exams = mockExams.filter(e => myRegs.some(r => r.examId === e.id));

  const sorted = [...exams].sort(
    (a, b) =>
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );

  return (
    <FormPage
      title="Exam Schedule"
      description="View your upcoming examination schedule"
    >
      <GridPanel
        data={sorted}
        columns={[
          { field: 'scheduledDate', header: 'Date' },
          { field: 'title', header: 'Exam' },
          { field: 'subjectName', header: 'Subject' },
          {
            header: 'Time',
            cell: row => (
              <span>
                {row.startTime} - {row.endTime}
              </span>
            ),
          },
          {
            header: 'Duration',
            cell: row => <span>{row.durationMinutes} min</span>,
          },
          {
            field: 'isOpenBook',
            header: 'Open Book',
            cell: row => <span>{row.isOpenBook ? 'Yes' : 'No'}</span>,
          },
          {
            header: 'Actions',
            cell: row => (
              <Button
                label="Instructions"
                icon="info"
                onClick={() =>
                  navigate(
                    `/open-book-examination/student/exam/${row.id}/instructions`
                  )
                }
              />
            ),
          },
        ]}
        dataKey="id"
        searchBox
        pagination={{ rows: 10 }}
      />
    </FormPage>
  );
}
