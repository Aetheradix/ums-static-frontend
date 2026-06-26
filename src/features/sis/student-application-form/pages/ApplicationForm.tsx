import { ToastService } from 'services';
import { FormWizard } from 'shared/components/forms';
import type { WizardStep } from 'shared/components/forms/FormWizard';
import { FormPage } from 'shared/new-components';
import AcademicInfoStep from '../components/AcademicInfoStep';
import AddressInfoStep from '../components/AddressInfoStep';
import BasicInfoStep from '../components/BasicInfoStep';
import ChoiceFillingStep from '../components/ChoiceFillingStep';
import FatherInfoStep from '../components/FatherInfoStep';
import { useApplicationForm } from '../components/form.hook';
import MotherInfoStep from '../components/MotherInfoStep';
import type { ApplicationFormData } from '../types';

export default function ApplicationForm() {
  const { methods, register, draftLoaded, isSubmitting, saveDraft, onSubmit } =
    useApplicationForm();
  const { handleSubmit, reset, trigger, control, setValue, formState } =
    methods;

  const onFormSubmit = handleSubmit(
    async (data: ApplicationFormData) => {
      try {
        const result = await onSubmit(data);
        if (result) {
          ToastService.success('Application submitted successfully.');
          reset();
        }
      } catch (e: any) {
        ToastService.error(e?.message || 'Failed to submit application.');
      }
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
      label: 'Basic Info',
      icon: 'user',
      content: <BasicInfoStep register={register} />,
    },
    {
      label: "Father's Details",
      icon: 'users',
      content: <FatherInfoStep register={register} />,
    },
    {
      label: "Mother's Details",
      icon: 'users',
      content: <MotherInfoStep register={register} />,
    },
    {
      label: 'Academic Info',
      icon: 'book',
      content: (
        <AcademicInfoStep
          register={register}
          control={control}
          setValue={setValue}
          errors={formState.errors}
        />
      ),
    },
    {
      label: 'Choice Filling',
      icon: 'list',
      content: <ChoiceFillingStep control={control} setValue={setValue} />,
    },
    {
      label: 'Address Info',
      icon: 'map-marker',
      content: (
        <AddressInfoStep
          register={register}
          control={control}
          setValue={setValue}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="Student Application Form"
      description="Fill in all the required details to submit your application."
    >
      {!draftLoaded ? (
        <div className="flex items-center justify-center p-8">
          <i className="pi pi-spin pi-spinner text-3xl text-primary" />
          <span className="ml-3 text-gray-500">
            Loading your application...
          </span>
        </div>
      ) : (
        <FormWizard
          steps={wizardSteps}
          onComplete={async () => {
            await saveDraft();
            await onFormSubmit();
          }}
          isSaving={isSubmitting}
          triggerValidation={trigger as (fields: string[]) => Promise<boolean>}
          onReset={reset}
        />
      )}
    </FormPage>
  );
}
