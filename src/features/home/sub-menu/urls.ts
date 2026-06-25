export function subMenuUrls(baseUrl: string) {
  const url = `${baseUrl}/sub-menu`;
  return {
    root: (moduleId: string) => `${url}/${moduleId}`,
  };
}
