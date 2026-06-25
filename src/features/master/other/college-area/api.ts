import { ApiService } from 'services';

const URL = `master/college-area`;

export function getCollegeAreas() {
  return ApiService.getList<Master.Other.CollegeAreaItem>(URL);
}
