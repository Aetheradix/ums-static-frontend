export const collegeTypeUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/college-type`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
