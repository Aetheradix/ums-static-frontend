import { ApiService } from 'services';

const PUBLICATION_TYPE_URL = `master/publication-type`;

export function getPublicationTypes() {
  return ApiService.getList<Master.Other.PublicationTypeItem>(
    PUBLICATION_TYPE_URL
  );
}
