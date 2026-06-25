export function actionOptionUrls(baseUrl: string) {
  const url = `${baseUrl}/action-option`;

  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
