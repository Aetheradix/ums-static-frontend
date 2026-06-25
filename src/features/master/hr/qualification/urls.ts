export function qualificationUrls(baseUrl: string) {
  const url = `${baseUrl}/qualification`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
