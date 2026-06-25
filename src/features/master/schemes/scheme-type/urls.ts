export const schemeTypeUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/scheme-type`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
