import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { ConfirmDialog } from 'shared/new-components';
import RoleForm from '../role/components/RoleForm';
import { ROLES } from '../static-data';
import './RoleSidePanel.css';

type RolePanelMode = { mode: 'closed' } | { mode: 'create' };

interface RoleSidePanelProps {
  selectedRoleId?: string;
  onRoleSelect: (role: UserManagement.UserRoleList) => void;
}

export default function RoleSidePanel({
  selectedRoleId,
  onRoleSelect,
}: RoleSidePanelProps) {
  const [search, setSearch] = useState('');
  const [panelMode, setPanelMode] = useState<RolePanelMode>({ mode: 'closed' });
  const [confirmTarget, setConfirmTarget] =
    useState<UserManagement.UserRoleList | null>(null);

  const closePanel = () => setPanelMode({ mode: 'closed' });

  const handleDeleteRole = (role: UserManagement.UserRoleList) => {
    setConfirmTarget(role);
  };

  const handleConfirmDelete = () => {
    if (!confirmTarget) return;
    ToastService.success('Role deleted successfully.');
    setConfirmTarget(null);
  };

  const filteredRoles = useMemo(() => {
    if (!search.trim()) return ROLES;

    return ROLES.filter(role =>
      role.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

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

      <div className="role-side-list-scroll">
        <div className="role-side-list">
          {filteredRoles.length === 0 && (
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
                    className="grid-action-icon-btn grid-action-delete-btn"
                    aria-label="Delete role"
                    title="Delete role"
                    onClick={event => {
                      event.stopPropagation();
                      handleDeleteRole(role);
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
        Showing {filteredRoles.length} of {ROLES.length} roles
      </div>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        visible={!!confirmTarget}
        onHide={() => setConfirmTarget(null)}
        onConfirm={handleConfirmDelete}
        variant="danger"
        title="Delete Role"
        message={`Are you sure you want to delete "${confirmTarget?.name}"? All user assignments and feature permissions linked to this role will also be removed.`}
        confirmLabel="Delete"
      />
    </aside>
  );
}

function CreateRoleContent({ onClose }: { onClose: () => void }) {
  async function handleSubmit(_data: UserManagement.UserRoleForm) {
    ToastService.success('Role created successfully.');
    onClose();
  }

  return <RoleForm onSubmit={handleSubmit} columns={1} />;
}
