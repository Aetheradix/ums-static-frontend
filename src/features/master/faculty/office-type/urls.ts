export function officeTypeUrls(baseUrl: string) {
  const url = `${baseUrl}/office-type`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
