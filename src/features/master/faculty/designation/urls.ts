export function designationUrls(baseUrl: string) {
  const url = `${baseUrl}/designation`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
