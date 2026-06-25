import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormWizard } from 'shared/components/forms';
import type { WizardStep } from 'shared/components/forms/FormWizard';
import { FormPage, PaymentDialog, ReceiptDialog } from 'shared/new-components';
import AffiliationOtherDetailsStep from '../components/AffiliationOtherDetailsStep';
import CollegeCourseDetailStep from '../components/CollegeCourseDetailStep';
import CollegeEnclosureStep from '../components/CollegeEnclosureStep';
import CollegeRegistrationStep from '../components/CollegeRegistrationStep';
import DraftSuccessDialog from '../components/DraftSuccessDialog';
import { useCollegeApplicationForm } from '../components/form.hook';
import { useCreateCollegeRegistrationMutation } from '../queries';

import './Create.css';

export default function Create() {
  const [isUploading, setIsUploading] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftAppNumber, setDraftAppNumber] = useState('');

  // Payment states
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [validatedData, setValidatedData] = useState<any>(null);

  const navigate = useNavigate();
  const { isPending } = useCreateCollegeRegistrationMutation();

  const { register, control, handleSubmit, reset, trigger, setValue } =
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
      // Direct save for draft
      if (data.isSubmitted === false) {
        await executeSubmission(data);
        return;
      }

      // For final submission, initiate payment flow
      let total = 0;
      data.courses?.forEach((c: any) => {
        total += c.totalAmount || 0;
      });

      setValidatedData(data);
      setPaymentAmount(total);
      setShowPaymentDialog(true);
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
    setValue('isSubmitted', true);
    await onFormSubmit();
  };

  const handlePaymentSuccess = (txId: string) => {
    setShowPaymentDialog(false);
    setTransactionId(txId);
    setShowReceiptDialog(true);
  };

  const handleReceiptClose = async () => {
    setShowReceiptDialog(false);
    if (validatedData) {
      // Append transaction details to the payload
      const finalData = {
        ...validatedData,
        transactionId: transactionId,
        transactionDate: new Date().toISOString(),
        isFeePaid: true,
      };
      await executeSubmission(finalData);
    }
  };

  const wizardSteps: WizardStep[] = [
    {
      label: 'College Details',
      icon: 'building',
      content: (
        <CollegeRegistrationStep
          register={register}
          control={control}
          setValue={setValue}
        />
      ),
    },
    {
      label: 'Management Details',
      icon: 'user',
      content: <AffiliationOtherDetailsStep register={register} />,
    },
    {
      label: 'Course Details',
      icon: 'book',
      content: <CollegeCourseDetailStep control={control} />,
    },
    {
      label: 'Enclosures',
      icon: 'folder-open',
      content: (
        <CollegeEnclosureStep
          register={register}
          control={control}
          setValue={setValue}
        />
      ),
    },
  ];

  const handleCloseDraftDialog = () => {
    setShowDraftDialog(false);
    reset();
    navigate(-1);
  };

  return (
    <FormPage
      title="Application for Affiliation"
      description="Fill in all the required details to submit the affiliation application."
      className="affiliation-page-no-scroll"
    >
      <FormWizard
        steps={wizardSteps}
        onComplete={handleFinalSubmit}
        isSaving={isPending || isUploading}
        triggerValidation={trigger as (fields: string[]) => Promise<boolean>}
        onReset={reset}
        customActions={(_activeIndex, isLastStep) =>
          isLastStep ? (
            <Button
              type="button"
              label="Save as Draft"
              variant="outlined"
              onClick={async () => {
                setValue('isSubmitted', false);
                await onFormSubmit();
              }}
              disabled={isUploading || isPending}
              icon="save"
            />
          ) : null
        }
      />

      <DraftSuccessDialog
        visible={showDraftDialog}
        draftAppNumber={draftAppNumber}
        onClose={handleCloseDraftDialog}
      />

      <PaymentDialog
        visible={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onSuccess={handlePaymentSuccess}
        amount={paymentAmount}
      />

      <ReceiptDialog
        visible={showReceiptDialog}
        onClose={handleReceiptClose}
        transactionId={transactionId}
        amount={paymentAmount}
        date={new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      />
    </FormPage>
  );
}
