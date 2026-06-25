declare namespace UserManagement {
  interface UserRoleBase {
    name: string;
    description: string;
    isActive: boolean;
  }
  type UserRoleForm = UserRoleBase;
  interface UserRoleList extends UserRoleBase {
    id: string;
  }
  interface UserBase {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
  }

  type UserForm = UserBase;
  interface UserList extends UserBase {
    id: string;
  }

  // Features Dropdown
  interface FeatureItem {
    name: string;
    value: string;
  }

  // Rights Dropdown
  interface RightItem {
    name: string;
    value: string;
  }

  // Role Permissions
  interface RolePermissionBase {
    roleName: string;
    domain: string;
    feature: string;
  }
  interface RolePermissionCreate extends RolePermissionBase {
    action: string;
  }
  interface RolePermissionList extends RolePermissionBase {
    id: string;
    action: string;
  }
  interface RolePermissionUpdate extends RolePermissionBase {
    oldAction: string;
    newAction: string;
  }

  // User Assignments
  interface UserAssignmentBase {
    roleName: string;
    domain: string;
  }
  interface UserAssignmentForm extends UserAssignmentBase {
    userId: string;
  }
  interface UserAssignmentList extends UserAssignmentBase {
    userId: string;
    userName: string;
  }
}
