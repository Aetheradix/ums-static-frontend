import { ApiService } from 'services';

const UGC_LISTED_URL = 'master/ugc-listed';

export function getUgcListed() {
  return ApiService.getList<Master.Other.UgcStatusItem>(UGC_LISTED_URL);
}
