import { aparApplicationUrls } from './apar-application/urls';
import { employeeSelfAssessmentUrls } from './employee-self-assessment/urls';
import { sessionsManagementUrls } from './sessions-management/urls';

const baseUrl = '/career-advancement';

export const careerAdvancementUrls = {
  root: baseUrl,
  sessionsManagement: sessionsManagementUrls(baseUrl),
  aparApplication: aparApplicationUrls(baseUrl),
  employeeSelfAssessment: employeeSelfAssessmentUrls(baseUrl),
};
