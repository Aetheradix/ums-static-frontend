import { PortalSelector } from 'shared/new-components';
import { hmsUrls } from '../urls';

export default function PublicHome() {
  return (
    <PortalSelector
      moduleTitle="Hostel Admission — Public Forum"
      moduleDescription="Apply for university hostel accommodation without signing in. Your academic details are fetched from the university record; the hostel you apply to reviews the request, and your ERP credentials are issued once it is approved."
      portals={[
        {
          title: 'Apply for Hostel',
          description:
            'Fill the admission form with your student, guardian, hostel preference, emergency and health details.',
          icon: 'assignment',
          colorScheme: 'blue',
          path: hmsUrls.public.apply,
        },
        {
          title: 'Track Application',
          description:
            'Check whether your application is pending, approved or rejected — and collect your ERP credentials.',
          icon: 'search',
          colorScheme: 'teal',
          path: hmsUrls.public.track,
        },
      ]}
    />
  );
}
