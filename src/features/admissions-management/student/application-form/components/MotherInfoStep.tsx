import { NumberBox, TextBox } from 'shared/components/forms';
import SelectDesignation from 'features/components/SelectDesignation';
import SelectOccupation from 'features/components/SelectOccupationTypes';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ApplicationFormData } from '../types';

interface MotherInfoStepProps {
  register: (key: keyof ApplicationFormData) => any;
}

export default function MotherInfoStep({ register }: MotherInfoStepProps) {
  return (
    <FormCard title="Mother's Details" icon="users">
      <FormGrid columns={3}>
        <TextBox
          label="Mother's Name"
          placeholder="Enter Mother's Name"
          {...register('motherName')}
          maxLength={45}
          required
        />
        <SelectOccupation
          label="Mother's Occupation"
          {...register('motherOccupation')}
          required
        />
        <SelectDesignation
          label="Mother's Designation"
          {...register('motherDesignation')}
          required
        />
        <NumberBox
          label="Annual Income"
          placeholder="Enter Annual Income"
          {...register('motherAnnualIncome')}
          min={0}
          useGrouping={false}
          required
        />
        <TextBox
          label="Contact Number"
          placeholder="Enter Contact Number"
          {...register('motherContactNumber')}
          maxLength={10}
          required
        />
      </FormGrid>
    </FormCard>
  );
}
