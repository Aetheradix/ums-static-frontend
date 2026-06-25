import type { OverlayPanel } from 'primereact/overlaypanel';
import { useCallback, useRef, useState } from 'react';
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
import UserForm from '../components/UserForm';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useUserQuery,
  useUsersQuery,
} from '../queries';
import './UserList.css';

type PopupState = { mode: 'closed' } | { mode: 'edit'; id: string };

export default function List() {
  const { data, isLoading } = useUsersQuery();

  const editOverlayRef = useRef<OverlayPanel>(null);
  const editButtonRef = useRef<HTMLButtonElement | null>(null);

  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [showCreatePanel, setShowCreatePanel] = useState(false);

  const closeEditOverlay = useCallback(() => {
    editOverlayRef.current?.hide();
    setPopup({ mode: 'closed' });
  }, []);

  const handleEditClick = (
    user: UserManagement.UserList,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!event) return;

    const target = event.currentTarget;
    editButtonRef.current = target;

    setPopup({ mode: 'edit', id: user.id });

    setTimeout(() => {
      editOverlayRef.current?.toggle(event, target);
    }, 0);
  };

  const handleRemove = (_user: UserManagement.UserList) => {
    // TODO: connect delete/remove user API when available
  };

  return (
    <FormPage
      title="User"
      description="Manage the list of all users in the system."
    >
      <InlineCreatePanel
        visible={showCreatePanel}
        title="Create User"
        onClose={() => setShowCreatePanel(false)}
      >
        <CreateUserContent onClose={() => setShowCreatePanel(false)} />
      </InlineCreatePanel>
      <FormCard>
        {isLoading ? <Loader /> : undefined}
        <GridPanel
          data={data ?? []}
          onEdit={handleEditClick}
          onRemove={handleRemove}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '30px',
            },
            { field: 'userName', header: 'User Name' },
            { field: 'firstName', header: 'First Name' },
            { field: 'lastName', header: 'Last Name' },
            { field: 'email', header: 'Email' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: UserManagement.UserList) => (
                <span
                  className={
                    item.isActive
                      ? 'user-status-badge user-status-active'
                      : 'user-status-badge user-status-inactive'
                  }
                >
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create"
              icon="plus"
              variant="primary"
              onClick={() => setShowCreatePanel(true)}
            />
          }
          searchBox
        />
      </FormCard>
      <ActionOverlay
        ref={editOverlayRef}
        className="user-edit-overlay-panel action-overlay-md"
        dismissable
        closeOnEscape
        showCloseIcon={false}
      >
        <div className="action-overlay-shell">
          <div className="action-overlay-header">
            <div>
              <h3 className="action-overlay-title">Edit User</h3>
            </div>

            <button
              type="button"
              className="action-overlay-close"
              onClick={closeEditOverlay}
              aria-label="Close edit user overlay"
            >
              <i className="pi pi-times" />
            </button>
          </div>

          <div className="action-overlay-body">
            {popup.mode === 'edit' && (
              <EditUserContent id={popup.id} onClose={closeEditOverlay} />
            )}
          </div>
        </div>
      </ActionOverlay>
    </FormPage>
  );
}

/* ── Inline Create Content ── */
function CreateUserContent({ onClose }: { onClose: () => void }) {
  const { mutateAsync, isPending } = useCreateUserMutation();

  async function handleSubmit(data: UserManagement.UserForm) {
    try {
      const result = await mutateAsync(data);
      if (result) {
        ToastService.success('User created successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to create user');
    }
  }

  return (
    <UserForm onSubmit={handleSubmit} isSaving={isPending} layout="inline" />
  );
}

/* ── Inline Edit Content ── */
function EditUserContent({ id, onClose }: { id: string; onClose: () => void }) {
  const { mutateAsync, isPending } = useUpdateUserMutation(id);
  const { data, isLoading } = useUserQuery(id);

  const DEFAULT: UserManagement.UserForm = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    isActive: true,
  };

  async function handleSubmit(formData: UserManagement.UserForm) {
    try {
      const result = await mutateAsync(formData);
      if (result) {
        ToastService.success('User updated successfully.');
        onClose();
      }
    } catch {
      ToastService.error('Failed to update user');
    }
  }

  if (isLoading) return <Loader />;

  return (
    <UserForm
      fetchData={data ?? DEFAULT}
      isSaving={isPending}
      isEditMode
      onSubmit={handleSubmit}
      layout="overlay"
    />
  );
}
