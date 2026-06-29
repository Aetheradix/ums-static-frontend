import { FormCard, FormPage } from 'shared/new-components';

export default function MailTemplatesBuilder() {
  return (
    <FormPage
      title="Mail Templates Builder"
      description="Create and manage email templates"
      breadcrumbs={[
        { label: 'Alumni Services', to: '/alumni-management' },
        { label: 'Mail Templates Builder' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <p>Mail templates builder configuration goes here.</p>
        </div>
      </FormCard>
    </FormPage>
  );
}
