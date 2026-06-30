import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { notificationTemplates } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Template = (typeof notificationTemplates)[0];

export default function NotificationTemplates() {
  const [list, setList] = useState<Template[]>(notificationTemplates);
  const [editId, setEditId] = useState<string | null>(null);
  const [event, setEvent] = useState('');
  const [channel, setChannel] = useState<'Email' | 'SMS' | 'Push'>('Email');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const reset = () => {
    setEditId(null);
    setEvent('');
    setChannel('Email');
    setSubject('');
    setBody('');
  };

  const handleEdit = (t: Template) => {
    setEditId(t.id);
    setEvent(t.event);
    setChannel(t.channel);
    setSubject(t.subject);
    setBody(t.body);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(t => t.id !== id));
    ToastService.success('Notification template deleted.');
  };

  const handleToggle = (id: string) => {
    setList(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' }
          : t
      )
    );
    ToastService.success('Template status updated.');
  };

  const handleSave = () => {
    if (!event || !subject || !body) {
      ToastService.error('Required: Event Name, Subject, and Template Body.');
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(t =>
          t.id === editId ? { ...t, event, channel, subject, body } : t
        )
      );
      ToastService.success('Template configuration updated.');
    } else {
      const newT: Template = {
        id: `nt-${Date.now()}`,
        event,
        channel,
        subject,
        body,
        status: 'Active',
      };
      setList(prev => [...prev, newT]);
      ToastService.success('New system notification template created.');
    }
    reset();
  };

  const statusColor: Record<string, string> = {
    Active: 'approved',
    Inactive: 'draft',
  };
  const channelColor: Record<string, string> = {
    Email: '#3b82f6',
    SMS: '#10b981',
    Push: '#7c3aed',
  };

  return (
    <FormPage
      title="Notification Templates"
      description="Manage SMS, Email and Push notification triggers, parameters and message body contents."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Notification Templates' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="System Templates Registry">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Trigger Event</th>
                  <th>Channel</th>
                  <th>Subject Line</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700 }}>{t.event}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.688rem',
                          fontWeight: 700,
                          color: '#fff',
                          backgroundColor: channelColor[t.channel],
                          padding: '0.15rem 0.5rem',
                          borderRadius: 4,
                        }}
                      >
                        {t.channel}
                      </span>
                    </td>
                    <td
                      style={{
                        fontSize: '0.75rem',
                        color: '#4b5563',
                        maxWidth: 180,
                      }}
                    >
                      {t.subject}
                    </td>
                    <td>
                      <span
                        className={`dbt-status-pill ${statusColor[t.status]}`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(t)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #3b82f6',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.625rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(t.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #f59e0b',
                            background: '#fffbeb',
                            color: '#d97706',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.625rem',
                          }}
                        >
                          {t.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #ef4444',
                            background: '#fff',
                            color: '#b91c1c',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.625rem',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard
          title={editId ? 'Edit Message Template' : 'Create Message Template'}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Trigger Event (e.g. Proposal Rejected)"
              value={event}
              onChange={setEvent}
              required
            />
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Notification Channel
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
                value={channel}
                onChange={e => setChannel(e.target.value as any)}
              >
                <option value="Email">Email</option>
                <option value="SMS">SMS / Text Message</option>
                <option value="Push">Push Notification</option>
              </select>
            </div>
            <TextBox
              label="Subject / Short Heading"
              value={subject}
              onChange={setSubject}
              required
            />
            <TextArea
              label="Message Body Template"
              value={body}
              onChange={setBody}
              required
            />
            <div
              style={{
                padding: '0.5rem',
                background: '#f9fafb',
                borderRadius: 6,
                fontSize: '0.688rem',
                color: '#6b7280',
              }}
            >
              💡 Placeholders allowed: <code>{'{name}'}</code>,{' '}
              <code>{'{title}'}</code>, <code>{'{milestone}'}</code>,{' '}
              <code>{'{date}'}</code>, <code>{'{venue}'}</code>,{' '}
              <code>{'{doi}'}</code>.
            </div>
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <Button
                label={editId ? 'Update Template' : 'Save Template'}
                variant="primary"
                onClick={handleSave}
              />
              {editId && (
                <Button label="Cancel" variant="outlined" onClick={reset} />
              )}
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
