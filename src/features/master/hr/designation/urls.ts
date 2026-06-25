export const designationUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/designation`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
