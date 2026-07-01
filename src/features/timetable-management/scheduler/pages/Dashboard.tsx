import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { rooms, sections, timetableEntries } from '../../mocks';
import { timetableUrls } from '../../urls';
import '../../Timetable.css';

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = useMemo(
    () => ({
      assignments: timetableEntries.length,
      sections: sections.length,
      rooms: rooms.length,
    }),
    []
  );

  return (
    <FormPage
      title="Scheduler Dashboard"
      description="Overview of course assignments, sections and room allocation."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Timetable Management', to: timetableUrls.portal },
        { label: 'Scheduler', to: timetableUrls.scheduler.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="ttm-stats-grid">
        <StatCard
          title="Assignments"
          value={stats.assignments}
          icon="edit_calendar"
          colorScheme="blue"
          subtitle="Course-slot allocations"
        />
        <StatCard
          title="Sections"
          value={stats.sections}
          icon="groups"
          colorScheme="indigo"
          subtitle="Being scheduled"
        />
        <StatCard
          title="Rooms"
          value={stats.rooms}
          icon="meeting_room"
          colorScheme="purple"
          subtitle="Available for allocation"
        />
      </div>

      <FormCard title="Quick Actions">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            label="Assign a Course"
            icon="plus"
            onClick={() => navigate(timetableUrls.scheduler.assignments)}
          />
          <Button
            label="View Room Allocation"
            icon="list"
            variant="outlined"
            onClick={() => navigate(timetableUrls.scheduler.rooms)}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
