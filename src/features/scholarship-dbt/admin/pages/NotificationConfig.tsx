import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

export default function AdminNotificationConfig() {
  const [template, setTemplate] = useState(
    'Dear {name}, your scholarship application {appNo} for {scheme} has been approved. Your fee ledger will be offset shortly.'
  );
  const [channels, setChannels] = useState({
    sms: true,
    email: true,
    push: false,
  });

  const handleSave = () => {
    ToastService.success(
      'Notification templates and broadcast channels configured.'
    );
  };

  return (
    <FormPage
      title="Notification Templates"
      description="Configure auto-SMS, email templates and push notification triggers for scholarship updates."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Notification Config' },
      ]}
    >
      <div style={{ maxWidth: 720 }}>
        <FormCard title="Auto-Trigger SMS / Email Template Configuration">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Notification Trigger Event
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
              >
                <option value="app_submitted">Application Submitted</option>
                <option value="app_approved" selected>
                  Application Approved
                </option>
                <option value="npci_pending">NPCI Seeding Pending Alert</option>
                <option value="dbt_credited">DBT Amount Credited</option>
              </select>
            </div>

            <TextArea
              label="Notification Body / Template String"
              value={template}
              onChange={setTemplate}
              rows={4}
              required
            />

            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Active Delivery Channels
              </label>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {[
                  ['sms', 'SMS Gateway Broadcast'],
                  ['email', 'Email SMTP Broadcast'],
                  ['push', 'In-App Web Push Notification'],
                ].map(([ch, label]) => (
                  <label
                    key={ch}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      fontSize: '0.813rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={(channels as any)[ch]}
                      onChange={e =>
                        setChannels(prev => ({
                          ...prev,
                          [ch]: e.target.checked,
                        }))
                      }
                      style={{ width: 16, height: 16, accentColor: '#2563eb' }}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Button
                label="Save Notification Triggers"
                variant="primary"
                onClick={handleSave}
              />
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
