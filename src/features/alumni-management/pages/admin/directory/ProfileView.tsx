import {
  mockAlumniProfiles,
  mockEducationalQualifications,
  mockProfessionalExperience,
} from 'features/alumni-management/data/mockData';
import { FormCard, FormPage, Tabs } from 'shared/new-components';

export default function ProfileView() {
  const profile = mockAlumniProfiles[1]; // Using Priya Nair (Verified)

  return (
    <FormPage
      title={`${profile.fullName}'s Profile`}
      description="Comprehensive Alumni View"
      breadcrumbs={[
        { label: 'Alumni Services', to: '/alumni-management' },
        { label: `${profile.fullName}'s Profile` },
      ]}
    >
      <FormCard>
        <div className="p-4">
          <Tabs
            tabs={[
              {
                title: 'Personal Info',
                content: (
                  <div className="flex flex-col gap-2">
                    <p>
                      <strong>Name:</strong> {profile.fullName}
                    </p>
                    <p>
                      <strong>Enrolment No:</strong> {profile.enrolmentNo}
                    </p>
                    <p>
                      <strong>Program:</strong> {profile.program}
                    </p>
                  </div>
                ),
              },
              {
                title: 'Contact Info',
                content: (
                  <p>
                    <strong>Email:</strong> {profile.emailAddress}
                  </p>
                ),
              },
              {
                title: 'Qualifications',
                content: (
                  <ul className="list-disc ml-5">
                    {mockEducationalQualifications.map((edu, idx) => (
                      <li key={idx}>
                        {edu.degree} from {edu.institute} ({edu.year})
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: 'Experience',
                content: (
                  <ul className="list-disc ml-5">
                    {mockProfessionalExperience.map((exp, idx) => (
                      <li key={idx}>
                        {exp.designation} at {exp.company_name} (
                        {exp.start_date} - {exp.end_date})
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: 'Contributions',
                content: <p>Opted in for Mentorship and Guest Lectures.</p>,
              },
            ]}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
