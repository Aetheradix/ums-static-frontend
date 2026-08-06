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
import { useInspectionReportForm } from '../components/form.hook';

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
    formState: { errors },
    reset,
  } = formMethods;

  const { isPending } = useSubmitInspectionReportMutation();

  const handleNext = async () => {
    setActiveStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const onFormSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      // Fake submission for static UI
      ToastService.success('Inspection report submitted successfully!');
      reset();
      setActiveStep(0);
      window.scrollTo(0, 0);
    } catch (e: any) {
      ToastService.error(e?.message || 'Failed to submit report.');
    }
  };

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
                type="button"
              />
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                key="submit"
                label="Submit Complete Report"
                type="button"
                onClick={onFormSubmit as any}
                icon="check"
                isLoading={isPending}
              />
            ) : (
              <Button
                key="next"
                label="Next Step"
                type="button"
                onClick={handleNext}
                icon="arrow-right"
              />
            )}
          </div>
        </form>
      </FormProvider>
    </FormPage>
  );
}
