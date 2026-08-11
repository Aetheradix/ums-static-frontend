import { useEffect, useRef, useState } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormPage } from 'shared/new-components';
import CollegeRegistrationStep from '../components/CollegeRegistrationStep';
import DraftSuccessDialog from '../components/DraftSuccessDialog';
import { useCollegeApplicationForm } from '../components/form.hook';
import './Create.css';

export default function Update() {
  const [isUploading, setIsUploading] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftAppNumber, setDraftAppNumber] = useState('');
  const submitTypeRef = useRef<'DRAFT' | 'FINAL'>('DRAFT');

  const navigate = useNavigate();
  const location = useLocation();

  const { methods, register, control, handleSubmit, reset, setValue } =
    useCollegeApplicationForm();

  const draftData = location.state
    ?.draftData as AffiliationManagementSystem.DraftRegistrationRequest;

  useEffect(() => {
    if (draftData) {
      reset({
        applicationNumber: draftData.applicationNumber,
        collegeName: draftData.collegeName,
        collegeTypeId: draftData.collegeTypeId || 1,
        principalDirectorName:
          draftData.affiliation?.principalDirectorName || '',
        principalMobileNo: draftData.affiliation?.principalMobileNo || '',
        principalEmail: draftData.affiliation?.principalEmail || '',
        collegeEmail: draftData.collegeEmail,
        collegeAddress: draftData.collegeAddress,
        districtId: draftData.districtId || 1,
        blockTehsil: draftData.blockTehsil || 'Indore',
        pinCode: draftData.pinCode || '452001',
        captcha: '7A9x2',
        declaration: true,
      });
    } else {
      ToastService.error('No draft data found. Redirecting to search.');
      navigate('/affiliation-management-system/draft-registration-request');
    }
  }, [draftData, reset, navigate]);

  const executeUpdate = async (data: any) => {
    try {
      setIsUploading(true);
      // Simulate network delay for static showcase
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsUploading(false);

      // Fully static bypass: Force success
      if (data.isSubmitted === false) {
        setDraftAppNumber(
          data.applicationNumber ||
            draftData?.applicationNumber ||
            'APP-' + Math.floor(Math.random() * 100000)
        );
        setShowDraftDialog(true);
      } else {
        ToastService.success('College Registration updated successfully.');
        reset();
        navigate('/affiliation-management-system/draft-registration-request');
      }
    } catch {
      setIsUploading(false);
      ToastService.error('Failed to update college registration');
    }
  };

  const onFormSubmit = handleSubmit(
    async data => {
      const isFinalSubmit = submitTypeRef.current === 'FINAL';
      data.isSubmitted = isFinalSubmit;
      await executeUpdate(data);
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
    navigate('/affiliation-management-system/draft-registration-request');
  };

  if (!draftData) return null;

  return (
    <FormPage
      title="Update College Registration"
      description="Fill in all the required details to update the registration form."
    >
      {draftData.approvalStatus === 3 && draftData.rejectionReason && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <i className="pi pi-exclamation-triangle text-red-500 text-xl mt-0.5"></i>
            <div>
              <h3 className="text-red-800 font-semibold text-base mb-1">
                Registration Rejected
              </h3>
              <p className="text-red-700 text-sm">
                <strong>Reason: </strong>
                {draftData.rejectionReason}
              </p>
            </div>
          </div>
        </div>
      )}

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
              onClick={() =>
                navigate(
                  '/affiliation-management-system/draft-registration-request'
                )
              }
              variant="outlined"
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
