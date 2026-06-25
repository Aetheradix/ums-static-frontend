import { ApiService } from 'services';

const PATENT_STATUS_URL = `master/patent-status`;

export function getPatentStatus() {
  return ApiService.getList<Master.Other.PatentStatusItem>(PATENT_STATUS_URL);
}
