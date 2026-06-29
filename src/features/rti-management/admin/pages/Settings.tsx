import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Checkbox, DropDownList, NumberBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import {
  type RTISettings,
  rtiSettings as initialSettings,
  priorityOptions,
} from '../../data';
import { rtiUrls } from '../../urls';

export default function Settings() {
  const [settings, setSettings] = useState<RTISettings>(initialSettings);

  const handleSave = () => {
    ToastService.success('RTI settings saved successfully.');
  };

  return (
    <FormPage
      title="Settings"
      description="Configure RTI system parameters and workflow settings."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'RTI Management', to: rtiUrls.portal },
        { label: 'Admin Portal', to: rtiUrls.admin.portal },
        { label: 'Settings' },
      ]}
    >
      <FormCard title="General Settings">
        <FormGrid columns={2}>
          <Checkbox
            label="Auto-calculate deadline based on type"
            checked={settings.autoDeadlineCalculation}
            onChange={v =>
              setSettings(s => ({ ...s, autoDeadlineCalculation: v }))
            }
          />
          <Checkbox
            label="Enable auto reminders"
            checked={settings.autoReminderEnabled}
            onChange={v => setSettings(s => ({ ...s, autoReminderEnabled: v }))}
          />
          <Checkbox
            label="Require digital signature"
            checked={settings.digitalSignatureRequired}
            onChange={v =>
              setSettings(s => ({ ...s, digitalSignatureRequired: v }))
            }
          />
          <DropDownList
            label="Default Priority"
            data={priorityOptions.map(p => ({ name: p, value: p }))}
            textField="name"
            optionValue="value"
            value={settings.defaultPriority}
            onChange={v =>
              setSettings(s => ({
                ...s,
                defaultPriority:
                  (v as RTISettings['defaultPriority']) || 'Normal',
              }))
            }
          />
        </FormGrid>
      </FormCard>

      <div className="mt-4">
        <FormCard title="Deadline Configuration">
          <FormGrid columns={2}>
            <NumberBox
              label="Standard RTI (days)"
              value={settings.standardDays}
              onChange={v =>
                setSettings(s => ({ ...s, standardDays: Number(v) || 30 }))
              }
              min={1}
            />
            <NumberBox
              label="Life & Liberty (hours)"
              value={settings.lifeLibertyHours}
              onChange={v =>
                setSettings(s => ({ ...s, lifeLibertyHours: Number(v) || 48 }))
              }
              min={1}
            />
            <NumberBox
              label="Transfer Case (days)"
              value={settings.transferDays}
              onChange={v =>
                setSettings(s => ({ ...s, transferDays: Number(v) || 35 }))
              }
              min={1}
            />
            <NumberBox
              label="Disabled Person (days)"
              value={settings.disabledDays}
              onChange={v =>
                setSettings(s => ({ ...s, disabledDays: Number(v) || 15 }))
              }
              min={1}
            />
            <NumberBox
              label="Max Appeals Allowed"
              value={settings.maxAppeals}
              onChange={v =>
                setSettings(s => ({ ...s, maxAppeals: Number(v) || 2 }))
              }
              min={1}
              max={5}
            />
          </FormGrid>
        </FormCard>
      </div>

      <div className="mt-4">
        <FormCard title="Reminder Schedule">
          <FormGrid columns={3}>
            {[7, 3, 1].map(days => (
              <Checkbox
                key={days}
                label={`Remind ${days} day${days > 1 ? 's' : ''} before deadline`}
                checked={settings.reminderDays.includes(days)}
                onChange={v => {
                  setSettings(s => ({
                    ...s,
                    reminderDays: v
                      ? [...s.reminderDays, days].sort((a, b) => b - a)
                      : s.reminderDays.filter(d => d !== days),
                  }));
                }}
              />
            ))}
          </FormGrid>
        </FormCard>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          label="Reset to Defaults"
          variant="outlined"
          onClick={() => setSettings(initialSettings)}
        />
        <Button label="Save Settings" variant="primary" onClick={handleSave} />
      </div>
    </FormPage>
  );
}
