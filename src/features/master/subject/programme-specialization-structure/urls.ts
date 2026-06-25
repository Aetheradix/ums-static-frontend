export function programmeSpecializationStructureUrls(baseUrl: string) {
  const url = `${baseUrl}/subject/programme-specialization-structure`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
