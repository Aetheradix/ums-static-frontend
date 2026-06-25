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
          <ReadOnlyField label="Employee Type" value={data.employeeType} />
          <ReadOnlyField
            label="Nature of Employment"
            value={data.employeeNature}
          />
          <ReadOnlyField
            label="Organization Unit"
            value={data.organizationUnit}
          />
          <ReadOnlyField label="Post" value={data.post} />
          <ReadOnlyField
            label="Designation"
            value={data.designationId ? `Desig ID: ${data.designationId}` : '-'}
          />
          <ReadOnlyField label="Seniority Rank" value={data.seniorityRank} />
          <ReadOnlyField
            label="Subject Specialization"
            value={data.subjectSpecialization}
          />
          <ReadOnlyField label="Employee Code" value={data.employeeCode} />
          <ReadOnlyField label="Date of Joining" value={data.dateOfJoining} />
        </FormGrid>
      </FormCard>
    </div>
  );
}
