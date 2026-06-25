import { ApiService } from 'services';

const GROUP_URL = `master/group-type`;

export function getGroup() {
  return ApiService.getList<Master.Other.GroupGrade>(GROUP_URL);
}
