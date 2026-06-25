export function documentOptionUrls(baseUrl: string) {
  const url = `${baseUrl}/document-option`;

  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
