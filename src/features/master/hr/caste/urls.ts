export function casteUrls(baseUrl: string) {
  const url = `${baseUrl}/caste`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
