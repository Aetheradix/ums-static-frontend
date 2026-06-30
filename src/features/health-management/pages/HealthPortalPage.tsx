import { PortalSelector } from 'shared/new-components';
import { mockCurrentUser } from '../data';
import { hmsUrls } from '../urls';

const roleInfo: Record<
  string,
  {
    title: string;
    description: string;
    icon: string;
    colorScheme:
      | 'blue'
      | 'green'
      | 'purple'
      | 'orange'
      | 'red'
      | 'teal'
      | 'indigo'
      | 'amber'
      | 'pink';
    path: string;
  }
> = {
  health_admin: {
    title: 'Health Admin',
    description:
      'Full control: manage memberships, records, stock, prescriptions, and system settings.',
    icon: 'admin_panel_settings',
    colorScheme: 'green',
    path: hmsUrls.admin.portal,
  },
  health_doctor: {
    title: 'Doctor Portal',
    description:
      'Manage appointments, create health records, and issue prescriptions.',
    icon: 'stethoscope',
    colorScheme: 'teal',
    path: hmsUrls.doctor.portal,
  },
  health_pharmacist: {
    title: 'Pharmacist Portal',
    description: 'Dispense medicines and manage medical stock inventory.',
    icon: 'medication',
    colorScheme: 'purple',
    path: hmsUrls.pharmacist.portal,
  },
  'employee-health': {
    title: 'Employee Portal',
    description:
      'View your health records, memberships, and book appointments.',
    icon: 'personal_injury',
    colorScheme: 'orange',
    path: hmsUrls.employee.portal,
  },
};

export default function HealthPortalPage() {
  const roleKey = mockCurrentUser?.role ?? 'employee-health';
  const explicit = roleInfo[roleKey];
  const portals = explicit ? [explicit] : Object.values(roleInfo);

  return (
    <PortalSelector
      moduleTitle="Health Services"
      moduleDescription="Manage health records, memberships, prescriptions, and dispensary operations across campus health centers."
      backPath="/home"
      backLabel="Home"
      portals={portals}
    />
  );
}
