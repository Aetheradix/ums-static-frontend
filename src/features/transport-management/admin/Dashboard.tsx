import { FormPage, StatCard } from 'shared/new-components';

export default function AdminDashboard() {
  return (
    <FormPage
      title="Admin Dashboard"
      description="Overview of Transport Management"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Transport Management', to: '/transport-management' },
        { label: 'Admin Login', to: '/transport-management/admin-login' },
        { label: 'Dashboard' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Transporters"
          value="12"
          icon="local_shipping"
          colorScheme="blue"
        />
        <StatCard
          title="Active Vehicles"
          value="45"
          icon="directions_car"
          colorScheme="green"
        />
        <StatCard
          title="Drivers & Attenders"
          value="38"
          icon="badge"
          colorScheme="indigo"
        />
        <StatCard
          title="Pending Approvals"
          value="5"
          icon="pending_actions"
          colorScheme="orange"
        />
        <StatCard
          title="Routes Active"
          value="18"
          icon="route"
          colorScheme="teal"
        />
        <StatCard
          title="Bus Stops"
          value="64"
          icon="location_on"
          colorScheme="red"
        />
        <StatCard
          title="Maintenance Logs"
          value="3"
          icon="build"
          colorScheme="purple"
        />
        <StatCard
          title="Insurance Renewals"
          value="2"
          icon="shield"
          colorScheme="pink"
        />
      </div>
    </FormPage>
  );
}
