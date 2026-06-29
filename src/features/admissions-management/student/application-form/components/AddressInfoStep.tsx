import { useEffect } from 'react';
import { useWatch, type Control, type UseFormSetValue } from 'react-hook-form';
import { NumberBox, TextBox } from 'shared/components/forms';
import SelectAddressType from 'features/components/SelectAddressType';
import SelectBlock from 'features/components/SelectBlock';
import SelectDistrict from 'features/components/SelectDistrict';
import SelectDivision from 'features/components/SelectDivision';
import SelectState from 'features/components/SelectState';
import SelectTehsil from 'features/components/SelectTehsil';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ApplicationFormData } from '../types';

interface AddressInfoStepProps {
  register: (key: keyof ApplicationFormData) => any;
  control: Control<ApplicationFormData>;
  setValue: UseFormSetValue<ApplicationFormData>;
}

export default function AddressInfoStep({
  register,
  control,
  setValue,
}: AddressInfoStepProps) {
  const selectedState = useWatch({ control, name: 'state' });
  const selectedDivision = useWatch({ control, name: 'division' });
  const selectedDistrict = useWatch({ control, name: 'district' });
  const selectedTehsil = useWatch({ control, name: 'tehsil' });

  useEffect(() => {
    setValue('division', null as any, {
      shouldValidate: false,
      shouldDirty: true,
    });
    setValue('district', null as any, {
      shouldValidate: false,
      shouldDirty: true,
    });
    setValue('tehsil', null as any, {
      shouldValidate: false,
      shouldDirty: true,
    });
    setValue('block', null as any, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [selectedState]);

  useEffect(() => {
    setValue('district', null as any, {
      shouldValidate: false,
      shouldDirty: true,
    });
    setValue('tehsil', null as any, {
      shouldValidate: false,
      shouldDirty: true,
    });
    setValue('block', null as any, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [selectedDivision]);

  useEffect(() => {
    setValue('tehsil', null as any, {
      shouldValidate: false,
      shouldDirty: true,
    });
    setValue('block', null as any, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [selectedDistrict]);

  useEffect(() => {
    setValue('block', null as any, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [selectedTehsil]);

  return (
    <FormCard title="Address Details" icon="map-marker">
      <FormGrid columns={3}>
        <SelectAddressType {...register('addressType')} required />
        <TextBox
          label="Country"
          placeholder="Enter Country"
          {...register('country')}
          maxLength={20}
          required
        />

        <SelectState {...register('state')} required />

        <SelectDivision
          {...register('division')}
          stateId={selectedState}
          required
        />

        <SelectDistrict
          {...register('district')}
          divisionId={selectedDivision}
          required
        />

        <SelectTehsil
          {...register('tehsil')}
          districtId={selectedDistrict}
          required
        />

        <SelectBlock
          {...register('block')}
          tehsilId={selectedTehsil}
          required
        />

        <TextBox
          label="Address Line 1"
          placeholder="Enter Address Line 1"
          {...register('addressLine1')}
          maxLength={150}
          required
        />
        <TextBox
          label="Address Line 2"
          placeholder="Enter Address Line 2"
          {...register('addressLine2')}
          maxLength={150}
          required
        />
        <TextBox
          label="Landmark"
          placeholder="Enter Landmark"
          {...register('landmark')}
          maxLength={40}
          required
        />
        <NumberBox
          label="Zipcode"
          placeholder="Enter Zipcode"
          {...register('zipcode')}
          useGrouping={false}
          required
        />
      </FormGrid>
    </FormCard>
  );
}
