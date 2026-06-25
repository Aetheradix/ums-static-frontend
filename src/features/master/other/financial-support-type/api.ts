import { ApiService } from 'services';

const FINANCIAL_SUPPORT_TYPE_URL = `master/financial-support-type`;

export function getFinancialSupportTypes() {
  return ApiService.getList<Master.Other.FinancialSupportTypeItem>(
    FINANCIAL_SUPPORT_TYPE_URL
  );
}
