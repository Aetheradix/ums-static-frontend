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

export default function ContactAddressTab({ data }: any) {
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <FormCard
        title="Contact Information"
        icon="phone"
        className="shadow-none border border-gray-100"
      >
        <FormGrid columns={3}>
          <ReadOnlyField label="Official Email" value={data.officialEmail} />
          <ReadOnlyField label="Personal Email" value={data.personalEmail} />
          <ReadOnlyField label="Mobile Number" value={data.mobileNumber} />
          <ReadOnlyField
            label="Alternate Mobile"
            value={data.alternateMobileNumber}
          />
          <ReadOnlyField label="Office Phone" value={data.officePhoneNumber} />
        </FormGrid>
      </FormCard>

      <FormCard
        title="Emergency Contact"
        icon="exclamation-triangle"
        className="shadow-none border border-gray-100"
      >
        <FormGrid columns={3}>
          <ReadOnlyField
            label="Contact Name"
            value={data.emergencyContactName}
          />
          <ReadOnlyField label="Relation" value={data.emergencyRelation} />
          <ReadOnlyField
            label="Emergency Mobile"
            value={data.emergencyPhoneNumber}
          />
        </FormGrid>
      </FormCard>
    </div>
  );
}
