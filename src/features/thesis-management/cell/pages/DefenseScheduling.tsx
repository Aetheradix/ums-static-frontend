import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { defenseSchedules } from '../../mocks';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

type Defense = (typeof defenseSchedules)[0];

export default function DefenseScheduling() {
  const [list, setList] = useState<Defense[]>(defenseSchedules);
  const [scholar, setScholar] = useState('Sunita Chouhan');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [chairperson, setChairperson] = useState('');
  const [external, setExternal] = useState('');
  const [internal, setInternal] = useState('');

  const handleSchedule = () => {
    if (!date || !venue) {
      ToastService.error('Date and Venue are required.');
      return;
    }
    const newD: Defense = {
      id: `ds-${Date.now()}`,
      scholarId: 'sch-new',
      scholarName: scholar,
      date,
      time,
      venue,
      chairperson,
      externalExaminer: external,
      internalExaminer: internal,
      status: 'Scheduled',
    };
    setList(prev => [...prev, newD]);
    ToastService.success(
      `Viva defense scheduled for ${scholar} on ${date}. All stakeholders notified.`
    );
    setDate('');
    setTime('');
    setVenue('');
    setChairperson('');
    setExternal('');
    setInternal('');
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(d => d.id !== id));
    ToastService.success('Defense schedule cancelled.');
  };

  const statusColor: Record<string, string> = {
    Scheduled: 'submitted',
    Completed: 'approved',
    Postponed: 'draft',
    Cancelled: 'rejected',
  };

  return (
    <FormPage
      title="Defense Scheduling"
      description="Schedule viva defense dates, assign venues and jury panel, and notify all stakeholders."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Research Cell', to: thesisUrls.cell.portal },
        { label: 'Defense Scheduling' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.4fr 1fr' }}
      >
        <FormCard title="Scheduled Viva Defenses">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Scholar</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                  <th>Chairperson</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 700 }}>{d.scholarName}</td>
                    <td style={{ fontWeight: 600 }}>{d.date}</td>
                    <td>{d.time}</td>
                    <td style={{ fontSize: '0.75rem' }}>{d.venue}</td>
                    <td style={{ fontSize: '0.75rem' }}>{d.chairperson}</td>
                    <td>
                      <span
                        className={`dbt-status-pill ${statusColor[d.status]}`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDelete(d.id)}
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
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard title="Schedule New Viva Defense">
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
                <option>Sunita Chouhan</option>
                <option>Priya Verma</option>
                <option>Rajesh Kumar Sahu</option>
              </select>
            </div>
            <TextBox
              label="Viva Date (e.g. 18 Aug 2026)"
              value={date}
              onChange={setDate}
              required
            />
            <TextBox
              label="Time (e.g. 11:30 AM)"
              value={time}
              onChange={setTime}
            />
            <TextBox label="Venue" value={venue} onChange={setVenue} required />
            <TextBox
              label="Chairperson"
              value={chairperson}
              onChange={setChairperson}
            />
            <TextBox
              label="External Examiner"
              value={external}
              onChange={setExternal}
            />
            <TextBox
              label="Internal Examiner"
              value={internal}
              onChange={setInternal}
            />
            <Button
              label="Schedule Defense & Notify All"
              variant="primary"
              onClick={handleSchedule}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
