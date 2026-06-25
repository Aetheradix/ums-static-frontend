export const programmeFeeUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/programme-fee`;

  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
