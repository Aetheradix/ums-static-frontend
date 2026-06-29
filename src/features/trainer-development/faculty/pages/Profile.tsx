import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { trainers } from '../../mocks';
import { tdmUrls } from '../../urls';

export default function MyProfilePage() {
  const profile =
    trainers.find(t => t.employeeId === 'EMP-1042') || trainers[0];

  return (
    <FormPage
      title="My Profile"
      description="View and update your academic profile, qualifications and expertise."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Faculty Portal', to: tdmUrls.faculty.portal },
        { label: 'Profile' },
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <FormCard title="Personal Information">
          <div
            style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <i
                className="pi pi-user"
                style={{ fontSize: '3rem', color: '#9ca3af' }}
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <i className="pi pi-camera" style={{ fontSize: '0.875rem' }} />
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <FormGrid columns={2}>
                <TextBox label="Full Name" value={profile.name} readOnly />
                <TextBox
                  label="Employee ID"
                  value={profile.employeeId}
                  readOnly
                />
                <TextBox label="Email" value={profile.email} />
                <TextBox label="Mobile" value={profile.mobile} />
              </FormGrid>
            </div>
          </div>
        </FormCard>

        <FormCard title="Academic & Professional Details">
          <FormGrid columns={2}>
            <DropDownList
              label="Department"
              data={[{ name: profile.department, value: profile.department }]}
              textField="name"
              optionValue="value"
              value={profile.department}
              disabled
            />
            <TextBox label="Designation" value={profile.designation} readOnly />
            <TextBox
              label="Highest Qualification"
              value={profile.qualification}
            />
            <TextBox
              label="Experience (Years)"
              type="number"
              value={profile.experience.toString()}
            />
          </FormGrid>
        </FormCard>

        <FormCard title="Expertise & Skills">
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.813rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              Specialization Areas
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {profile.specialization.map(s => (
                <span
                  key={s}
                  style={{
                    background: '#dbeafe',
                    color: '#1e40af',
                    padding: '4px 12px',
                    borderRadius: 9999,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {s}
                </span>
              ))}
              <Button size="small" icon="plus" variant="outlined" label="Add" />
            </div>
          </div>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.813rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              Technical Skills
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {profile.skills.map(s => (
                <span
                  key={s}
                  style={{
                    background: '#f3f4f6',
                    color: '#4b5563',
                    padding: '4px 12px',
                    borderRadius: 9999,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {s}
                </span>
              ))}
              <Button size="small" icon="plus" variant="outlined" label="Add" />
            </div>
          </div>
        </FormCard>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '1.5rem',
        }}
      >
        <Button label="Save Changes" icon="check" variant="primary" />
      </div>
    </FormPage>
  );
}
