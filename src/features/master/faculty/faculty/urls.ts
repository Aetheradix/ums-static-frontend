export function facultyUrls(baseUrl: string) {
  const url = `${baseUrl}/faculty`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
