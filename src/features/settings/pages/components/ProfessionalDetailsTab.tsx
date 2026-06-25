import { TextBox } from 'shared/components/forms';
import type { ProfileFormState } from '../my-profile/types';

interface ProfessionalDetailsTabProps {
  profileForm: ProfileFormState;
}

export default function ProfessionalDetailsTab({
  profileForm,
}: ProfessionalDetailsTabProps) {
  return (
    <div className="my-profile-form-panel">
      <div className="my-profile-form-grid">
        <TextBox
          label="UG Qualification"
          value={profileForm.ugQualification || 'B.E'}
          disabled
        />
        <TextBox
          label="PG Qualification"
          value={profileForm.pgQualification || '-'}
          disabled
        />

        <TextBox
          label="Registration Number"
          value={profileForm.registrationNumber || 'AD123'}
          disabled
        />
        <TextBox
          label="Total Experience"
          value={profileForm.totalExperience || '5'}
          disabled
        />
        <TextBox
          label="Specialization"
          value={profileForm.specialization || 'Management'}
          disabled
        />
      </div>
    </div>
  );
}
