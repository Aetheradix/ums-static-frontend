import {
  type Control,
  useForm,
  type UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ApplicationFormData, ChoiceFillingItemDto } from '../types';

import SelectCollegeCategory from 'features/components/SelectCollegeCategory';
import SelectCollegeType from 'features/components/SelectCollegeType';
import SelectDistrict from 'features/components/SelectDistrict';
import MultiSelectList from 'shared/components/forms/MultiSelectList';

import { useAllCollegeRegistrationsQuery } from 'features/affiliation-management-system/college-registration/queries';
import { useCollegeCategoriesQuery } from 'features/master/college/college-category/queries';
import { useCollegeTypesQuery } from 'features/master/college/college-type/queries';
import { useDistrictsQuery } from 'features/master/location/district/queries';

interface ChoiceFillingStepProps {
  control: Control<ApplicationFormData>;
  setValue: UseFormSetValue<ApplicationFormData>;
}

export default function ChoiceFillingStep({
  control,
  setValue,
}: ChoiceFillingStepProps) {
  interface LocalChoiceForm {
    districtId: number | null;
    collegeTypeName: string | null;
    collegeCategoryName: string | null;
    colleges: any[];
  }

  const {
    control: localControl,
    getValues,
    reset,
  } = useForm<LocalChoiceForm>({
    defaultValues: {
      districtId: null,
      collegeTypeName: null,
      collegeCategoryName: null,
      colleges: [] as any[],
    },
  });

  const choices =
    useWatch({
      control,
      name: 'choiceFilling',
    }) || [];

  const { data: districts } = useDistrictsQuery();
  const { data: collegeTypes } = useCollegeTypesQuery();
  const { data: collegeCategories } = useCollegeCategoriesQuery();
  const { data: allColleges } = useAllCollegeRegistrationsQuery();

  const handleLock = () => {
    const { districtId, collegeTypeName, collegeCategoryName, colleges } =
      getValues();

    if (
      !districtId ||
      !collegeTypeName ||
      !collegeCategoryName ||
      !colleges ||
      colleges.length === 0
    ) {
      ToastService.error('Please select all required fields to lock.');
      return;
    }

    const d = districts?.find((x: any) => String(x.id) === String(districtId));
    const ct = collegeTypes?.find(
      (x: any) => String(x.name) === String(collegeTypeName)
    );
    const cc = collegeCategories?.find(
      (x: any) => String(x.name) === String(collegeCategoryName)
    );

    const newChoices = colleges.map((c: any) => ({
      districtId: Number(districtId),
      districtName: d?.name || '',
      collegeTypeId: ct ? Number(ct.id) : 0,
      collegeTypeName: collegeTypeName,
      collegeCategoryId: cc ? Number(cc.id) : 0,
      collegeCategoryName: collegeCategoryName,
      collegeRegistrationId: c.collegeRegistrationId || c.id,
      collegeName: c.collegeName || c.name,
    }));

    setValue('choiceFilling', [...choices, ...newChoices]);

    // Reset current selection
    reset();
  };

  const handleResetCurrent = () => {
    reset();
  };

  const removeChoice = (index: number) => {
    const newChoices = [...choices];
    newChoices.splice(index, 1);
    setValue('choiceFilling', newChoices);
  };

  return (
    <FormCard title="Choice Filling" icon="list">
      <div className="flex flex-col gap-6">
        <FormGrid columns={4}>
          <SelectDistrict
            name="districtId"
            control={localControl}
            required={true}
          />
          <SelectCollegeType
            name="collegeTypeName"
            control={localControl}
            required={true}
          />
          <SelectCollegeCategory
            name="collegeCategoryName"
            control={localControl}
            required={true}
          />
          <MultiSelectList
            name="colleges"
            control={localControl}
            label="College Names"
            data={allColleges || []}
            textField="collegeName"
            required={true}
            placeholder="Select Colleges"
          />
        </FormGrid>

        <div className="flex gap-2 justify-end">
          <Button
            label="Reset"
            icon="times"
            variant="outlined"
            onClick={handleResetCurrent}
            type="button"
          />
          <Button label="Lock" icon="lock" onClick={handleLock} type="button" />
        </div>

        {choices.length > 0 && (
          <div className="mt-4 border rounded-md overflow-hidden shadow-sm">
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3">District</th>
                  <th className="px-6 py-3">College Type</th>
                  <th className="px-6 py-3">College Category</th>
                  <th className="px-6 py-3">College Name</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {choices.map((choice: ChoiceFillingItemDto, index: number) => (
                  <tr
                    key={`${choice.collegeRegistrationId}-${index}`}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {choice.districtName}
                    </td>
                    <td className="px-6 py-4">{choice.collegeTypeName}</td>
                    <td className="px-6 py-4">{choice.collegeCategoryName}</td>
                    <td className="px-6 py-4">{choice.collegeName}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeChoice(index)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </FormCard>
  );
}
