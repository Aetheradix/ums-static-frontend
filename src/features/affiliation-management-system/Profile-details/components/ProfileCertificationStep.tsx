import {
  Controller,
  type Control,
  type FormState,
  type Path,
} from 'react-hook-form';
import { Checkbox as PrimeCheckbox } from 'primereact/checkbox';
import { DatePicker, FileUpload, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileCertificationStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
}

export default function ProfileCertificationStep({
  register,
  control,
  formState,
}: ProfileCertificationStepProps) {
  return (
    <>
      <div className="mb-4 text-blue-700 font-semibold border-l-2 border-blue-500 pl-2">
        Section 14: Declaration & Signatures
      </div>

      <FormCard title="DECLARATION BY THE PRINCIPAL" icon="check-circle">
        <div className="flex flex-col gap-4">
          <FormGrid columns={2}>
            <TextBox
              label="Principal Name"
              placeholder="Enter Name"
              readOnly={true}
              {...register('principalName')}
              errorMessage={formState.errors.principalName?.message as string}
            />
            <DatePicker
              label="Date"
              name="dateOfCertification"
              control={control}
              placeholder="Select Date"
              errorMessage={
                formState.errors.dateOfCertification?.message as string
              }
            />
          </FormGrid>
          <FormGrid columns={2}>
            <FileUpload
              label="Principal Signature (Upload)"
              name="principalSignature"
              control={control}
              mode="file"
              accept="image/*"
              errorMessage={
                formState.errors.principalSignature?.message as string
              }
            />
            <FileUpload
              label="Management Member Signature (Upload)"
              name="managementSignature"
              control={control}
              mode="file"
              accept="image/*"
              errorMessage={
                formState.errors.managementSignature?.message as string
              }
            />
          </FormGrid>
        </div>
      </FormCard>

      <div className="mt-8 mb-4">
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Controller
            name="isDeclared"
            control={control}
            render={({ field }) => (
              <PrimeCheckbox
                inputId="isDeclared"
                checked={field.value}
                onChange={e => field.onChange(e.checked)}
              />
            )}
          />
          <label
            htmlFor="isDeclared"
            className="text-sm font-medium text-gray-800 cursor-pointer"
          >
            I hereby declare that all the information provided in this form is
            true and correct to the best of my knowledge and belief.
          </label>
        </div>
        {formState.errors.isDeclared?.message && (
          <span className="text-red-500 text-xs mt-2 block pl-2">
            {formState.errors.isDeclared?.message as string}
          </span>
        )}
      </div>
    </>
  );
}
