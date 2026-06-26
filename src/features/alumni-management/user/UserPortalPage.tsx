import { PortalSelector } from 'shared/new-components';
import { alumniUrls } from '../urls';

export default function UserPortalPage() {
  return (
    <PortalSelector
      moduleTitle="User Portal — Alumni Services"
      moduleDescription="Manage your alumni profile and preferences."
      backPath={alumniUrls.root}
      backLabel="Alumni Services"
      portals={[
        {
          title: 'Dashboard',
          description: 'View your alumni summary and recent activity.',
          icon: 'dashboard',
          colorScheme: 'blue',
          path: alumniUrls.user.dashboard,
        },
        {
          title: 'My Profile',
          description: 'Update your personal and contact information.',
          icon: 'edit',
          colorScheme: 'teal',
          path: alumniUrls.user.myProfile,
        },
        {
          title: 'Qualifications',
          description: 'Manage your academic qualifications and degrees.',
          icon: 'school',
          colorScheme: 'purple',
          path: alumniUrls.user.qualifications,
        },
        {
          title: 'Experience',
          description: 'Add and update your professional experience.',
          icon: 'work',
          colorScheme: 'orange',
          path: alumniUrls.user.experience,
        },
        {
          title: 'Contributions',
          description: 'Opt into mentorship, guest lectures, and more.',
          icon: 'volunteer_activism',
          colorScheme: 'green',
          path: alumniUrls.user.contributionPreferences,
        },
        {
          title: 'Privacy Settings',
          description: 'Control what information is visible to other alumni.',
          icon: 'privacy_tip',
          colorScheme: 'red',
          path: alumniUrls.user.privacySettings,
        },
      ]}
    />
  );
}
