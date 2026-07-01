import { useMemo } from 'react';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { examSchedule, sections } from '../../mocks';
import { timetableUrls } from '../../urls';

// Static prototype — assume the logged-in student belongs to the first section.
const CURRENT_SECTION = sections[0];

export default function ExamSchedule() {
  const rows = useMemo(
    () => examSchedule.filter(e => e.sectionName === CURRENT_SECTION.name),
    []
  );

  return (
    <FormPage
      title="Exam Schedule"
      description={`Examination schedule for section ${CURRENT_SECTION.name}.`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Student', to: timetableUrls.student.portal },
        { label: 'Exam Schedule' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={rows}
          searchBox
          searchPlaceholder="Search by course code or name..."
          emptyMessage="No examinations scheduled yet."
          columns={[
            {
              header: 'S.No',
              width: '60px',
              cell: (_, o) => <span>{o.rowIndex + 1}</span>,
            },
            { field: 'courseCode', header: 'Code', sortable: true },
            { field: 'courseName', header: 'Course' },
            { field: 'date', header: 'Date' },
            { field: 'timeLabel', header: 'Time' },
            { field: 'duration', header: 'Duration' },
            { field: 'roomName', header: 'Venue' },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
