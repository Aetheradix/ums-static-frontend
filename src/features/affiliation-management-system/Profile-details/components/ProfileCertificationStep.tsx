import type { Control, FormState, Path } from 'react-hook-form';
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
        Section 14: Certification & Signatures
      </div>

      <div className="mb-4 p-4 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-700 text-sm flex items-center gap-2">
        <i className="fal fa-info-circle" />
        This is to certify that all information given in this proforma is
        correct to the best of our knowledge.
      </div>

      <FormCard title="CERTIFICATION DETAILS" icon="check-circle">
        <div className="flex flex-col gap-4">
          <FormGrid columns={2}>
            <TextBox
              label="Principal Name"
              placeholder="Enter Name"
              {...register('principalName')}
              errorMessage={formState.errors.principalName?.message as string}
            />
            <DatePicker
              label="Date of Certification"
              name="dateOfCertification"
              control={control}
              placeholder="Select Date"
              errorMessage={
                formState.errors.dateOfCertification?.message as string
              }
            />
          </FormGrid>
          <FormGrid columns={2}>
            <TextBox
              label="Management Committee Member Name"
              placeholder="Enter Name"
              {...register('managementMemberName')}
              errorMessage={
                formState.errors.managementMemberName?.message as string
              }
            />
            <TextBox
              label="Designation"
              placeholder="Enter Designation"
              {...register('managementDesignation')}
              errorMessage={
                formState.errors.managementDesignation?.message as string
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
    </>
  );
}
