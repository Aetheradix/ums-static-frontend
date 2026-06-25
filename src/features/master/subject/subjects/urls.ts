export function subjectUrls(baseUrl: string) {
  const url = `${baseUrl}/subject/subjects`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
