import { PortalSelector } from 'shared/new-components';
import { tdmUrls } from '../urls';

export default function TdmPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Trainer Development Management"
      moduleDescription="Manage faculty training, competency development, certifications and performance across all departments."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Admin Portal',
          description:
            'Manage trainer registrations, training programmes, certificates and approvals.',
          icon: 'admin_panel_settings',
          colorScheme: 'blue',
          path: tdmUrls.admin.portal,
        },
        {
          title: 'Faculty / Employee Portal',
          description:
            'View your trainings, apply for programmes, track competencies and download certificates.',
          icon: 'groups',
          colorScheme: 'green',
          path: tdmUrls.faculty.portal,
        },
        {
          title: 'External Trainer Portal',
          description:
            'Access assigned training sessions, upload materials, submit attendance and view honorarium.',
          icon: 'person_pin',
          colorScheme: 'orange',
          path: tdmUrls.external.portal,
        },
      ]}
    />
  );
}
