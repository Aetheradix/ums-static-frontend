import { PortalSelector } from 'shared/new-components';
import { admissionsUrls } from './urls';

export default function AdmissionsPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admissions Management"
      moduleDescription="Manage the complete student admissions lifecycle — from applications to enrolment."
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Configure programmes, manage applications, approve fees, and set up the portal.',
          icon: 'admin_panel_settings',
          colorScheme: 'indigo',
          path: admissionsUrls.admin.root,
        },
        {
          title: 'Student Portal',
          description:
            'Apply for admission, track application status, pay fees, and select subjects.',
          icon: 'school',
          colorScheme: 'orange',
          path: admissionsUrls.student.root,
        },
      ]}
    />
  );
}
