const baseUrl = '/master/user-management';

export const userManagementUrls = {
  user: {
    root: `${baseUrl}/users`,
    edit: (id: string) => `${baseUrl}/users/edit/${id}`,
    create: `${baseUrl}/users/create`,
  },
  role: {
    root: `${baseUrl}/roles`,
    edit: (id: string) => `${baseUrl}/roles/edit/${id}`,
    create: `${baseUrl}/roles/create`,
  },
  rolePermissions: {
    root: `${baseUrl}/role-permissions`,
    edit: (roleName: string, domain: string, feature: string, action: string) =>
      `${baseUrl}/role-permissions/edit/${encodeURIComponent(roleName)}/${encodeURIComponent(domain)}/${encodeURIComponent(feature)}/${encodeURIComponent(action)}`,
    create: `${baseUrl}/role-permissions/create`,
  },
  userAssignment: {
    root: `${baseUrl}/user-assignments`,
    edit: (userId: string) => `${baseUrl}/user-assignments/edit/${userId}`,
    create: `${baseUrl}/user-assignments/create`,
  },
};
