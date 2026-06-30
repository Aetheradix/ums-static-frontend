import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, Switch, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, Tabs } from 'shared/new-components';
import { smsUrls } from '../../urls';

type SettingsTab = 'general' | 'notifications' | 'workflow' | 'access';
const TABS = [
  { label: 'General', key: 'general' },
  { label: 'Notifications', key: 'notifications' },
  { label: 'Workflow', key: 'workflow' },
  { label: 'Access Control', key: 'access' },
];

export default function SuperAdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [autoAssign, setAutoAssign] = useState(false);
  const [escalation, setEscalation] = useState(true);
  const [reminderHours, setReminderHours] = useState('24');
  const [orgName, setOrgName] = useState('University Security Management');
  const [contactEmail, setContactEmail] = useState('security@university.edu');

  return (
    <FormPage
      title="System Settings"
      description="Configure system-wide security management settings and preferences."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Settings' },
      ]}
    >
      <FormCard>
        <Tabs
          tabs={TABS.map(t => ({ title: t.label, content: <></> }))}
          activeIndex={TABS.findIndex(t => t.key === activeTab)}
          onTabChange={e => setActiveTab(TABS[e.index].key as SettingsTab)}
        />
        <div style={{ marginTop: '1.25rem' }}>
          {activeTab === 'general' && (
            <FormGrid columns={2}>
              <TextBox label="Organization Name" value={orgName} onChange={setOrgName} />
              <TextBox label="Security Control Room Email" value={contactEmail} onChange={setContactEmail} />
              <TextBox label="Emergency Hotline" value="1800-000-000" onChange={() => {}} />
              <DropDownList label="Default Priority" data={['Low', 'Medium', 'High', 'Critical'].map(p => ({ name: p, value: p }))} textField="name" optionValue="value" value="Medium" onChange={() => {}} />
            </FormGrid>
          )}
          {activeTab === 'notifications' && (
            <FormGrid columns={2}>
              <Switch label="Email Notifications" checked={emailNotif} onChange={setEmailNotif} />
              <Switch label="SMS Notifications" checked={smsNotif} onChange={setSmsNotif} />
              <Switch label="Push Notifications" checked={true} onChange={() => {}} />
              <Switch label="Escalation Alerts" checked={escalation} onChange={setEscalation} />
              <TextBox label="Reminder Frequency (hours)" value={reminderHours} onChange={setReminderHours} />
            </FormGrid>
          )}
          {activeTab === 'workflow' && (
            <FormGrid columns={2}>
              <Switch label="Auto-assign Incidents" checked={autoAssign} onChange={setAutoAssign} />
              <Switch label="Enable Escalation" checked={escalation} onChange={setEscalation} />
              <TextBox label="SLA Hours (High Priority)" value="4" onChange={() => {}} />
              <TextBox label="SLA Hours (Critical Priority)" value="1" onChange={() => {}} />
              <TextBox label="Auto-close after (days)" value="30" onChange={() => {}} />
            </FormGrid>
          )}
          {activeTab === 'access' && (
            <div>
              {[
                { role: 'Super Admin', permissions: 'Full Access — Masters, Reports, Settings, Incidents' },
                { role: 'Security Admin', permissions: 'Incidents, Helplines, Guidelines, Awareness, Reports (No Masters)' },
                { role: 'Security Officer', permissions: 'Assigned Incidents Only — View, Investigate, Resolve, Close' },
                { role: 'Employee', permissions: 'Report Incident, View Own Incidents, Helplines, Guidelines, Awareness' },
                { role: 'Student', permissions: 'Report Incident, View Own Incidents, Helplines, Guidelines, Awareness' },
              ].map(r => (
                <div key={r.role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #f3f4f6', borderRadius: 8, marginBottom: '0.5rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{r.role}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>{r.permissions}</p>
                  </div>
                  <Button size="small" label="Edit" icon="pencil" variant="outlined" onClick={() => ToastService.success('Access control is managed by system administrators.')} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Reset to Default" variant="outlined" icon="refresh" onClick={() => ToastService.success('Settings reset to defaults.')} />
          <Button label="Save Settings" variant="primary" icon="save" onClick={() => ToastService.success('Settings saved successfully.')} />
        </div>
      </FormCard>
    </FormPage>
  );
}
