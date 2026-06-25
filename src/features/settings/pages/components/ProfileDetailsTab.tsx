import type { SubmitEventHandler } from 'react';
import type { Control, Path } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import type { ProfileFormState } from '../my-profile/types';

interface ProfileDetailsTabProps {
  register: (name: Path<ProfileFormState>) => {
    control: Control<ProfileFormState>;
    name: Path<ProfileFormState>;
  };
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  onReset: () => void;
}

export default function ProfileDetailsTab({
  register,
  onSubmit,
  onReset,
}: ProfileDetailsTabProps) {
  return (
    <form className="my-profile-form-panel" onSubmit={onSubmit}>
      <section className="my-profile-form-section">
        <div className="my-profile-section-header">
          <div className="my-profile-section-icon">
            <i className="pi pi-user" />
          </div>

          <div>
            <h3>Basic Information</h3>
            <p>View your personal and identity-related information.</p>
          </div>
        </div>

        <div className="my-profile-form-grid">
          <TextBox
            label="Full Name"
            placeholder="Enter full name"
            disabled
            {...register('fullName')}
          />

          <TextBox
            label="Name in Hindi"
            placeholder="Name in Hindi"
            disabled
            {...register('nameInHindi')}
          />

          <TextBox
            label="Gender"
            placeholder="Gender"
            disabled
            {...register('gender')}
          />

          <TextBox
            label="Date of Birth"
            placeholder="Date of birth"
            disabled
            {...register('dateOfBirth')}
          />

          <TextBox
            label="Category"
            placeholder="Category"
            disabled
            {...register('category')}
          />

          <TextBox
            label="PwD Status"
            placeholder="PwD status"
            disabled
            {...register('pwdStatus')}
          />

          <TextBox
            label="Blood Group"
            placeholder="Blood group"
            disabled
            {...register('bloodGroup')}
          />

          <TextBox
            label="Nationality"
            placeholder="Nationality"
            disabled
            {...register('nationality')}
          />

          <TextBox
            label="Marital Status"
            placeholder="Marital status"
            disabled
            {...register('maritalStatus')}
          />

          <TextBox
            label="Guardian / Father Name"
            placeholder="Guardian or father name"
            disabled
            {...register('fatherName')}
          />

          <TextBox
            label="Mother Name"
            placeholder="Mother name"
            disabled
            {...register('motherName')}
          />
        </div>

        <div className="my-profile-description">
          <TextArea
            label="Bio"
            placeholder="Write a short bio..."
            {...register('bio')}
          />
        </div>
      </section>

      <div className="my-profile-actions">
        <Button
          type="button"
          label="Cancel"
          icon="times"
          variant="outlined"
          onClick={onReset}
        />

        <Button
          type="submit"
          label="Update Profile"
          icon="check"
          variant="primary"
        />
      </div>
    </form>
  );
}
