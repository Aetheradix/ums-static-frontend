import { ApiService } from 'services';

export const NEWS_API_ROOT = 'cms/news';

export const NewsApi = {
  getAll: () => ApiService.getList<Cms.NewsEventItem>(NEWS_API_ROOT),

  create: (data: Cms.NewsEventForm) => ApiService.post(NEWS_API_ROOT, data),

  update: (id: number, data: Cms.NewsEventForm) =>
    ApiService.put(`${NEWS_API_ROOT}/${id}`, data),

  delete: (id: number) => ApiService.del(`${NEWS_API_ROOT}/${id}`),
};
