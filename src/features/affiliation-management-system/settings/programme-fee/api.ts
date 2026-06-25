import { ApiService } from 'services';

const MASTER_API_ROOT = `master/`;

const PROGRAMME_FEE_URL = `${MASTER_API_ROOT}programme-fee`;

export function getProgrammeFees() {
  return ApiService.getList<AffiliationMaster.ProgrammeFeeItem>(
    PROGRAMME_FEE_URL
  );
}

export async function getProgrammeFee(programmeFeeId: number) {
  const { data } = await ApiService.get<AffiliationMaster.ProgrammeFeeItem>(
    `${PROGRAMME_FEE_URL}/${programmeFeeId}`
  );
  return data;
}

export async function createProgrammeFee(
  form: AffiliationMaster.ProgrammeFeeForm
) {
  const { error, data } =
    await ApiService.post<AffiliationMaster.ProgrammeFeeItem>(
      PROGRAMME_FEE_URL,

      form
    );

  return !error ? data : undefined;
}

export async function updateProgrammeFee(
  programmeFeeId: number,
  form: AffiliationMaster.ProgrammeFeeForm
): Promise<boolean> {
  const result = await ApiService.put(
    `${PROGRAMME_FEE_URL}/${programmeFeeId}`,
    form
  );
  return !result.error;
}

export async function deleteProgrammeFee(
  programmeFeeId: number
): Promise<boolean> {
  const result = await ApiService.del(`${PROGRAMME_FEE_URL}/${programmeFeeId}`);
  return !result.error;
}

export async function patchProgrammeFeeStatus(
  programmeFeeId: number
): Promise<boolean> {
  const result = await ApiService.patch(
    `${PROGRAMME_FEE_URL}/${programmeFeeId}`,
    {}
  );
  return !result.error;
}
