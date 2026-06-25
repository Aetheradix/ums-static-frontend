import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRolePermission,
  getFeatures,
  getRights,
  getRolePermissionByPolicy,
  getRolePermissions,
  updateRolePermission,
} from './api';

const queryKey = ['@user-management/role-permissions'];
const featuresKey = ['@user-management/features'];
const rightsKey = ['@user-management/rights'];

export function useFeaturesQuery() {
  return useQuery({
    queryKey: featuresKey,
    queryFn: getFeatures,
  });
}

export function useRightsQuery() {
  return useQuery({
    queryKey: rightsKey,
    queryFn: getRights,
  });
}

export function useRolePermissionsQuery() {
  return useQuery({
    queryKey: queryKey,
    queryFn: getRolePermissions,
  });
}

export function useRolePermissionByPolicyQuery(
  roleName: string,
  domain: string,
  feature: string,
  action: string
) {
  return useQuery({
    queryKey: [...queryKey, roleName, domain, feature, action],
    queryFn: () => getRolePermissionByPolicy(roleName, domain, feature, action),
    enabled: !!roleName && !!domain && !!feature && !!action,
  });
}

export function useCreateRolePermissionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserManagement.RolePermissionCreate) =>
      await createRolePermission(data),
    onSuccess(data) {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}

export function useUpdateRolePermissionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserManagement.RolePermissionUpdate) =>
      await updateRolePermission(data),
    onSuccess(result) {
      if (!result) return;
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
}
