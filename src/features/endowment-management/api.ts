import {
  MOCK_ENDOWMENT_TYPES,
  MOCK_FUND_CATEGORIES,
  MOCK_AWARD_TYPES,
  MOCK_ELIGIBILITY_PARAMS,
  MOCK_DONORS,
  MOCK_FUNDS,
  MOCK_DONATIONS,
  MOCK_SCHEMES,
  MOCK_APPLICATIONS,
  MOCK_DISBURSEMENTS,
} from './mocks';

// --- Masters ---
export const getEndowmentTypes = async () =>
  Promise.resolve([...MOCK_ENDOWMENT_TYPES]);
export const getFundCategories = async () =>
  Promise.resolve([...MOCK_FUND_CATEGORIES]);
export const getAwardTypes = async () => Promise.resolve([...MOCK_AWARD_TYPES]);
export const getEligibilityParams = async () =>
  Promise.resolve([...MOCK_ELIGIBILITY_PARAMS]);

// --- Donors & Donations ---
export const getDonors = async () => Promise.resolve([...MOCK_DONORS]);
export const createDonor = async (data: any) =>
  Promise.resolve({ id: Date.now(), status: 'Active', ...data });

export const getDonations = async () => Promise.resolve([...MOCK_DONATIONS]);
export const createDonation = async (data: any) =>
  Promise.resolve({
    id: Date.now(),
    eligible80G: data.amount >= 50000,
    ...data,
  });

// --- Funds ---
export const getFunds = async () => Promise.resolve([...MOCK_FUNDS]);
export const createFund = async (data: any) =>
  Promise.resolve({
    id: Date.now(),
    fundCode: `FND-${Date.now()}`,
    status: 'Proposed',
    ...data,
  });

// --- Schemes ---
export const getSchemes = async () => Promise.resolve([...MOCK_SCHEMES]);
export const createScheme = async (data: any) =>
  Promise.resolve({ id: Date.now(), status: 'Draft', ...data });

// --- Applications & Beneficiaries ---
export const getApplications = async () =>
  Promise.resolve([...MOCK_APPLICATIONS]);
export const createApplication = async (data: any) =>
  Promise.resolve({
    id: Date.now(),
    status: 'Applied',
    date: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    ...data,
  });
export const updateApplicationStatus = async ({
  id,
  status,
}: {
  id: number;
  status: string;
}) => Promise.resolve({ id, status });

export const getDisbursements = async () =>
  Promise.resolve([...MOCK_DISBURSEMENTS]);
export const createDisbursement = async (data: any) =>
  Promise.resolve({ id: Date.now(), status: 'Processed', ...data });
export const updateDisbursementStatus = async ({
  id,
  status,
}: {
  id: number;
  status: string;
}) => Promise.resolve({ id, status });
