import { ApiService } from 'services';

export const DOWNLOADS_API_ROOT = 'cms/downloads';

export const DownloadsApi = {
  getAll: () => ApiService.getList<Cms.DownloadItem>(DOWNLOADS_API_ROOT),

  create: (data: Cms.DownloadForm) => ApiService.post(DOWNLOADS_API_ROOT, data),

  update: (id: number, data: Cms.DownloadForm) =>
    ApiService.put(`${DOWNLOADS_API_ROOT}/${id}`, data),

  delete: (id: number) => ApiService.del(`${DOWNLOADS_API_ROOT}/${id}`),
};
