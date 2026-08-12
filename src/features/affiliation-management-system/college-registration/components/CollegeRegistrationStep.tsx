import { useEffect, useState } from 'react';
import type { Control, Path, UseFormSetValue } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import {
  DropDownList,
  TextBox,
  TextArea,
  Checkbox,
} from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import '../pages/Create.css';

const dummyStates = [{ id: 1, name: 'Madhya Pradesh' }];

const dummyDistricts = [
  { id: 1, name: 'Indore' },
  { id: 2, name: 'Bhopal' },
  { id: 3, name: 'Jabalpur' },
  { id: 4, name: 'Gwalior' },
  { id: 5, name: 'Ujjain' },
];

const dummyTypes = [
  { id: 1, name: 'Government' },
  { id: 2, name: 'Private' },
  { id: 3, name: 'Aided' },
  { id: 4, name: 'Unaided' },
  { id: 5, name: 'Other' },
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
}

export default function CollegeRegistrationStep({
  register,
  control,
  setValue,
}: CollegeRegistrationStepProps) {
  const [captchaText, setCaptchaText] = useState('7A9x2');

  const regenerateCaptcha = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  useEffect(() => {
    regenerateCaptcha();
  }, []);

  return (
    <FormCard
      title="College Registration"
      subtitle="Provide the required details to register the college."
      icon="building"
    >
      <FormGrid columns={3}>
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

        <TextBox
          label="College Official Email"
          placeholder="Enter college email"
          {...register('collegeEmail')}
          maxLength={255}
          required
        />

        <TextBox
          label="Principal Name"
          placeholder="Enter principal director name"
          {...register('principalDirectorName')}
          maxLength={100}
          required
        />

        <TextBox
          label="Principal Mobile Number"
          placeholder="Enter 10-digit mobile number"
          {...register('principalMobileNo')}
          maxLength={10}
          required
        />

        <TextBox
          label="Principal Email ID"
          placeholder="Enter principal email"
          {...register('principalEmail')}
          maxLength={255}
          required
        />

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
          data={dummyDistricts}
          textField="name"
          valueField="id"
          {...register('districtId')}
          required
        />

        <TextBox
          label="Block / Tehsil"
          placeholder="Enter Block or Tehsil"
          {...register('blockTehsil')}
          maxLength={100}
          required
        />

        <TextBox
          label="PIN Code"
          placeholder="Enter 6-digit PIN Code"
          {...register('pinCode')}
          maxLength={6}
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

        <div className="lg:col-span-2 flex flex-row gap-6 items-start">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Captcha <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3 h-[46px]">
              <div
                className="px-6 py-2 h-full bg-[#f0f4f8] text-[#1e293b] rounded-md font-extrabold tracking-[0.5em] text-2xl select-none pointer-events-none border border-gray-300 shadow-inner flex items-center justify-center min-w-[150px] relative overflow-hidden"
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)',
                }}
              >
                <span className="relative z-10 drop-shadow-sm">
                  {captchaText}
                </span>
              </div>
              <Button
                variant="outlined"
                icon="pi pi-refresh"
                onClick={regenerateCaptcha}
                className="h-full px-4 rounded-md flex items-center justify-center border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors"
                tooltip="Refresh Captcha"
              />
            </div>
          </div>

          <div className="w-64">
            <TextBox
              label="Enter Captcha"
              placeholder="Enter the captcha code"
              {...register('captcha')}
              required
            />
          </div>
        </div>
      </FormGrid>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <Controller
          control={control}
          name="declaration"
          render={({ field, fieldState }) => (
            <Checkbox
              id="declaration"
              name={field.name}
              checked={field.value}
              onChange={field.onChange}
              errorMessage={fieldState.error?.message}
              label="Declaration: I hereby declare that all the information provided above is true and correct to the best of my knowledge."
              required
            />
          )}
        />
      </div>
    </FormCard>
  );
}
