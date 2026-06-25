export const postUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/post`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
