import { ApiService } from 'services';

const TRAVEL_REASON_URL = `master/travel-reason`;

export function getTravelReasons() {
  return ApiService.getList<Master.Other.TravelReasonItem>(TRAVEL_REASON_URL);
}
