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
import { trainingAttendance, trainingSessions } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<string, 'approved' | 'pending' | 'rejected' | 'neutral'> = {
  'Present': 'approved',
  'Absent': 'rejected',
  'Late': 'pending',
  'Excused': 'neutral',
};

type PopupState = { mode: 'closed' } | { mode: 'qr' } | { mode: 'manual' } | { mode: 'edit'; item: any };

export default function AttendancePage() {
  const [data] = useState(trainingAttendance);
  const [sessionFilter, setSessionFilter] = useState('All');
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<any>({});

  const close = () => setPopup({ mode: 'closed' });

  return (
    <FormPage
      title="Training Attendance"
      description="Track session-wise attendance, QR check-ins and generate attendance reports."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Attendance' },
      ]}
    >
      <FormCard>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: 350 }}>
            <DropDownList
              label="Filter by Session"
              data={[
                { name: 'All Sessions', value: 'All' },
                ...trainingSessions.map(s => ({ name: `${s.trainingTitle} - ${s.date}`, value: s.sessionId }))
              ]}
              textField="name" optionValue="value"
              value={sessionFilter} onChange={v => setSessionFilter(v as string)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button label="Generate QR" icon="qr-code" variant="outlined" onClick={() => setPopup({ mode: 'qr' })} />
            <Button label="Mark Manual" icon="user-check" variant="primary" onClick={() => { setForm({}); setPopup({ mode: 'manual' }); }} />
          </div>
        </div>

        <GridPanel
          data={data.filter(d => sessionFilter === 'All' || d.sessionId === sessionFilter) as any[]}
          columns={[
            {
              field: 'participant', header: 'Participant',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600 }}>{item.participantName}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.participantId} • {item.department}</span>
                </div>
              ),
            },
            {
              field: 'session', header: 'Training Session',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.813rem', color: '#111827' }}>{item.trainingTitle}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Date: {item.date}</span>
                </div>
              ),
            },
            { field: 'punchIn', header: 'Punch In' },
            { field: 'punchOut', header: 'Punch Out' },
            {
              field: 'status', header: 'Status',
              cell: (item) => (
                <StatusBadge label={item.status} variant={STATUS_VARIANTS[item.status]} />
              ),
            },
            { field: 'remarks', header: 'Remarks' },
            {
              field: 'actions', header: 'Actions', sortable: false,
              cell: (item) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" icon="pencil" variant="outlined" label="" tooltip="Edit Attendance" onClick={() => { setForm(item); setPopup({ mode: 'edit', item }); }} />
                </div>
              ),
            },
          ]}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={popup.mode === 'qr' ? 'Generate QR Code' : popup.mode === 'manual' ? 'Mark Manual Attendance' : 'Edit Attendance'}
        size="default"
      >
        {popup.mode === 'qr' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
            <div style={{ width: 200, height: 200, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '5rem', color: '#9ca3af' }}>qr_code_2</span>
            </div>
            <p style={{ textAlign: 'center', color: '#4b5563' }}>Scan this QR code from the UMS App to register your attendance for the current session.</p>
          </div>
        )}
        {(popup.mode === 'manual' || popup.mode === 'edit') && (
          <>
            <FormGrid columns={1}>
              <TextBox label="Participant ID / Name" value={form.participantName ?? ''} onChange={v => setForm((f: any) => ({ ...f, participantName: v }))} required />
              <DropDownList label="Status" data={[{name: 'Present', value: 'Present'}, {name: 'Absent', value: 'Absent'}, {name: 'Late', value: 'Late'}]} textField="name" optionValue="value" value={form.status ?? 'Present'} onChange={v => setForm((f: any) => ({ ...f, status: v as string }))} />
              <TextBox label="Punch In Time" type="time" value={form.punchIn ?? ''} onChange={v => setForm((f: any) => ({ ...f, punchIn: v }))} />
              <TextBox label="Remarks" value={form.remarks ?? ''} onChange={v => setForm((f: any) => ({ ...f, remarks: v }))} />
            </FormGrid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <Button label="Cancel" variant="outlined" onClick={close} />
              <Button label="Save Attendance" variant="primary" icon="check" onClick={close} />
            </div>
          </>
        )}
      </FormPopup>
    </FormPage>
  );
}
