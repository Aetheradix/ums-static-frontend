import { ApiService } from 'services';

const GENDER_URL = `master/gender`;

export function getGenders() {
  return ApiService.getList<Master.Other.GenderItem>(GENDER_URL);
}
