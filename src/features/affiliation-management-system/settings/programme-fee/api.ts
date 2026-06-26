export function getProgrammeFees() {
  return [
    {
      programmeFeeId: 1,
      programmeId: 1, // B.Tech
      affiliationFee: 50000,
      inspectionFee: 25000,
      securityDepositAmount: 100000,
      isActive: true,
    },
    {
      programmeFeeId: 2,
      programmeId: 2, // MBA
      affiliationFee: 40000,
      inspectionFee: 20000,
      securityDepositAmount: 75000,
      isActive: true,
    },
    {
      programmeFeeId: 3,
      programmeId: 3, // B.Sc
      affiliationFee: 20000,
      inspectionFee: 10000,
      securityDepositAmount: 50000,
      isActive: true,
    },
    {
      programmeFeeId: 4,
      programmeId: 4, // M.Tech
      affiliationFee: 60000,
      inspectionFee: 30000,
      securityDepositAmount: 120000,
      isActive: true,
    },
  ] as unknown as AffiliationManagementSystem.ProgrammeFeeItem[];
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
