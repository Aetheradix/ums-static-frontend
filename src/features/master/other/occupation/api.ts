import { ApiService } from 'services';

const OCCUPATION_URL = `master/occupation`;

export function getOccupationTypes() {
  return ApiService.getList<Master.Other.OccupationItem>(OCCUPATION_URL);
}
