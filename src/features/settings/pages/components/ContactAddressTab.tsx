import type { SubmitEventHandler } from 'react';
import type { Control, Path } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import type { ProfileFormState } from '../my-profile/types';

interface ContactAddressTabProps {
  register: (name: Path<ProfileFormState>) => {
    control: Control<ProfileFormState>;
    name: Path<ProfileFormState>;
  };
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  onReset: () => void;
}

export default function ContactAddressTab({
  register,
  onSubmit,
  onReset,
}: ContactAddressTabProps) {
  return (
    <form className="my-profile-form-panel" onSubmit={onSubmit}>
      <section className="my-profile-form-section">
        <div className="my-profile-section-header">
          <div className="my-profile-section-icon">
            <i className="pi pi-phone" />
          </div>

          <div>
            <h3>Contact Information</h3>
            <p>Manage your alternate contact and emergency details.</p>
          </div>
        </div>

        <div className="my-profile-form-grid">
          <TextBox
            label="Official Email ID"
            placeholder="Official email ID"
            disabled
            {...register('officialEmail')}
          />

          <TextBox
            label="Alternate Email ID"
            placeholder="Enter alternate email ID"
            {...register('alternateEmail')}
          />

          <TextBox
            label="Official Phone No."
            placeholder="Official phone number"
            disabled
            {...register('officialPhone')}
          />

          <TextBox
            label="Alternate Phone No."
            placeholder="Enter alternate phone number"
            {...register('alternatePhone')}
          />

          <TextBox
            label="Emergency Phone No."
            placeholder="Enter emergency phone number"
            {...register('emergencyPhone')}
          />
        </div>
      </section>

      <section className="my-profile-form-section">
        <div className="my-profile-section-header">
          <div className="my-profile-section-icon">
            <i className="pi pi-map-marker" />
          </div>

          <div>
            <h3>Address Information</h3>
            <p>Review your permanent address and update your local address.</p>
          </div>
        </div>

        <div className="my-profile-address-grid">
          <TextArea
            label="Permanent Address"
            placeholder="Permanent address"
            disabled
            {...register('permanentAddress')}
          />

          <TextArea
            label="Local Address"
            placeholder="Enter local address"
            {...register('localAddress')}
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
          label="Update Contact Details"
          icon="check"
          variant="primary"
        />
      </div>
    </form>
  );
}
