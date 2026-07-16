import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { DropDownList } from 'shared/components/forms';
import { Icon } from 'shared/components/Icon/Icon';
import type { Role } from '../../types';
import { STUDENTS, FACULTY, ADMINS } from '../../data';
import { adminRoleLabel, DEFAULT_MATRIX } from '../../data/domain';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

interface UserRow {
  id: string;
  name: string;
  role: Role;
  sub?: string;
  email: string;
  color: string;
}

const ROLE_STYLE: Record<Role, string> = {
  student: 'bg-blue-100 text-blue-800 border-blue-200',
  faculty: 'bg-amber-100 text-amber-800 border-amber-200',
  admin: 'bg-red-100 text-red-800 border-red-200',
};

const ALL_USERS: UserRow[] = [
  ...STUDENTS.map(s => ({
    id: s.enrollmentNo,
    name: s.name,
    role: 'student' as const,
    email: s.email,
    color: s.photoColor,
  })),
  ...FACULTY.map(f => ({
    id: f.id,
    name: f.name,
    role: 'faculty' as const,
    sub: f.designation,
    email: f.email,
    color: f.photoColor,
  })),
  ...ADMINS.map(a => ({
    id: a.id,
    name: a.name,
    role: 'admin' as const,
    sub: adminRoleLabel(a.adminRole),
    email: a.email,
    color: a.photoColor,
  })),
];

export default function AdminUsers() {
  const currentAdminRole = useLifecycleStore(s => s.currentAdminRole);
  const deactivatedUserIds = useLifecycleStore(s => s.deactivatedUserIds);
  const toggleUserActive = useLifecycleStore(s => s.toggleUserActive);

  const [filterRole, setFilterRole] = useState<Role | 'all'>('all');

  const perms = DEFAULT_MATRIX[currentAdminRole] || [];
  const canManage = perms.includes('students.manage');

  if (!canManage) {
    return (
      <FormPage
        title="User Accounts Directory"
        description="Access Denied. You do not have permissions to manage user accounts."
      >
        <FormCard>
          <div className="p-8 text-center text-red-500 flex flex-col items-center justify-center gap-3">
            <Icon name="block" className="text-5xl" />
            <p className="font-bold">Unauthorized Access</p>
            <p className="text-xs text-slate-400">
              Please switch to an admin role with higher privileges (e.g. Super
              Admin or Registrar).
            </p>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const filteredUsers =
    filterRole === 'all'
      ? ALL_USERS
      : ALL_USERS.filter(u => u.role === filterRole);

  const handleToggleActive = (id: string, name: string, wasActive: boolean) => {
    toggleUserActive(id);
    ToastService.success(
      `${name} has been ${wasActive ? 'deactivated' : 'activated'} successfully.`
    );
  };

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.admin.root },
    { label: 'User Management' },
  ];

  const headerAction = (
    <Link
      to={studentLifecycleUrls.admin.roles}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-colors"
    >
      <Icon name="security" className="text-xs" />
      <span>Roles & RBAC Matrix</span>
    </Link>
  );

  const gridColumns = [
    {
      field: 'name',
      header: 'User Profile',
      cell: (u: UserRow) => {
        const initials = u.name
          .split(' ')
          .map(n => n[0])
          .join('');
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0 shadow-sm"
              style={{ backgroundColor: u.color }}
            >
              {initials}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {u.name}
              </p>
              {u.sub && (
                <p className="text-[10px] text-slate-400 mt-0.5">{u.sub}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      field: 'id',
      header: 'Portal ID',
      sortable: true,
      cell: (u: UserRow) => (
        <span className="font-mono text-[10px] text-slate-400 font-bold">
          {u.id}
        </span>
      ),
    },
    {
      field: 'role',
      header: 'Assigned Role',
      sortable: true,
      cell: (u: UserRow) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_STYLE[u.role]}`}
        >
          {u.role}
        </span>
      ),
    },
    {
      field: 'id',
      header: 'Status',
      cell: (u: UserRow) => {
        const isActive = !deactivatedUserIds.includes(u.id);
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span
              className={`w-1 h-1 rounded-full ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/400' : 'bg-slate-400'}`}
            />
            {isActive ? 'Active' : 'Deactivated'}
          </span>
        );
      },
    },
    {
      field: 'id',
      header: 'Action',
      cell: (u: UserRow) => {
        const isActive = !deactivatedUserIds.includes(u.id);
        return (
          <button
            onClick={() => handleToggleActive(u.id, u.name, isActive)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 border rounded-lg text-xs font-bold transition-colors ${
              isActive
                ? 'bg-red-50 dark:bg-red-950/40 hover:bg-red-100 border-red-100 dark:border-red-900/30 text-red-600'
                : 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border-emerald-100 dark:border-emerald-900/30 text-emerald-600'
            }`}
          >
            <Icon
              name={isActive ? 'block' : 'check_circle'}
              className="text-xs"
            />
            <span>{isActive ? 'Deactivate' : 'Activate'}</span>
          </button>
        );
      },
    },
  ];

  const roleOptions = [
    { text: 'All Roles', value: 'all' },
    { text: 'Students', value: 'student' },
    { text: 'Faculty', value: 'faculty' },
    { text: 'Administration', value: 'admin' },
  ];

  return (
    <FormPage
      title="User Accounts Directory"
      description="View and manage portal accounts for students, faculty, and administrative staff."
      breadcrumbs={breadcrumbs}
      headerAction={headerAction}
    >
      <div className="flex flex-col gap-6 w-full">
        <FormCard title="System Users" className="p-0 overflow-hidden">
          {/* Header toolbar */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 gap-3">
            <div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Showing {filteredUsers.length} of {ALL_USERS.length} accounts
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-64 select-no-label">
              <DropDownList
                label=""
                value={filterRole}
                data={roleOptions}
                textField="text"
                valueField="value"
                onChange={val => setFilterRole(val as any)}
              />
            </div>
          </div>

          <GridPanel
            data={filteredUsers}
            dataKey="id"
            emptyMessage="No accounts match this filter."
            columns={gridColumns as any}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
