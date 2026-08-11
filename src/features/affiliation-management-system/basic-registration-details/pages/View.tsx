import { TextBox, TextArea } from 'shared/components/forms';
import { FormCard, FormPage, FormGrid } from 'shared/new-components';

export default function BasicRegistrationDetailsView() {
  return (
    <FormPage
      title="Basic Registration Details"
      description="View the initial registration information submitted by your college. This form is read-only."
    >
      <FormCard
        title="College Details"
        subtitle="Basic college information submitted during registration."
        icon="building"
      >
        <FormGrid columns={3}>
          <TextBox
            label="College Name"
            value="Global Institute of Technology"
            readOnly
          />
          <TextBox label="College Type" value="Private" readOnly />
          <TextBox
            label="College Official Email"
            value="admin@globalinstitute.edu"
            readOnly
          />

          <TextBox label="Principal Name" value="Dr. Rajesh Sharma" readOnly />
          <TextBox
            label="Principal Mobile Number"
            value="9876543210"
            readOnly
          />
          <TextBox
            label="Principal Email ID"
            value="rajesh.sharma@globalinstitute.edu"
            readOnly
          />

          <TextBox label="State" value="Madhya Pradesh" readOnly />
          <TextBox label="District" value="Indore" readOnly />
          <TextBox label="Block / Tehsil" value="Indore" readOnly />

          <TextBox label="PIN Code" value="452001" readOnly />

          <div className="affiliation-grid-full">
            <TextArea
              label="College Address"
              value="123 Education Lane, Knowledge Park, Phase 1"
              readOnly
            />
          </div>
        </FormGrid>
      </FormCard>
    </FormPage>
  );
}
