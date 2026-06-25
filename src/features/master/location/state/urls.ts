export function stateUrls(baseUrl: string) {
  const url = `${baseUrl}/states`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
