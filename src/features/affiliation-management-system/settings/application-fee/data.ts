export interface ApplicationFeeItem {
  applicationFeeId: number;
  feeType: string;
  amount: number;
  isActive: boolean;
}

// Master list of application fee types charged during college registration.
export const APPLICATION_FEE_DATA: ApplicationFeeItem[] = [
  {
    applicationFeeId: 1,
    feeType: 'Application Fees',
    amount: 1500,
    isActive: true,
  },
  {
    applicationFeeId: 2,
    feeType: 'Late Fee',
    amount: 5000,
    isActive: true,
  },
  {
    applicationFeeId: 3,
    feeType: 'Document Verification Fee',
    amount: 1000,
    isActive: true,
  },
];
