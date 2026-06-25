import { FormCard, FormGrid } from 'shared/new-components';

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50 text-sm text-gray-500 min-h-[38px] flex items-center">
        {value || '-'}
      </div>
    </div>
  );
}

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
          <ReadOnlyField label="Full Name" value={data.fullName} />
          <ReadOnlyField label="Name in Hindi" value={data.nameInHindi || ''} />
          <ReadOnlyField label="Gender" value={data.gender} />
          <ReadOnlyField label="Date of Birth" value={data.dateOfBirth} />
          <ReadOnlyField
            label="Category"
            value={data.casteId ? `Caste ID: ${data.casteId}` : 'General'}
          />
          <ReadOnlyField
            label="PwD Status"
            value={data.isPersonWithDisability ? 'Yes' : 'No'}
          />
          <ReadOnlyField label="Blood Group" value={data.bloodGroup} />
          <ReadOnlyField
            label="Nationality"
            value={
              data.nationalityId ? `Nat ID: ${data.nationalityId}` : 'Indian'
            }
          />
          <ReadOnlyField label="Marital Status" value={data.maritalStatus} />
          <ReadOnlyField
            label="Guardian / Father Name"
            value={data.fatherName}
          />
          <ReadOnlyField label="Mother Name" value={data.motherName} />
        </FormGrid>

        <div className="mt-4">
          <ReadOnlyField
            label="Bio"
            value={data.bioNote || 'No bio available.'}
          />
        </div>
      </FormCard>
    </div>
  );
}
