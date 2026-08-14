import { TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  StatusBadge,
} from 'shared/new-components';
import { getCollegeRegistration } from '../../registrationStore';

export default function BasicRegistrationDetailsView() {
  const saved = getCollegeRegistration();

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
            value={saved?.collegeName || 'Global Institute of Technology'}
            readOnly
          />
          <TextBox
            label="College Type"
            value={saved?.collegeType || 'Private'}
            readOnly
          />
          <TextBox
            label="College Official Email"
            value={saved?.collegeEmail || 'admin@globalinstitute.edu'}
            readOnly
          />

          <TextBox
            label="Principal Name"
            value={saved?.principalDirectorName || 'Dr. Rajesh Sharma'}
            readOnly
          />
          <TextBox
            label="Principal Mobile Number"
            value={saved?.principalMobileNo || '9876543210'}
            readOnly
          />
          <TextBox
            label="Principal Email ID"
            value={saved?.principalEmail || 'rajesh.sharma@globalinstitute.edu'}
            readOnly
          />

          <TextBox
            label="State"
            value={saved?.stateName || 'Madhya Pradesh'}
            readOnly
          />
          <TextBox
            label="District"
            value={saved?.districtName || 'Indore'}
            readOnly
          />
          <TextBox
            label="Block / Tehsil"
            value={saved?.blockTehsil || 'Indore'}
            readOnly
          />

          <TextBox
            label="PIN Code"
            value={saved?.pinCode || '452001'}
            readOnly
          />

          <div className="affiliation-grid-full">
            <TextArea
              label="College Address"
              value={
                saved?.collegeAddress ||
                '123 Education Lane, Knowledge Park, Phase 1'
              }
              readOnly
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard
        title="Approval Authority & Application Fees"
        subtitle="Regulatory details and fee payment submitted with the registration."
        icon="check-circle"
        headerAction={<StatusBadge label="Fee Paid" variant="approved" />}
      >
        <FormGrid columns={3}>
          <TextBox
            label="Application Number"
            value={saved?.applicationNumber || 'APP-92837'}
            readOnly
          />
          <TextBox
            label="Education Type"
            value={saved?.educationType || 'General Higher Education'}
            readOnly
          />
          <TextBox
            label="Approval Authority"
            value={saved?.approvalAuthority || 'UGC'}
            readOnly
          />
          <TextBox
            label="Fee Transaction ID"
            value={saved?.feeTransactionRef || 'TXN-2026-088412'}
            readOnly
          />
          <TextBox
            label="Fee Paid On"
            value={saved?.feePaidDate || '20 Jun 2026'}
            readOnly
          />
        </FormGrid>
      </FormCard>
    </FormPage>
  );
}
