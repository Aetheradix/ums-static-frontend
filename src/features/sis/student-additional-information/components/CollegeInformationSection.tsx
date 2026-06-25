import { useEffect } from 'react';
import { useWatch, type Control, type UseFormSetValue } from 'react-hook-form';
import SelectCollegeType from 'features/components/SelectCollegeType';
import SelectCollegeName from 'features/components/SelectCollegeName';
import { TextBox } from 'shared/components/forms';
import { FormGrid } from 'shared/new-components';

interface Props {
  control: Control<SIS.StudentAdditionalInformationForm>;
  setValue: UseFormSetValue<SIS.StudentAdditionalInformationForm>;
}

export default function CollegeInformationSection({
  control,
  setValue,
}: Props) {
  const collegeTypeId = useWatch({ control, name: 'collegeTypeId' });

  // When College Type is 4 or 5 (Main Campus UTDs, University Administration)
  const isMainCampus = collegeTypeId === 4 || collegeTypeId === 5;
  // When College Type is 8 or 9 (Autonomous College, Affiliated College)
  const isAutonomousOrAffiliated = collegeTypeId === 8 || collegeTypeId === 9;

  useEffect(() => {
    // When College Type changes: Clear previously selected College Name.
    setValue('collegeRegistrationId', undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (isMainCampus) {
      setValue('parentUniversity', 'DAVV');
    } else {
      setValue('parentUniversity', '');
    }
  }, [collegeTypeId, setValue, isMainCampus]);

  return (
    <div className="mt-8 border-t border-slate-200 pt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-6">
        College Information
      </h3>
      <FormGrid>
        <SelectCollegeType name="collegeTypeId" control={control} />

        {isMainCampus && (
          <TextBox
            label="Parent University"
            name="parentUniversity"
            control={control}
            disabled
          />
        )}

        {isAutonomousOrAffiliated && (
          <SelectCollegeName
            name="collegeRegistrationId"
            control={control}
            collegeTypeId={collegeTypeId}
          />
        )}
      </FormGrid>
    </div>
  );
}
