import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { trainingAttendance, trainingSessions } from '../../mocks';
import { tdmUrls } from '../../urls';

export default function ExternalAttendancePage() {
  const [data] = useState(trainingAttendance);
  const [sessionFilter, setSessionFilter] = useState('All');

  return (
    <FormPage
      title="Attendance Management"
      description="Mark and manage participant attendance for your assigned sessions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'External Portal', to: tdmUrls.external.portal },
        { label: 'Attendance' },
      ]}
    >
      <FormCard>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 350 }}>
            <DropDownList
              label="Select Session"
              data={[
                { name: 'All My Sessions', value: 'All' },
                ...trainingSessions.map(s => ({
                  name: `${s.trainingTitle} - ${s.date}`,
                  value: s.sessionId,
                })),
              ]}
              textField="name"
              optionValue="value"
              value={sessionFilter}
              onChange={v => setSessionFilter(v as string)}
            />
          </div>
        </div>

        <GridPanel
          data={
            data.filter(
              d => sessionFilter === 'All' || d.sessionId === sessionFilter
            ) as any[]
          }
          columns={[
            {
              field: 'participant',
              header: 'Participant',
              cell: item => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600 }}>
                    {item.participantName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.participantId}
                  </span>
                </div>
              ),
            },
            {
              field: 'status',
              header: 'Attendance Status',
              cell: item => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    size="small"
                    variant={item.status === 'Present' ? 'primary' : 'outlined'}
                    label="Present"
                  />
                  <Button
                    size="small"
                    variant={item.status === 'Absent' ? 'danger' : 'outlined'}
                    label="Absent"
                  />
                </div>
              ),
            },
            {
              field: 'remarks',
              header: 'Remarks',
              cell: () => (
                <input
                  type="text"
                  placeholder="Optional remarks..."
                  style={{
                    padding: '0.25rem 0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: 4,
                    width: '100%',
                  }}
                />
              ),
            },
          ]}
          toolbar={
            <Button label="Save Attendance" icon="check" variant="primary" />
          }
        />
      </FormCard>
    </FormPage>
  );
}
