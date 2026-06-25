import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const SEPARATION_REASON_TYPE_URL = `${MASTER_API_ROOT}separation-reason-type`;

export function getSeparationReasonTypes() {
  return ApiService.getList<Master.Employee.SeparationReasonTypeItem>(
    SEPARATION_REASON_TYPE_URL
  );
}

export async function getSeparationReasonType(id: number) {
  const { data } =
    await ApiService.get<Master.Employee.SeparationReasonTypeForm>(
      `${SEPARATION_REASON_TYPE_URL}/${id}`
    );

  return data;
}

export async function createSeparationReasonType(
  form: Master.Employee.SeparationReasonTypeForm
) {
  const { error, data } =
    await ApiService.post<Master.Employee.SeparationReasonTypeForm>(
      SEPARATION_REASON_TYPE_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateSeparationReasonType(
  id: number,
  form: Master.Employee.SeparationReasonTypeForm
): Promise<boolean> {
  const result = await ApiService.put(
    `${SEPARATION_REASON_TYPE_URL}/${id}`,
    form
  );

  return !result.error;
}

export async function patchSeparationReasonTypeStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${SEPARATION_REASON_TYPE_URL}/${id}`, {
    isActive,
  });

  return !result.error;
}
