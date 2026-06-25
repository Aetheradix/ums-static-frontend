import { Route, Routes } from 'react-router-dom';
import User from './user';
import Role from './role';
import RolePermissions from './role-permissions';
import UserAssignment from './user-assignment';

export default function UserManagement() {
  return (
    <Routes>
      <Route path="users/*" element={<User />} />
      <Route path="roles/*" element={<Role />} />
      <Route path="role-permissions/*" element={<RolePermissions />} />
      <Route path="user-assignments/*" element={<UserAssignment />} />
    </Routes>
  );
}
