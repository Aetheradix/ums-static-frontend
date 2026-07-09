import { availableFacilityUrls } from 'features/master/college/college-facility/urls';
import { establishmentYearUrls } from 'features/master/other/establishment-year/urls';
import { collegeRegistrationApprovalUrls } from './college-registration-approval/urls';
import { collegeRegistrationUrls } from './college-registration/urls';
import { departmentRegistrationUrls } from './department-registration/urls';
import { collegeRenewalUrls } from './college-renewal/urls';
import { collegeRenewalAdminUrls } from './college-renewal-admin/urls';
import { inspectionAssignmentUrls } from './inspection-assignment/urls';
import { finalRegistrationApprovalUrls } from './final-registration-approval/urls';

const baseUrl = '/affiliation-management-system';
export const affiliationManagementSystemUrls = {
  collegeRegistration: collegeRegistrationUrls(baseUrl),
  departmentRegistration: departmentRegistrationUrls(baseUrl),
  collegeRegistrationApproval: collegeRegistrationApprovalUrls(baseUrl),
  collegeRenewal: collegeRenewalUrls(baseUrl),
  collegeRenewalAdmin: collegeRenewalAdminUrls(baseUrl),
  inspectionAssignment: inspectionAssignmentUrls(baseUrl),
  finalRegistrationApproval: finalRegistrationApprovalUrls(baseUrl),
  availableFacility: availableFacilityUrls(`${baseUrl}/affiliation-settings`),
  establishmentYear: establishmentYearUrls(`${baseUrl}/affiliation-settings`),
};
