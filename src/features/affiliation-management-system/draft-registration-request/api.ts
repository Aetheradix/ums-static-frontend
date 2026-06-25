import { ApiService } from 'services';

const DRAFT_REGISTRATION_URL = `college-affiliation/draft-registration/`;

export async function getDraftRegistration(
  applicationNumber: string,
  establishmentYear: number
) {
  const url = `${DRAFT_REGISTRATION_URL}${applicationNumber}/${establishmentYear}`;

  const { error, data } =
    await ApiService.get<AffiliationManagementSystem.DraftRegistrationRequest>(
      url
    );

  return !error ? data : undefined;
}
