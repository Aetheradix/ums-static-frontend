import { actionOptionReasonUrls } from 'features/master/employee/settings/action-option-reason/urls';
import { actionOptionUrls } from 'features/master/employee/settings/action-option/urls';
import { employmentNatureUrls } from 'features/master/employee/settings/nature-of-employment/urls';
import { organizationUnitUrls } from 'features/master/employee/settings/organization-unit/urls';
import { subjectSpecializationUrls } from 'features/master/employee/settings/subject-specialization/urls';
import { travelPurposeUrls } from 'features/master/employee/settings/travel-purpose/urls';

const baseUrl = '/employee-management';

export const quickOnboardingUrls = (base: string) => {
  const prefix = `${base}/quick-onboarding`;

  return {
    root: prefix,
    create: `${prefix}/create`,
  };
};

export const settingsUrls = (base: string) => {
  const prefix = `${base}/settings`;

  return {
    root: prefix,
    employmentNature: employmentNatureUrls(prefix),
    organizationUnit: organizationUnitUrls(prefix),
    actionOption: actionOptionUrls(prefix),
    subjectSpecialization: subjectSpecializationUrls(prefix),
    actionOptionReason: actionOptionReasonUrls(prefix),
    travelPurpose: travelPurposeUrls(prefix),
  };
};

export const fullOnboardingUrls = (base: string) => {
  const prefix = `${base}/full-onboarding`;

  return {
    root: prefix,
    create: `${prefix}/create`,
  };
};

export const employeeManagementUrls = {
  root: baseUrl,

  quickOnboarding: quickOnboardingUrls(baseUrl),
  fullOnboarding: fullOnboardingUrls(baseUrl),
  settings: settingsUrls(baseUrl),
};
