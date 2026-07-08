import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Checkbox, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { notificationTemplates } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function AdminNotificationTemplates() {
  const [templates, setTemplates] = useState(notificationTemplates);
  const [selected, setSelected] = useState(notificationTemplates[0]);

  const [subject, setSubject] = useState(selected.subject || '');
  const [body, setBody] = useState(selected.body);
  const [isActive, setIsActive] = useState(selected.isActive);

  const handleUpdate = () => {
    setTemplates(prev =>
      prev.map(t => {
        if (t.id === selected.id) {
          return { ...t, subject, body, isActive };
        }
        return t;
      })
    );
    ToastService.success(
      `Notification templates updated for event: ${selected.event}`
    );
  };

  return (
    <FormPage
      title="Notification Templates Configuration"
      description="Configure event triggers, customize message bodies, and activate SMS/Email/WhatsApp template pathways."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Portal', to: grvUrls.admin.portal },
        { label: 'Notification Templates' },
      ]}
    >
      <div
        className="grv-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 2fr' }}
      >
        {/* Left side list */}
        <FormCard title="System Dispatch Triggers" icon="bell">
          <div className="space-y-3">
            {templates.map(t => {
              const isSelected = selected.id === t.id;
              const isEmail = t.channel === 'Email';
              const isSms = t.channel === 'SMS';
              const isWa = t.channel === 'WhatsApp';

              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelected(t);
                    setSubject(t.subject || '');
                    setBody(t.body);
                    setIsActive(t.isActive);
                  }}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-xs text-slate-800">
                      {t.event}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        t.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {t.isActive ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-bold">
                    <i
                      className={`pi ${isEmail ? 'pi-envelope text-blue-600' : isSms ? 'pi-phone text-purple-600' : isWa ? 'pi-whatsapp text-emerald-600' : 'pi-bell text-yellow-600'}`}
                    ></i>
                    <span>Channel: {t.channel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </FormCard>

        {/* Right side form */}
        <FormCard title={`Edit Template: ${selected.event}`} icon="edit">
          <FormGrid columns={1}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">
                Trigger: {selected.channel} Node Dispatcher
              </span>
              <Checkbox
                label="Enable Notification Trigger Pathway"
                checked={isActive}
                onChange={setIsActive}
              />
            </div>

            {selected.channel === 'Email' && (
              <TextBox
                label="Email Subject Heading *"
                placeholder="e.g. Complaint Assigned"
                value={subject}
                onChange={setSubject}
                required
              />
            )}

            <div className="mt-3">
              <TextArea
                label="Message Dispatch Body Template *"
                value={body}
                onChange={setBody}
                rows={6}
                required
              />
              <div className="mt-2 p-2 bg-slate-50 border rounded text-[10px] text-slate-400 font-mono">
                Available Dynamic Variables: {'{NAME}'}, {'{TICKET_NO}'},{' '}
                {'{DEPT}'}, {'{SLA_DATE}'}, {'{REMARKS}'}, {'{LINK}'}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
              <Button
                label="Save Template Parameters"
                icon="save"
                variant="primary"
                onClick={handleUpdate}
              />
            </div>
          </FormGrid>
        </FormCard>
      </div>
    </FormPage>
  );
}
