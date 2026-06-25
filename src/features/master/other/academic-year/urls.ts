export function academicYearUrls(baseUrl: string) {
  const url = `${baseUrl}/academic-year`;

  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
