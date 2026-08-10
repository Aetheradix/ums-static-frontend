import { useEffect } from 'react';
import type { Control, Path, UseFormSetValue } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { ToastService } from 'services';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import { generateApplicationNumber } from '../utils';
import './CollegeEnclosureStep.css';

interface CollegeApplicationDetailsCardProps {
  register: (
    name: Path<AffiliationManagementSystem.CollegeApplicationFormData>
  ) => {
    control: Control<AffiliationManagementSystem.CollegeApplicationFormData>;
    name: Path<AffiliationManagementSystem.CollegeApplicationFormData>;
  };
  control: Control<AffiliationManagementSystem.CollegeApplicationFormData>;
  setValue: UseFormSetValue<AffiliationManagementSystem.CollegeApplicationFormData>;
  isEdit?: boolean;
}

export default function CollegeApplicationDetailsCard({
  register,
  control,
  setValue,
  isEdit = false,
}: CollegeApplicationDetailsCardProps) {
  const collegeCode = useWatch({ control, name: 'collegeCode' }) || '';
  const applicationNumber = useWatch({ control, name: 'applicationNumber' });

  useEffect(() => {
    if (isEdit) return;

    const codePrefix = collegeCode.slice(-3).toUpperCase();
    const shouldRegenerate =
      !applicationNumber ||
      (codePrefix && !applicationNumber.startsWith(codePrefix)) ||
      (!codePrefix && /^[A-Za-z]/.test(applicationNumber || ''));

    if (shouldRegenerate) {
      const newAppNo = generateApplicationNumber(collegeCode);
      setValue('applicationNumber', newAppNo, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [applicationNumber, collegeCode, setValue]);

  return (
    <FormCard
      title="Application Details"
      subtitle="Review your auto-generated application number before submission."
      icon="id-card"
    >
      <FormGrid columns={2}>
        <div className="application-number-field-wrap">
          <TextBox
            label="Application Number"
            subLabel="This is your unique application number."
            {...register('applicationNumber')}
            disabled
            placeholder="Auto-generated application number"
          />

          <button
            type="button"
            className="application-number-copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(applicationNumber || '');
              ToastService.success('Application number copied.');
            }}
            title="Copy application number"
          >
            <i className="pi pi-copy" />
          </button>
        </div>
      </FormGrid>
    </FormCard>
  );
}
