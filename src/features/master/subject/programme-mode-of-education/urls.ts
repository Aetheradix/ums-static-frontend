export function ProgrammeModeOfEducationUrls(baseUrl: string) {
  const url = `${baseUrl}/subject/programme-mode-of-education`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
