export function divisionUrls(baseUrl: string) {
  const url = `${baseUrl}/divisions`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
