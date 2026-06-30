import { PortalSelector } from 'shared/new-components';

export default function PublicPortalPage() {
  return (
    <PortalSelector
      moduleTitle="Public"
      moduleDescription="Public forms for college registration."
      backPath="/home/sub-menu/affiliation-management-system"
      portals={[
        {
          title: 'College Registration',
          description: 'Manage college registration processes.',
          icon: 'assignment',
          colorScheme: 'orange',
          path: '/affiliation-management-system/college-registration',
        },
        {
          title: 'Draft College Registration',
          description: 'Manage draft college registration processes.',
          icon: 'assignment',
          colorScheme: 'orange',
          path: '/affiliation-management-system/draft-registration-request',
        },
      ]}
    />
  );
}
