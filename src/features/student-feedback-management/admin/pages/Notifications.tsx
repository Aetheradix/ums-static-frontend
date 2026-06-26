import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Checkbox, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import {
  type NotificationTemplate,
  notificationTemplates as initialData,
} from '../../data';
import { feedbackUrls } from '../../urls';

export default function Notifications() {
  const [templates, setTemplates] =
    useState<NotificationTemplate[]>(initialData);

  const updateTemplate = (
    id: string,
    field: keyof NotificationTemplate,
    value: string | boolean
  ) => {
    setTemplates(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleSave = () => {
    ToastService.success('Notification settings saved successfully.');
  };

  const eventColors: Record<string, string> = {
    'Feedback Open': 'border-l-blue-500 bg-blue-50',
    Reminder: 'border-l-amber-500 bg-amber-50',
    'Last Reminder': 'border-l-red-500 bg-red-50',
    'Feedback Closed': 'border-l-green-500 bg-green-50',
  };

  return (
    <FormPage
      title="Notifications"
      description="Configure notification templates and delivery channels for feedback events."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Student Feedback Management', to: feedbackUrls.portal },
        { label: 'Admin Portal', to: feedbackUrls.admin.portal },
        { label: 'Notifications' },
      ]}
    >
      <div className="flex flex-col gap-4">
        {templates.map(t => (
          <FormCard key={t.id}>
            <div
              className={`border-l-4 ${eventColors[t.event]} -ml-6 pl-4 -mt-4 -mb-4 pt-4 pb-4`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {t.event}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Configure the notification sent when this event occurs.
                  </p>
                </div>
              </div>
              <FormGrid columns={2}>
                <TextBox
                  label="Subject"
                  value={t.subject}
                  onChange={v => updateTemplate(t.id, 'subject', v)}
                />
                <div className="flex items-end gap-4 pb-1">
                  <Checkbox
                    label="Email"
                    checked={t.emailEnabled}
                    onChange={v => updateTemplate(t.id, 'emailEnabled', v)}
                  />
                  <Checkbox
                    label="ERP Notification"
                    checked={t.erpEnabled}
                    onChange={v => updateTemplate(t.id, 'erpEnabled', v)}
                  />
                </div>
                <div className="col-span-2">
                  <TextArea
                    label="Body"
                    value={t.body}
                    onChange={v => updateTemplate(t.id, 'body', v)}
                    rows={3}
                  />
                </div>
              </FormGrid>
            </div>
          </FormCard>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button label="Save Changes" variant="primary" onClick={handleSave} />
      </div>
    </FormPage>
  );
}
