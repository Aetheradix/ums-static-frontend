import { useEffect, useRef } from 'react';
import type { Control, Path, UseFormSetValue } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';
import {
  DatePicker,
  DropDownList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import '../pages/Create.css';

const dummyAffiliationTypes = [
  { id: 1, name: 'New Affiliation' },
  { id: 2, name: 'Renewal Affiliation' },
];

const dummyStates = [{ id: 1, name: 'Madhya Pradesh' }];

const dummyDistricts = [
  { id: 1, name: 'Indore', stateId: 1 },
  { id: 2, name: 'Bhopal', stateId: 1 },
  { id: 3, name: 'Mumbai', stateId: 2 },
  { id: 4, name: 'Pune', stateId: 2 },
];

const dummyCategories = [
  { id: 1, name: 'Engineering College' },
  { id: 2, name: 'Medical College' },
  { id: 3, name: 'Arts & Science College' },
  { id: 4, name: 'Management College' },
  { id: 5, name: 'Education College' },
  { id: 6, name: 'Law College' },
  { id: 7, name: 'Pharmacy College' },
];

const dummyTypes = [
  { id: 1, name: 'Government' },
  { id: 2, name: 'Private' },
  { id: 3, name: 'Aided' },
];

const dummyAreas = [
  { id: 'Urban', name: 'Urban' },
  { id: 'Rural', name: 'Rural' },
  { id: 'Semi-Urban', name: 'Semi-Urban' },
];

const dummyAccommodations = [
  { id: '1', name: 'Rented' },
  { id: '2', name: 'Owned' },
];

interface CollegeRegistrationStepProps {
  register: (
    key: Path<AffiliationManagementSystem.CollegeApplicationFormData>
  ) => {
    control: Control<AffiliationManagementSystem.CollegeApplicationFormData>;
    name: Path<AffiliationManagementSystem.CollegeApplicationFormData>;
  };
  control: Control<AffiliationManagementSystem.CollegeApplicationFormData>;
  setValue: UseFormSetValue<AffiliationManagementSystem.CollegeApplicationFormData>;
  isEdit?: boolean;
}

export default function CollegeRegistrationStep({
  register,
  control,
  setValue,
  isEdit = false,
}: CollegeRegistrationStepProps) {
  const stateId = useWatch({ control, name: 'stateId' });
  const isFeePaid = useWatch({ control, name: 'isFeePaid' });
  const affiliationTypeId = useWatch({ control, name: 'affiliationTypeId' });
  const previousStateIdRef = useRef(stateId);

  useEffect(() => {
    if (
      previousStateIdRef.current !== undefined &&
      stateId !== previousStateIdRef.current
    ) {
      setValue('districtId', null, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    previousStateIdRef.current = stateId;
  }, [stateId, setValue]);

  useEffect(() => {
    if (affiliationTypeId === 1) {
      setValue('collegeCode', '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [affiliationTypeId, setValue]);

  const filteredDistricts = dummyDistricts.filter(d => d.stateId === stateId);

  return (
    <FormCard
      title="College Details"
      subtitle="Enter the basic college information required for affiliation."
      icon="building"
    >
      <FormGrid columns={3}>
        {isEdit && (
          <TextBox
            label="Application Number"
            placeholder="Application number"
            {...register('applicationNumber')}
            readOnly
          />
        )}
        <DropDownList
          label="Affiliation Type"
          defaultOptionText="Select Affiliation Type"
          placeholder="Select Affiliation Type"
          data={dummyAffiliationTypes}
          textField="name"
          valueField="id"
          {...register('affiliationTypeId')}
          disabled={isFeePaid}
          required
        />
        {affiliationTypeId !== 1 && (
          <TextBox
            label="College Code"
            placeholder="Enter college code"
            {...register('collegeCode')}
            maxLength={15}
            required
            readOnly={isEdit}
          />
        )}
        <Controller
          control={control}
          name="establishmentYear"
          render={({ field, fieldState }) => (
            <DatePicker
              label="Establishment Year"
              placeholder="Select establishment year"
              name={field.name}
              value={
                field.value ? new Date(field.value as number, 0, 1) : undefined
              }
              onChange={val => field.onChange(val ? val.getFullYear() : null)}
              view="year"
              dateFormat="yy"
              errorMessage={fieldState.error?.message}
              required
              maxDate={new Date()}
              yearRange={`1800:${new Date().getFullYear()}`}
            />
          )}
        />

        <TextBox
          label="College Name"
          placeholder="Enter college name"
          {...register('collegeName')}
          onChange={val => {
            if (!val) return;
            const formatted = val
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            setValue('collegeName', formatted);
          }}
          maxLength={200}
          required
        />

        <div className="affiliation-grid-full">
          <TextArea
            label="College Address"
            placeholder="Enter college address"
            {...register('collegeAddress')}
            required
          />
        </div>

        <DropDownList
          label="State"
          defaultOptionText="Select State"
          placeholder="Select State"
          data={dummyStates}
          textField="name"
          valueField="id"
          {...register('stateId')}
          required
        />

        <DropDownList
          label="District"
          defaultOptionText="Select District"
          placeholder="Select District"
          data={filteredDistricts}
          textField="name"
          valueField="id"
          {...register('districtId')}
          disabled={!stateId}
          required
        />

        <TextBox
          label="Telephone No."
          subLabel="(Please write telephone number including STD code.)"
          placeholder="Enter telephone no."
          {...register('telephoneNo')}
          maxLength={20}
          required
        />

        <TextBox
          label="College Email"
          placeholder="Enter college email"
          {...register('collegeEmail')}
          maxLength={255}
          required
        />

        <DropDownList
          label="College Category"
          defaultOptionText="Select College Category"
          placeholder="Select College Category"
          data={dummyCategories}
          textField="name"
          valueField="id"
          {...register('collegeCategoryId')}
          required
        />

        <DropDownList
          label="College Type"
          defaultOptionText="Select College Type"
          placeholder="Select College Type"
          data={dummyTypes}
          textField="name"
          valueField="id"
          {...register('collegeTypeId')}
          required
        />

        <DropDownList
          label="College Area"
          defaultOptionText="Select College Area"
          placeholder="Select College Area"
          data={dummyAreas}
          textField="name"
          valueField="id"
          {...register('collegeArea')}
          required
        />

        <DropDownList
          label="Accommodation Type"
          defaultOptionText="Select Accommodation Type"
          placeholder="Select Accommodation Type"
          data={dummyAccommodations}
          textField="name"
          valueField="id"
          {...register('accommodationType')}
          required
        />
      </FormGrid>
    </FormCard>
  );
}
