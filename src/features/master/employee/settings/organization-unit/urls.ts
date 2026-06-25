export function organizationUnitUrls(baseUrl: string) {
  const url = `${baseUrl}/organization-unit`;

  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
