import { useNavigate } from 'react-router-dom';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { registrations } from '../../mocks';
import { eventUrls } from '../../urls';
import '../../EventTicketing.css';

export default function Dashboard() {
  const navigate = useNavigate();

  const checkedIn = registrations.filter(r => r.status === 'Checked-In').length;
  const pending = registrations.filter(
    r => r.status === 'Registered' || r.status === 'Confirmed'
  ).length;

  return (
    <FormPage
      title="Volunteer Dashboard"
      description="Track check-in progress across today's events."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Event & Ticketing Management', to: eventUrls.portal },
        { label: 'Volunteer', to: eventUrls.volunteer.portal },
        { label: 'Dashboard' },
      ]}
    >
      <div className="etm-stats-grid">
        <StatCard
          title="Total Attendees"
          value={registrations.length}
          icon="groups"
          colorScheme="blue"
          subtitle="Registered"
        />
        <StatCard
          title="Checked In"
          value={checkedIn}
          icon="how_to_reg"
          colorScheme="green"
          subtitle="Arrived"
        />
        <StatCard
          title="Awaiting Check-In"
          value={pending}
          icon="hourglass_top"
          colorScheme="amber"
          subtitle="Not yet arrived"
        />
      </div>

      <FormCard title="Quick Actions">
        <Button
          label="Go to Check-In"
          icon="check-circle"
          onClick={() => navigate(eventUrls.volunteer.checkIn)}
        />
      </FormCard>
    </FormPage>
  );
}
