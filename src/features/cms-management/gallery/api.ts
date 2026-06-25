import { ApiService } from 'services';

export const GALLERY_API_ROOT = 'cms/gallery';

export const GalleryApi = {
  getAll: () => ApiService.getList<Cms.GalleryItem>(GALLERY_API_ROOT),

  create: (data: Cms.GalleryForm) => ApiService.post(GALLERY_API_ROOT, data),

  delete: (id: number) => ApiService.del(`${GALLERY_API_ROOT}/${id}`),
};
