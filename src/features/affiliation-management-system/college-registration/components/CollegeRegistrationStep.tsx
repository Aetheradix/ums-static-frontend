import {
  SelectAccommodationType,
  SelectCollegeArea,
  SelectCollegeCategory,
  SelectCollegeType,
} from 'features/components';
import SelectDistrict from 'features/components/SelectDistrict';
import { useAvailableFacilitiesQuery } from 'features/master/college/college-facility/queries';
import { useEffect, useRef } from 'react';
import type { Control, Path, UseFormSetValue } from 'react-hook-form';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import {
  CheckboxList,
  DatePicker,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';

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

const getFacilityIcon = (facilityName: string) => {
  const name = facilityName.toLowerCase();

  if (name.includes('play')) return 'pi pi-map';
  if (name.includes('library')) return 'pi pi-book';
  if (name.includes('laboratory')) return 'pi pi-cog';
  if (name.includes('boys')) return 'pi pi-home';
  if (name.includes('girls')) return 'pi pi-user';
  if (name.includes('medical')) return 'pi pi-briefcase';
  if (name.includes('canteen')) return 'pi pi-shopping-bag';
  if (name.includes('transport')) return 'pi pi-car';

  return 'pi pi-ellipsis-h';
};

export default function CollegeRegistrationStep({
  register,
  control,
  setValue,
  isEdit = false,
}: CollegeRegistrationStepProps) {
  const { data: facilityData } = useAvailableFacilitiesQuery();

  const facilityOptions = [
    ...(facilityData?.filter(f => f.isActive) || []),
    { id: -1, facilityName: 'Other' },
  ].map(item => ({
    ...item,
    icon: getFacilityIcon(item.facilityName),
  }));

  const watchedFacilities = useWatch({ control, name: 'availableFacilities' });
  const isOtherSelected = watchedFacilities && watchedFacilities[-1] === true;
  const wasOtherSelectedRef = useRef(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'otherFacilities',
  });

  useEffect(() => {
    if (
      isOtherSelected &&
      !wasOtherSelectedRef.current &&
      fields.length === 0
    ) {
      append({ facilityName: '' });
    }

    wasOtherSelectedRef.current = !!isOtherSelected;
  }, [isOtherSelected, fields.length, append]);

  const handleRemoveOtherFacility = (index: number) => {
    remove(index);

    if (fields.length === 1) {
      setValue(
        'availableFacilities',
        {
          ...(watchedFacilities || {}),
          [-1]: false,
        },
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      );

      setValue('otherFacilities', [], {
        shouldDirty: true,
        shouldValidate: true,
      });

      wasOtherSelectedRef.current = false;
    }
  };
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
        <TextBox
          label="College Code"
          placeholder="College code"
          {...register('collegeCode')}
          maxLength={15}
          required
          readOnly={isEdit}
        />
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
            />
          )}
        />

        <TextBox
          label="College Name"
          placeholder="College name"
          {...register('collegeName')}
          maxLength={200}
          required
        />

        <div className="affiliation-grid-full">
          <TextArea
            label="College Address"
            placeholder="College address"
            {...register('collegeAddress')}
            required
          />
        </div>

        <SelectDistrict
          label="District"
          defaultOptionText="Select district"
          {...register('districtId')}
          required
        />

        <TextBox
          label="Telephone No."
          subLabel="(Please write telephone number including STD code.)"
          placeholder="Telephone No."
          {...register('telephoneNo')}
          maxLength={20}
          required
        />

        <TextBox
          label="College Email"
          placeholder="College email"
          {...register('collegeEmail')}
          maxLength={255}
          required
        />

        <SelectCollegeCategory
          label="College Category"
          defaultOptionText="Select college category"
          {...register('collegeCategoryId')}
          required
        />

        <SelectCollegeType
          label="College Type"
          defaultOptionText="Select college type"
          {...register('collegeTypeId')}
          required
        />

        <SelectCollegeArea
          label="College Area"
          defaultOptionText="Select college area"
          {...register('collegeArea')}
          required
        />
        <SelectAccommodationType
          label="Accommodation Type"
          defaultOptionText="Select Accommodation type"
          {...register('accommodationType')}
          required
        />

        <div className="affiliation-grid-full affiliation-facility-section">
          <div className="affiliation-facility-header-row">
            <h4>Available Facilities</h4>

            <p className="affiliation-facility-note">
              <i className="pi pi-info-circle" />
              <span>
                <strong>Note:</strong> If any of your available facilities are
                not listed, please select the “Other” option and add them.
              </span>
            </p>
          </div>

          <CheckboxList
            name="availableFacilities"
            control={control}
            options={facilityOptions}
            getLabel={opt => opt.facilityName}
            getValue={opt => opt.id}
            columns={4}
            className="affiliation-facility-list"
            itemClassName="affiliation-facility-item"
            renderOption={opt => (
              <div className="affiliation-facility-content">
                <div className="affiliation-facility-left">
                  <span className="affiliation-facility-icon-box">
                    <i className={opt.icon} />
                  </span>

                  <span className="affiliation-facility-text">
                    {opt.facilityName}
                  </span>
                </div>
              </div>
            )}
          />
        </div>

        {isOtherSelected && (
          <div className="affiliation-grid-full">
            <div className="affiliation-other-facility-panel">
              <div className="affiliation-other-facility-header">
                <h4>Add Other Facilities</h4>

                <Button
                  type="button"
                  variant="outlined"
                  icon="plus"
                  label="Add More"
                  onClick={() => append({ facilityName: '' })}
                />
              </div>

              <div className="affiliation-other-facility-body">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="affiliation-other-facility-row"
                  >
                    <label className="affiliation-other-facility-label">
                      Other Facility {index + 1}
                      <span>*</span>
                    </label>

                    <div className="affiliation-other-facility-input-wrap">
                      <TextBox
                        placeholder="Enter facility name"
                        {...register(
                          `otherFacilities.${index}.facilityName` as const
                        )}
                        required
                      />

                      <Button
                        type="button"
                        variant="text"
                        className="affiliation-other-facility-delete"
                        icon="trash"
                        onClick={() => handleRemoveOtherFacility(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </FormGrid>
    </FormCard>
  );
}
