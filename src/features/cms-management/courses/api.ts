import { ApiService } from 'services';

export const COURSE_API_ROOT = 'cms/courses';

export const CourseApi = {
  getAll: () => ApiService.getList<Cms.CourseItem>(COURSE_API_ROOT),

  getById: (id: number) =>
    ApiService.get<Cms.CourseForm>(`${COURSE_API_ROOT}/${id}`),

  create: (data: Cms.CourseForm) => ApiService.post(COURSE_API_ROOT, data),

  update: (id: number, data: Cms.CourseForm) =>
    ApiService.put(`${COURSE_API_ROOT}/${id}`, data),

  delete: (id: number) => ApiService.del(`${COURSE_API_ROOT}/${id}`),
};
