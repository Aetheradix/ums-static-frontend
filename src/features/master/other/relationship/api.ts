import { ApiService } from 'services';

const RELATIONSHIP_URL = `master/relationship`;

export function getRelationship() {
  //   return ApiService.getList<Master.Other.RelationshipItem>(RELATIONSHIP_URL);
  ApiService;
  RELATIONSHIP_URL;
  return Promise.resolve([
    { id: 1, name: 'Father', text: 'Father', isActive: true },
    { id: 2, name: 'Mother', text: 'Mother', isActive: true },
    { id: 3, name: 'Guardian', text: 'Guardian', isActive: true },
  ] as unknown as Master.Other.RelationshipItem[]);
}
