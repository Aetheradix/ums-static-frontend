import { ApiService } from 'services';

const DOCUMENT_TYPE_URL = `master/document-type
`;

export function getDocType() {
  return ApiService.getList<Master.Other.DocumentTypeItem>(DOCUMENT_TYPE_URL);
}
