export const classUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/class`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
