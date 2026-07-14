import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function AuthorityPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Authority Portal — Grievance Administration"
      moduleDescription="DAVV Indore — Select authority level to review green notesheets, verify recommendations, and sanction final resolution orders."
      backPath={grvUrls.portal}
      backLabel="Grievance Management System"
      portals={[
        {
          title: 'Head of Department (HoD) Desk',
          description:
            'Access department level inbox, review notesheets, append official remarks, and forward/return files.',
          icon: 'supervisor_account',
          colorScheme: 'teal',
          path: grvUrls.hod.portal,
        },
        {
          title: 'Registrar Desk',
          description:
            'Review statutory committee recommendations, verify full notesheet history, and sanction final closing orders.',
          icon: 'gavel',
          colorScheme: 'orange',
          path: grvUrls.registrar.portal,
        },
      ]}
    />
  );
}
