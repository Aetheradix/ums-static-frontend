export function tehsilUrls(baseUrl: string) {
  const url = `${baseUrl}/tehsils`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
