import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DropDownList, TextArea } from 'shared/components/forms';
import {
  FormActions,
  FormCard,
  FormGrid,
  FormPage,
} from 'shared/new-components';
import { ToastService } from 'services';
import { groups, type RecipientType } from '../../mocks';
import { commUrls } from '../../urls';
import '../../Communication.css';

const RECIPIENT_OPTIONS = [
  { name: 'All Employees', value: 'Employees' },
  { name: 'All Students', value: 'Students' },
  { name: 'Group', value: 'Group' },
];

const SMS_SEGMENT = 160;

export default function ComposeSms() {
  const navigate = useNavigate();

  const [recipientType, setRecipientType] = useState<RecipientType>('Students');
  const [groupId, setGroupId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const segments = Math.max(1, Math.ceil(message.length / SMS_SEGMENT));

  const handleSend = () => {
    if (!message.trim()) {
      ToastService.error('Please enter the SMS message.');
      return;
    }
    if (recipientType === 'Group' && !groupId) {
      ToastService.error('Please select a group.');
      return;
    }
    ToastService.success('SMS queued for delivery.');
    navigate(commUrls.admin.logs);
  };

  return (
    <FormPage
      title="Compose SMS"
      description="Draft and send a bulk SMS to employees, students or a group."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Communication Management', to: commUrls.portal },
        { label: 'Communication Admin', to: commUrls.admin.portal },
        { label: 'Compose SMS' },
      ]}
    >
      <FormCard title="New SMS" icon="comment">
        <FormGrid columns={2}>
          <DropDownList
            label="Recipient Type"
            placeholder="Select recipients"
            data={RECIPIENT_OPTIONS}
            textField="name"
            valueField="value"
            value={recipientType}
            onChange={val => setRecipientType(val as RecipientType)}
            required
          />
          {recipientType === 'Group' && (
            <DropDownList
              label="Group"
              placeholder="Select a group"
              data={groups}
              textField="name"
              valueField="id"
              value={groupId}
              onChange={val => setGroupId(val as number)}
              required
            />
          )}
          <div className="col-span-full">
            <TextArea
              label={`Message (${message.length} chars • ${segments} segment${
                segments > 1 ? 's' : ''
              })`}
              placeholder="Type the SMS message..."
              value={message}
              onChange={setMessage}
              rows={5}
            />
          </div>
        </FormGrid>

        <FormActions
          saveLabel="Send SMS"
          onSave={handleSend}
          onReset={() => navigate(commUrls.admin.dashboard)}
        />
      </FormCard>
    </FormPage>
  );
}
