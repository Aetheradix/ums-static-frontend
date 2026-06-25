import { ApiService } from 'services';

const URL = `master/deficiency-status`;

export function getDeficiencyStatuses() {
  return ApiService.getList<Master.Other.DeficiencyStatusItem>(URL);
}
