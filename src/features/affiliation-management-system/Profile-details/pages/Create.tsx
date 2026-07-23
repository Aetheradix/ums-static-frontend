import { ToastService } from 'services';
import { FormWizard } from 'shared/components/forms';
import type { WizardStep } from 'shared/components/forms/FormWizard';
import { FormPage } from 'shared/new-components';
import { useProfileDetailsForm } from '../components/form.hook';
import ProfileEcosystemStep from '../components/ProfileEcosystemStep';
import ProfileInfrastructureStep from '../components/ProfileInfrastructureStep';
import ProfileInstitutionalStep from '../components/ProfileInstitutionalStep';

export default function Create() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    formState,
    nocsArray,
    existingProgrammesArray,
    proposedProgrammesArray,
  } = useProfileDetailsForm();

  const onFormSubmit = handleSubmit(
    data => {
      console.log('Form Submitted', data);
      ToastService.success('College Profile details saved successfully!');
      reset();
    },
    errors => {
      console.log('Validation Errors:', errors);

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

  const wizardSteps: WizardStep[] = [
    {
      label: 'Institutional & NOC Details',
      icon: 'building',
      content: (
        <ProfileInstitutionalStep
          register={register}
          control={control}
          formState={formState}
          nocsArray={nocsArray}
        />
      ),
    },
    {
      label: 'Infrastructure',
      icon: 'map',
      content: (
        <ProfileInfrastructureStep
          register={register}
          control={control}
          formState={formState}
        />
      ),
    },
    {
      label: 'Ecosystem & Courses',
      icon: 'book',
      content: (
        <ProfileEcosystemStep
          register={register}
          control={control}
          formState={formState}
          existingProgrammesArray={existingProgrammesArray}
          proposedProgrammesArray={proposedProgrammesArray}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="College Profile Form"
      description="Configure and save college profile details, infrastructure, and courses."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Affiliation Management System' },
        { label: 'College Profile' },
      ]}
      className="affiliation-page-no-scroll"
    >
      <FormWizard
        steps={wizardSteps}
        onComplete={onFormSubmit}
        triggerValidation={trigger as (fields: string[]) => Promise<boolean>}
        onReset={reset}
      />
    </FormPage>
  );
}
