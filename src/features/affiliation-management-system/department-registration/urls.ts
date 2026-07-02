export const departmentRegistrationUrls = (baseUrl: string) => ({
  base: `${baseUrl}/department-registration`,
  list: `${baseUrl}/department-registration/list`,
  create: `${baseUrl}/department-registration/create`,
  update: (id: string | number) =>
    `${baseUrl}/department-registration/update/${id}`,
});
