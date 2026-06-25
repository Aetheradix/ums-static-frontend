export function subjectCategoryUrls(baseUrl: string) {
  const url = `${baseUrl}/subject/subject-category`;
  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
