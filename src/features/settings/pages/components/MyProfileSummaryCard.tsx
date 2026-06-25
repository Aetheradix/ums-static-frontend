import type { Control, Path } from 'react-hook-form';
import { FileUpload } from 'shared/components/forms';
import type { ProfileFormState } from '../my-profile/types';
import ProfileInfoRow from './ProfileInfoRow';

interface MyProfileSummaryCardProps {
  profileForm: ProfileFormState;
  username: string;
  email: string;
  initials: string;
  register: (name: Path<ProfileFormState>) => {
    control: Control<ProfileFormState>;
    name: Path<ProfileFormState>;
  };
}

export default function MyProfileSummaryCard({
  profileForm,
  username,
  email,
  register,
}: MyProfileSummaryCardProps) {
  return (
    <aside className="my-profile-sidebar-card">
      <div className="my-profile-cover" />

      <div className="my-profile-avatar-wrap">
        <FileUpload
          accept=".jpg,.jpeg,.png"
          mode="avatar"
          maxSizeKB={250}
          uploadNote="JPG/PNG, max 250 KB"
          {...register('profileImage')}
        />
      </div>

      <div className="my-profile-user-head">
        <h3>{profileForm.fullName || username}</h3>
      </div>

      <div className="my-profile-divider" />

      <div className="my-profile-info-section">
        <ProfileInfoRow
          label="Employee Code"
          value={profileForm.employeeCode || '-'}
        />

        <ProfileInfoRow
          label="Full Name"
          value={profileForm.fullName || username}
        />

        <ProfileInfoRow
          label="Email"
          value={profileForm.officialEmail || email}
        />

        <ProfileInfoRow
          label="Official Phone"
          value={profileForm.officialPhone || '-'}
        />

        <ProfileInfoRow
          label="Department"
          value={profileForm.department || '-'}
        />

        <ProfileInfoRow
          label="Designation"
          value={profileForm.designation || '-'}
        />

        <ProfileInfoRow
          label="Bio"
          value={profileForm.bio || 'Add a short bio to complete your profile.'}
        />
      </div>
    </aside>
  );
}
