import { FormCard, FormGrid, PreviewField } from 'shared/new-components';

export default function BasicInformationTab({ data }: any) {
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6 mt-4">
      <FormCard
        title="Personal Details"
        icon="user"
        className="shadow-none border border-gray-200 dark:border-zinc-800"
      >
        <FormGrid columns={3}>
          <PreviewField label="Full Name" value={data.name} />
          <PreviewField label="Roll Number" value={data.rollNumber} />
          <PreviewField label="Date of Birth" value={data.dateOfBirth} />
          <PreviewField label="Gender" value={data.gender} />
          <PreviewField label="Blood Group" value={data.bloodGroup} />
          <PreviewField label="Nationality" value={data.nationality} />
          <PreviewField label="Height" value={data.height} />
          <PreviewField label="Weight" value={data.weight} />
          <PreviewField
            label="Medical Fitness Status"
            value={data.medicalFitnessStatus}
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title="Emergency Contact"
        icon="phone"
        className="shadow-none border border-gray-200 dark:border-zinc-800"
      >
        <FormGrid columns={3}>
          <PreviewField
            label="Contact Name"
            value={data.emergencyContactName}
          />
          <PreviewField
            label="Relationship"
            value={data.emergencyContactRelation}
          />
          <PreviewField
            label="Contact Number"
            value={data.emergencyContactNumber}
          />
        </FormGrid>
      </FormCard>
    </div>
  );
}
