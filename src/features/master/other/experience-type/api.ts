import { ApiService } from 'services';

const EXPERIENCE_TYPE_URL = `master/experience-type`;

export function getExperienceTypes() {
  return ApiService.getList<Master.Other.ExperienceTypeItem>(
    EXPERIENCE_TYPE_URL
  );
}
