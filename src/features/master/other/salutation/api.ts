import { ApiService } from 'services';

const SALUTATION_URL = `master/salutation`;

export function getSalutations() {
  return ApiService.getList<Master.Other.SalutationsItem>(SALUTATION_URL);
}
