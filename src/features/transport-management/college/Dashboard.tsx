import { FormPage, StatCard } from 'shared/new-components';

export default function CollegeDashboard() {
  return (
    <FormPage
      title="College Transport Dashboard"
      description="Overview of College Transport Operations"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        { label: 'College Login', to: '/transport-management/college-login' },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value="1250"
          icon="groups"
          colorScheme="blue"
        />
        <StatCard
          title="Allocated Buses"
          value="15"
          icon="directions_bus"
          colorScheme="green"
        />
        <StatCard
          title="Live Tracking"
          value="12"
          icon="gps_fixed"
          colorScheme="indigo"
        />
        <StatCard
          title="Maintenance Requests"
          value="1"
          icon="build"
          colorScheme="orange"
        />
        <StatCard
          title="Active Routes"
          value="8"
          icon="route"
          colorScheme="teal"
        />
        <StatCard
          title="Staff Leaves"
          value="2"
          icon="event_busy"
          colorScheme="red"
        />
        <StatCard
          title="Gate Passes"
          value="45"
          icon="confirmation_number"
          colorScheme="purple"
        />
        <StatCard
          title="Pickup Cancellations"
          value="3"
          icon="cancel"
          colorScheme="pink"
        />
      </div>
    </FormPage>
  );
}
