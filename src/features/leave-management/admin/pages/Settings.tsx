import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { Switch, TextBox } from 'shared/components/forms';
import { FormCard, FormPage, Tabs } from 'shared/new-components';
import { lmsUrls } from '../../urls';

type SettingsTab =
  | 'workflow'
  | 'notification'
  | 'attendance'
  | 'biometric'
  | 'email'
  | 'roles';

const TABS: { label: string; key: SettingsTab }[] = [
  { label: 'Approval Workflow', key: 'workflow' },
  { label: 'Notifications', key: 'notification' },
  { label: 'Attendance Sync', key: 'attendance' },
  { label: 'Biometric Integration', key: 'biometric' },
  { label: 'Email Templates', key: 'email' },
  { label: 'Role Permissions', key: 'roles' },
];

const PERMISSIONS = [
  {
    role: 'Admin',
    canApprove: true,
    canReject: true,
    canCreate: true,
    canExport: true,
  },
  {
    role: 'HOD',
    canApprove: true,
    canReject: true,
    canCreate: false,
    canExport: true,
  },
  {
    role: 'Dean',
    canApprove: true,
    canReject: true,
    canCreate: false,
    canExport: true,
  },
  {
    role: 'Teacher',
    canApprove: true,
    canReject: true,
    canCreate: false,
    canExport: false,
  },
  {
    role: 'Student',
    canApprove: false,
    canReject: false,
    canCreate: true,
    canExport: false,
  },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [workflowSettings, setWorkflowSettings] = useState({
    autoApprove: false,
    maxPendingDays: '5',
    notifyOnSubmit: true,
    notifyOnApproval: true,
    requireAttachmentAbove: '3',
    allowHalfDay: true,
    sandwichRule: true,
  });
  const [notifSettings, setNotifSettings] = useState({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    leaveSubmitted: true,
    leaveApproved: true,
    leaveRejected: true,
    biometricMissing: true,
    balanceLow: true,
  });
  const [biometricSettings, setBiometricSettings] = useState({
    deviceIp: '192.168.1.100',
    syncInterval: '15',
    autoSync: true,
    missingSyncAlert: true,
  });

  const handleSave = () => {
    ToastService.success('Settings saved successfully.');
  };

  return (
    <FormPage
      title="Settings"
      description="Configure leave management system settings and integrations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Leave Management', to: lmsUrls.portal },
        { label: 'Admin Portal', to: lmsUrls.admin.portal },
        { label: 'Settings' },
      ]}
    >
      <FormCard>
        <Tabs
          tabs={TABS.map(t => ({ title: t.label, content: <></> }))}
          activeIndex={activeTab}
          onTabChange={e => setActiveTab(e.index)}
        />
        <div style={{ marginTop: '1.5rem' }}>
          {/* Workflow Tab */}
          {TABS[activeTab].key === 'workflow' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TextBox
                label="Max Pending Days (before escalation)"
                value={workflowSettings.maxPendingDays}
                onChange={v =>
                  setWorkflowSettings(s => ({ ...s, maxPendingDays: v }))
                }
                placeholder="5"
              />
              <TextBox
                label="Attachment Required Above (days)"
                value={workflowSettings.requireAttachmentAbove}
                onChange={v =>
                  setWorkflowSettings(s => ({
                    ...s,
                    requireAttachmentAbove: v,
                  }))
                }
                placeholder="3"
              />
              <Switch
                label="Auto-Approve Single Day Leave"
                checked={workflowSettings.autoApprove}
                onChange={v =>
                  setWorkflowSettings(s => ({ ...s, autoApprove: v }))
                }
              />
              <Switch
                label="Notify on Leave Submit"
                checked={workflowSettings.notifyOnSubmit}
                onChange={v =>
                  setWorkflowSettings(s => ({ ...s, notifyOnSubmit: v }))
                }
              />
              <Switch
                label="Notify on Approval/Rejection"
                checked={workflowSettings.notifyOnApproval}
                onChange={v =>
                  setWorkflowSettings(s => ({ ...s, notifyOnApproval: v }))
                }
              />
              <Switch
                label="Allow Half-Day Leave"
                checked={workflowSettings.allowHalfDay}
                onChange={v =>
                  setWorkflowSettings(s => ({ ...s, allowHalfDay: v }))
                }
              />
              <Switch
                label="Sandwich Rule Enforcement"
                checked={workflowSettings.sandwichRule}
                onChange={v =>
                  setWorkflowSettings(s => ({ ...s, sandwichRule: v }))
                }
              />
            </div>
          )}

          {/* Notification Tab */}
          {TABS[activeTab].key === 'notification' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div
                style={{
                  gridColumn: '1/-1',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#374151',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                Channels
              </div>
              <Switch
                label="Email Notifications"
                checked={notifSettings.emailEnabled}
                onChange={v =>
                  setNotifSettings(s => ({ ...s, emailEnabled: v }))
                }
              />
              <Switch
                label="SMS Notifications"
                checked={notifSettings.smsEnabled}
                onChange={v => setNotifSettings(s => ({ ...s, smsEnabled: v }))}
              />
              <Switch
                label="Push Notifications"
                checked={notifSettings.pushEnabled}
                onChange={v =>
                  setNotifSettings(s => ({ ...s, pushEnabled: v }))
                }
              />
              <div
                style={{
                  gridColumn: '1/-1',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#374151',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #f3f4f6',
                  marginTop: '0.5rem',
                }}
              >
                Events
              </div>
              <Switch
                label="Leave Submitted"
                checked={notifSettings.leaveSubmitted}
                onChange={v =>
                  setNotifSettings(s => ({ ...s, leaveSubmitted: v }))
                }
              />
              <Switch
                label="Leave Approved"
                checked={notifSettings.leaveApproved}
                onChange={v =>
                  setNotifSettings(s => ({ ...s, leaveApproved: v }))
                }
              />
              <Switch
                label="Leave Rejected"
                checked={notifSettings.leaveRejected}
                onChange={v =>
                  setNotifSettings(s => ({ ...s, leaveRejected: v }))
                }
              />
              <Switch
                label="Biometric Missing"
                checked={notifSettings.biometricMissing}
                onChange={v =>
                  setNotifSettings(s => ({ ...s, biometricMissing: v }))
                }
              />
              <Switch
                label="Leave Balance Low Alert"
                checked={notifSettings.balanceLow}
                onChange={v => setNotifSettings(s => ({ ...s, balanceLow: v }))}
              />
            </div>
          )}

          {/* Attendance Sync Tab */}
          {TABS[activeTab].key === 'attendance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Switch
                label="Automatic Daily Sync"
                checked={biometricSettings.autoSync}
                onChange={v =>
                  setBiometricSettings(s => ({ ...s, autoSync: v }))
                }
              />
              <TextBox
                label="Sync Interval (minutes)"
                value={biometricSettings.syncInterval}
                onChange={v =>
                  setBiometricSettings(s => ({ ...s, syncInterval: v }))
                }
                placeholder="15"
              />
              <div className="flex gap-3" style={{ gridColumn: '1/-1' }}>
                <Button
                  label="Sync Now"
                  icon="refresh"
                  variant="primary"
                  onClick={() =>
                    ToastService.success('Attendance sync initiated.')
                  }
                />
                <Button
                  label="View Sync Log"
                  icon="list"
                  variant="outlined"
                  onClick={() => ToastService.success('Viewing sync log...')}
                />
              </div>
            </div>
          )}

          {/* Biometric Integration Tab */}
          {TABS[activeTab].key === 'biometric' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TextBox
                label="Biometric Device IP"
                value={biometricSettings.deviceIp}
                onChange={v =>
                  setBiometricSettings(s => ({ ...s, deviceIp: v }))
                }
                placeholder="192.168.x.x"
              />
              <TextBox
                label="Sync Interval (minutes)"
                value={biometricSettings.syncInterval}
                onChange={v =>
                  setBiometricSettings(s => ({ ...s, syncInterval: v }))
                }
                placeholder="15"
              />
              <Switch
                label="Alert on Missing Sync"
                checked={biometricSettings.missingSyncAlert}
                onChange={v =>
                  setBiometricSettings(s => ({ ...s, missingSyncAlert: v }))
                }
              />
              <div className="flex gap-3" style={{ gridColumn: '1/-1' }}>
                <Button
                  label="Test Connection"
                  icon="wifi"
                  variant="primary"
                  onClick={() => ToastService.success('Connection successful!')}
                />
                <Button
                  label="Force Sync"
                  icon="sync"
                  variant="outlined"
                  onClick={() =>
                    ToastService.success('Biometric sync started.')
                  }
                />
              </div>
            </div>
          )}

          {/* Email Templates Tab */}
          {TABS[activeTab].key === 'email' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {[
                'Leave Submitted Notification',
                'Leave Approved Notification',
                'Leave Rejected Notification',
                'Biometric Missing Alert',
                'LTC Approval Notification',
              ].map(template => (
                <div
                  key={template}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#111827',
                      }}
                    >
                      {template}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        marginTop: 2,
                      }}
                    >
                      Last edited: 15 Jun 2024
                    </p>
                  </div>
                  <Button
                    label="Edit Template"
                    icon="pencil"
                    size="small"
                    variant="outlined"
                    onClick={() => ToastService.success(`Editing: ${template}`)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Role Permissions Tab */}
          {TABS[activeTab].key === 'roles' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {[
                    'Role',
                    'Approve Leave',
                    'Reject Leave',
                    'Create Leave',
                    'Export Reports',
                  ].map(h => (
                    <th
                      key={h}
                      style={{
                        fontSize: '0.688rem',
                        fontWeight: 600,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid #e5e7eb',
                        textAlign: 'left',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map(p => (
                  <tr key={p.role}>
                    <td
                      style={{
                        padding: '0.625rem 0.75rem',
                        borderBottom: '1px solid #f3f4f6',
                        fontWeight: 600,
                        fontSize: '0.813rem',
                      }}
                    >
                      {p.role}
                    </td>
                    {[p.canApprove, p.canReject, p.canCreate, p.canExport].map(
                      (val, i) => (
                        <td
                          key={i}
                          style={{
                            padding: '0.625rem 0.75rem',
                            borderBottom: '1px solid #f3f4f6',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.125rem 0.5rem',
                              borderRadius: 9999,
                              fontSize: '0.688rem',
                              fontWeight: 600,
                              background: val ? '#dcfce7' : '#fee2e2',
                              color: val ? '#15803d' : '#b91c1c',
                            }}
                          >
                            {val ? 'Yes' : 'No'}
                          </span>
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-end mt-6">
            <Button
              label="Save Settings"
              icon="save"
              variant="primary"
              onClick={handleSave}
            />
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}
