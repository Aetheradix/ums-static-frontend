export const eligibilityApplicationProcessUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/eligibility-application-process`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
