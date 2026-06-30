import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel, StatusBadge } from 'shared/new-components';
import { type EmergencyContactType, emergencyContactTypes as initialData } from '../../../mocks';
import { smsUrls } from '../../../urls';

type PopupState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; item: EmergencyContactType } | { mode: 'view'; item: EmergencyContactType };
const STATUS_OPTIONS = [{ name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
const EMPTY: Partial<EmergencyContactType> = { typeName: '', description: '', priority: 1, status: 'Active' };

export default function EmergencyContactTypeMaster() {
  const [data, setData] = useState<EmergencyContactType[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<EmergencyContactType>>(EMPTY);

  const close = useCallback(() => { setPopup({ mode: 'closed' }); setForm(EMPTY); }, []);

  const handleSave = () => {
    if (!form.typeName) { ToastService.error('Type Name is required.'); return; }
    if (popup.mode === 'create') {
      setData(prev => [...prev, { ...form, id: String(Date.now()) } as EmergencyContactType]);
      ToastService.success('Emergency contact type created.');
    } else if (popup.mode === 'edit') {
      setData(prev => prev.map(d => d.id === (popup as any).item.id ? { ...d, ...form } as EmergencyContactType : d));
      ToastService.success('Emergency contact type updated.');
    }
    close();
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Emergency Contact Type Master"
      description="Manage types of emergency contacts for security management."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Emergency Contact Types' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'typeName', header: 'Type Name' },
            { field: 'description', header: 'Description' },
            { field: 'priority', header: 'Priority Order' },
            {
              field: 'status', header: 'Status',
              cell: (item: EmergencyContactType) => <StatusBadge label={item.status} variant={item.status === 'Active' ? 'approved' : 'rejected'} />,
            },
            {
              field: 'id', header: 'Actions', sortable: false,
              cell: (item: EmergencyContactType) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" label="" icon="eye" variant="outlined" onClick={() => { setForm(item); setPopup({ mode: 'view', item }); }} />
                  <Button size="small" label="" icon="pencil" variant="outlined" onClick={() => { setForm(item); setPopup({ mode: 'edit', item }); }} />
                  <Button size="small" label="" icon="trash" variant="danger" onClick={() => { setData(prev => prev.filter(d => d.id !== item.id)); ToastService.success('Deleted.'); }} />
                </div>
              ),
            },
          ]}
          toolbar={<Button label="Add Contact Type" icon="plus" variant="primary" onClick={() => { setForm(EMPTY); setPopup({ mode: 'create' }); }} />}
          searchBox searchPlaceholder="Search contact types..."
        />
      </FormCard>

      <FormPopup visible={popup.mode !== 'closed'} onHide={close}
        title={popup.mode === 'create' ? 'Add Emergency Contact Type' : popup.mode === 'edit' ? 'Edit Contact Type' : 'View Contact Type'}
        subtitle="Configure emergency contact type details." size="lg"
      >
        <FormGrid columns={2}>
          <TextBox label="Type Name" placeholder="e.g. Medical Emergency" value={form.typeName ?? ''} onChange={v => setForm(f => ({ ...f, typeName: v }))} required disabled={isReadOnly} />
          <TextBox label="Priority Order" placeholder="1=Highest" value={String(form.priority ?? '')} onChange={v => setForm(f => ({ ...f, priority: Number(v) }))} disabled={isReadOnly} />
          <DropDownList label="Status" data={STATUS_OPTIONS} textField="name" optionValue="value" value={form.status} onChange={v => setForm(f => ({ ...f, status: v as any }))} disabled={isReadOnly} />
        </FormGrid>
        <TextArea label="Description" placeholder="Description of this contact type" value={form.description ?? ''} onChange={v => setForm(f => ({ ...f, description: v }))} disabled={isReadOnly} rows={2} />
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
