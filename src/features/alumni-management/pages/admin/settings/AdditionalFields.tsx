import { FormCard, FormPage } from 'shared/new-components';

export default function AdditionalFields() {
  return (
    <FormPage
      title="Additional Fields Builder"
      description="Manage custom fields for alumni profile"
      breadcrumbs={[
        { label: 'Alumni Services', to: '/alumni-management' },
        { label: 'Additional Fields Builder' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <p>Additional fields builder configuration goes here.</p>
        </div>
      </FormCard>
    </FormPage>
  );
}
