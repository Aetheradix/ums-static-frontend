import { useEffect } from 'react';
import type { Control, Path, UseFormSetValue } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { ToastService } from 'services';
import { FileUpload, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid } from 'shared/new-components';
import { generateApplicationNumber } from '../utils';
import './CollegeEnclosureStep.css';

interface CollegeEnclosureStepProps {
  register: (
    name: Path<AffiliationManagementSystem.CollegeApplicationFormData>
  ) => {
    control: Control<AffiliationManagementSystem.CollegeApplicationFormData>;
    name: Path<AffiliationManagementSystem.CollegeApplicationFormData>;
  };
  control: Control<AffiliationManagementSystem.CollegeApplicationFormData>;
  setValue: UseFormSetValue<AffiliationManagementSystem.CollegeApplicationFormData>;
}

export default function CollegeEnclosureStep({
  register,
  control,
  setValue,
}: CollegeEnclosureStepProps) {
  const collegeCode = useWatch({ control, name: 'collegeCode' }) || '';
  const applicationNumber = useWatch({ control, name: 'applicationNumber' });

  useEffect(() => {
    const codePrefix = collegeCode.slice(-3).toUpperCase();
    const shouldRegenerate =
      !applicationNumber ||
      (codePrefix && !applicationNumber.startsWith(codePrefix));

    if (shouldRegenerate) {
      const newAppNo = generateApplicationNumber(collegeCode);
      setValue('applicationNumber', newAppNo, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [applicationNumber, collegeCode, setValue]);

  return (
    <div className="college-enclosure-step">
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

      <FormCard
        title="Enclosure (All enclosures to be submitted in hard copy)"
        subtitle="Please upload clear and legible scanned copies in PDF format."
        icon="folder-open"
        headerAction={
          <div className="enclosure-card-top-note">
            <i className="pi pi-info-circle" />
            <span>Maximum file size: 250 KB each</span>
          </div>
        }
      >
        <FormGrid columns={1}>
          <div className="enclosure-upload-list">
            <FileUpload
              label="Attach scanned copy of NOC of MP Government in .pdf format"
              name="nocFile"
              control={control}
              accept=".pdf"
              mode="file"
              uploadNote="PDF format only, maximum size 250 KB"
              required
            />

            <FileUpload
              label="Attach scanned copy of Affidavit in .pdf format"
              name="affidavitFile"
              control={control}
              accept=".pdf"
              mode="file"
              uploadNote="PDF format only, maximum size 250 KB"
              required
            />

            <FileUpload
              label="Attach scanned copy of relevant regular authority letter for professional course in .pdf format"
              name="regularAuthorityFile"
              control={control}
              accept=".pdf"
              mode="file"
              uploadNote="PDF format only, maximum size 250 KB (Optional)"
            />
          </div>
        </FormGrid>
      </FormCard>
    </div>
  );
}
