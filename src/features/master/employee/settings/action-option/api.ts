import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const ACTION_OPTION_URL = `${MASTER_API_ROOT}action-option`;

export function getActionOptions() {
  return ApiService.getList<Master.Employee.ActionOptionItem>(
    ACTION_OPTION_URL
  );
}

export async function getActionOption(id: number) {
  const { data } = await ApiService.get<Master.Employee.ActionOptionForm>(
    `${ACTION_OPTION_URL}/${id}`
  );

  return data;
}

export async function createActionOption(
  form: Master.Employee.ActionOptionForm
) {
  const { error, data } =
    await ApiService.post<Master.Employee.ActionOptionForm>(
      ACTION_OPTION_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateActionOption(
  id: number,
  form: Master.Employee.ActionOptionForm
): Promise<boolean> {
  const result = await ApiService.put(`${ACTION_OPTION_URL}/${id}`, form);

  return !result.error;
}

export async function patchActionOptionStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(`${ACTION_OPTION_URL}/${id}`, {
    isActive,
  });

  return !result.error;
}
