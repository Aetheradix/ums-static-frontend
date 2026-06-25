export const SESSIONS_MANAGEMENT_BASE_URL = 'career/sessions';

export const sessionsManagementUrls = (base: string) => {
  const prefix = `${base}/sessions-management`;
  return {
    root: prefix,
    create: `${prefix}/create`,
    edit: (id: string | number) => `${prefix}/edit/${id}`,
  };
};
