export async function getCollegeRegistrations() {
  return [] as AffiliationManagementSystem.CollegeRegistrationListItem[];
}

export async function getCollegesByCollegeType(_collegeTypeId: number) {
  return [] as {
    registrationId: number;
    collegeName: string;
    collegeTypeId: number;
  }[];
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
  const docs = [];
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
