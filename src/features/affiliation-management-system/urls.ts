import { availableFacilityUrls } from 'features/master/college/college-facility/urls';
import { establishmentYearUrls } from 'features/master/other/establishment-year/urls';
import { collegeRegistrationApprovalUrls } from './college-registration-approval/urls';
import { collegeRegistrationUrls } from './college-registration/urls';
import { departmentRegistrationUrls } from './department-registration/urls';
import { collegeRenewalUrls } from './college-renewal/urls';
import { collegeRenewalAdminUrls } from './college-renewal-admin/urls';

const baseUrl = '/affiliation-management-system';
export const affiliationManagementSystemUrls = {
  collegeRegistration: collegeRegistrationUrls(baseUrl),
  departmentRegistration: departmentRegistrationUrls(baseUrl),
  collegeRegistrationApproval: collegeRegistrationApprovalUrls(baseUrl),
  collegeRenewal: collegeRenewalUrls(baseUrl),
  collegeRenewalAdmin: collegeRenewalAdminUrls(baseUrl),
  availableFacility: availableFacilityUrls(`${baseUrl}/affiliation-settings`),
  establishmentYear: establishmentYearUrls(`${baseUrl}/affiliation-settings`),
};
