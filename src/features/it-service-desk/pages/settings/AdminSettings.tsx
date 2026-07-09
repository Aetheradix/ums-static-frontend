import { useState } from 'react';
import { ToastService } from 'services';
import { FormPage, FormGrid, Tabs } from 'shared/new-components';
import { TextBox, Switch, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { PriorityBadge } from '../../components';
import { initialSettings, serviceCategories } from '../../data';
import { itsmUrls } from '../../urls';

export default function AdminSettings() {
  const [settings, setSettings] = useState(initialSettings);

  const updateGeneral = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      general: { ...prev.general, [field]: value },
    }));
  };

  const handleSave = () => {
    ToastService.success('Settings saved successfully.');
  };

  const tabs = [
    {
      title: 'General',
      content: (
        <FormGrid columns={2}>
          <TextBox
            label="Module Name"
            value={settings.general.moduleName}
            onChange={(v: string) => updateGeneral('moduleName', v)}
          />
          <DropDownList
            label="Default Priority"
            value={settings.general.defaultPriority}
            onChange={(v: any) => updateGeneral('defaultPriority', v)}
            data={
              [
                { name: 'Low' },
                { name: 'Medium' },
                { name: 'High' },
                { name: 'Critical' },
              ] as any
            }
            textField="name"
            optionValue="name"
          />
          <Switch
            label="Auto-Assign Tickets"
            checked={settings.general.autoAssign}
            onChange={(e: any) => updateGeneral('autoAssign', e.value ?? e)}
          />
          <Switch
            label="Allow Guest Tickets"
            checked={settings.general.allowGuestTickets}
            onChange={(e: any) =>
              updateGeneral('allowGuestTickets', e.value ?? e)
            }
          />
          <TextBox
            label="Max Attachments"
            value={String(settings.general.maxAttachments)}
            onChange={(v: string) =>
              updateGeneral('maxAttachments', parseInt(v) || 5)
            }
          />
        </FormGrid>
      ),
    },
    {
      title: 'Services',
      content: (
        <div className="space-y-4">
          {serviceCategories.map(cat => (
            <div
              key={cat.name}
              className="border border-gray-100 rounded-lg p-4"
            >
              <p className="text-sm font-bold text-gray-700 mb-2">{cat.name}</p>
              <div className="flex flex-wrap gap-2">
                {cat.services.map(svc => (
                  <span
                    key={svc.name}
                    className="text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded"
                  >
                    {svc.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'SLA Rules',
      content: (
        <div className="space-y-3">
          {settings.slaRules.map(rule => (
            <div
              key={rule.priority}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <PriorityBadge priority={rule.priority} />
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">
                    {rule.responseHours}h
                  </span>{' '}
                  response
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">
                    {rule.resolutionHours}h
                  </span>{' '}
                  resolution
                </div>
              </div>
              <span
                className="inline-block w-5 h-5 rounded-full shrink-0"
                style={{ backgroundColor: rule.color }}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Agent Mapping',
      content: (
        <div className="space-y-3">
          {['Er. Amit Patel', 'Er. Sandeep Kothari', 'Ms. Priya Nair'].map(
            agent => {
              const assigned = Math.floor(Math.random() * 8) + 2;
              const inProgress = Math.floor(Math.random() * 4) + 1;
              return (
                <div
                  key={agent}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{agent}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      <span>
                        <span className="font-medium text-gray-700">
                          {assigned}
                        </span>{' '}
                        Assigned
                      </span>
                      <span>
                        <span className="font-medium text-gray-700">
                          {inProgress}
                        </span>{' '}
                        In Progress
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                    Active
                  </span>
                </div>
              );
            }
          )}
        </div>
      ),
    },
    {
      title: 'Auto Assignment',
      content: (
        <FormGrid columns={2}>
          <Switch
            label="Enable Auto Assignment"
            checked={settings.autoAssignment.enabled}
            onChange={(e: any) =>
              setSettings(prev => ({
                ...prev,
                autoAssignment: {
                  ...prev.autoAssignment,
                  enabled: e.value ?? e,
                },
              }))
            }
          />
          <DropDownList
            label="Assignment Method"
            value={settings.autoAssignment.method}
            onChange={(v: any) =>
              setSettings(prev => ({
                ...prev,
                autoAssignment: { ...prev.autoAssignment, method: v },
              }))
            }
            data={
              [
                { name: 'round-robin' },
                { name: 'least-loaded' },
                { name: 'skill-based' },
              ].map(m => ({
                label: m.name
                  .replace('-', ' ')
                  .replace(/\b\w/g, (c: string) => c.toUpperCase()),
                value: m.name,
              })) as any
            }
            textField="label"
            optionValue="value"
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
          <Switch
            label="Daily Digest"
            checked={settings.notificationSettings.dailyDigest}
            onChange={(e: any) =>
              setSettings(prev => ({
                ...prev,
                notificationSettings: {
                  ...prev.notificationSettings,
                  dailyDigest: e.value ?? e,
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
      title="Settings"
      description="Configure service desk parameters, services, SLA rules, and agent settings."
      breadcrumbs={[
        { label: 'IT Service Desk', to: itsmUrls.portal },
        { label: 'Settings' },
      ]}
      headerAction={
        <Button
          label="Save All"
          variant="primary"
          icon="save"
          onClick={handleSave}
        />
      }
    >
      <Tabs tabs={tabs} />
    </FormPage>
  );
}
