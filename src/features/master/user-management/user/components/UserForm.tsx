import { TextBox } from 'shared/components/forms';
import { FormActions, FormGrid } from 'shared/new-components';
import { useUserForm } from './form.hook';

interface UserFormProps {
  onSubmit: (data: UserManagement.UserForm) => Promise<void>;
  fetchData?: Forms.FetchDataFunc<UserManagement.UserForm>;
  isSaving?: boolean;
  isEditMode?: boolean;
  layout?: 'default' | 'inline' | 'overlay';
}

export default function UserForm({
  onSubmit,
  fetchData,
  isSaving,
  isEditMode,
  layout = 'default',
}: UserFormProps) {
  const { register, handleSubmit, reset } = useUserForm(onSubmit, fetchData);

  const isInline = layout === 'inline';
  const isOverlay = layout === 'overlay';

  const fields = (
    <>
      <div className="user-form-field">
        <TextBox
          label="User Name"
          placeholder="Enter User Name"
          {...register('userName')}
          required
        />
      </div>

      <div className="user-form-field">
        <TextBox
          label="First Name"
          placeholder="Enter First Name"
          {...register('firstName')}
          required
        />
      </div>

      <div className="user-form-field">
        <TextBox
          label="Last Name"
          placeholder="Enter Last Name"
          {...register('lastName')}
          required
        />
      </div>

      <div className="user-form-field user-form-email">
        <TextBox
          label="Email"
          placeholder="Enter Email"
          {...register('email')}
          required
        />
      </div>

      <div className="user-form-status">
        <label className="user-form-status-label">
          Status <span className="text-red-500">*</span>
        </label>

        <label className="user-status-toggle">
          <input
            type="checkbox"
            className="user-status-toggle-input"
            {...register('isActive')}
          />

          <span className="user-status-toggle-track">
            <span className="user-status-toggle-thumb" />
          </span>

          <span className="user-status-toggle-text">Active</span>
        </label>
      </div>
    </>
  );

  if (isInline) {
    return (
      <form onSubmit={handleSubmit} className="user-form user-form-inline">
        <div className="user-form-inline-grid">
          {fields}

          <div className="user-form-actions-inline">
            <FormActions
              isEditMode={isEditMode}
              isLoading={isSaving}
              onSave={handleSubmit}
              onReset={reset}
            />
          </div>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={isOverlay ? 'user-form user-form-overlay' : 'user-form'}
    >
      <FormGrid columns={isOverlay ? 1 : 2}>{fields}</FormGrid>

      <FormActions
        isEditMode={isEditMode}
        isLoading={isSaving}
        onSave={handleSubmit}
        onReset={reset}
      />
    </form>
  );
}
