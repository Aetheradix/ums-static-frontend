import { PortalSelector } from 'shared/new-components';
import { tdmUrls } from '../urls';

export default function AdminMastersPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Admin Masters — Trainer Development"
      moduleDescription="Manage all training categories, delivery modes, competencies, venues, and certification configurations."
      backPath={tdmUrls.admin.portal}
      backLabel="Admin Portal"
      portals={[
        {
          title: 'Training Category',
          description:
            'Manage FDP, workshop, seminar and other training category masters.',
          icon: 'category',
          colorScheme: 'purple',
          path: tdmUrls.admin.trainingCategory,
        },
        {
          title: 'Competency Master',
          description:
            'Define and manage competency frameworks and skill levels.',
          icon: 'psychology',
          colorScheme: 'teal',
          path: tdmUrls.admin.competencyMaster,
        },
        {
          title: 'Certification Master',
          description:
            'Manage certification types, templates and renewal policies.',
          icon: 'workspace_premium',
          colorScheme: 'indigo',
          path: tdmUrls.admin.certificationMaster,
        },
        {
          title: 'Venue Master',
          description:
            'Training venues, halls and labs with capacity and facilities.',
          icon: 'meeting_room',
          colorScheme: 'amber',
          path: tdmUrls.admin.venueMaster,
        },
        {
          title: 'Training Mode',
          description:
            'Configure online, offline and hybrid training mode settings.',
          icon: 'cast_for_education',
          colorScheme: 'orange',
          path: tdmUrls.admin.trainingMode,
        },
      ]}
    />
  );
}
