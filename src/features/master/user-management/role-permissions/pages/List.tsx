import { useCallback, useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormPage,
  GridPanel,
  InlineCreatePanel,
} from 'shared/new-components';
import RoleSidePanel from '../../components/RoleSidePanel';
import '../../components/RoleSplitLayout.css';
import { ROLE_PERMISSIONS } from '../../static-data';
import RolePermissionForm from '../components/RolePermissionForm';
import './RolePermissionsList.css';

type PopupState = { mode: 'closed' } | { mode: 'create' };

type FeaturePermissionRow = {
  roleName: string;
  domain: string;
  feature: string;
  read: boolean;
  write: boolean;
  items: UserManagement.RolePermissionList[];
};

export default function List() {
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  // Local, unsaved read/write toggles keyed by `${role}::${feature}`.
  // Read and Write are mutually exclusive (write implies read), so switching
  // directly is blocked with a validation toast — the other must be unchecked
  // first. State is per-session only (this is a static screen).
  const [overrides, setOverrides] = useState<
    Record<string, 'read' | 'write' | null>
  >({});

  const [selectedRole, setSelectedRole] =
    useState<UserManagement.UserRoleList | null>(() => {
      const first = ROLE_PERMISSIONS[0];
      if (!first) return null;

      return {
        id: first.roleName,
        name: first.roleName,
        description: '',
        isActive: true,
      } as UserManagement.UserRoleList;
    });

  const filteredPermissions = useMemo(() => {
    if (!selectedRole) return [];

    return ROLE_PERMISSIONS.filter(item => item.roleName === selectedRole.name);
  }, [selectedRole]);

  const featurePermissionRows = useMemo<FeaturePermissionRow[]>(() => {
    const featureMap = new Map<string, FeaturePermissionRow>();

    filteredPermissions.forEach(item => {
      const key = `${item.domain}-${item.feature}`;

      if (!featureMap.has(key)) {
        featureMap.set(key, {
          roleName: item.roleName,
          domain: item.domain,
          feature: item.feature,
          read: false,
          write: false,
          items: [],
        });
      }

      const row = featureMap.get(key);
      if (!row) return;

      row.items.push(item);

      const action = item.action?.toLowerCase();

      if (action === 'read') {
        row.read = true;
      }

      if (action === 'write') {
        row.write = true;
      }
    });

    // Apply any local (unsaved) toggle overrides on top of the seeded data.
    return Array.from(featureMap.values()).map(row => {
      const key = `${row.roleName}::${row.feature}`;
      if (!(key in overrides)) return row;

      const action = overrides[key];
      return { ...row, read: action === 'read', write: action === 'write' };
    });
  }, [filteredPermissions, overrides]);

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const handleToggleRight = (
    row: FeaturePermissionRow,
    clicked: 'read' | 'write'
  ) => {
    const key = `${row.roleName}::${row.feature}`;

    if (clicked === 'read') {
      if (row.write) {
        ToastService.error(
          'Write access already includes Read. Uncheck Write first to set this feature to Read-only.'
        );
        return;
      }
      // toggle Read on / off
      setOverrides(prev => ({ ...prev, [key]: row.read ? null : 'read' }));
      return;
    }

    // clicked === 'write'
    if (row.read) {
      ToastService.error(
        'A feature cannot be both Read and Write. Uncheck Read first to grant Write access.'
      );
      return;
    }
    // toggle Write on / off
    setOverrides(prev => ({ ...prev, [key]: row.write ? null : 'write' }));
  };

  const handleDeletePermission = (_item: FeaturePermissionRow) => {
    ToastService.success('Role permission removed successfully.');
  };

  return (
    <FormPage
      title="Role Permissions"
      description="Configure which features and actions each role is permitted to perform across the application."
    >
      <FormCard>
        <div className="role-split-layout">
          <RoleSidePanel
            selectedRoleId={selectedRole?.id}
            onRoleSelect={setSelectedRole}
          />

          <div className="role-main-panel role-permission-main-panel">
            <div className="role-main-header">
              <div>
                <h3 className="role-main-title">Feature Permissions</h3>
              </div>
            </div>

            <InlineCreatePanel
              visible={popup.mode === 'create'}
              title="Create Role Permission"
              onClose={closePopup}
            >
              <CreateRolePermissionContent onClose={closePopup} />
            </InlineCreatePanel>

            {!selectedRole ? (
              <div className="role-empty-state">
                <i className="pi pi-shield role-empty-icon" />
                <h4>Select a role</h4>
                <p>
                  Select a role from the left panel to view and manage its
                  feature permissions.
                </p>
              </div>
            ) : (
              <GridPanel
                data={featurePermissionRows}
                onRemove={handleDeletePermission}
                emptyMessage={`No permissions found for ${selectedRole?.name}.`}
                columns={[
                  {
                    field: 'feature',
                    header: 'Feature Name',
                    cell: (item: FeaturePermissionRow) => (
                      <span className="role-permission-feature-name">
                        {item.feature}
                      </span>
                    ),
                  },
                  {
                    field: 'read',
                    header: 'Read',
                    sortable: false,
                    width: '110px',
                    cell: (item: FeaturePermissionRow) => (
                      <input
                        type="checkbox"
                        checked={item.read}
                        onChange={() => handleToggleRight(item, 'read')}
                        className="role-permission-check"
                      />
                    ),
                  },
                  {
                    field: 'write',
                    header: 'Write',
                    sortable: false,
                    width: '110px',
                    cell: (item: FeaturePermissionRow) => (
                      <input
                        type="checkbox"
                        checked={item.write}
                        onChange={() => handleToggleRight(item, 'write')}
                        className="role-permission-check"
                      />
                    ),
                  },
                ]}
                toolbar={
                  <Button
                    label="Create"
                    icon="plus"
                    variant="primary"
                    disabled={!selectedRole}
                    onClick={() => setPopup({ mode: 'create' })}
                  />
                }
                searchBox
              />
            )}
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}

/* ── Inline Create Content ── */
function CreateRolePermissionContent({ onClose }: { onClose: () => void }) {
  async function handleSubmit(_data: UserManagement.RolePermissionCreate) {
    ToastService.success('Role permission granted successfully.');
    onClose();
  }

  return <RolePermissionForm onSubmit={handleSubmit} />;
}
