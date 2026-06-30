import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel, StatusBadge } from 'shared/new-components';
import { type Building, buildings as initialData } from '../../../mocks';
import { smsUrls } from '../../../urls';

type PopupState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; item: Building } | { mode: 'view'; item: Building };
const STATUS_OPTIONS = [{ name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
const CAMPUS_OPTIONS = [
  { name: 'Main Campus', value: 'Main Campus' },
  { name: 'Hostel Zone', value: 'Hostel Zone' },
  { name: 'Sports Zone', value: 'Sports Zone' },
  { name: 'Research Campus', value: 'Research Campus' },
];
const EMPTY: Partial<Building> = { buildingName: '', buildingCode: '', campus: 'Main Campus', floors: 1, status: 'Active' };

export default function BuildingMaster() {
  const [data, setData] = useState<Building[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Building>>(EMPTY);

  const close = useCallback(() => { setPopup({ mode: 'closed' }); setForm(EMPTY); }, []);

  const handleSave = () => {
    if (!form.buildingName || !form.buildingCode) { ToastService.error('Building Name and Code are required.'); return; }
    if (popup.mode === 'create') {
      setData(prev => [...prev, { ...form, id: String(Date.now()) } as Building]);
      ToastService.success('Building created.');
    } else if (popup.mode === 'edit') {
      setData(prev => prev.map(d => d.id === (popup as any).item.id ? { ...d, ...form } as Building : d));
      ToastService.success('Building updated.');
    }
    close();
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Building Master"
      description="Manage campus buildings for incident location tracking."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Building Master' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'buildingName', header: 'Building Name' },
            { field: 'buildingCode', header: 'Code' },
            { field: 'campus', header: 'Campus' },
            { field: 'floors', header: 'Floors' },
            {
              field: 'status', header: 'Status',
              cell: (item: Building) => <StatusBadge label={item.status} variant={item.status === 'Active' ? 'approved' : 'rejected'} />,
            },
            {
              field: 'id', header: 'Actions', sortable: false,
              cell: (item: Building) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" label="" icon="eye" variant="outlined" onClick={() => { setForm(item); setPopup({ mode: 'view', item }); }} />
                  <Button size="small" label="" icon="pencil" variant="outlined" onClick={() => { setForm(item); setPopup({ mode: 'edit', item }); }} />
                  <Button size="small" label="" icon="trash" variant="danger" onClick={() => { setData(prev => prev.filter(d => d.id !== item.id)); ToastService.success('Deleted.'); }} />
                </div>
              ),
            },
          ]}
          toolbar={<Button label="Add Building" icon="plus" variant="primary" onClick={() => { setForm(EMPTY); setPopup({ mode: 'create' }); }} />}
          searchBox searchPlaceholder="Search buildings..."
        />
      </FormCard>

      <FormPopup visible={popup.mode !== 'closed'} onHide={close}
        title={popup.mode === 'create' ? 'Add Building' : popup.mode === 'edit' ? 'Edit Building' : 'View Building'}
        subtitle="Configure campus building details." size="lg"
      >
        <FormGrid columns={2}>
          <TextBox label="Building Name" placeholder="e.g. Engineering Block" value={form.buildingName ?? ''} onChange={v => setForm(f => ({ ...f, buildingName: v }))} required disabled={isReadOnly} />
          <TextBox label="Building Code" placeholder="e.g. ENB" value={form.buildingCode ?? ''} onChange={v => setForm(f => ({ ...f, buildingCode: v }))} required disabled={isReadOnly} />
          <DropDownList label="Campus" data={CAMPUS_OPTIONS} textField="name" optionValue="value" value={form.campus} onChange={v => setForm(f => ({ ...f, campus: v as string }))} disabled={isReadOnly} />
          <TextBox label="Number of Floors" placeholder="e.g. 4" value={String(form.floors ?? '')} onChange={v => setForm(f => ({ ...f, floors: Number(v) }))} disabled={isReadOnly} />
          <DropDownList label="Status" data={STATUS_OPTIONS} textField="name" optionValue="value" value={form.status} onChange={v => setForm(f => ({ ...f, status: v as any }))} disabled={isReadOnly} />
        </FormGrid>
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
