import { ApiService } from 'services';

const OCCUPATION_URL = `master/occupation`;

export function getOccupationTypes() {
  //   return ApiService.getList<Master.Other.OccupationItem>(OCCUPATION_URL);
  ApiService;
  OCCUPATION_URL;
  return Promise.resolve([
    {
      id: 1,
      name: 'Government Service',
      text: 'Government Service',
      isActive: true,
    },
    { id: 2, name: 'Private Service', text: 'Private Service', isActive: true },
    { id: 3, name: 'Business', text: 'Business', isActive: true },
  ] as unknown as Master.Other.OccupationItem[]);
}
