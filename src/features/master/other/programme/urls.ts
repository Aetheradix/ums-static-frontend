export function programmeUrls(baseUrl: string) {
  const url = `${baseUrl}/programme`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
