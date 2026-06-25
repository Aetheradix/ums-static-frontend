import { collegeCategoryUrls } from './college/college-category/urls';
import { collegeTypeUrls } from './college/college-type/urls';
import { actionOptionReasonUrls } from './employee/settings/action-option-reason/urls';
import { actionOptionUrls } from './employee/settings/action-option/urls';
import { employeeGroupUrls } from './employee/settings/employee-group/urls';
import { employmentNatureUrls } from './employee/settings/nature-of-employment/urls';
import { organizationUnitUrls } from './employee/settings/organization-unit/urls';
import { subjectSpecializationUrls } from './employee/settings/subject-specialization/urls';
import { travelPurposeUrls } from './employee/settings/travel-purpose/urls';
import { departmentUrls } from './faculty/department/urls';
import { designationUrls } from './faculty/designation/urls';
import { facultyUrls } from './faculty/faculty/urls';
import { officeTypeUrls } from './faculty/office-type/urls';
import { eligibilityApplicationProcessUrls } from './grant/eligibility-application-process/urls';
import { grantCategoryUrls } from './grant/grant-category/urls';
import { grantTypeUrls } from './grant/grant-type/urls';
import { casteUrls } from './hr/caste/urls';
import { classUrls } from './hr/class/urls';
import { designationTypeUrls } from './hr/designation-type/urls';
import { designationUrls as designationHrUrls } from './hr/designation/urls';
import { postUrls } from './hr/post/urls';
import { qualificationUrls } from './hr/qualification/urls';
import { religionUrls } from './hr/religion/urls';
import { sectionUrls } from './hr/section/urls';
import { blockUrls } from './location/block/urls';
import { districtUrls } from './location/district/urls';
import { divisionUrls } from './location/division/urls';
import { stateUrls } from './location/state/urls';
import { tehsilUrls } from './location/tehsil/urls';
import { academicYearUrls } from './other/academic-year/urls';
import { degreeLevelUrls } from './other/degree-level/urls';
import { nationalityUrls } from './other/nationality/urls';
import { programmeUrls } from './other/programme/urls';
import { specialisationUrls } from './other/specialisation/urls';
import { schemeCategoryUrls } from './schemes/scheme-category/urls';
import { schemeTypeUrls } from './schemes/scheme-type/urls';
import { schemeUrls } from './schemes/scheme/urls';
import { ProgrammeModeOfEducationUrls } from './subject/programme-mode-of-education/urls';
import { subjectCategoryUrls } from './subject/subject-category/urls';
const baseUrl = '/master';
export const masterUrls = {
  programmeModeOfEducation: ProgrammeModeOfEducationUrls(baseUrl),
  subjectCategory: subjectCategoryUrls(baseUrl),
  officeType: officeTypeUrls(`${baseUrl}/faculty-management`),
  department: departmentUrls(`${baseUrl}/faculty-management`),
  state: stateUrls(`${baseUrl}/location`),
  division: divisionUrls(`${baseUrl}/location`),
  district: districtUrls(`${baseUrl}/location`),
  tehsil: tehsilUrls(`${baseUrl}/location`),
  block: blockUrls(`${baseUrl}/location`),
  designation: designationUrls(`${baseUrl}/faculty-management`),
  caste: casteUrls(`${baseUrl}/hr`),
  class: classUrls(`${baseUrl}/hr`),
  designationType: designationTypeUrls(`${baseUrl}/hr`),
  designationHr: designationHrUrls(`${baseUrl}/hr`),
  post: postUrls(`${baseUrl}/hr`),
  qualification: qualificationUrls(`${baseUrl}/hr`),
  religion: religionUrls(`${baseUrl}/hr`),
  section: sectionUrls(`${baseUrl}/hr`),
  collegeType: collegeTypeUrls(`${baseUrl}/college`),
  collegeCategory: collegeCategoryUrls(`${baseUrl}/college`),
  faculty: facultyUrls(`${baseUrl}/faculty-management`),
  degreeLevel: degreeLevelUrls(`${baseUrl}/other`),
  academicYear: academicYearUrls(`${baseUrl}/other`),
  programme: programmeUrls(`${baseUrl}/other`),
  scheme: schemeUrls(`${baseUrl}/scheme`),
  schemeType: schemeTypeUrls(`${baseUrl}/scheme`),
  schemeCategory: schemeCategoryUrls(`${baseUrl}/scheme`),
  specialisation: specialisationUrls(`${baseUrl}/other`),
  Nationality: nationalityUrls(`${baseUrl}/other`),
  grantType: grantTypeUrls(`${baseUrl}/grant`),
  grantCategory: grantCategoryUrls(`${baseUrl}/grant`),
  eligibilityApplicationProcess: eligibilityApplicationProcessUrls(
    `${baseUrl}/grant`
  ),
  natureOfEmployment: employmentNatureUrls(`${baseUrl}/employee/settings`),
  organizationUnit: organizationUnitUrls(`${baseUrl}/employee/settings`),
  actionOption: actionOptionUrls(`${baseUrl}/employee/settings`),
  subjectSpecialization: subjectSpecializationUrls(
    `${baseUrl}/employee/settings`
  ),
  actionOptionReason: actionOptionReasonUrls(`${baseUrl}/employee/settings`),
  travelPurpose: travelPurposeUrls(`${baseUrl}/employee/settings`),
  employeeGroup: employeeGroupUrls(`${baseUrl}/employee/settings`),
};
