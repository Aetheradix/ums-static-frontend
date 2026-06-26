import { alumniUrls } from 'features/alumni-management/urls';
import TextBox from 'shared/components/forms/TextBox';
import { FormActions, FormCard, FormPage } from 'shared/new-components';

export default function EditProfile() {
  return (
    <FormPage
      title="Edit Profile"
      description="Update your personal and contact information"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'User Portal', to: alumniUrls.user.portal },
        { label: 'Edit Profile' },
      ]}
    >
      <FormCard>
        <div className="p-4 max-w-2xl flex flex-col gap-4">
          <TextBox label="Full Name" placeholder="Rahul Sharma" disabled />
          <TextBox label="Mobile Number" placeholder="+91 9876543210" />
          <TextBox
            label="Current Address"
            placeholder="Enter current address"
          />
          <TextBox
            label="LinkedIn Profile URL"
            placeholder="https://linkedin.com/in/rahulsharma"
          />
        </div>
        <FormActions saveLabel="Save Changes" />
      </FormCard>
    </FormPage>
  );
}
