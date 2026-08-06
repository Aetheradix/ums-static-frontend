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
    establishmentYear: form.establishmentYear,
    collegeCode: form.collegeCode,
    collegeName: form.collegeName,
    collegeAddress: form.collegeAddress,
    districtId: form.districtId,
    telephoneNo: form.telephoneNo,
    collegeEmail: form.collegeEmail,
    collegeCategoryId: form.collegeCategoryId,
    collegeTypeId: form.collegeTypeId,
    accommodationType: form.accommodationType,
    collegeArea: form.collegeArea,
    applicationNumber: form.applicationNumber,
    isSubmitted: form.isSubmitted ?? false,

    affiliation: {
      principalDirectorName: form.principalDirectorName,
      principalMobileNo: form.principalMobileNo,
      principalEmail: form.principalEmail,
      societyName: form.societyName,
      secretaryName: form.secretaryName,
      societyRegistrationNo: form.societyRegistrationNo,
      societyRegistrationDate: form.societyRegistrationDate,
      isOtherInstitutionRunning: form.isOtherInstitutionRunning ?? false,
    },

    courses: (form.courses ?? []).map(course => ({
      courseId: course.courseId,
      subjectIds: course.subjectIds,
      totalAmount: course.totalAmount ?? 0,
      isFeePaid: course.isFeePaid ?? false,
      paymentDate: course.paymentDate || null,
    })),

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
