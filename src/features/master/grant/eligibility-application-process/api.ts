import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const ELIGIBILITY_APPLICATION_PROCESS_URL = `${MASTER_API_ROOT}eligibility-application-processes`;

export function getEligibilityApplicationProcesses() {
  return ApiService.getList<Master.Grant.EligibilityApplicationProcessItem>(
    ELIGIBILITY_APPLICATION_PROCESS_URL
  );
}

export async function getEligibilityApplicationProcess(id: number) {
  const { data } =
    await ApiService.get<Master.Grant.EligibilityApplicationProcessItem>(
      `${ELIGIBILITY_APPLICATION_PROCESS_URL}/${id}`
    );
  return data;
}

export async function createEligibilityApplicationProcess(
  form: Master.Grant.EligibilityApplicationProcessForm
) {
  const { error, data } =
    await ApiService.post<Master.Grant.EligibilityApplicationProcessItem>(
      ELIGIBILITY_APPLICATION_PROCESS_URL,
      form
    );

  return !error ? data : undefined;
}

export async function updateEligibilityApplicationProcess(
  id: number,
  form: Master.Grant.EligibilityApplicationProcessForm
): Promise<boolean> {
  const result = await ApiService.put(
    `${ELIGIBILITY_APPLICATION_PROCESS_URL}/${id}`,
    form
  );
  return !result.error;
}

export async function deleteEligibilityApplicationProcess(
  id: number
): Promise<boolean> {
  const result = await ApiService.del(
    `${ELIGIBILITY_APPLICATION_PROCESS_URL}/${id}`
  );
  return !result.error;
}

export async function patchEligibilityApplicationProcessStatus(
  id: number
): Promise<boolean> {
  const result = await ApiService.patch(
    `${ELIGIBILITY_APPLICATION_PROCESS_URL}/${id}/status`,
    {}
  );
  return !result.error;
}
