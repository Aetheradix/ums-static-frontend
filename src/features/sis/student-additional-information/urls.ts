export const studentAdditionalInformationUrls = (baseUrl: string) => {
  const prefix = `${baseUrl}/student-additional-information`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
