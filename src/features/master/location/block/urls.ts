export function blockUrls(baseUrl: string) {
  const url = `${baseUrl}/blocks`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
