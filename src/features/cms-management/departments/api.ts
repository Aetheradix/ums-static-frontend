import { ApiService } from 'services';

export const DEPARTMENT_API_ROOT = 'cms/departments';

export const DepartmentApi = {
  getAll: () => ApiService.getList<Cms.DepartmentItem>(DEPARTMENT_API_ROOT),

  getById: (id: number) =>
    ApiService.get<Cms.DepartmentForm>(`${DEPARTMENT_API_ROOT}/${id}`),

  create: (data: Cms.DepartmentForm) =>
    ApiService.post(DEPARTMENT_API_ROOT, data),

  update: (id: number, data: Cms.DepartmentForm) =>
    ApiService.put(`${DEPARTMENT_API_ROOT}/${id}`, data),

  delete: (id: number) => ApiService.del(`${DEPARTMENT_API_ROOT}/${id}`),
};
