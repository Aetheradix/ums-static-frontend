import { PortalSelector } from 'shared/new-components';
import { legalUrls } from '../urls';

export default function LegalCasePortalPage() {
  return (
    <PortalSelector
      moduleTitle="Legal Case Management System"
      moduleDescription="Track university legal cases from registration through disposal — hearings, court details, judgments and advocate payments."
      backPath="/home"
      backLabel="Home"
      portals={[
        {
          title: 'Case Administrator',
          description:
            'Full control — register cases, schedule hearings, log advocate payments and generate reports.',
          icon: 'gavel',
          colorScheme: 'red',
          path: legalUrls.admin.portal,
        },
        {
          title: 'Data Entry Operator',
          description:
            'Enter case details and record hearings under the legal cell supervision.',
          icon: 'edit_note',
          colorScheme: 'blue',
          path: legalUrls.dataEntry.portal,
        },
        {
          title: 'Case Viewer',
          description:
            'Read-only access to case dashboards, registers and compliance reports.',
          icon: 'visibility',
          colorScheme: 'teal',
          path: legalUrls.viewer.portal,
        },
      ]}
    />
  );
}
