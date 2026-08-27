export const AffiliationFeeMasterUrls = {
  root: () => '/affiliation-management-system/affiliation-fee-master',
  list: () => '/affiliation-management-system/affiliation-fee-master/list',
  create: () => '/affiliation-management-system/affiliation-fee-master/create',
  edit: (id: string | number) =>
    `/affiliation-management-system/affiliation-fee-master/edit/${id}`,
};
