export function districtUrls(baseUrl: string) {
  const url = `${baseUrl}/districts`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
