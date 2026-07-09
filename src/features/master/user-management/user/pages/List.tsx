import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  ConfirmDialog,
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import UserForm from '../components/UserForm';
import { USERS } from '../../static-data';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; id: string };

export default function List() {
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [confirmTarget, setConfirmTarget] =
    useState<UserManagement.UserList | null>(null);

  const closePopup = useCallback(() => setPopup({ mode: 'closed' }), []);

  const handleRemoveClick = (user: UserManagement.UserList) => {
    setConfirmTarget(user);
  };

  const handleConfirmDelete = () => {
    if (!confirmTarget) return;
    ToastService.success('User deleted successfully.');
    setConfirmTarget(null);
  };

  return (
    <FormPage
      title="User Registration"
      description="Register and manage system user accounts. Each user can be assigned roles across different domains to control their access."
    >
      <FormCard>
        <GridPanel
          data={USERS}
          onEdit={user => setPopup({ mode: 'edit', id: user.id })}
          onRemove={handleRemoveClick}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'userName', header: 'User Name' },
            { field: 'firstName', header: 'First Name' },
            { field: 'lastName', header: 'Last Name' },
            { field: 'email', header: 'Email' },
          ]}
          toolbar={
            <Button
              label="Create"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          searchBox
        />
      </FormCard>

      {/* Create Popup */}
      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Register New User"
        subtitle="Enter the user's personal details and login credentials to create a new system account."
      >
        <CreateUserContent onClose={closePopup} />
      </FormPopup>

      {/* Edit Popup */}
      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit User Details"
        subtitle="Update the user's personal details or credentials."
      >
        {popup.mode === 'edit' && (
          <EditUserContent id={popup.id} onClose={closePopup} />
        )}
      </FormPopup>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        visible={!!confirmTarget}
        onHide={() => setConfirmTarget(null)}
        onConfirm={handleConfirmDelete}
        variant="danger"
        title="Delete User"
        message={`Are you sure you want to delete "${confirmTarget?.userName}"? All user role assignments for this user will also be removed.`}
        confirmLabel="Delete"
      />
    </FormPage>
  );
}

/* ── Create Content ── */
function CreateUserContent({ onClose }: { onClose: () => void }) {
  async function handleSubmit(_data: UserManagement.UserForm) {
    ToastService.success('User created successfully.');
    onClose();
  }

  return <UserForm onSubmit={handleSubmit} />;
}

/* ── Edit Content ── */
function EditUserContent({ id, onClose }: { id: string; onClose: () => void }) {
  const DEFAULT: UserManagement.UserForm = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    isActive: true,
  };

  const user = USERS.find(u => u.id === id) ?? DEFAULT;

  async function handleSubmit(_formData: UserManagement.UserForm) {
    ToastService.success('User updated successfully.');
    onClose();
  }

  return <UserForm fetchData={user} isEditMode onSubmit={handleSubmit} />;
}
