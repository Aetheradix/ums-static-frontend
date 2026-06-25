import { FormPage, FormCard, GridPanel } from 'shared/new-components';
import { useStudentTimetableQuery } from '../../queries';

export default function StudentTimetable() {
  const { data, isLoading } = useStudentTimetableQuery();

  return (
    <FormPage
      title="My Exam Timetable"
      description="View your personal examination schedule"
    >
      <FormCard>
        <GridPanel
          data={data ?? []}
          loading={isLoading}
          searchBox
          searchPlaceholder="Search subjects..."
          columns={[
            { field: 'examDate', header: 'Date' },
            { field: 'subjectCode', header: 'Code' },
            { field: 'subjectName', header: 'Subject' },
            { field: 'startTime', header: 'Start' },
            { field: 'endTime', header: 'End' },
            { field: 'hall', header: 'Hall' },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
