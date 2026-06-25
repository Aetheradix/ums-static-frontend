import { ApiService } from 'services';

const BLOOD_GROUP_URL = `master/blood-group`;

export function getBloodGroups() {
  return ApiService.getList<Master.Other.BloodGroupItem>(BLOOD_GROUP_URL);
}
