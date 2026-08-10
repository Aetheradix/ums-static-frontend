import { useRef, useState } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormPage } from 'shared/new-components';
import AffiliationOtherDetailsStep from '../components/AffiliationOtherDetailsStep';
import CollegeApplicationDetailsCard from '../components/CollegeApplicationDetailsCard';
import CollegeEnclosureStep from '../components/CollegeEnclosureStep';
import CollegeRegistrationStep from '../components/CollegeRegistrationStep';
import DraftSuccessDialog from '../components/DraftSuccessDialog';
import { useCollegeApplicationForm } from '../components/form.hook';
import './Create.css';

export default function Create() {
  const [isUploading, setIsUploading] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftAppNumber, setDraftAppNumber] = useState('');
  const submitTypeRef = useRef<'DRAFT' | 'FINAL'>('DRAFT');

  const navigate = useNavigate();

  const { methods, register, control, handleSubmit, reset, setValue } =
    useCollegeApplicationForm();

  const executeSubmission = async (data: any) => {
    try {
      setIsUploading(true);
      // Simulate network delay for static showcase
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsUploading(false);

      // Fully static bypass: Force success
      if (data.isSubmitted === false) {
        setDraftAppNumber(
          data.applicationNumber || 'APP-' + Math.floor(Math.random() * 100000)
        );
        setShowDraftDialog(true);
      } else {
        ToastService.success('College Registration submitted successfully.');
        reset();
        navigate(-1);
      }
    } catch {
      setIsUploading(false);
      ToastService.error('Failed to submit college registration');
    }
  };

  const onFormSubmit = handleSubmit(
    async data => {
      const isFinalSubmit = submitTypeRef.current === 'FINAL';
      data.isSubmitted = isFinalSubmit;
      await executeSubmission(data);
    },
    errors => {
      console.log('Validation Errors on Save:', errors);
      const getFirstError = (obj: any): string | null => {
        if (!obj || typeof obj !== 'object') return null;
        for (const key in obj) {
          if (obj[key]?.message && typeof obj[key].message === 'string') {
            return obj[key].message;
          }
          const nested = getFirstError(obj[key]);
          if (nested) return nested;
        }
        return null;
      };
      const errorMsg = getFirstError(errors);
      ToastService.error(
        errorMsg
          ? `Validation Error: ${errorMsg}`
          : 'Please fix the validation errors in the form.'
      );
    }
  );

  const handleFinalSubmit = async () => {
    submitTypeRef.current = 'FINAL';
    setValue('isSubmitted', true);
    await onFormSubmit();
  };

  const handleCloseDraftDialog = () => {
    setShowDraftDialog(false);
    reset();
    navigate(-1);
  };

  return (
    <FormPage
      title="Application for Affiliation"
      description="Fill in all the required details to submit the affiliation application."
    >
      <FormProvider
        {...(methods as unknown as UseFormReturn<AffiliationManagementSystem.CollegeApplicationFormData>)}
      >
        <form onSubmit={onFormSubmit}>
          <div className="flex flex-col gap-6 mb-6 mt-6">
            <CollegeApplicationDetailsCard
              register={register}
              control={control}
              setValue={setValue}
            />
            <CollegeRegistrationStep
              register={register}
              control={control}
              setValue={setValue}
            />
            <AffiliationOtherDetailsStep
              register={register}
              setValue={setValue}
            />
            <CollegeEnclosureStep control={control} />
          </div>

          <div className="form-actions-container form-actions-right">
            <Button
              key="cancel-button"
              label="Cancel"
              type="button"
              onClick={() => navigate(-1)}
              variant="outlined"
            />
            <Button
              key="draft-button"
              label="Save as Draft"
              type="button"
              variant="outlined"
              onClick={async () => {
                submitTypeRef.current = 'DRAFT';
                setValue('isSubmitted', false);
                await onFormSubmit();
              }}
              disabled={isUploading}
              icon="save"
            />
            <Button
              key="save-button"
              label="Save"
              type="button"
              icon="save"
              onClick={handleFinalSubmit}
              isLoading={isUploading}
            />
          </div>
        </form>
      </FormProvider>

      <DraftSuccessDialog
        visible={showDraftDialog}
        draftAppNumber={draftAppNumber}
        onClose={handleCloseDraftDialog}
      />
    </FormPage>
  );
}
