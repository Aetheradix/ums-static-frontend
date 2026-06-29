import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type TrainingSession, trainingSessions } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<
  string,
  'approved' | 'pending' | 'rejected' | 'neutral'
> = {
  Completed: 'approved',
  Ongoing: 'pending',
  Scheduled: 'neutral',
  Cancelled: 'rejected',
};

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: TrainingSession }
  | { mode: 'view'; item: TrainingSession };
const EMPTY: Partial<TrainingSession> = {
  topic: '',
  status: 'Scheduled',
  attendanceCount: 0,
  totalParticipants: 0,
};

export default function TrainingSessionsPage() {
  const [data] = useState(trainingSessions);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<TrainingSession>>({});

  const close = () => setPopup({ mode: 'closed' });
  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Training Sessions"
      description="Manage individual sessions, attendance and topics for all training programmes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Sessions' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            { field: 'sessionId', header: 'Session ID' },
            {
              field: 'training',
              header: 'Training Programme',
              cell: item => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600 }}>{item.trainingTitle}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    ID: {item.trainingId} • Session {item.sessionNo}
                  </span>
                </div>
              ),
            },
            {
              field: 'topic',
              header: 'Topic & Trainer',
              cell: item => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.813rem', color: '#111827' }}>
                    {item.topic}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.trainer}
                  </span>
                </div>
              ),
            },
            {
              field: 'schedule',
              header: 'Schedule & Venue',
              cell: item => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.813rem', color: '#111827' }}>
                    {item.date}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.startTime} - {item.endTime} • {item.venue}
                  </span>
                </div>
              ),
            },
            {
              field: 'attendance',
              header: 'Attendance',
              cell: item => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      flex: 1,
                      background: '#f3f4f6',
                      height: 6,
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background: '#3b82f6',
                        width: `${(item.attendanceCount / item.totalParticipants) * 100}%`,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {item.attendanceCount}/{item.totalParticipants}
                  </span>
                </div>
              ),
            },
            {
              field: 'status',
              header: 'Status',
              cell: item => (
                <StatusBadge
                  label={item.status}
                  variant={STATUS_VARIANTS[item.status]}
                />
              ),
            },
            {
              field: 'actions',
              header: 'Actions',
              sortable: false,
              cell: item => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    icon="eye"
                    variant="outlined"
                    label=""
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'view', item });
                    }}
                  />
                  <Button
                    size="small"
                    icon="pencil"
                    variant="primary"
                    label=""
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'edit', item });
                    }}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add New Session"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Schedule New Session'
            : popup.mode === 'edit'
              ? 'Edit Session'
              : 'Session Details'
        }
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Topic"
            value={form.topic ?? ''}
            onChange={v => setForm(f => ({ ...f, topic: v }))}
            required
            readOnly={isReadOnly}
          />
          <TextBox
            label="Trainer Name"
            value={form.trainer ?? ''}
            onChange={v => setForm(f => ({ ...f, trainer: v }))}
            required
            readOnly={isReadOnly}
          />
          <TextBox
            label="Date"
            type="date"
            value={form.date ?? ''}
            onChange={v => setForm(f => ({ ...f, date: v }))}
            required
            readOnly={isReadOnly}
          />
          <TextBox
            label="Start Time"
            type="time"
            value={form.startTime ?? ''}
            onChange={v => setForm(f => ({ ...f, startTime: v }))}
            required
            readOnly={isReadOnly}
          />
          <TextBox
            label="End Time"
            type="time"
            value={form.endTime ?? ''}
            onChange={v => setForm(f => ({ ...f, endTime: v }))}
            required
            readOnly={isReadOnly}
          />
          <TextBox
            label="Venue"
            value={form.venue ?? ''}
            onChange={v => setForm(f => ({ ...f, venue: v }))}
            required
            readOnly={isReadOnly}
          />
          <DropDownList
            label="Status"
            data={[
              { name: 'Scheduled', value: 'Scheduled' },
              { name: 'Ongoing', value: 'Ongoing' },
              { name: 'Completed', value: 'Completed' },
            ]}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v =>
              setForm(f => ({ ...f, status: v as TrainingSession['status'] }))
            }
            disabled={isReadOnly}
          />
        </FormGrid>
        {!isReadOnly && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '2rem',
            }}
          >
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label="Save Session"
              variant="primary"
              icon="check"
              onClick={close}
            />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
