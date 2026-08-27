import { useRef, useState } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormPage } from 'shared/new-components';
import { APPROVAL_AUTHORITY_DATA } from '../../settings/approval-authority/data';
import { saveCollegeRegistration } from '../../registrationStore';
import CollegeRegistrationStep, {
  dummyDistricts,
  dummyStates,
  dummyTypes,
} from '../components/CollegeRegistrationStep';
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
        const authorityDocs: any[] =
          data.authorityNocDocs && data.authorityNocDocs.length > 0
            ? data.authorityNocDocs
            : data.educationTypeId
              ? [
                  APPROVAL_AUTHORITY_DATA.find(
                    item => item.approvalAuthorityId === data.educationTypeId
                  ),
                ].filter(Boolean)
              : [];
        saveCollegeRegistration({
          collegeName: data.collegeName,
          collegeType:
            dummyTypes.find(t => t.id === data.collegeTypeId)?.name || '',
          collegeEmail: data.collegeEmail,
          principalDirectorName: data.principalDirectorName,
          principalMobileNo: data.principalMobileNo,
          principalEmail: data.principalEmail,
          stateName:
            dummyStates.find(s => s.id === data.stateId)?.name ||
            'Madhya Pradesh',
          districtName:
            dummyDistricts.find(d => d.id === data.districtId)?.name || '',
          blockTehsil: data.blockTehsil || '',
          pinCode: data.pinCode || '',
          collegeAddress: data.collegeAddress,
          societyName: data.societyName,
          secretaryName: data.secretaryName,
          secretaryMobileNo: data.secretaryMobileNo,
          secretaryEmail: data.secretaryEmail,
          educationType: authorityDocs
            .map((doc: any) => doc.educationType)
            .join(', '),
          approvalAuthority: authorityDocs
            .map((doc: any) => doc.authorityName)
            .join(' / '),
          applicationFeePaid: data.applicationFeePaid,
          feeTransactionRef: data.feeTransactionRef,
          feePaidDate: data.feePaidDate,
          applicationNumber:
            data.applicationNumber ||
            'APP-' + Math.floor(10000 + Math.random() * 90000),
        });
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
    if (!methods.getValues('applicationFeePaid')) {
      ToastService.error(
        'Please pay the application fees before saving the form.'
      );
      return;
    }
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
      title="College Registration"
      description="Fill in all the required details to submit the registration form."
    >
      <FormProvider
        {...(methods as unknown as UseFormReturn<AffiliationManagementSystem.CollegeApplicationFormData>)}
      >
        <form onSubmit={onFormSubmit}>
          <div className="flex flex-col gap-6 mb-6 mt-6">
            <CollegeRegistrationStep
              register={register}
              control={control}
              setValue={setValue}
            />
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
              key="fee-summary-button"
              label="View Fee Calculation Mockup"
              type="button"
              icon="payments"
              variant="outlined"
              onClick={() =>
                navigate(
                  '/affiliation-management-system/college-registration/fee-summary-mockup'
                )
              }
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
