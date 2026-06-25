import { ApiService } from 'services';

export const FACULTY_API_ROOT = 'cms/faculty';

export const FacultyApi = {
  getAll: () => ApiService.getList<Cms.FacultyItem>(FACULTY_API_ROOT),

  getById: (id: number) =>
    ApiService.get<Cms.FacultyForm>(`${FACULTY_API_ROOT}/${id}`),

  create: (data: Cms.FacultyForm) => ApiService.post(FACULTY_API_ROOT, data),

  update: (id: number, data: Cms.FacultyForm) =>
    ApiService.put(`${FACULTY_API_ROOT}/${id}`, data),

  delete: (id: number) => ApiService.del(`${FACULTY_API_ROOT}/${id}`),
};
