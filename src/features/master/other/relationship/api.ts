import { ApiService } from 'services';

const RELATIONSHIP_URL = `master/relationship`;

export function getRelationship() {
  return ApiService.getList<Master.Other.RelationshipItem>(RELATIONSHIP_URL);
}
