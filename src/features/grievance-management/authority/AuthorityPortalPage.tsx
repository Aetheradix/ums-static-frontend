import { PortalSelector } from 'shared/new-components';
import { grvUrls } from '../urls';

export default function AuthorityPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Authority Portal — HoD / Registrar"
      moduleDescription="Review pending approvals, notesheets, decisions, and appeal hearings."
      backPath={grvUrls.portal}
      backLabel="Grievance Management"
      portals={[
        {
          title: 'Dashboard',
          description:
            'Overview of approvals pending, appeal rates, decision count and urgent items.',
          icon: 'dashboard',
          colorScheme: 'orange',
          path: grvUrls.authority.dashboard,
        },
        {
          title: 'Pending Approvals',
          description:
            'Approve, reject, or return digital notesheets and resolutions forwarded to you.',
          icon: 'rule',
          colorScheme: 'blue',
          path: grvUrls.authority.approvals,
        },
        {
          title: 'Appeal Management',
          description:
            'Hear appeals submitted by students/faculty against previous resolution decisions.',
          icon: 'gavel',
          colorScheme: 'red',
          path: grvUrls.authority.appeals,
        },
        {
          title: 'Decision History',
          description:
            'Log of all final decisions, approved notesheets and closed cases signed by you.',
          icon: 'history',
          colorScheme: 'gray',
          path: grvUrls.authority.history,
        },
      ]}
    />
  );
}
