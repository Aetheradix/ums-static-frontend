export const collegeCategoryUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/college-category`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
