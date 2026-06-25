import { ApiService } from 'services';

const SEMESTER_URL = `master/semester`;

export function getSemester() {
  return ApiService.getList<Master.Other.SemesterItem>(SEMESTER_URL);
}
