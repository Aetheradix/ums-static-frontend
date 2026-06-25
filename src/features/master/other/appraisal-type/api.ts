import { ApiService } from 'services';

const APPRAISAL_TYPE_URL = `master/appraisal-type`;

export function getAppraisalType() {
  return ApiService.getList<Master.Other.AppraisalTypeItem>(APPRAISAL_TYPE_URL);
}
