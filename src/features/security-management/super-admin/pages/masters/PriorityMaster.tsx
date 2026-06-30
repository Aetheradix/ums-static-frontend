import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel, StatusBadge } from 'shared/new-components';
import { type Priority, priorities as initialData } from '../../../mocks';
import { smsUrls } from '../../../urls';

type PopupState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; item: Priority } | { mode: 'view'; item: Priority };
const STATUS_OPTIONS = [{ name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
const COLOR_OPTIONS = [
  { name: 'Green (Low)', value: '#22c55e' },
  { name: 'Amber (Medium)', value: '#f59e0b' },
  { name: 'Red (High)', value: '#ef4444' },
  { name: 'Purple (Critical)', value: '#7c3aed' },
];
const EMPTY: Partial<Priority> = { priorityName: '', level: 1, color: '#22c55e', description: '', status: 'Active' };

export default function PriorityMaster() {
  const [data, setData] = useState<Priority[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Priority>>(EMPTY);

  const close = useCallback(() => { setPopup({ mode: 'closed' }); setForm(EMPTY); }, []);

  const handleSave = () => {
    if (!form.priorityName) { ToastService.error('Priority Name is required.'); return; }
    if (popup.mode === 'create') {
      setData(prev => [...prev, { ...form, id: String(Date.now()) } as Priority]);
      ToastService.success('Priority created.');
    } else if (popup.mode === 'edit') {
      setData(prev => prev.map(d => d.id === (popup as any).item.id ? { ...d, ...form } as Priority : d));
      ToastService.success('Priority updated.');
    }
    close();
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Priority Master"
      description="Configure incident priority levels and their visual indicators."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Priority Master' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'priorityName', header: 'Priority Name' },
            { field: 'level', header: 'Level' },
            {
              field: 'color', header: 'Color',
              cell: (item: Priority) => (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                  {item.color}
                </span>
              ),
            },
            { field: 'description', header: 'Description' },
            {
              field: 'status', header: 'Status',
              cell: (item: Priority) => <StatusBadge label={item.status} variant={item.status === 'Active' ? 'approved' : 'rejected'} />,
            },
            {
              field: 'id', header: 'Actions', sortable: false,
              cell: (item: Priority) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" label="" icon="eye" variant="outlined" onClick={() => { setForm(item); setPopup({ mode: 'view', item }); }} />
                  <Button size="small" label="" icon="pencil" variant="outlined" onClick={() => { setForm(item); setPopup({ mode: 'edit', item }); }} />
                  <Button size="small" label="" icon="trash" variant="danger" onClick={() => { setData(prev => prev.filter(d => d.id !== item.id)); ToastService.success('Deleted.'); }} />
                </div>
              ),
            },
          ]}
          toolbar={<Button label="Add Priority" icon="plus" variant="primary" onClick={() => { setForm(EMPTY); setPopup({ mode: 'create' }); }} />}
          searchBox searchPlaceholder="Search priorities..."
        />
      </FormCard>

      <FormPopup visible={popup.mode !== 'closed'} onHide={close}
        title={popup.mode === 'create' ? 'Add Priority' : popup.mode === 'edit' ? 'Edit Priority' : 'View Priority'}
        subtitle="Configure priority level details." size="lg"
      >
        <FormGrid columns={2}>
          <TextBox label="Priority Name" placeholder="e.g. High" value={form.priorityName ?? ''} onChange={v => setForm(f => ({ ...f, priorityName: v }))} required disabled={isReadOnly} />
          <TextBox label="Level (1=Low, 4=Critical)" placeholder="1-4" value={String(form.level ?? '')} onChange={v => setForm(f => ({ ...f, level: Number(v) }))} disabled={isReadOnly} />
          <DropDownList label="Color" data={COLOR_OPTIONS} textField="name" optionValue="value" value={form.color} onChange={v => setForm(f => ({ ...f, color: v as string }))} disabled={isReadOnly} />
          <DropDownList label="Status" data={STATUS_OPTIONS} textField="name" optionValue="value" value={form.status} onChange={v => setForm(f => ({ ...f, status: v as any }))} disabled={isReadOnly} />
        </FormGrid>
        <TextArea label="Description" placeholder="Priority description" value={form.description ?? ''} onChange={v => setForm(f => ({ ...f, description: v }))} disabled={isReadOnly} rows={2} />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button label={popup.mode === 'create' ? 'Create' : 'Update'} variant="primary" icon="save" onClick={handleSave} />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
