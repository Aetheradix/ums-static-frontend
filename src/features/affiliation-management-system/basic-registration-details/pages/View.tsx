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
          <TextBox label="Application Number" value="APP-2026-8991" readOnly />
          <TextBox label="College Code" value="COL-1002" readOnly />
          <TextBox label="Establishment Year" value="1995" readOnly />

          <TextBox
            label="College Name"
            value="Global Institute of Technology"
            readOnly
          />

          <div className="affiliation-grid-full">
            <TextArea
              label="College Address"
              value="123 Education Lane, Knowledge Park, Phase 1"
              readOnly
            />
          </div>

          <TextBox label="District" value="Indore" readOnly />
          <TextBox label="Telephone No." value="+91-9876543210" readOnly />
          <TextBox
            label="College Email"
            value="admin@globalinstitute.edu"
            readOnly
          />

          <TextBox label="College Category" value="Private" readOnly />
          <TextBox label="College Type" value="Engineering" readOnly />
          <TextBox label="College Area" value="Urban" readOnly />

          <TextBox
            label="Accommodation Type"
            value="Boys & Girls (Co-ed)"
            readOnly
          />

          <div className="affiliation-grid-full">
            <TextArea
              label="Available Facilities"
              value="Library, Computer Laboratory, Sports Ground, Boys Hostel, Girls Hostel, Medical Facility, Canteen"
              readOnly
            />
          </div>
        </FormGrid>
      </FormCard>
    </FormPage>
  );
}
