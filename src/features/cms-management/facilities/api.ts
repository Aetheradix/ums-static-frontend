import { ApiService } from 'services';

export const FACILITIES_API_ROOT = 'cms/facilities';

export const FacilitiesApi = {
  getAll: () => ApiService.getList<Cms.FacilityItem>(FACILITIES_API_ROOT),

  create: (data: Cms.FacilityForm) =>
    ApiService.post(FACILITIES_API_ROOT, data),

  update: (id: number, data: Cms.FacilityForm) =>
    ApiService.put(`${FACILITIES_API_ROOT}/${id}`, data),

  delete: (id: number) => ApiService.del(`${FACILITIES_API_ROOT}/${id}`),
};
