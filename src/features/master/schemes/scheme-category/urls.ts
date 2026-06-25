export const schemeCategoryUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/scheme-category`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
