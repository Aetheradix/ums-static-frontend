import { ApiService } from 'services';

const GRADING_SYSTEM_URL = `master/grading-system`;

export function getGradingSystems() {
  return ApiService.getList<Master.Other.GradingSystemItem>(GRADING_SYSTEM_URL);
}
