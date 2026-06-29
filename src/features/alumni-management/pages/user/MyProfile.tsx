import { alumniUrls } from 'features/alumni-management/urls';
import TextBox from 'shared/components/forms/TextBox';
import {
  FormActions,
  FormCard,
  FormPage,
  PreviewField,
  PreviewSection,
} from 'shared/new-components';

export default function MyProfile() {
  return (
    <FormPage
      title="My Profile"
      description="View and update your personal, contact, and professional information"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'User Portal', to: alumniUrls.user.portal },
        { label: 'My Profile' },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <PreviewSection
            title="Academic Information"
            subtitle="Read-only — sourced from university records"
          >
            <PreviewField label="Full Name" value="Rahul Sharma" />
            <PreviewField label="Enrolment No" value="A2026-CSE-911" />
            <PreviewField label="Programme" value="M.Tech Computer Science" />
            <PreviewField
              label="Department"
              value="Department of Computer Science & Engineering"
            />
            <PreviewField label="Year of Passing" value="2025" />
            <PreviewField
              label="University Email"
              value="rahul.sharma@alumni.edu"
              fullWidth
            />
          </PreviewSection>
        </div>
      </FormCard>

      <FormCard>
        <div className="p-4 flex flex-col gap-4 max-w-2xl">
          <PreviewSection
            title="Contact Information"
            subtitle="Update your personal contact details"
          >
            <div className="flex flex-col gap-4 pt-2">
              <TextBox label="Mobile Number" value="+91 9876543210" />
              <TextBox
                label="Personal Email"
                value="rahul.s@personalmail.com"
              />
              <TextBox label="Current City" value="Bengaluru, Karnataka" />
              <TextBox
                label="Current Address"
                placeholder="Enter your current address"
              />
            </div>
          </PreviewSection>
        </div>
      </FormCard>

      <FormCard>
        <div className="p-4 flex flex-col gap-4 max-w-2xl">
          <PreviewSection
            title="Professional Information"
            subtitle="Keep your employer details up to date"
          >
            <div className="flex flex-col gap-4 pt-2">
              <TextBox
                label="Current Employer"
                value="Infosys Technologies Ltd"
              />
              <TextBox label="Designation" value="Senior Software Engineer" />
              <TextBox
                label="LinkedIn Profile URL"
                value="https://linkedin.com/in/rahulsharma"
              />
              <TextBox
                label="Personal Website / Portfolio"
                placeholder="https://yoursite.com"
              />
            </div>
          </PreviewSection>
        </div>
        <FormActions saveLabel="Save Changes" />
      </FormCard>
    </FormPage>
  );
}
