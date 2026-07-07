import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  ConfirmDialog,
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import RoleForm from '../components/RoleForm';
import { ROLES } from '../../static-data';

export default function List() {
  const [showCreate, setShowCreate] = useState(false);
  const [confirmTarget, setConfirmTarget] =
    useState<UserManagement.UserRoleList | null>(null);

  const handleRemoveClick = (role: UserManagement.UserRoleList) => {
    setConfirmTarget(role);
  };

  const handleConfirmDelete = () => {
    if (!confirmTarget) return;
    ToastService.success('Role deleted successfully.');
    setConfirmTarget(null);
  };

  return (
    <FormPage
      title="Role Masters"
      description="Define the roles available in the system. Roles group users with similar responsibilities and are the foundation for assigning access and permissions."
    >
      <FormCard>
        <GridPanel
          data={ROLES}
          onRemove={handleRemoveClick}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'name', header: 'Role Name' },
            { field: 'description', header: 'Description' },
          ]}
          toolbar={
            <Button
              label="Create"
              icon="plus"
              variant="primary"
              onClick={() => setShowCreate(true)}
            />
          }
          searchBox
        />
      </FormCard>

      {/* Create Popup */}
      <FormPopup
        visible={showCreate}
        onHide={() => setShowCreate(false)}
        title="Create New Role"
        subtitle="Define a role name and description. Once created, this role can be assigned to users and granted feature-level access."
      >
        <CreateRoleContent onClose={() => setShowCreate(false)} />
      </FormPopup>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        visible={!!confirmTarget}
        onHide={() => setConfirmTarget(null)}
        onConfirm={handleConfirmDelete}
        variant="danger"
        title="Delete Role"
        message={`Are you sure you want to delete the role "${confirmTarget?.name}"? All users assigned to this role and all access permissions configured for it will also be removed.`}
        confirmLabel="Delete"
      />
    </FormPage>
  );
}

/* ── Create Content ── */
function CreateRoleContent({ onClose }: { onClose: () => void }) {
  async function handleSubmit(_data: UserManagement.UserRoleForm) {
    ToastService.success('Role created successfully.');
    onClose();
  }

  return <RoleForm onSubmit={handleSubmit} />;
}
