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
import { USER_ASSIGNMENTS } from '../../static-data';
import UserAssignmentForm from '../components/UserAssignmentForm';
import './UserAssignmentList.css';

type PopupState = { mode: 'closed' } | { mode: 'create' };

export default function List() {
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [selectedRole, setSelectedRole] =
    useState<UserManagement.UserRoleList | null>(() => {
      const first = USER_ASSIGNMENTS[0];
      if (!first) return null;

      return {
        id: first.roleName,
        name: first.roleName,
        description: '',
        isActive: true,
      } as UserManagement.UserRoleList;
    });

  const filteredAssignments = useMemo(() => {
    if (!selectedRole) return [];

    return USER_ASSIGNMENTS.filter(item => item.roleName === selectedRole.name);
  }, [selectedRole]);

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const handleDeleteAssignment = (_item: UserManagement.UserAssignmentList) => {
    ToastService.success('User assignment deleted successfully.');
  };

  return (
    <FormPage
      title="User Role Assignment"
      description="Assign roles to users within specific domains."
    >
      <FormCard>
        <div className="role-split-layout">
          <RoleSidePanel
            selectedRoleId={selectedRole?.id}
            onRoleSelect={setSelectedRole}
          />

          <div className="role-main-panel">
            <div className="role-main-header">
              <div>
                <h3 className="role-main-title">User Role Assignments</h3>
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
                onRemove={handleDeleteAssignment}
                emptyMessage={`No user assignments found for ${selectedRole?.name}.`}
                columns={[
                  { field: 'userName', header: 'User' },
                  { field: 'roleName', header: 'Role' },
                  { field: 'domain', header: 'Domain' },
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
function CreateUserAssignmentContent({ onClose }: { onClose: () => void }) {
  async function handleSubmit(_data: UserManagement.UserAssignmentForm) {
    ToastService.success('User assigned successfully.');
    onClose();
  }

  return <UserAssignmentForm onSubmit={handleSubmit} />;
}
