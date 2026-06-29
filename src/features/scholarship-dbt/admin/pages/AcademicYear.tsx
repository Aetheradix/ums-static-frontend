import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

interface Session {
  year: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Closed' | 'Upcoming';
}

export default function AdminAcademicYear() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      year: '2025-26',
      startDate: '01 Jul 2025',
      endDate: '31 Oct 2025',
      status: 'Active',
    },
    {
      year: '2024-25',
      startDate: '01 Jul 2024',
      endDate: '30 Nov 2024',
      status: 'Closed',
    },
  ]);

  const [year, setYear] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleAdd = () => {
    if (!year || !start || !end) {
      ToastService.error('All fields are required.');
      return;
    }
    setSessions([
      ...sessions,
      { year, startDate: start, endDate: end, status: 'Upcoming' },
    ]);
    setYear('');
    setStart('');
    setEnd('');
    ToastService.success('Academic session added.');
  };

  const handleToggle = (y: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.year === y) {
          return {
            ...s,
            status:
              s.status === 'Active' ? ('Closed' as const) : ('Active' as const),
          };
        }
        return s;
      })
    );
    ToastService.success('Session status updated.');
  };

  return (
    <FormPage
      title="Academic Year Sessions"
      description="Manage active intake sessions, application dates and timelines."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Admin Portal', to: dbtUrls.admin.portal },
        { label: 'Academic Year' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Academic Sessions">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Start Date</th>
                  <th>Closing Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.year}>
                    <td style={{ fontWeight: 700 }}>{s.year}</td>
                    <td>{s.startDate}</td>
                    <td>{s.endDate}</td>
                    <td>
                      <span
                        className={`dbt-status-pill ${s.status.toLowerCase()}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <Button
                        label={
                          s.status === 'Active' ? 'Deactivate' : 'Activate'
                        }
                        variant="outlined"
                        size="small"
                        onClick={() => handleToggle(s.year)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard title="Create New Intake Session">
          <TextBox
            label="Session Year (e.g. 2026-27)"
            value={year}
            onChange={setYear}
            required
          />
          <div style={{ marginTop: '0.75rem' }}>
            <TextBox
              label="Application Opening Date"
              value={start}
              onChange={setStart}
              required
            />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <TextBox
              label="Application Closing Date"
              value={end}
              onChange={setEnd}
              required
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Button
              label="Add Intake Session"
              variant="primary"
              onClick={handleAdd}
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
