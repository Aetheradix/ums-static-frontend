export const AffiliationFeeMasterUrls = {
  root: () => '/affiliation-management-system/affiliation-fee-master',
  list: () => '/affiliation-management-system/affiliation-fee-master/list',
  createCourse: () =>
    '/affiliation-management-system/affiliation-fee-master/create-course',
  createSpecial: () =>
    '/affiliation-management-system/affiliation-fee-master/create-special',
  edit: (id: string | number) =>
    `/affiliation-management-system/affiliation-fee-master/edit/${id}`,
};
