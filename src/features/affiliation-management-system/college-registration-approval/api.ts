import { ApiService } from 'services';

const REGISTRATION_APPROVAL_URL = `college-affiliation/registration-approval`;

export async function getCollegeRegistrationApprovals() {
  return ApiService.getList<AffiliationManagementSystem.CollegeRegistrationApprovalItem>(
    REGISTRATION_APPROVAL_URL
  );
}

export async function getCollegeRegistrationById(id: number) {
  return ApiService.get<AffiliationManagementSystem.CollegeRegistrationPreview>(
    `college-affiliation/registration/${id}`
  );
}

export async function updateCollegeRegistrationApprovalStatus(
  id: number,
  status: number,
  rejectionReason?: string
): Promise<boolean> {
  const result = await ApiService.put(
    `${REGISTRATION_APPROVAL_URL}/${id}/status`,
    {
      status,
      rejectionReason,
    }
  );
  return !result.error;
}
