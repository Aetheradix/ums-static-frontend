export function getProgrammeFees() {
  return [] as AffiliationMaster.ProgrammeFeeItem[];
}

export async function getProgrammeFee(programmeFeeId: number) {
  return {
    programmeFeeId,
    programmeName: 'Mock Programme',
    feeAmount: 1000,
    isActive: true,
  } as unknown as AffiliationMaster.ProgrammeFeeItem;
}

export async function createProgrammeFee(
  form: AffiliationMaster.ProgrammeFeeForm
) {
  return {
    ...form,
    programmeFeeId: Math.floor(Math.random() * 1000),
  } as unknown as AffiliationMaster.ProgrammeFeeItem;
}

export async function updateProgrammeFee(
  _programmeFeeId: number,
  _form: AffiliationMaster.ProgrammeFeeForm
): Promise<boolean> {
  return true;
}

export async function deleteProgrammeFee(
  _programmeFeeId: number
): Promise<boolean> {
  return true;
}

export async function patchProgrammeFeeStatus(
  _programmeFeeId: number
): Promise<boolean> {
  return true;
}
