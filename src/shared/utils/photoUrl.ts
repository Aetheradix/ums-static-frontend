import ApiService from 'services/api';

export function getPhotoUrl(
  photoPath: string | null | undefined
): string | undefined {
  if (!photoPath) return undefined;

  if (photoPath.startsWith('data:')) {
    return photoPath;
  }

  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }

  const apiRoot = ApiService.getApiRoot();
  if (!apiRoot) return undefined;

  const baseUrl = apiRoot.replace(/\/+$/, '');

  const fileName = photoPath.split('/').pop();
  if (!fileName) return undefined;

  return `${baseUrl}/student/photo/${fileName}`;
}
