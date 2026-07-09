import { useState } from 'react';
import { ToastService } from 'services';
import { FormPage, FormGrid, Tabs } from 'shared/new-components';
import { Switch } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { initialSettings } from '../../data';
import { itsmUrls } from '../../urls';

export default function ModuleAdminSettings() {
  const [settings, setSettings] = useState(initialSettings);

  const tabs = [
    {
      title: 'General',
      content: (
        <FormGrid columns={2}>
          <Switch
            label="Auto-Assign Tickets"
            checked={settings.general.autoAssign}
            onChange={(e: any) =>
              setSettings(prev => ({
                ...prev,
                general: { ...prev.general, autoAssign: e.value ?? e },
              }))
            }
          />
          <Switch
            label="Allow Guest Tickets"
            checked={settings.general.allowGuestTickets}
            onChange={(e: any) =>
              setSettings(prev => ({
                ...prev,
                general: { ...prev.general, allowGuestTickets: e.value ?? e },
              }))
            }
          />
        </FormGrid>
      ),
    },
    {
      title: 'Notifications',
      content: (
        <FormGrid columns={2}>
          <Switch
            label="Email Notifications"
            checked={settings.notificationSettings.emailNotifications}
            onChange={(e: any) =>
              setSettings(prev => ({
                ...prev,
                notificationSettings: {
                  ...prev.notificationSettings,
                  emailNotifications: e.value ?? e,
                },
              }))
            }
          />
          <Switch
            label="In-App Notifications"
            checked={settings.notificationSettings.inAppNotifications}
            onChange={(e: any) =>
              setSettings(prev => ({
                ...prev,
                notificationSettings: {
                  ...prev.notificationSettings,
                  inAppNotifications: e.value ?? e,
                },
              }))
            }
          />
        </FormGrid>
      ),
    },
  ];

  return (
    <FormPage
      title="Module Settings"
      description="Configure module-level service desk settings."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Module Settings' },
      ]}
      headerAction={
        <Button
          label="Save"
          variant="primary"
          icon="save"
          onClick={() => ToastService.success('Settings saved.')}
        />
      }
    >
      <Tabs tabs={tabs} />
    </FormPage>
  );
}
