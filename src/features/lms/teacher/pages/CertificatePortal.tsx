import { PortalSelector } from 'shared/new-components';
import { learningUrls } from '../../urls';

export default function CertificatePortal() {
  return (
    <PortalSelector
      moduleTitle="Certificate Management"
      moduleDescription="Recommend students for certificates, review elegibility and check status logs."
      backPath={learningUrls.teacher.portal}
      backLabel="Teacher Portal"
      portals={[
        {
          title: 'Recommend Certificate / View Eligible Students',
          description:
            'Evaluate students who completed courses and recommend them for verification.',
          icon: 'reviews',
          colorScheme: 'amber',
          path: `${learningUrls.teacher.certificate}/recommend`,
        },
        {
          title: 'Certificate Status & View',
          description:
            'Track generated certificates and verify system hash IDs.',
          icon: 'workspace_premium',
          colorScheme: 'purple',
          path: `${learningUrls.teacher.certificate}/status`,
        },
      ]}
    />
  );
}
