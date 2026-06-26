import { FormCard, FormGrid, PreviewField } from 'shared/new-components';

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
          <PreviewField label="Official Email" value={data.officialEmail} />
          <PreviewField label="Personal Email" value={data.personalEmail} />
          <PreviewField label="Mobile Number" value={data.mobileNumber} />
          <PreviewField
            label="Alternate Mobile"
            value={data.alternateMobileNumber}
          />
          <PreviewField label="Office Phone" value={data.officePhoneNumber} />
        </FormGrid>
      </FormCard>

      <FormCard
        title="Emergency Contact"
        icon="exclamation-triangle"
        className="shadow-none border border-gray-100"
      >
        <FormGrid columns={3}>
          <PreviewField
            label="Contact Name"
            value={data.emergencyContactName}
          />
          <PreviewField label="Relation" value={data.emergencyRelation} />
          <PreviewField
            label="Emergency Mobile"
            value={data.emergencyPhoneNumber}
          />
        </FormGrid>
      </FormCard>
    </div>
  );
}
