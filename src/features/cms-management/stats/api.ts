import { ApiService } from 'services';

export const STATS_API_ROOT = 'cms/stats';

export const StatsApi = {
  getAll: () => ApiService.getList<Cms.UniversityStatItem>(STATS_API_ROOT),

  update: (id: number, data: Cms.UniversityStatForm) =>
    ApiService.put(`${STATS_API_ROOT}/${id}`, data),
};
