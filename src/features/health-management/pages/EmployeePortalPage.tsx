import { PortalSelector } from 'shared/new-components';
import { hmsUrls } from '../urls';

export default function EmployeePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Employee Health Portal"
      moduleDescription="View your health records, memberships, and book appointments."
      backPath={hmsUrls.portal}
      backLabel="Health Services"
      portals={[
        {
          title: 'Dashboard',
          description: 'Your health overview and quick actions.',
          icon: 'dashboard',
          colorScheme: 'orange',
          path: hmsUrls.employee.dashboard,
        },
        {
          title: 'Memberships',
          description: 'View your health memberships.',
          icon: 'card_membership',
          colorScheme: 'blue',
          path: hmsUrls.memberships,
        },
        {
          title: 'Health Records',
          description: 'View your health records.',
          icon: 'folder_medical',
          colorScheme: 'teal',
          path: hmsUrls.records,
        },
        {
          title: 'Appointments',
          description: 'Book and view appointments.',
          icon: 'calendar_month',
          colorScheme: 'green',
          path: hmsUrls.appointments,
        },
      ]}
    />
  );
}
