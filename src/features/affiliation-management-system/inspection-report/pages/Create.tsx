import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormPage, StatusBadge, Stepper } from 'shared/new-components';
import { useSubmitInspectionReportMutation } from '../api';
import AcademicFacilitiesStep from '../components/AcademicFacilitiesStep';
import AcademicStaffStep from '../components/AcademicStaffStep';
import ComplianceAndOpinionStep from '../components/ComplianceAndOpinionStep';
import InfrastructureStep from '../components/InfrastructureStep';
import InspectionDetailsStep from '../components/InspectionDetailsStep';
import { STEP_FIELDS, useInspectionReportForm } from '../components/form.hook';

const steps = [
  { label: 'Inspection Details' },
  { label: 'Infrastructure & Facilities' },
  { label: 'Academic Staff' },
  { label: 'Academic Facilities' },
  { label: 'Compliance & Opinion' },
];

export default function Create() {
  const [activeStep, setActiveStep] = useState(0);
  const formMethods = useInspectionReportForm();
  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = formMethods;

  const { mutateAsync, isPending } = useSubmitInspectionReportMutation();

  const handleNext = async () => {
    const fieldsToValidate =
      STEP_FIELDS[activeStep as keyof typeof STEP_FIELDS];
    const isStepValid = await trigger(fieldsToValidate as any);

    if (isStepValid) {
      setActiveStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      ToastService.error('Please fill all required fields in this step.');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const onFormSubmit = handleSubmit(
    async data => {
      try {
        await mutateAsync(data as any);
        ToastService.success('Inspection report submitted successfully!');
        reset();
        setActiveStep(0);
        window.scrollTo(0, 0);
      } catch (e: any) {
        ToastService.error(e?.message || 'Failed to submit report.');
      }
    },
    err => {
      console.log('Validation Errors:', err);
      ToastService.error('Please fix the validation errors in the form.');
    }
  );

  return (
    <FormPage
      title="Detailed Inspection Report"
      description="College: Bhopal College | App No: 111281524081"
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Inspection Report' }]}
      headerAction={
        <StatusBadge label="Inspection In Progress" variant="pending" />
      }
    >
      <div className="mb-6">
        <Stepper steps={steps} activeStep={activeStep} />
      </div>

      <FormProvider {...(formMethods as any)}>
        <form onSubmit={onFormSubmit}>
          {activeStep === 0 && (
            <InspectionDetailsStep
              register={register}
              control={control}
              errors={errors}
            />
          )}

          {activeStep === 1 && (
            <InfrastructureStep
              register={register}
              control={control}
              errors={errors}
            />
          )}

          {activeStep === 2 && (
            <AcademicStaffStep
              register={register}
              control={control}
              errors={errors}
            />
          )}

          {activeStep === 3 && (
            <AcademicFacilitiesStep
              register={register}
              control={control}
              errors={errors}
            />
          )}

          {activeStep === 4 && (
            <ComplianceAndOpinionStep
              register={register}
              control={control}
              errors={errors}
            />
          )}

          <div className="flex justify-end gap-2 mt-4">
            {activeStep > 0 && (
              <Button
                label="Back"
                onClick={handleBack}
                icon="arrow-left"
                variant="outlined"
              />
            )}
            <Button
              label={
                activeStep === steps.length - 1
                  ? 'Submit Complete Report'
                  : 'Next Step'
              }
              type="submit"
              onClick={activeStep === steps.length - 1 ? undefined : handleNext}
              icon={activeStep === steps.length - 1 ? 'check' : 'arrow-right'}
              isLoading={isPending}
            />
          </div>
        </form>
      </FormProvider>
    </FormPage>
  );
}
