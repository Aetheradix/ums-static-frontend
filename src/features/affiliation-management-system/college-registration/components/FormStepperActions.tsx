import { Button } from 'shared/components/buttons';

interface FormStepperActionsProps {
  activeStep: number;
  totalSteps: number;
  isPending: boolean;
  isUploading: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onFinalSubmit: () => void;
}

export default function FormStepperActions({
  activeStep,
  totalSteps,
  isPending,
  isUploading,
  onBack,
  onNext,
  onSaveDraft,
  onFinalSubmit,
}: FormStepperActionsProps) {
  const isLastStep = activeStep === totalSteps - 1;

  return (
    <div className="affiliation-form-actions">
      {activeStep > 0 && (
        <Button
          key="back-button"
          label="Back"
          type="button"
          onClick={onBack}
          icon="arrow-left"
          variant="outlined"
        />
      )}

      {!isLastStep ? (
        <Button
          key="next-button"
          label="Next"
          type="button"
          onClick={onNext}
          icon="arrow-right"
        />
      ) : (
        <>
          <Button
            key="draft-button"
            label="Save as Draft"
            type="submit"
            icon="save"
            variant="outlined"
            className="w-auto!"
            onClick={onSaveDraft}
            isLoading={isPending || isUploading}
          />
          <Button
            key="submit-button"
            label={
              isUploading
                ? 'Uploading...'
                : isPending
                  ? 'Saving...'
                  : 'Final Submit'
            }
            type="submit"
            icon="check"
            onClick={onFinalSubmit}
            isLoading={isPending || isUploading}
          />
        </>
      )}
    </div>
  );
}
