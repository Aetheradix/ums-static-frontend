import { ApiService } from 'services';

const APPRAISAL_APPLICATION_STATUS_URL = `master/appraisal-application-status`;

export function getAppraisalApplicationStatus() {
  return ApiService.getList<Master.Other.AppraisalApplicationStatusItem>(
    APPRAISAL_APPLICATION_STATUS_URL
  );
}
