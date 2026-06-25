import type { OverlayPanel } from 'primereact/overlaypanel';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Loader } from 'shared/components/progress';
import {
  ActionOverlay,
  FormCard,
  FormPage,
  GridPanel,
  InlineCreatePanel,
} from 'shared/new-components';
import RoleSidePanel from '../../components/RoleSidePanel';
import '../../components/RoleSplitLayout.css';
import RolePermissionForm from '../components/RolePermissionForm';
import {
  useCreateRolePermissionMutation,
  useRolePermissionsQuery,
  useUpdateRolePermissionMutation,
} from '../queries';
import './RolePermissionsList.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: UserManagement.RolePermissionList };

type FeaturePermissionRow = {
  roleName: string;
  domain: string;
  feature: string;
  read: boolean;
  write: boolean;
  items: UserManagement.RolePermissionList[];
};

export default function List() {
  const { data, isLoading } = useRolePermissionsQuery();

  const editOverlayRef = useRef<OverlayPanel>(null);
  const editButtonRef = useRef<HTMLButtonElement | null>(null);

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });

  const [selectedRole, setSelectedRole] =
    useState<UserManagement.UserRoleList | null>(null);

  useEffect(() => {
    if (!selectedRole && data && data.length > 0) {
      const firstRoleName = data[0].roleName;

      setSelectedRole({
        id: firstRoleName,
        name: firstRoleName,
        description: '',
        isActive: true,
      } as UserManagement.UserRoleList);
    }
  }, [data, selectedRole]);

  const filteredPermissions = useMemo(() => {
    if (!selectedRole) return [];

    return (data ?? []).filter(item => item.roleName === selectedRole.name);
  }, [data, selectedRole]);

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

    return Array.from(featureMap.values());
  }, [filteredPermissions]);

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const closeEditOverlay = useCallback(() => {
    editOverlayRef.current?.hide();
    setPopup({ mode: 'closed' });
  }, []);

  const handleEditPermissionClick = (
    item: FeaturePermissionRow,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const editItem = item.items[0];

    if (!editItem) return;

    const target = event.currentTarget;
    editButtonRef.current = target;

    setPopup({ mode: 'edit', item: editItem });

    setTimeout(() => {
      editOverlayRef.current?.toggle(event, target);
    }, 0);
  };

  const handleDeletePermission = (_item: FeaturePermissionRow) => {
    // TODO: connect delete role permission API when available
    ToastService.error('Delete permission API is not connected yet.');
  };

  return (
    <FormPage
      title="Role Permissions Configuration"
      description="Manage the role permissions mapping configuration in the system."
    >
      <FormCard>
        <div className="role-split-layout">
          <RoleSidePanel
            selectedRoleId={selectedRole?.id}
            onRoleSelect={setSelectedRole}
          />

          <div className="role-main-panel role-permission-main-panel">
            {isLoading ? <Loader /> : undefined}

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
                        readOnly
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
                        readOnly
                        className="role-permission-check"
                      />
                    ),
                  },
                  {
                    header: 'Action',
                    sortable: false,
                    width: '120px',
                    cell: (item: FeaturePermissionRow) => (
                      <div className="grid-row-actions-center">
                        <button
                          type="button"
                          className="grid-action-icon-btn grid-action-edit-btn"
                          aria-label="Edit permission"
                          title="Edit"
                          onClick={event =>
                            handleEditPermissionClick(item, event)
                          }
                        >
                          <i className="pi pi-pencil" />
                        </button>

                        <button
                          type="button"
                          className="grid-action-icon-btn grid-action-delete-btn"
                          aria-label="Delete permission"
                          title="Delete"
                          onClick={() => handleDeletePermission(item)}
                        >
                          <i className="pi pi-trash" />
                        </button>
                      </div>
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

      <ActionOverlay
        ref={editOverlayRef}
        className="role-permission-edit-overlay-panel action-overlay-md"
        dismissable
        closeOnEscape
        showCloseIcon={false}
      >
        <div className="action-overlay-shell">
          <div className="action-overlay-header">
            <div>
              <h3 className="action-overlay-title">Edit Role Permission</h3>
            </div>

            <button
              type="button"
              className="action-overlay-close"
              onClick={closeEditOverlay}
              aria-label="Close edit role permission overlay"
            >
              <i className="pi pi-times" />
            </button>
          </div>

          <div className="action-overlay-body">
            {popup.mode === 'edit' && (
              <EditRolePermissionContent
                item={popup.item}
                onClose={closeEditOverlay}
              />
            )}
          </div>
        </div>
      </ActionOverlay>
    </FormPage>
  );
}

/* ── Inline Create Content ── */
function CreateRolePermissionContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateRolePermissionMutation();

  async function handleSubmit(data: UserManagement.RolePermissionCreate) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('Role permission granted successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to grant role permission');
    }
  }

  return <RolePermissionForm onSubmit={handleSubmit} isSaving={isPending} />;
}

/* ── Inline Edit Content ── */
function EditRolePermissionContent({
  item,
  onClose,
}: {
  item: UserManagement.RolePermissionList;
  onClose: () => void;
}) {
  const { mutateAsync, isPending } = useUpdateRolePermissionMutation();

  async function handleSubmit(formData: UserManagement.RolePermissionCreate) {
    try {
      const result = await mutateAsync({
        roleName: item.roleName,
        domain: item.domain,
        feature: item.feature,
        oldAction: item.action,
        newAction: formData.action,
      });
      if (result) {
        ToastService.success('Role permission updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update role permission');
    }
  }

  return (
    <RolePermissionForm
      fetchData={() => Promise.resolve(item)}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
      columns={1}
    />
  );
}
