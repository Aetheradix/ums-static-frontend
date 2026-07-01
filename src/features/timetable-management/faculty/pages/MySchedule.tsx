import { useMemo } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { faculty, timetableEntries } from '../../mocks';
import { timetableUrls } from '../../urls';
import WeeklyGrid from '../../components/WeeklyGrid';

// Static prototype — assume the logged-in faculty is the first one.
const CURRENT_FACULTY = faculty[0];

export default function MySchedule() {
  const myEntries = useMemo(
    () => timetableEntries.filter(e => e.facultyId === CURRENT_FACULTY.id),
    []
  );

  return (
    <FormPage
      title="My Schedule"
      description={`Weekly teaching timetable for ${CURRENT_FACULTY.name}.`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Faculty', to: timetableUrls.faculty.portal },
        { label: 'My Schedule' },
      ]}
    >
      <FormCard title="Weekly Timetable" icon="calendar">
        <WeeklyGrid entries={myEntries} />
      </FormCard>
    </FormPage>
  );
}
