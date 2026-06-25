import { ApiService } from 'services';

const URL = `master/accommodation-type`;

export function getAccommodationTypes() {
  return ApiService.getList<Master.Other.AccommodationTypeItem>(URL);
}
