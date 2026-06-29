import { NumberBox, TextBox } from 'shared/components/forms';
import SelectDesignation from 'features/components/SelectDesignation';
import SelectOccupation from 'features/components/SelectOccupationTypes';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ApplicationFormData } from '../types';

interface FatherInfoStepProps {
  register: (key: keyof ApplicationFormData) => any;
}

export default function FatherInfoStep({ register }: FatherInfoStepProps) {
  return (
    <FormCard title="Father's Details" icon="users">
      <FormGrid columns={3}>
        <TextBox
          label="Father's Name"
          placeholder="Enter Father's Name"
          {...register('fatherName')}
          maxLength={45}
          required
        />
        <SelectOccupation {...register('fatherOccupation')} required />
        <SelectDesignation {...register('fatherDesignation')} required />
        <NumberBox
          label="Annual Income"
          placeholder="Enter Annual Income"
          {...register('fatherAnnualIncome')}
          min={0}
          useGrouping={false}
          required
        />
        <TextBox
          label="Contact Number"
          placeholder="Enter Contact Number"
          {...register('fatherContactNumber')}
          maxLength={10}
          required
        />
      </FormGrid>
    </FormCard>
  );
}
