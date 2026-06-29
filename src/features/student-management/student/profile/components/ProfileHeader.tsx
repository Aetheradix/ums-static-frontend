import { StatusBadge } from 'shared/new-components';
import type { StudentProfile } from '../types';

interface ProfileHeaderProps {
  profile: StudentProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="profile-header">
      <div className="profile-avatar">
        <div className="profile-avatar-placeholder">
          <i className="pi pi-user text-4xl text-white" />
        </div>
      </div>
      <div className="profile-header-info">
        <h1 className="profile-header-name">
          {profile.firstName} {profile.middleName} {profile.lastName}
        </h1>
        <div className="profile-header-details">
          <span className="profile-header-detail">
            <i className="pi pi-id-card" />
            {profile.enrollmentNo}
          </span>
          <span className="profile-header-detail">
            <i className="pi pi-book" />
            {profile.programme} - {profile.specialisation}
          </span>
          <span className="profile-header-detail">
            <i className="pi pi-calendar" />
            Batch: {profile.admissionDetails.batchYear}
          </span>
        </div>
      </div>
      <div className="profile-header-status">
        <StatusBadge
          label={profile.applicationStatus.currentStatus}
          variant={profile.applicationStatus.statusColor}
        />
        <span className="profile-header-updated">
          Updated: {profile.applicationStatus.lastUpdated}
        </span>
      </div>
    </div>
  );
}
