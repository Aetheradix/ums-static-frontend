export const establishmentYearUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/establishment-year`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
