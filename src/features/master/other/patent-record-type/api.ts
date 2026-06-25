import { ApiService } from 'services';

const PATENT_RECORD_TYPE_URL = `master/patent-record-type`;

export function getPatentRecordTypes() {
  return ApiService.getList<Master.Other.PatentRecordTypeItem>(
    PATENT_RECORD_TYPE_URL
  );
}
