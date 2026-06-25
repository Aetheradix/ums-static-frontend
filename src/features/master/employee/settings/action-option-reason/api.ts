import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const ACTION_OPTION_REASON_URL = `${MASTER_API_ROOT}action-option-reason`;

export function getActionOptionReasons() {
  return ApiService.getList<Master.Employee.ActionOptionReasonItem>(
    ACTION_OPTION_REASON_URL
  );
}

export async function getActionOptionReason(id: number) {
  const { data } = await ApiService.get<Master.Employee.ActionOptionReasonItem>(
    `${ACTION_OPTION_REASON_URL}/${id}`
  );
  return data;
}

export async function createActionOptionReason(
  form: Master.Employee.ActionOptionReasonForm
) {
  const { error, data } =
    await ApiService.post<Master.Employee.ActionOptionReasonItem>(
      ACTION_OPTION_REASON_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateActionOptionReason(
  id: number,
  form: Master.Employee.ActionOptionReasonForm
): Promise<boolean> {
  const result = await ApiService.put(
    `${ACTION_OPTION_REASON_URL}/${id}`,
    form
  );
  return !result.error;
}

export async function patchActionOptionReasonStatus(
  id: number,
  _isActive: boolean
): Promise<boolean> {
  const result = await ApiService.patch(
    `${ACTION_OPTION_REASON_URL}/${id}/status`,
    {}
  );

  return !result.error;
}
