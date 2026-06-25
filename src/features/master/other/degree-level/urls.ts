export function degreeLevelUrls(baseUrl: string) {
  const url = `${baseUrl}/degree-level`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
