import { useState } from 'react';
import { NumberBox, TextBox } from 'shared/components/forms';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
} from 'shared/new-components';
import { ToastService } from 'services';
import { commUrls } from '../../urls';

const DEFAULTS = {
  smtpHost: 'smtp.univ.edu',
  smtpPort: 587,
  fromEmail: 'no-reply@univ.edu',
  smsGateway: 'MSG91',
  senderId: 'UNIVMSG',
};

export default function Settings() {
  const [smtpHost, setSmtpHost] = useState(DEFAULTS.smtpHost);
  const [smtpPort, setSmtpPort] = useState<number>(DEFAULTS.smtpPort);
  const [fromEmail, setFromEmail] = useState(DEFAULTS.fromEmail);
  const [smsGateway, setSmsGateway] = useState(DEFAULTS.smsGateway);
  const [senderId, setSenderId] = useState(DEFAULTS.senderId);

  const handleSave = () => {
    if (!smtpHost.trim() || !fromEmail.trim()) {
      ToastService.error('SMTP host and from-email are required.');
      return;
    }
    ToastService.success('Communication settings saved.');
  };

  const handleReset = () => {
    setSmtpHost(DEFAULTS.smtpHost);
    setSmtpPort(DEFAULTS.smtpPort);
    setFromEmail(DEFAULTS.fromEmail);
    setSmsGateway(DEFAULTS.smsGateway);
    setSenderId(DEFAULTS.senderId);
  };

  return (
    <FormPage
      title="Settings"
      description="Configure the SMTP server and SMS gateway used for bulk communications."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Communication Management', to: commUrls.portal },
        { label: 'Communication Admin', to: commUrls.admin.portal },
        { label: 'Settings' },
      ]}
    >
      <FormCard title="Email (SMTP)" icon="envelope">
        <FormGrid columns={2}>
          <TextBox
            label="SMTP Host"
            placeholder="smtp.example.com"
            value={smtpHost}
            onChange={setSmtpHost}
            required
          />
          <NumberBox
            label="SMTP Port"
            value={smtpPort}
            onChange={val => setSmtpPort(Number(val) || 0)}
            min={0}
          />
          <div className="col-span-full">
            <TextBox
              label="From Email"
              placeholder="no-reply@example.com"
              value={fromEmail}
              onChange={setFromEmail}
              required
            />
          </div>
        </FormGrid>
      </FormCard>

      <FormCard title="SMS Gateway" icon="comment">
        <FormGrid columns={2}>
          <TextBox
            label="Gateway Name"
            placeholder="e.g. MSG91"
            value={smsGateway}
            onChange={setSmsGateway}
          />
          <TextBox
            label="Sender ID"
            placeholder="e.g. UNIVMSG"
            value={senderId}
            onChange={setSenderId}
            maxLength={11}
          />
        </FormGrid>

        <FormActions
          saveLabel="Save Settings"
          onSave={handleSave}
          onReset={handleReset}
        />
      </FormCard>
    </FormPage>
  );
}
