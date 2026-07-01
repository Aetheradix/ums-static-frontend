import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { events, registrations } from '../../mocks';
import { eventUrls } from '../../urls';
import '../../EventTicketing.css';

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const published = events.filter(e => e.status === 'Published').length;
    const totalReg = registrations.length;
    return {
      total: events.length,
      published,
      registrations: totalReg,
    };
  }, []);

  return (
    <FormPage
      title="Organizer Dashboard"
      description="Overview of the events you organize and their registrations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Event & Ticketing Management', to: eventUrls.portal },
        { label: 'Organizer', to: eventUrls.organizer.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="etm-stats-grid">
        <StatCard
          title="My Events"
          value={stats.total}
          icon="event"
          colorScheme="blue"
          subtitle="Total created"
        />
        <StatCard
          title="Published"
          value={stats.published}
          icon="campaign"
          colorScheme="green"
          subtitle="Live now"
        />
        <StatCard
          title="Registrations"
          value={stats.registrations}
          icon="groups"
          colorScheme="purple"
          subtitle="Across your events"
        />
      </div>

      <FormCard title="Quick Actions">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            label="Create New Event"
            icon="plus"
            onClick={() => navigate(eventUrls.organizer.eventNew)}
          />
          <Button
            label="View My Events"
            icon="list"
            variant="outlined"
            onClick={() => navigate(eventUrls.organizer.events)}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
