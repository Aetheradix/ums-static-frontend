import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
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

export default function ComposeEmail() {
  const navigate = useNavigate();

  const [recipientType, setRecipientType] =
    useState<RecipientType>('Employees');
  const [groupId, setGroupId] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [from, setFrom] = useState('registrar@univ.edu');

  const handleSend = () => {
    if (!subject.trim()) {
      ToastService.error('Please enter a subject.');
      return;
    }
    if (!body.trim()) {
      ToastService.error('Please enter the email body.');
      return;
    }
    if (recipientType === 'Group' && !groupId) {
      ToastService.error('Please select a group.');
      return;
    }
    ToastService.success('Email queued for delivery.');
    navigate(commUrls.admin.logs);
  };

  return (
    <FormPage
      title="Compose Email"
      description="Draft and send a bulk email to employees, students or a group."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Communication Management', to: commUrls.portal },
        { label: 'Communication Admin', to: commUrls.admin.portal },
        { label: 'Compose Email' },
      ]}
    >
      <FormCard title="New Email" icon="envelope">
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
          {recipientType === 'Group' ? (
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
          ) : (
            <TextBox
              label="From"
              placeholder="sender@univ.edu"
              value={from}
              onChange={setFrom}
            />
          )}
          {recipientType === 'Group' && (
            <TextBox
              label="From"
              placeholder="sender@univ.edu"
              value={from}
              onChange={setFrom}
            />
          )}
          <div className="col-span-full">
            <TextBox
              label="Subject"
              placeholder="Email subject line"
              value={subject}
              onChange={setSubject}
              required
              maxLength={200}
            />
          </div>
          <div className="col-span-full">
            <TextArea
              label="Body"
              placeholder="Compose the email message..."
              value={body}
              onChange={setBody}
              rows={8}
            />
          </div>
        </FormGrid>

        <FormActions
          saveLabel="Send Email"
          onSave={handleSend}
          onReset={() => navigate(commUrls.admin.dashboard)}
        />
      </FormCard>
    </FormPage>
  );
}
