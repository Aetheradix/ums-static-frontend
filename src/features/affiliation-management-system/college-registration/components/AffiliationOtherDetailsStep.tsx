import type { Control, Path } from 'react-hook-form';
import { DatePicker, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';

import { SelectYesNo } from 'features/components';

interface AffiliationOtherDetailsStepProps {
  register: (
    key: Path<AffiliationManagementSystem.CollegeApplicationFormData>
  ) => {
    control: Control<AffiliationManagementSystem.CollegeApplicationFormData>;
    name: Path<AffiliationManagementSystem.CollegeApplicationFormData>;
  };
}

export default function AffiliationOtherDetailsStep({
  register,
}: AffiliationOtherDetailsStepProps) {
  return (
    <>
      <FormCard
        title="Management Details"
        subtitle="Principal and society details"
        icon="user"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Principal/Director Name"
            placeholder="Enter principal/director Name"
            {...register('principalDirectorName')}
            maxLength={100}
            required
          />

          <TextBox
            label="Mobile No."
            placeholder="Enter mobile no."
            {...register('principalMobileNo')}
            maxLength={10}
            required
          />
          <TextBox
            label="Email"
            placeholder="Enter email"
            {...register('principalEmail')}
            maxLength={70}
            required
          />
        </FormGrid>
      </FormCard>

      <FormCard
        title="Society/Committee Details"
        subtitle="Enter the society/committee registration and authorized person details."
        icon="building"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Society Name"
            placeholder="Enter society name"
            {...register('societyName')}
            maxLength={200}
            required
          />

          <TextBox
            label="Secretary Name"
            placeholder="Enter secretary name"
            {...register('secretaryName')}
            maxLength={100}
            required
          />

          <TextBox
            label="Society Registration No."
            placeholder="Enter society registration no."
            {...register('societyRegistrationNo')}
            maxLength={100}
            required
          />

          <DatePicker
            label="Society Registration Date"
            placeholder="Select society registration date"
            {...register('societyRegistrationDate')}
            required
          />

          <div className="affiliation-grid-span-2">
            <SelectYesNo
              label="Is there any other college running by this committee which is affiliated with this University?"
              useBooleanValues={true}
              defaultOptionText="Select another college/institute run by this society"
              {...register('isOtherInstitutionRunning')}
              required
            />
          </div>
        </FormGrid>
      </FormCard>
    </>
  );
}
