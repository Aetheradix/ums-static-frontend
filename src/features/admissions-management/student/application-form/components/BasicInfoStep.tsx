import { DatePicker, NumberBox, TextBox } from 'shared/components/forms';
import SelectCaste from 'features/components/SelectCaste';
import SelectGender from 'features/components/SelectGender';
import SelectNationality from 'features/components/SelectNationality';
import SelectResidencyStatus from 'features/components/SelectResidencyStatus';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ApplicationFormData } from '../types';

interface BasicInfoStepProps {
  register: (key: keyof ApplicationFormData) => any;
}

export default function BasicInfoStep({ register }: BasicInfoStepProps) {
  return (
    <FormCard title="Personal Details" icon="user">
      <FormGrid columns={3}>
        <TextBox
          label="First Name"
          placeholder="Enter First Name"
          {...register('firstName')}
          maxLength={45}
          required
        />
        <TextBox
          label="Middle Name"
          placeholder="Enter Middle Name"
          {...register('middleName')}
          maxLength={45}
        />
        <TextBox
          label="Last Name"
          placeholder="Enter Last Name"
          {...register('lastName')}
          maxLength={45}
          required
        />
        <TextBox
          label="Email"
          placeholder="Enter Email Address"
          {...register('email')}
          maxLength={30}
          required
        />
        <TextBox
          label="Phone"
          placeholder="Enter Phone Number"
          {...register('phone')}
          maxLength={15}
          required
        />
        <SelectGender {...register('gender')} required />
        <SelectCaste {...register('caste')} required />
        <DatePicker
          label="Date of Birth"
          placeholder="Select Date of Birth"
          {...register('dateOfBirth')}
          required
        />
        <NumberBox
          label="Age"
          placeholder="Enter Age"
          {...register('age')}
          min={1}
          max={100}
          useGrouping={false}
          required
        />
        <SelectResidencyStatus {...register('residencyStatus')} required />
        <TextBox
          label="Ethnicity"
          placeholder="Enter Ethnicity"
          {...register('ethnicity')}
          maxLength={20}
          required
        />
        <SelectNationality {...register('nationality')} required />
      </FormGrid>
    </FormCard>
  );
}
