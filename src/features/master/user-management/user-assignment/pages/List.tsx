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
import UserAssignmentForm from '../components/UserAssignmentForm';
import {
  useCreateUserAssignmentMutation,
  useUpdateUserAssignmentMutation,
  useUserAssignmentsQuery,
} from '../queries';
import './UserAssignmentList.css';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: UserManagement.UserAssignmentList };

export default function List() {
  const { data, isLoading } = useUserAssignmentsQuery();

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

  const filteredAssignments = useMemo(() => {
    if (!selectedRole) return [];

    return (data ?? []).filter(item => item.roleName === selectedRole.name);
  }, [data, selectedRole]);

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const closeEditOverlay = useCallback(() => {
    editOverlayRef.current?.hide();
    setPopup({ mode: 'closed' });
  }, []);

  const handleEditAssignmentClick = (
    item: UserManagement.UserAssignmentList,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const target = event.currentTarget;
    editButtonRef.current = target;

    setPopup({ mode: 'edit', item });

    setTimeout(() => {
      editOverlayRef.current?.toggle(event, target);
    }, 0);
  };

  const handleDeleteAssignment = (_item: UserManagement.UserAssignmentList) => {
    // TODO: connect delete user assignment API when available
    ToastService.error('Delete user assignment API is not connected yet.');
  };

  return (
    <FormPage
      title="User Assignments"
      description="Manage user assignments in the system."
    >
      <FormCard>
        <div className="role-split-layout">
          <RoleSidePanel
            selectedRoleId={selectedRole?.id}
            onRoleSelect={setSelectedRole}
          />

          <div className="role-main-panel">
            {isLoading ? <Loader /> : undefined}

            <div className="role-main-header">
              <div>
                <h3 className="role-main-title">User Assignments</h3>
              </div>
            </div>

            <InlineCreatePanel
              visible={popup.mode === 'create'}
              title="Create User Assignment"
              onClose={closePopup}
            >
              <CreateUserAssignmentContent onClose={closePopup} />
            </InlineCreatePanel>

            {!selectedRole ? (
              <div className="role-empty-state">
                <i className="pi pi-users role-empty-icon" />
                <h4>Select a role</h4>
                <p>
                  Select a role from the left panel to view and manage user
                  assignments.
                </p>
              </div>
            ) : (
              <GridPanel
                data={filteredAssignments}
                emptyMessage={`No user assignments found for ${selectedRole?.name}.`}
                columns={[
                  { field: 'userName', header: 'User' },
                  { field: 'roleName', header: 'Role' },
                  { field: 'domain', header: 'Domain' },
                  {
                    header: 'Action',
                    sortable: false,
                    width: '120px',
                    cell: (item: UserManagement.UserAssignmentList) => (
                      <div className="grid-row-actions-center">
                        <button
                          type="button"
                          className="grid-action-icon-btn grid-action-edit-btn"
                          aria-label="Edit user assignment"
                          title="Edit"
                          onClick={event =>
                            handleEditAssignmentClick(item, event)
                          }
                        >
                          <i className="pi pi-pencil" />
                        </button>

                        <button
                          type="button"
                          className="grid-action-icon-btn grid-action-delete-btn"
                          aria-label="Delete user assignment"
                          title="Delete"
                          onClick={() => handleDeleteAssignment(item)}
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
        className="user-assignment-edit-overlay-panel action-overlay-md"
        dismissable
        closeOnEscape
        showCloseIcon={false}
      >
        <div className="action-overlay-shell">
          <div className="action-overlay-header">
            <h3 className="action-overlay-title">Edit User Assignment</h3>

            <button
              type="button"
              className="action-overlay-close"
              onClick={closeEditOverlay}
              aria-label="Close edit user assignment overlay"
            >
              <i className="pi pi-times" />
            </button>
          </div>

          <div className="action-overlay-body">
            {popup.mode === 'edit' && (
              <EditUserAssignmentContent
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
function CreateUserAssignmentContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateUserAssignmentMutation();

  async function handleSubmit(data: UserManagement.UserAssignmentForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('User assigned successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to assign user');
    }
  }

  return <UserAssignmentForm onSubmit={handleSubmit} isSaving={isPending} />;
}

/* ── Inline Edit Content ── */
function EditUserAssignmentContent({
  item,
  onClose,
}: {
  item: UserManagement.UserAssignmentList;
  onClose: () => void;
}) {
  const { mutateAsync, isPending } = useUpdateUserAssignmentMutation();

  async function handleSubmit(formData: UserManagement.UserAssignmentForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('User assignment updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update user assignment');
    }
  }

  return (
    <UserAssignmentForm
      fetchData={() => Promise.resolve(item)}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
      columns={1}
    />
  );
}
