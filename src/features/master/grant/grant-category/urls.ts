export const grantCategoryUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/grant-category`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
