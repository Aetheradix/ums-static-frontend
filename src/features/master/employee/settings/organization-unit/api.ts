import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const ORGANIZATION_UNIT_URL = `${MASTER_API_ROOT}organization-unit`;

export function getOrganizationUnits() {
  return ApiService.getList<Master.Employee.OrganizationUnitItem>(
    ORGANIZATION_UNIT_URL
  );
}

export async function getOrganizationUnit(id: number) {
  const { data } = await ApiService.get<Master.Employee.OrganizationUnitForm>(
    `${ORGANIZATION_UNIT_URL}/${id}`
  );

  return data;
}

export async function createOrganizationUnit(
  form: Master.Employee.OrganizationUnitForm
) {
  const { error, data } =
    await ApiService.post<Master.Employee.OrganizationUnitForm>(
      ORGANIZATION_UNIT_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateOrganizationUnit(
  id: number,
  form: Master.Employee.OrganizationUnitForm
): Promise<boolean> {
  const result = await ApiService.put(`${ORGANIZATION_UNIT_URL}/${id}`, form);

  return !result.error;
}

export async function patchOrganizationUnitStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${ORGANIZATION_UNIT_URL}/${id}`, {
    isActive,
  });

  return !result.error;
}
