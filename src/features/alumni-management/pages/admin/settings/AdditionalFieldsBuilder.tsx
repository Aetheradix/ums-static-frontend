import { alumniUrls } from 'features/alumni-management/urls';
import { FormCard, FormPage } from 'shared/new-components';

export default function AdditionalFieldsBuilder() {
  return (
    <FormPage
      title="Additional Fields Builder"
      description="Configure custom fields for alumni profiles"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'Settings', to: alumniUrls.admin.settings.ouMapping },
        { label: 'Additional Fields Builder' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <p className="text-gray-500">
            Field builder configuration will appear here.
          </p>
        </div>
      </FormCard>
    </FormPage>
  );
}
