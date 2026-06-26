import { FormCard, FormGrid, PreviewField } from 'shared/new-components';

export default function ProfileDetailsTab({ data }: any) {
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <FormCard
        title="Basic Information"
        icon="user"
        className="shadow-none border border-gray-100"
      >
        <FormGrid columns={3}>
          <PreviewField label="Full Name" value={data.fullName} />
          <PreviewField label="Name in Hindi" value={data.nameInHindi} />
          <PreviewField label="Gender" value={data.gender} />
          <PreviewField label="Date of Birth" value={data.dateOfBirth} />
          <PreviewField
            label="Category"
            value={data.casteId ? `Caste ID: ${data.casteId}` : 'General'}
          />
          <PreviewField
            label="PwD Status"
            value={data.isPersonWithDisability ? 'Yes' : 'No'}
          />
          <PreviewField label="Blood Group" value={data.bloodGroup} />
          <PreviewField
            label="Nationality"
            value={
              data.nationalityId ? `Nat ID: ${data.nationalityId}` : 'Indian'
            }
          />
          <PreviewField label="Marital Status" value={data.maritalStatus} />
          <PreviewField
            label="Guardian / Father Name"
            value={data.fatherName}
          />
          <PreviewField label="Mother Name" value={data.motherName} />
        </FormGrid>

        <div className="mt-4">
          <PreviewField
            label="Bio"
            value={data.bioNote || 'No bio available.'}
            fullWidth
          />
        </div>
      </FormCard>
    </div>
  );
}
