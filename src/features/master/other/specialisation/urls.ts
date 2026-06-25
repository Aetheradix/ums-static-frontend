export function specialisationUrls(baseUrl: string) {
  const url = `${baseUrl}/specialisation`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
