export function departmentUrls(baseUrl: string) {
  const url = `${baseUrl}/department`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
