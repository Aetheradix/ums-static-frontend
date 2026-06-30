import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, TextArea } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { meetingLogs } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Meeting = (typeof meetingLogs)[0];

export default function MeetingLogs() {
  const [list, setList] = useState<Meeting[]>(
    meetingLogs.filter(m => m.scholarId === 'sch-1')
  );
  const [editId, setEditId] = useState<string | null>(null);
  const [agenda, setAgenda] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState<'Offline' | 'Online'>('Offline');
  const [discussion, setDiscussion] = useState('');
  const [comments, setComments] = useState('');
  const [nextDate, setNextDate] = useState('');

  const reset = () => {
    setEditId(null);
    setAgenda('');
    setDate('');
    setTime('');
    setMode('Offline');
    setDiscussion('');
    setComments('');
    setNextDate('');
  };

  const handleEdit = (m: Meeting) => {
    setEditId(m.id);
    setAgenda(m.agenda);
    setDate(m.date);
    setTime(m.time);
    setMode(m.mode);
    setDiscussion(m.discussion);
    setComments(m.supervisorComments);
    setNextDate(m.nextMeetingDate);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(m => m.id !== id));
    ToastService.success('Meeting log removed.');
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
                time,
                mode,
                discussion,
                supervisorComments: comments,
                nextMeetingDate: nextDate,
              }
            : m
        )
      );
      ToastService.success('Meeting log updated.');
    } else {
      const newM: Meeting = {
        id: `mt-${Date.now()}`,
        scholarId: 'sch-1',
        date,
        time,
        agenda,
        mode,
        discussion,
        supervisorComments: comments,
        actionItems: [],
        nextMeetingDate: nextDate,
      };
      setList(prev => [newM, ...prev]);
      ToastService.success('Meeting log added.');
    }
    reset();
  };

  return (
    <FormPage
      title="Meeting Logs"
      description="Log advisory meetings with guide, record discussion notes and action items."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Student Portal', to: thesisUrls.student.portal },
        { label: 'Meeting Logs' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Advisory Meeting History">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Agenda</th>
                  <th>Mode</th>
                  <th>Next Meet</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {m.date}
                    </td>
                    <td style={{ maxWidth: 220, fontSize: '0.813rem' }}>
                      {m.agenda}
                    </td>
                    <td>
                      <span
                        className={`dbt-status-pill ${m.mode === 'Offline' ? 'approved' : 'submitted'}`}
                      >
                        {m.mode}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                      {m.nextMeetingDate}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(m)}
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

        <FormCard title={editId ? 'Edit Meeting Log' : 'Add New Meeting Log'}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Meeting Agenda"
              value={agenda}
              onChange={setAgenda}
              required
            />
            <TextBox
              label="Meeting Date (e.g. 07 Jul 2026)"
              value={date}
              onChange={setDate}
              required
            />
            <TextBox
              label="Time (e.g. 11:30 AM)"
              value={time}
              onChange={setTime}
            />
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Meeting Mode
              </label>
              <select
                className="dbt-filter-select"
                style={{ width: '100%', marginTop: 4, height: 38 }}
                value={mode}
                onChange={e => setMode(e.target.value as any)}
              >
                <option value="Offline">Offline (Cabin Visit)</option>
                <option value="Online">Online (MS Teams / Zoom)</option>
              </select>
            </div>
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
            <TextBox
              label="Next Meeting Date"
              value={nextDate}
              onChange={setNextDate}
            />
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
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
