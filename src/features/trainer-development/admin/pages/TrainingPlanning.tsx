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
import { type TrainingProgram, trainingPrograms } from '../../mocks';
import { tdmUrls } from '../../urls';

const STATUS_VARIANTS: Record<string, 'approved' | 'pending' | 'rejected' | 'neutral' | 'ongoing'> = {
  'Completed': 'approved',
  'Ongoing': 'ongoing',
  'Scheduled': 'pending',
  'Planned': 'neutral',
  'Cancelled': 'rejected',
  'Postponed': 'neutral',
};

type PopupState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; item: TrainingProgram } | { mode: 'view'; item: TrainingProgram };
const EMPTY: Partial<TrainingProgram> = { title: '', category: 'FDP', type: 'FDP', mode: 'Offline', status: 'Planned' };

export default function TrainingPlanningPage() {
  const [data] = useState(trainingPrograms);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<TrainingProgram>>({});

  const close = () => setPopup({ mode: 'closed' });
  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Training Planning & Programmes"
      description="Create and plan new training programmes, assign trainers and define budgets."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Training Planning' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data as any[]}
          columns={[
            { field: 'trainingId', header: 'Training ID' },
            {
              field: 'title', header: 'Programme Details',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontWeight: 600 }}>{item.title}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.category} • {item.type} • {item.mode}
                  </span>
                </div>
              ),
            },
            {
              field: 'trainer', header: 'Trainer & Dept',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: '0.813rem', color: '#374151' }}>{item.trainer}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.department}</span>
                </div>
              ),
            },
            {
              field: 'date', header: 'Schedule',
              cell: (item) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: '0.813rem', color: '#374151' }}>{item.startDate} to {item.endDate}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.startTime} - {item.endTime} ({item.duration}h)</span>
                </div>
              ),
            },
            {
              field: 'status', header: 'Status',
              cell: (item) => (
                <StatusBadge label={item.status} variant={STATUS_VARIANTS[item.status] as any} />
              ),
            },
            {
              field: 'approvalStatus', header: 'Approval',
              cell: (item) => (
                <StatusBadge label={item.approvalStatus} variant={item.approvalStatus === 'Approved' ? 'approved' : item.approvalStatus === 'Pending' ? 'pending' : 'rejected'} />
              ),
            },
            {
              field: 'actions', header: 'Actions', sortable: false,
              cell: (item) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" icon="eye" variant="outlined" label="" onClick={() => { setForm(item); setPopup({ mode: 'view', item }); }} />
                  <Button size="small" icon="pencil" variant="primary" label="" onClick={() => { setForm(item); setPopup({ mode: 'edit', item }); }} />
                </div>
              ),
            },
          ]}
          toolbar={<Button label="Plan New Training" icon="plus" variant="primary" onClick={() => { setForm(EMPTY); setPopup({ mode: 'create' }); }} />}
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={popup.mode === 'create' ? 'Plan New Training' : popup.mode === 'edit' ? 'Edit Training Plan' : 'Training Plan Details'}
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox label="Programme Title" value={form.title ?? ''} onChange={v => setForm(f => ({ ...f, title: v }))} required readOnly={isReadOnly} />
          <DropDownList label="Category" data={[{name: 'FDP', value: 'FDP'}, {name: 'Workshop', value: 'Workshop'}]} textField="name" optionValue="value" value={form.category} onChange={v => setForm(f => ({ ...f, category: v as string }))} disabled={isReadOnly} />
          <DropDownList label="Type" data={[{name: 'FDP', value: 'FDP'}, {name: 'Workshop', value: 'Workshop'}, {name: 'Seminar', value: 'Seminar'}]} textField="name" optionValue="value" value={form.type} onChange={v => setForm(f => ({ ...f, type: v as TrainingProgram['type'] }))} disabled={isReadOnly} />
          <DropDownList label="Mode" data={[{name: 'Offline', value: 'Offline'}, {name: 'Online', value: 'Online'}, {name: 'Hybrid', value: 'Hybrid'}]} textField="name" optionValue="value" value={form.mode} onChange={v => setForm(f => ({ ...f, mode: v as TrainingProgram['mode'] }))} disabled={isReadOnly} />
          <TextBox label="Trainer Name" value={form.trainer ?? ''} onChange={v => setForm(f => ({ ...f, trainer: v }))} readOnly={isReadOnly} />
          <TextBox label="Start Date" type="date" value={form.startDate ?? ''} onChange={v => setForm(f => ({ ...f, startDate: v }))} readOnly={isReadOnly} />
          <TextBox label="End Date" type="date" value={form.endDate ?? ''} onChange={v => setForm(f => ({ ...f, endDate: v }))} readOnly={isReadOnly} />
          <TextBox label="Budget (₹)" type="number" value={form.budget?.toString() ?? ''} onChange={v => setForm(f => ({ ...f, budget: Number(v) }))} readOnly={isReadOnly} />
        </FormGrid>
        {!isReadOnly && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button label="Save Plan" variant="primary" icon="check" onClick={close} />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
