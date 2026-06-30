import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  TextArea,
  TextBox,
  DatePicker,
  FileUpload,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import {
  type AwarenessProgram,
  awarenessPrograms as initialData,
} from '../../../mocks';
import { smsUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: AwarenessProgram }
  | { mode: 'view'; item: AwarenessProgram };

const STATUS_OPTIONS = [
  { name: 'Upcoming', value: 'Upcoming' },
  { name: 'Ongoing', value: 'Ongoing' },
  { name: 'Completed', value: 'Completed' },
  { name: 'Cancelled', value: 'Cancelled' },
];
const DEPT_OPTIONS = [
  'All Departments',
  'Administration',
  'Computer Science',
  'Science',
  'Engineering',
].map(d => ({ name: d, value: d }));
const AUDIENCE_OPTIONS = [
  'All Staff & Students',
  'All Students & Faculty',
  'Faculty & Staff',
  'All Women Students & Staff',
  'Security Staff & Wardens',
].map(a => ({ name: a, value: a }));

const EMPTY: Partial<AwarenessProgram> = {
  programName: '',
  description: '',
  speaker: '',
  venue: '',
  date: '',
  time: '',
  department: 'All Departments',
  audience: 'All Staff & Students',
  attachments: '',
  status: 'Upcoming',
};

const getVariant = (status: string) => {
  switch (status) {
    case 'Upcoming':
      return 'pending';
    case 'Ongoing':
      return 'approved';
    case 'Completed':
      return 'neutral';
    case 'Cancelled':
      return 'rejected';
    default:
      return 'neutral';
  }
};

export default function AwarenessProgramManagement() {
  const [data, setData] = useState<AwarenessProgram[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<AwarenessProgram>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.programName || !form.date || !form.venue) {
      ToastService.error('Program Name, Date and Venue are required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as AwarenessProgram,
      ]);
      ToastService.success('Awareness program created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as AwarenessProgram)
            : d
        )
      );
      ToastService.success('Awareness program updated.');
    }
    close();
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Awareness Program Management"
      description="Create and manage safety awareness programs, drills and workshops."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Awareness Programs' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'programName', header: 'Program Name' },
            { field: 'speaker', header: 'Speaker' },
            { field: 'venue', header: 'Venue' },
            { field: 'date', header: 'Date' },
            { field: 'time', header: 'Time' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: AwarenessProgram) => (
                <StatusBadge
                  label={item.status}
                  variant={getVariant(item.status)}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: AwarenessProgram) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button
                    size="small"
                    label=""
                    icon="eye"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'view', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="pencil"
                    variant="outlined"
                    onClick={() => {
                      setForm(item);
                      setPopup({ mode: 'edit', item });
                    }}
                  />
                  <Button
                    size="small"
                    label=""
                    icon="trash"
                    variant="danger"
                    onClick={() => {
                      setData(prev => prev.filter(d => d.id !== item.id));
                      ToastService.success('Deleted.');
                    }}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create Program"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search programs..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Create Awareness Program'
            : popup.mode === 'edit'
              ? 'Edit Program'
              : 'Program Details'
        }
        subtitle="Configure awareness program details, speakers and audience."
        size="xl"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Program Name"
            placeholder="e.g. Annual Fire Drill 2024"
            value={form.programName ?? ''}
            onChange={v => setForm(f => ({ ...f, programName: v }))}
            required
            disabled={isReadOnly}
          />
          <TextBox
            label="Speaker"
            placeholder="e.g. Fire Officer Suresh Nair"
            value={form.speaker ?? ''}
            onChange={v => setForm(f => ({ ...f, speaker: v }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Venue"
            placeholder="e.g. Main Ground"
            value={form.venue ?? ''}
            onChange={v => setForm(f => ({ ...f, venue: v }))}
            required
            disabled={isReadOnly}
          />
          <DatePicker
            label="Date *"
            value={form.date ? new Date(form.date) : undefined}
            onChange={date =>
              setForm(f => ({
                ...f,
                date: date ? date.toISOString().split('T')[0] : '',
              }))
            }
            disabled={isReadOnly}
          />
          <TextBox
            label="Time"
            placeholder="e.g. 10:00 AM"
            value={form.time ?? ''}
            onChange={v => setForm(f => ({ ...f, time: v }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Department"
            data={DEPT_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.department}
            onChange={v => setForm(f => ({ ...f, department: v as string }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Audience"
            data={AUDIENCE_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.audience}
            onChange={v => setForm(f => ({ ...f, audience: v as string }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v as any }))}
            disabled={isReadOnly}
          />
          {isReadOnly ? (
            <TextBox
              label="Attachments"
              value={form.attachments ?? ''}
              disabled
            />
          ) : (
            <FileUpload
              label="Attachments"
              mode="file"
              accept=".pdf,.doc,.docx"
              value={form.attachments}
              onChange={file =>
                setForm(f => ({ ...f, attachments: file ? file.name : '' }))
              }
            />
          )}
        </FormGrid>
        <TextArea
          label="Description"
          placeholder="Detailed program description"
          value={form.description ?? ''}
          onChange={v => setForm(f => ({ ...f, description: v }))}
          disabled={isReadOnly}
          rows={3}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={
                popup.mode === 'create' ? 'Create Program' : 'Update Program'
              }
              variant="primary"
              icon="save"
              onClick={handleSave}
            />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
