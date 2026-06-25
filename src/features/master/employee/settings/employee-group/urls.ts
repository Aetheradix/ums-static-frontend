export function employeeGroupUrls(baseUrl: string) {
  const url = `${baseUrl}/employee-group`;

  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
