import { ApiService } from 'services';

const PHD_STATUS_URL = `master/phd-status`;

export function getPhDStatus() {
  return ApiService.getList<Master.Other.PhDStatusItem>(PHD_STATUS_URL);
}
