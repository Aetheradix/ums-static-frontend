import { ApiService } from 'services';

export const NOTICES_API_ROOT = 'cms/notices';

export const NoticesApi = {
  getAll: () => ApiService.getList<Cms.NoticeItem>(NOTICES_API_ROOT),

  create: (data: Cms.NoticeForm) => ApiService.post(NOTICES_API_ROOT, data),

  update: (id: number, data: Cms.NoticeForm) =>
    ApiService.put(`${NOTICES_API_ROOT}/${id}`, data),

  delete: (id: number) => ApiService.del(`${NOTICES_API_ROOT}/${id}`),
};
