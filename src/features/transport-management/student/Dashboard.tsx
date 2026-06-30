import { FormPage, StatCard } from 'shared/new-components';

export default function StudentDashboard() {
  return (
    <FormPage
      title="Student Transport Dashboard"
      description="Track your bus, manage leaves, and view pickup details."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        { label: 'Student Login', to: '/transport-management/student-login' },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned Route"
          value="Route-5"
          icon="route"
          colorScheme="blue"
        />
        <StatCard
          title="Pickup Time"
          value="08:15 AM"
          icon="schedule"
          colorScheme="green"
        />
        <StatCard
          title="Total Leaves"
          value="2"
          icon="event_busy"
          colorScheme="orange"
        />
        <StatCard
          title="Bus Number"
          value="MP-04-1234"
          icon="directions_bus"
          colorScheme="purple"
        />
      </div>
    </FormPage>
  );
}
