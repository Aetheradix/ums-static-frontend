export function religionUrls(baseUrl: string) {
  const url = `${baseUrl}/religion`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
