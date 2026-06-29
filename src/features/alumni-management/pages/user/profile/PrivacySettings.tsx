import { alumniUrls } from 'features/alumni-management/urls';
import Switch from 'shared/components/forms/Switch';
import { FormActions, FormCard, FormPage } from 'shared/new-components';

export default function PrivacySettings() {
  return (
    <FormPage
      title="Privacy Settings"
      description="Control which parts of your profile are visible to other alumni and the public"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'User Portal', to: alumniUrls.user.portal },
        { label: 'Privacy Settings' },
      ]}
    >
      <FormCard>
        <div className="p-4 flex flex-col gap-6 max-w-2xl">
          <p className="text-sm text-gray-500">
            Changes below only affect what other verified alumni can see when
            browsing the alumni directory. Your core academic information is
            always visible to institution admins.
          </p>
          <Switch label="Show Mobile Number to other Alumni" checked={false} />
          <Switch
            label="Show Personal Email Address to other Alumni"
            checked={true}
          />
          <Switch label="Show Current Employer & Designation" checked={true} />
          <Switch label="Show Current City / Location" checked={true} />
          <Switch label="Show LinkedIn Profile URL" checked={false} />
          <Switch label="Appear in Alumni Directory Search" checked={true} />
        </div>
        <FormActions saveLabel="Save Settings" />
      </FormCard>
    </FormPage>
  );
}
