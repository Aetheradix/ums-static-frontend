import { useMemo } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { sections, timetableEntries } from '../../mocks';
import { timetableUrls } from '../../urls';
import WeeklyGrid from '../../components/WeeklyGrid';

// Static prototype — assume the logged-in student belongs to the first section.
const CURRENT_SECTION = sections[0];

export default function MyTimetable() {
  const myEntries = useMemo(
    () => timetableEntries.filter(e => e.sectionId === CURRENT_SECTION.id),
    []
  );

  return (
    <FormPage
      title="My Timetable"
      description={`Weekly class timetable for section ${CURRENT_SECTION.name}.`}
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Student', to: timetableUrls.student.portal },
        { label: 'My Timetable' },
      ]}
    >
      <FormCard
        title={`${CURRENT_SECTION.name} — Weekly Timetable`}
        icon="calendar"
      >
        <WeeklyGrid entries={myEntries} />
      </FormCard>
    </FormPage>
  );
}
