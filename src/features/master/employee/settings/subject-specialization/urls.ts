export function subjectSpecializationUrls(baseUrl: string) {
  const url = `${baseUrl}/subject-specialization`;

  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
