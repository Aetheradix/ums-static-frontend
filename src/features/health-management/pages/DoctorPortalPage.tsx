import { PortalSelector } from 'shared/new-components';
import { hmsUrls } from '../urls';

export default function DoctorPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Doctor Portal"
      moduleDescription="Manage appointments, create health records, and issue prescriptions."
      backPath={hmsUrls.portal}
      backLabel="Health Services"
      portals={[
        {
          title: 'Appointments',
          description: 'View and manage patient appointments.',
          icon: 'calendar_month',
          colorScheme: 'teal',
          path: hmsUrls.appointments,
        },
        {
          title: 'Health Records',
          description: 'Create and view patient health records.',
          icon: 'folder_medical',
          colorScheme: 'green',
          path: hmsUrls.records,
        },
        {
          title: 'Prescriptions',
          description: 'Issue prescriptions for patients.',
          icon: 'prescriptions',
          colorScheme: 'amber',
          path: hmsUrls.prescriptions,
        },
      ]}
    />
  );
}
