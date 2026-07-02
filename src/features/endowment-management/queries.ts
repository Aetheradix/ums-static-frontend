import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

export const QK = {
  ENDOWMENT_TYPES: ['@enm/endowment-types'],
  FUND_CATEGORIES: ['@enm/fund-categories'],
  AWARD_TYPES: ['@enm/award-types'],
  ELIGIBILITY_PARAMS: ['@enm/eligibility-params'],
  DONORS: ['@enm/donors'],
  DONATIONS: ['@enm/donations'],
  FUNDS: ['@enm/funds'],
  SCHEMES: ['@enm/schemes'],
  APPLICATIONS: ['@enm/applications'],
  DISBURSEMENTS: ['@enm/disbursements'],
};

// --- Masters ---
export const useEndowmentTypes = () =>
  useQuery({ queryKey: QK.ENDOWMENT_TYPES, queryFn: api.getEndowmentTypes });
export const useFundCategories = () =>
  useQuery({ queryKey: QK.FUND_CATEGORIES, queryFn: api.getFundCategories });
export const useAwardTypes = () =>
  useQuery({ queryKey: QK.AWARD_TYPES, queryFn: api.getAwardTypes });
export const useEligibilityParams = () =>
  useQuery({
    queryKey: QK.ELIGIBILITY_PARAMS,
    queryFn: api.getEligibilityParams,
  });

// --- Donors & Donations ---
export const useDonors = () =>
  useQuery({ queryKey: QK.DONORS, queryFn: api.getDonors });
export const useCreateDonor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createDonor,
    onSuccess: newData => {
      qc.setQueryData(QK.DONORS, (old: any) => [newData, ...(old || [])]);
    },
  });
};

export const useDonations = () =>
  useQuery({ queryKey: QK.DONATIONS, queryFn: api.getDonations });
export const useCreateDonation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createDonation,
    onSuccess: newData => {
      qc.setQueryData(QK.DONATIONS, (old: any) => [newData, ...(old || [])]);
    },
  });
};

// --- Funds ---
export const useFunds = () =>
  useQuery({ queryKey: QK.FUNDS, queryFn: api.getFunds });
export const useCreateFund = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createFund,
    onSuccess: newData => {
      qc.setQueryData(QK.FUNDS, (old: any) => [newData, ...(old || [])]);
    },
  });
};

// --- Schemes ---
export const useSchemes = () =>
  useQuery({ queryKey: QK.SCHEMES, queryFn: api.getSchemes });
export const useCreateScheme = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createScheme,
    onSuccess: newData => {
      qc.setQueryData(QK.SCHEMES, (old: any) => [newData, ...(old || [])]);
    },
  });
};

// --- Applications & Beneficiaries ---
export const useApplications = () =>
  useQuery({ queryKey: QK.APPLICATIONS, queryFn: api.getApplications });
export const useCreateApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createApplication,
    onSuccess: newData => {
      qc.setQueryData(QK.APPLICATIONS, (old: any) => [newData, ...(old || [])]);
    },
  });
};
export const useUpdateApplicationStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateApplicationStatus,
    onSuccess: updatedData => {
      qc.setQueryData(QK.APPLICATIONS, (old: any) =>
        old?.map((item: any) =>
          item.id === updatedData.id
            ? { ...item, status: updatedData.status }
            : item
        )
      );
    },
  });
};

// --- Disbursements ---
export const useDisbursements = () =>
  useQuery({ queryKey: QK.DISBURSEMENTS, queryFn: api.getDisbursements });
export const useCreateDisbursement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createDisbursement,
    onSuccess: newData => {
      qc.setQueryData(QK.DISBURSEMENTS, (old: any) => [
        newData,
        ...(old || []),
      ]);
    },
  });
};
export const useUpdateDisbursementStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateDisbursementStatus,
    onSuccess: updatedData => {
      qc.setQueryData(QK.DISBURSEMENTS, (old: any) =>
        old?.map((item: any) =>
          item.id === updatedData.id
            ? { ...item, status: updatedData.status }
            : item
        )
      );
    },
  });
};
