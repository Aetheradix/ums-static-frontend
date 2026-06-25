import { useCallback, useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Loader } from 'shared/components/progress';
import RoleForm from '../role/components/RoleForm';
import {
  useCreateUserRoleMutation,
  useUpdateUserRoleMutation,
  useUserRoleQuery,
  useUserRolesQuery,
} from '../role/queries';
import './RoleSidePanel.css';

type RolePanelMode =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: string };

interface RoleSidePanelProps {
  selectedRoleId?: string;
  onRoleSelect: (role: UserManagement.UserRoleList) => void;
}

export default function RoleSidePanel({
  selectedRoleId,
  onRoleSelect,
}: RoleSidePanelProps) {
  const { data, isLoading } = useUserRolesQuery();

  const [search, setSearch] = useState('');
  const [panelMode, setPanelMode] = useState<RolePanelMode>({
    mode: 'closed',
  });

  const closePanel = useCallback(() => {
    setPanelMode({ mode: 'closed' });
  }, []);

  const handleDeleteRole = () => {
    // TODO: connect delete role API when available
    ToastService.error('Delete role API is not connected yet.');
  };

  const filteredRoles = useMemo(() => {
    const roles = data ?? [];

    if (!search.trim()) return roles;

    return roles.filter(role =>
      role.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <aside className="role-side-panel">
      <div className="role-side-panel-header">
        <div>
          <h3 className="role-side-panel-title">Roles</h3>
          <p className="role-side-panel-subtitle">
            Select a role to manage access.
          </p>
        </div>

        <Button
          label="Add"
          icon="plus"
          variant="primary"
          onClick={() => setPanelMode({ mode: 'create' })}
        />
      </div>

      <div className="role-side-search">
        <i className="pi pi-search role-side-search-icon" />
        <input
          type="text"
          value={search}
          placeholder="Search roles..."
          onChange={event => setSearch(event.target.value)}
          className="role-side-search-input"
        />
      </div>

      {panelMode.mode === 'create' && (
        <div className="role-side-form-card">
          <div className="role-side-form-header">
            <div>
              <h4 className="role-side-form-title">Create Role</h4>
            </div>

            <button
              type="button"
              className="role-side-close"
              onClick={closePanel}
              aria-label="Close create role form"
            >
              <i className="pi pi-angle-up" />
            </button>
          </div>

          <CreateRoleContent onClose={closePanel} />
        </div>
      )}

      {panelMode.mode === 'edit' && (
        <div className="role-side-form-card">
          <div className="role-side-form-header">
            <div>
              <h4 className="role-side-form-title">Edit Role</h4>
              <p className="role-side-form-subtitle">
                Update selected role details.
              </p>
            </div>

            <button
              type="button"
              className="role-side-close"
              onClick={closePanel}
              aria-label="Close edit role form"
            >
              <i className="pi pi-times" />
            </button>
          </div>

          <EditRoleContent id={panelMode.id} onClose={closePanel} />
        </div>
      )}

      <div className="role-side-list-scroll">
        <div className="role-side-list">
          {isLoading ? <Loader /> : undefined}

          {!isLoading && filteredRoles.length === 0 && (
            <div className="role-side-empty">No roles found.</div>
          )}

          {filteredRoles.map(role => {
            const isSelected = selectedRoleId === role.id;

            return (
              <div
                key={role.id}
                role="button"
                tabIndex={0}
                className={
                  isSelected
                    ? 'role-side-item role-side-item-selected'
                    : 'role-side-item'
                }
                onClick={() => onRoleSelect(role)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    onRoleSelect(role);
                  }
                }}
              >
                <span className="role-side-select-indicator">
                  {isSelected ? (
                    <i className="pi pi-check" />
                  ) : (
                    <i className="pi pi-users" />
                  )}
                </span>

                <span className="role-side-item-content">
                  <span className="role-side-item-name">{role.name}</span>
                </span>

                <span className="role-side-item-actions">
                  <button
                    type="button"
                    className="grid-action-icon-btn grid-action-edit-btn"
                    aria-label="Edit role"
                    title="Edit role"
                    onClick={event => {
                      event.stopPropagation();
                      setPanelMode({ mode: 'edit', id: role.id });
                    }}
                  >
                    <i className="pi pi-pencil" />
                  </button>

                  <button
                    type="button"
                    className="grid-action-icon-btn grid-action-delete-btn"
                    aria-label="Delete role"
                    title="Delete role"
                    onClick={event => {
                      event.stopPropagation();
                      handleDeleteRole();
                    }}
                  >
                    <i className="pi pi-trash" />
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="role-side-footer">
        Showing {filteredRoles.length} of {data?.length ?? 0} roles
      </div>
    </aside>
  );
}

function CreateRoleContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateUserRoleMutation();

  async function handleSubmit(data: UserManagement.UserRoleForm) {
    try {
      const result = await mutateAsync(data);

      if (result) {
        ToastService.success('Role created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create role');
    }
  }

  return <RoleForm onSubmit={handleSubmit} isSaving={isPending} columns={1} />;
}

function EditRoleContent({ id, onClose }: { id: string; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateUserRoleMutation(id);
  const { data, isLoading } = useUserRoleQuery(id);

  const DEFAULT: UserManagement.UserRoleForm = {
    name: '',
    description: '',
    isActive: true,
  };

  async function handleSubmit(formData: UserManagement.UserRoleForm) {
    try {
      const result = await mutateAsync(formData);

      if (result) {
        ToastService.success('Role updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update role');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <RoleForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
      columns={1}
    />
  );
}
