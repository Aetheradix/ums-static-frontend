import { Fragment } from 'react';
import { FormCard, FormPage } from 'shared/new-components';
import { Icon } from 'shared/components/Icon/Icon';
import { ADMIN_ROLES, PERMISSIONS, DEFAULT_MATRIX } from '../../data/domain';
import { useLifecycleStore } from '../../store/useLifecycleStore';
import { ToastService } from 'services';
import { studentLifecycleUrls, studentServicesUrl } from '../../urls';

export default function AdminRoles() {
  const currentAdminRole = useLifecycleStore(s => s.currentAdminRole);
  const permissionMatrix = useLifecycleStore(s => s.permissionMatrix);
  const togglePermission = useLifecycleStore(s => s.togglePermission);
  const resetPermissionMatrix = useLifecycleStore(s => s.resetPermissionMatrix);

  const perms = DEFAULT_MATRIX[currentAdminRole] || [];
  const canEdit = perms.includes('roles.edit');

  if (!canEdit) {
    return (
      <FormPage
        title="Roles & Permissions Matrix"
        description="Access Denied. You do not have permissions to modify access control matrix."
      >
        <FormCard>
          <div className="p-8 text-center text-red-500 flex flex-col items-center justify-center gap-3">
            <Icon name="block" className="text-5xl" />
            <p className="font-bold">Unauthorized Access</p>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  const groups = [...new Set(PERMISSIONS.map(p => p.group))];

  const handleResetDefaults = () => {
    resetPermissionMatrix();
    ToastService.success('Access matrix reset to system defaults.');
  };

  const breadcrumbs = [
    { label: 'Home', to: '/home' },
    { label: 'Student Services', to: studentServicesUrl },
    { label: 'Student Lifecycle', to: studentLifecycleUrls.admin.root },
    { label: 'Access Control Matrix' },
  ];

  const headerAction = (
    <button
      onClick={handleResetDefaults}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors"
    >
      <Icon name="history" className="text-xs" />
      <span>Reset Defaults</span>
    </button>
  );

  return (
    <FormPage
      title="Roles & Permissions Matrix"
      description="Configure role-based access control (RBAC) capabilities. Changes propagate instantly to active staff sessions."
      breadcrumbs={breadcrumbs}
      headerAction={headerAction}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Permission matrix grid */}
        <FormCard className="p-0 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/50">
            <Icon name="security" className="text-primary text-xl" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              RBAC Capability Matrix
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 text-slate-400 font-semibold text-xs">
                  <th className="px-5 py-3">
                    Capability / Operation Permission
                  </th>
                  {ADMIN_ROLES.map(r => (
                    <th key={r.key} className="px-5 py-3 text-center w-32">
                      {r.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {groups.map(group => (
                  <Fragment key={group}>
                    <tr className="bg-slate-50 dark:bg-slate-950/50">
                      <td
                        colSpan={ADMIN_ROLES.length + 1}
                        className="px-5 py-2 text-[9px] font-black tracking-wider text-slate-400 uppercase"
                      >
                        {group} Capabilities
                      </td>
                    </tr>
                    {PERMISSIONS.filter(p => p.group === group).map(p => (
                      <tr
                        key={p.key}
                        className="hover:bg-slate-50 dark:bg-slate-950/15 transition-colors"
                      >
                        <td className="px-5 py-3 font-semibold text-slate-700 dark:text-slate-300 text-xs">
                          {p.label}
                        </td>
                        {ADMIN_ROLES.map(r => {
                          const checked =
                            permissionMatrix[r.key]?.includes(p.key) ?? false;
                          const locked = r.key === 'super';
                          return (
                            <td key={r.key} className="px-5 py-3 text-center">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-700 rounded"
                                checked={checked}
                                disabled={locked}
                                onChange={() => {
                                  togglePermission(r.key, p.key);
                                  ToastService.success(
                                    `Permission "${p.label}" ${!checked ? 'granted to' : 'revoked from'} role "${r.label}".`
                                  );
                                }}
                                aria-label={`${r.label}: ${p.label}`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        {/* Roles information cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ADMIN_ROLES.map(r => (
            <FormCard key={r.key} className="p-4 flex flex-col gap-2">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {r.label}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  {r.description}
                </p>
              </div>
              <div className="mt-auto pt-2 flex">
                <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 border border-blue-100 dark:border-blue-900/30 text-[8px] font-black uppercase tracking-wider">
                  {permissionMatrix[r.key]?.length ?? 0} Permissions
                </span>
              </div>
            </FormCard>
          ))}
        </div>
      </div>
    </FormPage>
  );
}
