import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { tdmUrls } from '../../urls';

export default function AdminSettingsPage() {
  return (
    <FormPage
      title="Module Settings"
      description="Configure email templates, notification rules and module preferences."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Settings' },
      ]}
    >
      <FormGrid columns={2}>
        <FormCard title="General Settings">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <DropDownList
              label="Default Academic Year"
              data={[{ name: '2024-2025', value: '2024-2025' }]}
              textField="name"
              optionValue="value"
              value="2024-2025"
            />
            <DropDownList
              label="Auto-Approve External Trainers"
              data={[
                { name: 'Yes', value: 'Yes' },
                { name: 'No, requires HOD approval', value: 'No' },
              ]}
              textField="name"
              optionValue="value"
              value="No"
            />
            <TextBox
              label="Default Honorarium Rate (₹)"
              type="number"
              value="1500"
            />
          </div>
        </FormCard>

        <FormCard title="Notification Settings">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.813rem' }}>
                  Training Application Received
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Notify HOD when faculty applies
                </div>
              </div>
              <Button
                size="small"
                variant="outlined"
                label="Enabled"
                icon="check"
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.813rem' }}>
                  Certificate Auto-Generation
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Send email with certificate upon completion
                </div>
              </div>
              <Button
                size="small"
                variant="outlined"
                label="Enabled"
                icon="check"
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.813rem' }}>
                  Feedback Reminder
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Remind participants to submit feedback
                </div>
              </div>
              <Button
                size="small"
                variant="outlined"
                label="Enabled"
                icon="check"
              />
            </div>
          </div>
        </FormCard>
      </FormGrid>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '1.5rem',
        }}
      >
        <Button label="Save Settings" icon="check" variant="primary" />
      </div>
    </FormPage>
  );
}
