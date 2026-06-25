import { ApiService } from 'services';

const APPRAISAL_APPLICATION_FORWARD_TYPE_URL = `master/appraisal-application-forwarded-to-type`;

export function getAppraisalApplicationForwardedToType() {
  return ApiService.getList<Master.Other.AppraisalApplicationForwardedToTypeItem>(
    APPRAISAL_APPLICATION_FORWARD_TYPE_URL
  );
}
