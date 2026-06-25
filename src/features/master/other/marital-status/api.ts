import { ApiService } from 'services';

const MARITAL_STATUS_URL = `master/marital-status`;

export function getMaritalStatuses() {
  return ApiService.getList<Master.Other.MaritalStatusItem>(MARITAL_STATUS_URL);
}
