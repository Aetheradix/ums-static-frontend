import { FormCard, FormGrid, PreviewField } from 'shared/new-components';

export default function OrganizationTab({ data }: any) {
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <FormCard
        title="Organization Details"
        icon="building"
        className="shadow-none border border-gray-100"
      >
        <FormGrid columns={3}>
          <PreviewField label="Employee Type" value={data.employeeType} />
          <PreviewField
            label="Nature of Employment"
            value={data.employeeNature}
          />
          <PreviewField
            label="Organization Unit"
            value={data.organizationUnit}
          />
          <PreviewField label="Post" value={data.post} />
          <PreviewField
            label="Designation"
            value={
              data.designationId ? `Desig ID: ${data.designationId}` : undefined
            }
          />
          <PreviewField label="Seniority Rank" value={data.seniorityRank} />
          <PreviewField
            label="Subject Specialization"
            value={data.subjectSpecialization}
          />
          <PreviewField label="Employee Code" value={data.employeeCode} />
          <PreviewField label="Date of Joining" value={data.dateOfJoining} />
        </FormGrid>
      </FormCard>
    </div>
  );
}
