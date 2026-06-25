export const sectionUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/section`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
