import { alumniUrls } from 'features/alumni-management/urls';
import { FormCard, FormPage } from 'shared/new-components';

export default function PrivacyRules() {
  return (
    <FormPage
      title="Privacy Rules"
      description="Manage privacy settings and data visibility rules for alumni"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Settings', to: alumniUrls.admin.settings.ouMapping },
        { label: 'Privacy Rules' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <p className="text-gray-500">
            Privacy rule configuration will appear here.
          </p>
        </div>
      </FormCard>
    </FormPage>
  );
}
