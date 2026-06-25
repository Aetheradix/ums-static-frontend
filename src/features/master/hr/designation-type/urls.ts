export const designationTypeUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/designation-type`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
