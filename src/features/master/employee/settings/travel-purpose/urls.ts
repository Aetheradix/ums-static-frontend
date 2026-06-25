export function travelPurposeUrls(baseUrl: string) {
  const url = `${baseUrl}/travel-purpose`;

  return {
    root: url,
    edit: (id: number) => `${url}/edit/${id}`,
    create: `${url}/create`,
  };
}
