import { ApiService } from 'services';

const SERVICE_CADRE_URL = `master/service-cadre`;

export function getServiceCadres() {
  return ApiService.getList<Master.Other.ServiceCadreItem>(SERVICE_CADRE_URL);
}
