export function employmentNatureUrls(baseUrl: string) {
  const url = `${baseUrl}/employment-nature`;

  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
