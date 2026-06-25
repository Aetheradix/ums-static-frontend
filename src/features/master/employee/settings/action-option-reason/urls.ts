export function actionOptionReasonUrls(baseUrl: string) {
  const url = `${baseUrl}/action-option-reason`;

  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
