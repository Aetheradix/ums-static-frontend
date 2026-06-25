export const availableFacilityUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/available-facility`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
