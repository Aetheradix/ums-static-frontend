import { mockContributionPreferences } from 'features/alumni-management/data/mockData';
import { alumniUrls } from 'features/alumni-management/urls';
import CheckBox from 'shared/components/forms/CheckBox';
import { FormActions, FormCard, FormPage } from 'shared/new-components';

export default function ContributionPreferences() {
  return (
    <FormPage
      title="Contribution Preferences"
      description="Select areas in which you are willing to contribute to your alma mater"
      breadcrumbs={[
        { label: 'Alumni Services', to: alumniUrls.root },
        { label: 'User Portal', to: alumniUrls.user.portal },
        { label: 'Contributions' },
      ]}
    >
      <FormCard>
        <div className="p-4 flex flex-col gap-6 max-w-2xl">
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Your selected preferences help the institution connect you with
              students and faculty for the right opportunities. You can update
              these at any time.
            </p>
            <div className="flex flex-col gap-4">
              <CheckBox
                label="Mentorship — One-on-one mentoring of final year project students"
                checked={mockContributionPreferences.mentorship}
              />
              <CheckBox
                label="Guest Lectures — Deliver talks, workshops, and knowledge sessions"
                checked={mockContributionPreferences.guestLectures}
              />
              <CheckBox
                label="Placement Assistance — Employee referrals and mock interview sessions"
                checked={mockContributionPreferences.placementAssistance}
              />
              <CheckBox
                label="Financial Support — Scholarships, bursaries, and financial aid sponsorship"
                checked={mockContributionPreferences.financialSupport}
              />
              <CheckBox
                label="Research Collaboration — Co-authoring research papers with faculty"
                checked={false}
              />
            </div>
          </div>
        </div>
        <FormActions saveLabel="Save Preferences" />
      </FormCard>
    </FormPage>
  );
}
