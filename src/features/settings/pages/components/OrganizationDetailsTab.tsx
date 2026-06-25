import { TextBox } from 'shared/components/forms';
import type { ProfileFormState } from '../my-profile/types';

interface OrganizationDetailsTabProps {
  profileForm: ProfileFormState;
}

export default function OrganizationDetailsTab({
  profileForm,
}: OrganizationDetailsTabProps) {
  return (
    <div className="my-profile-form-panel">
      <div className="my-profile-form-grid">
        <TextBox
          label="Employee Code"
          value={profileForm.employeeCode || '-'}
          disabled
        />

        <TextBox label="Role" value={profileForm.role || '-'} disabled />

        <TextBox
          label="Department"
          value={profileForm.department || '-'}
          disabled
        />

        <TextBox
          label="Designation"
          value={profileForm.designation || '-'}
          disabled
        />

        <TextBox
          label="Organization Unit"
          value={profileForm.organizationUnit || '-'}
          disabled
        />

        <TextBox
          label="Reporting To"
          value={profileForm.reportingTo || '-'}
          disabled
        />

        <TextBox
          label="Employee Type"
          value={profileForm.employeeType || '-'}
          disabled
        />

        <TextBox
          label="Nature of Employment"
          value={profileForm.natureOfEmployment || '-'}
          disabled
        />

        <TextBox
          label="Date of Joining"
          value={profileForm.dateOfJoining || '-'}
          disabled
        />

        <TextBox
          label="Employee Status"
          value={profileForm.employeeStatus || '-'}
          disabled
        />

        <TextBox
          label="Work Location"
          value={profileForm.workLocation || '-'}
          disabled
        />
      </div>
    </div>
  );
}
