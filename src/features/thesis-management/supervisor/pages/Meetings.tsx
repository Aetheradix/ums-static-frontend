import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { meetingLogs } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Meeting = (typeof meetingLogs)[0];

export default function SupervisorMeetings() {
  const [list, setList] = useState<Meeting[]>(meetingLogs);
  const [editId, setEditId] = useState<string | null>(null);
  const [scholar, setScholar] = useState('Rajesh Kumar Sahu');
  const [agenda, setAgenda] = useState('');
  const [date, setDate] = useState('');
  const [mode, setMode] = useState<'Offline' | 'Online'>('Offline');
  const [discussion, setDiscussion] = useState('');
  const [comments, setComments] = useState('');

  const reset = () => {
    setEditId(null);
    setAgenda('');
    setDate('');
    setDiscussion('');
    setComments('');
  };

  const handleSave = () => {
    if (!agenda || !date) {
      ToastService.error('Agenda and Date are required.');
      return;
    }
    if (editId) {
      setList(prev =>
        prev.map(m =>
          m.id === editId
            ? {
                ...m,
                agenda,
                date,
                mode,
                discussion,
                supervisorComments: comments,
              }
            : m
        )
      );
      ToastService.success('Meeting log updated.');
    } else {
      const newM: Meeting = {
        id: `sv-mt-${Date.now()}`,
        scholarId: 'sch-1',
        date,
        time: '11:00 AM',
        agenda,
        mode,
        discussion,
        supervisorComments: comments,
        actionItems: [],
        nextMeetingDate: '',
      };
      setList(prev => [newM, ...prev]);
      ToastService.success('Meeting logged successfully.');
    }
    reset();
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(m => m.id !== id));
    ToastService.success('Meeting log removed.');
  };

  return (
    <FormPage
      title="Advisory Meetings"
      description="Schedule and log advisory meetings with scholars. Record discussion notes, comments and action items."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Supervisor Portal', to: thesisUrls.supervisor.portal },
        { label: 'Meetings' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Meeting History">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Scholar</th>
                  <th>Agenda</th>
                  <th>Mode</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {m.date}
                    </td>
                    <td>Rajesh Sahu</td>
                    <td style={{ maxWidth: 200, fontSize: '0.75rem' }}>
                      {m.agenda}
                    </td>
                    <td>
                      <span
                        className={`dbt-status-pill ${m.mode === 'Offline' ? 'approved' : 'submitted'}`}
                      >
                        {m.mode}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditId(m.id);
                            setAgenda(m.agenda);
                            setDate(m.date);
                            setMode(m.mode);
                            setDiscussion(m.discussion);
                            setComments(m.supervisorComments);
                          }}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #3b82f6',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.688rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(m.id)}
                          style={{
                            padding: '0.2rem 0.5rem',
                            border: '1px solid #ef4444',
                            background: '#fff',
                            color: '#b91c1c',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: '0.688rem',
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
          title={editId ? 'Edit Meeting Log' : 'Log New Advisory Meeting'}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Scholar
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
                value={scholar}
                onChange={e => setScholar(e.target.value)}
              >
                <option>Rajesh Kumar Sahu</option>
                <option>Priya Verma</option>
                <option>Amit Khandelwal</option>
                <option>Sunita Chouhan</option>
              </select>
            </div>
            <TextBox
              label="Meeting Date"
              value={date}
              onChange={setDate}
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
                Mode
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
                value={mode}
                onChange={e => setMode(e.target.value as any)}
              >
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
              </select>
            </div>
            <TextBox
              label="Meeting Agenda"
              value={agenda}
              onChange={setAgenda}
              required
            />
            <TextArea
              label="Discussion Summary"
              value={discussion}
              onChange={setDiscussion}
            />
            <TextArea
              label="Supervisor Comments"
              value={comments}
              onChange={setComments}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                label={editId ? 'Update Log' : 'Save Log'}
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
