import { ApiService } from 'services';

const RESIDENCY_STATUS_URL = `master/residency-status`;

export function getResidencyStatuses() {
  //   return ApiService.getList<Master.Other.ResidencyStatusItem>(
  //     RESIDENCY_STATUS_URL
  //   );
  ApiService;
  RESIDENCY_STATUS_URL;
  return Promise.resolve([
    { id: 1, name: 'Hosteler', text: 'Hosteler', isActive: true },
    { id: 2, name: 'Day Scholar', text: 'Day Scholar', isActive: true },
  ] as unknown as Master.Other.ResidencyStatusItem[]);
}
