export const schemeUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/schemes`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
