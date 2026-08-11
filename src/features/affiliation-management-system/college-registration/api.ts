export async function getCollegeRegistrations() {
  return [
    {
      id: 1,
      registrationId: 1,
      collegeName: 'Holkar Science College',
      isActive: true,
    },
    {
      id: 2,
      registrationId: 2,
      collegeName: 'Christian Eminent College',
      isActive: true,
    },
  ] as unknown as AffiliationManagementSystem.CollegeRegistrationListItem[];
}

export async function getCollegesByCollegeType(collegeTypeId: number) {
  return [
    {
      registrationId: 1,
      collegeName: 'Holkar Science College',
      collegeTypeId: collegeTypeId,
      isActive: true,
    },
    {
      registrationId: 2,
      collegeName: 'Christian Eminent College',
      collegeTypeId: collegeTypeId,
      isActive: true,
    },
  ];
}

export function buildApiPayload(
  form: AffiliationManagementSystem.CollegeApplicationFormData,
  documentIds: { documentId: string; documentType: string }[]
) {
  return {
    collegeName: form.collegeName,
    collegeAddress: form.collegeAddress,
    stateId: form.stateId,
    districtId: form.districtId,
    collegeEmail: form.collegeEmail,
    collegeTypeId: form.collegeTypeId,
    blockTehsil: form.blockTehsil,
    pinCode: form.pinCode,
    captcha: form.captcha,
    declaration: form.declaration,
    applicationNumber: form.applicationNumber,
    isSubmitted: form.isSubmitted ?? false,

    affiliation: {
      principalDirectorName: form.principalDirectorName,
      principalMobileNo: form.principalMobileNo,
      principalEmail: form.principalEmail,
    },

    documents: documentIds,
  };
}

export async function createCollegeRegistration(
  _form: AffiliationManagementSystem.CollegeApplicationFormData,
  _documentIds: { documentId: string; documentType: string }[]
) {
  return { value: Math.floor(Math.random() * 1000) };
}

export async function updateCollegeRegistration(
  id: number,
  _form: AffiliationManagementSystem.CollegeApplicationFormData,
  _documentIds: { documentId: string; documentType: string }[]
) {
  return { value: id };
}

export async function uploadCollegeDocuments(
  nocFile: File | null,
  affidavitFile: File | null,
  regularAuthorityFile: File | null
) {
  const docs: any[] = [];
  if (nocFile) docs.push({ documentId: 'mock-noc', documentType: 'NocFile' });
  if (affidavitFile)
    docs.push({ documentId: 'mock-affidavit', documentType: 'AffidavitFile' });
  if (regularAuthorityFile)
    docs.push({
      documentId: 'mock-regular',
      documentType: 'RegularAuthorityFile',
    });
  return docs;
}
