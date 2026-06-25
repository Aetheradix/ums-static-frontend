export const grantTypeUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/grant-type`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
