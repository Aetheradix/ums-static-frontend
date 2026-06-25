import { ApiService } from 'services';

const RESIDENCY_STATUS_URL = `master/residency-status`;

export function getResidencyStatuses() {
  return ApiService.getList<Master.Other.ResidencyStatusItem>(
    RESIDENCY_STATUS_URL
  );
}
