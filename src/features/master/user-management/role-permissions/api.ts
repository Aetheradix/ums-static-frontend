import ApiService from 'services/api';

const ROLE_PERMISSIONS_URL = `user-management/role-permissions`;
const FEATURES_URL = `user-management/features`;
const RIGHTS_URL = `user-management/rights`;

export async function getFeatures(): Promise<UserManagement.FeatureItem[]> {
  const response =
    await ApiService.get<UserManagement.FeatureItem[]>(FEATURES_URL);
  return response.data ?? [];
}

export async function getRights(): Promise<UserManagement.RightItem[]> {
  const response = await ApiService.get<UserManagement.RightItem[]>(RIGHTS_URL);
  return response.data ?? [];
}

export async function getRolePermissionByPolicy(
  roleName: string,
  domain: string,
  feature: string,
  action: string
): Promise<UserManagement.RolePermissionList> {
  const url = `${ROLE_PERMISSIONS_URL}/${encodeURIComponent(roleName)}/${encodeURIComponent(domain)}/${encodeURIComponent(feature)}/${encodeURIComponent(action)}`;
  const response = await ApiService.get<UserManagement.RolePermissionList>(url);
  return response.data!;
}

export async function getRolePermissions(): Promise<
  UserManagement.RolePermissionList[]
> {
  const response =
    await ApiService.get<UserManagement.RolePermissionList[]>(
      ROLE_PERMISSIONS_URL
    );
  return response.data ?? [];
}

export async function createRolePermission(
  data: UserManagement.RolePermissionCreate
) {
  const { error, data: result } =
    await ApiService.post<UserManagement.RolePermissionCreate>(
      ROLE_PERMISSIONS_URL,
      data
    );
  return !error ? result : undefined;
}

export async function updateRolePermission(
  data: UserManagement.RolePermissionUpdate
): Promise<boolean> {
  const { error } = await ApiService.put(ROLE_PERMISSIONS_URL, data);
  return !error;
}
