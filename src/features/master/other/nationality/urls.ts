export function nationalityUrls(baseUrl: string) {
  const url = `${baseUrl}/nationality`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
