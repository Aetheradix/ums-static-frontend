import { ApiService } from 'services';

const GENDER_URL = `master/gender`;

export function getGenders() {
  //   return ApiService.getList<Master.Other.GenderItem>(GENDER_URL);
  ApiService;
  GENDER_URL;
  return Promise.resolve([
    { id: 1, name: 'Male', text: 'Male', isActive: true },
    { id: 2, name: 'Female', text: 'Female', isActive: true },
    { id: 3, name: 'Other', text: 'Other', isActive: true },
  ] as unknown as Master.Other.GenderItem[]);
}
