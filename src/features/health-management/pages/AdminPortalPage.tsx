import { PortalSelector } from 'shared/new-components';
import { hmsUrls } from '../urls';

export default function AdminPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Health Admin Portal"
      moduleDescription="Complete health management: memberships, records, stock, prescriptions, reports, and settings."
      backPath={hmsUrls.portal}
      backLabel="Health Services"
      portals={[
        {
          title: 'Dashboard',
          description: 'KPIs: members, records, stock, appointments.',
          icon: 'dashboard',
          colorScheme: 'green',
          path: hmsUrls.admin.dashboard,
        },
        {
          title: 'Memberships',
          description: 'Manage health memberships and dependents.',
          icon: 'card_membership',
          colorScheme: 'blue',
          path: hmsUrls.memberships,
        },
        {
          title: 'Health Records',
          description: 'View and create patient health records.',
          icon: 'folder_medical',
          colorScheme: 'teal',
          path: hmsUrls.records,
        },
        {
          title: 'Doctor Time',
          description: 'View doctor schedules and availability.',
          icon: 'schedule',
          colorScheme: 'purple',
          path: hmsUrls.doctors,
        },
        {
          title: 'Medical Stock',
          description: 'Track medicine inventory and expiry.',
          icon: 'inventory_2',
          colorScheme: 'indigo',
          path: hmsUrls.stock,
        },
        {
          title: 'Prescriptions',
          description: 'Issue and manage prescriptions.',
          icon: 'prescriptions',
          colorScheme: 'amber',
          path: hmsUrls.prescriptions,
        },
        {
          title: 'Dispensary',
          description: 'Dispense medicines and verify prescriptions.',
          icon: 'medication',
          colorScheme: 'purple',
          path: hmsUrls.dispensary,
        },
        {
          title: 'Appointments',
          description: 'View all scheduled appointments.',
          icon: 'calendar_month',
          colorScheme: 'orange',
          path: hmsUrls.appointments,
        },
        {
          title: 'Guest Users',
          description: 'Manage guest health service users.',
          icon: 'person_add',
          colorScheme: 'pink',
          path: hmsUrls.guestUsers,
        },
        {
          title: 'Subscriptions',
          description: 'View membership payment records.',
          icon: 'receipt_long',
          colorScheme: 'teal',
          path: hmsUrls.subscriptions,
        },
        {
          title: 'Reports',
          description: 'Export reports: memberships, records, stock.',
          icon: 'bar_chart',
          colorScheme: 'green',
          path: hmsUrls.reports,
        },
        {
          title: 'Activity Logs',
          description: 'Audit trail of all health operations.',
          icon: 'history',
          colorScheme: 'red',
          path: hmsUrls.logs,
        },
        {
          title: 'Settings',
          description: 'Configure membership types, hospitals, doctors, stock.',
          icon: 'settings',
          colorScheme: 'gray',
          path: hmsUrls.admin.settings,
        },
      ]}
    />
  );
}
