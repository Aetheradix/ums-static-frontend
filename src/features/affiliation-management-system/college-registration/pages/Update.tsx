import { useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, type Path, type UseFormReturn } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormPage, Stepper } from 'shared/new-components';
import AffiliationOtherDetailsStep from '../components/AffiliationOtherDetailsStep';
import CollegeEnclosureStep from '../components/CollegeEnclosureStep';
import CollegeRegistrationStep from '../components/CollegeRegistrationStep';
import DraftSuccessDialog from '../components/DraftSuccessDialog';
import {
  useCollegeApplicationForm,
  STEP_FIELDS,
} from '../components/form.hook';
import './Create.css';

const STEPS = [
  { label: 'College Details' },
  { label: 'Management Details' },
  { label: 'Enclosures' },
];

export default function Update() {
  const [activeStep, setActiveStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftAppNumber, setDraftAppNumber] = useState('');
  const submitTypeRef = useRef<'DRAFT' | 'FINAL'>('DRAFT');

  const navigate = useNavigate();
  const location = useLocation();

  const { methods, register, control, handleSubmit, reset, trigger, setValue } =
    useCollegeApplicationForm();

  const draftData = location.state
    ?.draftData as AffiliationManagementSystem.DraftRegistrationRequest;

  useEffect(() => {
    if (draftData) {
      reset({
        applicationNumber: draftData.applicationNumber,
        collegeName: draftData.collegeName,
        collegeCode: draftData.collegeCode,
        establishmentYear: draftData.establishmentYear,
        collegeAddress: draftData.collegeAddress,
        stateId: draftData.stateId || null,
        districtId: draftData.districtId || null,
        affiliationTypeId: draftData.affiliationTypeId || null,
        telephoneNo: draftData.telephoneNo,
        collegeEmail: draftData.collegeEmail,
        collegeCategoryId: draftData.collegeCategoryId,
        collegeTypeId: draftData.collegeTypeId,
        accommodationType: draftData.accommodationType,
        collegeArea: draftData.collegeArea,
        principalDirectorName:
          draftData.affiliation?.principalDirectorName || '',
        principalMobileNo: draftData.affiliation?.principalMobileNo || '',
        principalEmail: draftData.affiliation?.principalEmail || '',
        societyName: draftData.affiliation?.societyName || '',
        secretaryName: draftData.affiliation?.secretaryName || '',
        societyRegistrationNo:
          draftData.affiliation?.societyRegistrationNo || '',
        societyRegistrationDate: draftData.affiliation?.societyRegistrationDate
          ? new Date(draftData.affiliation.societyRegistrationDate)
          : undefined,
        isOtherInstitutionRunning:
          draftData.affiliation?.isOtherInstitutionRunning || false,
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

  const handleNext = useCallback(async () => {
    const fields = STEP_FIELDS[activeStep];
    const isValid = await trigger(
      fields as Path<AffiliationManagementSystem.CollegeApplicationFormData>[]
    );
    if (isValid) setActiveStep(prev => prev + 1);
  }, [activeStep, trigger]);

  const handleBack = useCallback(() => {
    setActiveStep(prev => Math.max(0, prev - 1));
  }, []);

  const handleStepClick = useCallback(
    (index: number) => {
      if (index < activeStep) setActiveStep(index);
    },
    [activeStep]
  );

  const isLastStep = activeStep === STEPS.length - 1;

  const handleCloseDraftDialog = () => {
    setShowDraftDialog(false);
    reset();
    navigate('/affiliation-management-system/draft-registration-request');
  };

  if (!draftData) return null;

  return (
    <FormPage
      title="Update Application for Affiliation"
      description="Fill in all the required details to submit the affiliation application."
      className="affiliation-page-no-scroll"
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

      <Stepper
        steps={STEPS}
        activeStep={activeStep}
        onStepClick={handleStepClick}
      />

      <FormProvider
        {...(methods as unknown as UseFormReturn<AffiliationManagementSystem.CollegeApplicationFormData>)}
      >
        <form onSubmit={onFormSubmit}>
          <div className="flex flex-col gap-6 mb-6 mt-6">
            {activeStep === 0 && (
              <CollegeRegistrationStep
                register={register}
                control={control}
                setValue={setValue}
                isEdit={true}
              />
            )}
            {activeStep === 1 && (
              <AffiliationOtherDetailsStep
                register={register}
                setValue={setValue}
              />
            )}
            {activeStep === 2 && (
              <CollegeEnclosureStep
                register={register}
                control={control}
                setValue={setValue}
                isEdit={true}
              />
            )}
          </div>

          <div className="form-actions-container form-actions-right">
            {activeStep > 0 && (
              <Button
                key="back-button"
                label="Back"
                type="button"
                onClick={handleBack}
                icon="arrow-left"
                variant="outlined"
              />
            )}
            {!isLastStep ? (
              <Button
                key="next-button"
                label="Next"
                type="button"
                onClick={handleNext}
                icon="arrow-right"
              />
            ) : (
              <>
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
              </>
            )}
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
