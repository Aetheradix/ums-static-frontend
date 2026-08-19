import { ToastService } from 'services';
import { FormWizard } from 'shared/components/forms';
import type { WizardStep } from 'shared/components/forms/FormWizard';
import { FormPage } from 'shared/new-components';
import { useProfileDetailsForm } from '../components/form.hook';
import ProfileCertificationStep from '../components/ProfileCertificationStep';
import ProfileComplianceStep from '../components/ProfileComplianceStep';
import ProfileEcosystemStep from '../components/ProfileEcosystemStep';
import ProfileFacilitiesStep from '../components/ProfileFacilitiesStep';
import ProfileFeePaymentStep from '../components/ProfileFeePaymentStep';
import ProfileInfraDetailsStep from '../components/ProfileInfraDetailsStep';
import ProfileInstitutionalStep from '../components/ProfileInstitutionalStep';
import ProfileLandBuildingStep from '../components/ProfileLandBuildingStep';
import ProfileOthersStep from '../components/ProfileOthersStep';
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
    hostelsArray,
    nonTeachingStaffArray,
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
          additionalInstitutionsArray={additionalInstitutionsArray}
          trigger={trigger as any}
        />
      ),
    },
    {
      label: 'Course Registration',
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
      label: 'Land & Building',
      icon: 'map',
      content: (
        <ProfileLandBuildingStep
          register={register}
          control={control}
          formState={formState}
          setValue={setValue}
        />
      ),
    },
    {
      label: 'Facilities',
      icon: 'building',
      content: (
        <ProfileFacilitiesStep
          register={register}
          control={control}
          formState={formState}
          labsArray={labsArray}
          hostelsArray={hostelsArray}
          trigger={trigger as any}
        />
      ),
    },
    {
      label: 'Infrastructure',
      icon: 'desktop',
      content: (
        <ProfileInfraDetailsStep
          register={register}
          control={control}
          formState={formState}
        />
      ),
    },
    {
      label: 'Teacher Details',
      icon: 'users',
      content: (
        <ProfileEcosystemStep
          register={register}
          control={control}
          formState={formState}
          teachingStaffArray={teachingStaffArray}
          nonTeachingStaffArray={nonTeachingStaffArray}
          trigger={trigger as any}
        />
      ),
    },
    {
      label: 'Compliance',
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
      label: 'Others',
      icon: 'list',
      content: (
        <ProfileOthersStep
          register={register}
          control={control}
          formState={formState}
        />
      ),
    },
    {
      label: 'Course Fees & Payment',
      icon: 'credit-card',
      content: (
        <ProfileFeePaymentStep
          register={register}
          control={control}
          formState={formState}
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
