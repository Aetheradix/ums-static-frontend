import { ToastService } from 'services';
import { FormWizard } from 'shared/components/forms';
import type { WizardStep } from 'shared/components/forms/FormWizard';
import { FormPage } from 'shared/new-components';
import { useProfileDetailsForm } from '../components/form.hook';
import ProfileCertificationStep from '../components/ProfileCertificationStep';
import ProfileDocumentUploadStep from '../components/ProfileDocumentUploadStep';
import ProfileComplianceStep from '../components/ProfileComplianceStep';
import ProfileEcosystemStep from '../components/ProfileEcosystemStep';
import ProfileInfrastructureStep from '../components/ProfileInfrastructureStep';
import ProfileInstitutionalStep from '../components/ProfileInstitutionalStep';
import ProfileCoursesStep from '../components/ProfileCoursesStep';

export default function Create() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState,
    governingBodyMembersArray,
    existingCoursesArray,
    teachingStaffArray,
    additionalInstitutionsArray,
    labsArray,
  } = useProfileDetailsForm();

  const onFormSubmit = handleSubmit(
    _data => {
      ToastService.success('College Affiliation Form saved successfully!');
      reset();
    },
    errors => {
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
      label: 'General Info',
      icon: 'info-circle',
      content: (
        <ProfileInstitutionalStep
          register={register}
          control={control}
          formState={formState}
          governingBodyMembersArray={governingBodyMembersArray}
          trigger={trigger as any}
        />
      ),
    },
    {
      label: 'Academics & Inst.',
      icon: 'book',
      content: (
        <ProfileEcosystemStep
          register={register}
          control={control}
          formState={formState}
          teachingStaffArray={teachingStaffArray}
          additionalInstitutionsArray={additionalInstitutionsArray}
          trigger={trigger as any}
        />
      ),
    },
    {
      label: 'Infra & Facilities',
      icon: 'map',
      content: (
        <ProfileInfrastructureStep
          register={register}
          control={control}
          formState={formState}
          labsArray={labsArray}
          trigger={trigger as any}
        />
      ),
    },
    {
      label: 'Compliance & Eq...',
      icon: 'check-circle',
      content: (
        <ProfileComplianceStep
          register={register}
          control={control}
          formState={formState}
        />
      ),
    },
    {
      label: 'Existing Courses',
      icon: 'book',
      content: (
        <ProfileCoursesStep
          register={register}
          control={control}
          formState={formState}
          existingCoursesArray={existingCoursesArray}
          trigger={trigger as any}
        />
      ),
    },
    {
      label: 'Document Uploads',
      icon: 'upload',
      content: (
        <ProfileDocumentUploadStep
          register={register}
          control={control}
          formState={formState}
          setValue={setValue}
        />
      ),
    },
    {
      label: 'Signature & Declaration',
      icon: 'check-circle',
      content: (
        <ProfileCertificationStep
          register={register}
          control={control}
          formState={formState}
        />
      ),
    },
  ];

  return (
    <FormPage
      title="College Affiliation Form"
      description="Configure and save college affiliation form, infrastructure, and courses."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Affiliation Management System' },
        { label: 'College Affiliation Form' },
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
