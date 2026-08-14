// Shared course options and fee master used by the Course Registration step
// and the Course Fees & Payment step.

export const courseOptions = [
  { id: 'btech', name: 'B.Tech' },
  { id: 'mtech', name: 'M.Tech' },
  { id: 'bsc', name: 'B.Sc' },
  { id: 'msc', name: 'M.Sc' },
  { id: 'bba', name: 'BBA' },
  { id: 'mba', name: 'MBA' },
  { id: 'bca', name: 'BCA' },
  { id: 'mca', name: 'MCA' },
  { id: 'bcom', name: 'B.Com' },
  { id: 'mcom', name: 'M.Com' },
  { id: 'ba', name: 'B.A' },
  { id: 'ma', name: 'M.A' },
  { id: 'diploma', name: 'Diploma' },
  { id: 'other', name: 'Other' },
];

export const FEE_MASTER: Record<string, number> = {
  btech: 50000,
  mtech: 60000,
  bsc: 25000,
  msc: 30000,
  bba: 20000,
  mba: 40000,
  bca: 25000,
  mca: 35000,
  bcom: 20000,
  mcom: 25000,
  ba: 15000,
  ma: 20000,
  diploma: 30000,
  other: 10000,
};
