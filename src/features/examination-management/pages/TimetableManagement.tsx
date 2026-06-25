import { useParams } from 'react-router-dom';
import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { useTimetableQuery } from '../queries';

export default function TimetableManagement() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sid = Number(sessionId);
  const { data, isLoading } = useTimetableQuery(sid);

  return (
    <FormPage
      title="Timetable Management"
      description={`Examination timetable for session #${sid}`}
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search subjects..."
          columns={[
            { field: 'subjectCode', header: 'Subject Code' },
            { field: 'subjectName', header: 'Subject Name' },
            { field: 'examDate', header: 'Exam Date' },
            { field: 'slotName', header: 'Shift' },
            { field: 'startTime', header: 'Start' },
            { field: 'endTime', header: 'End' },
            { field: 'centerName', header: 'Center' },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
