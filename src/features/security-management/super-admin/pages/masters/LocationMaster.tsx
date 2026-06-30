import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage, FormPopup, GridPanel, StatusBadge } from 'shared/new-components';
import { type Location, locations as initialData, buildings } from '../../../mocks';
import { smsUrls } from '../../../urls';

type PopupState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; item: Location } | { mode: 'view'; item: Location };
const STATUS_OPTIONS = [{ name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
const BUILDING_OPTIONS = buildings.map(b => ({ name: b.buildingName, value: b.buildingName }));
const FLOOR_OPTIONS = ['Ground', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', 'Terrace', 'Basement'].map(f => ({ name: f, value: f }));
const EMPTY: Partial<Location> = { locationName: '', buildingId: '', building: '', floor: 'Ground', description: '', status: 'Active' };

export default function LocationMaster() {
  const [data, setData] = useState<Location[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Location>>(EMPTY);

  const close = useCallback(() => { setPopup({ mode: 'closed' }); setForm(EMPTY); }, []);

  const handleSave = () => {
    if (!form.locationName || !form.building) { ToastService.error('Location Name and Building are required.'); return; }
    if (popup.mode === 'create') {
      setData(prev => [...prev, { ...form, id: String(Date.now()) } as Location]);
      ToastService.success('Location created.');
    } else if (popup.mode === 'edit') {
      setData(prev => prev.map(d => d.id === (popup as any).item.id ? { ...d, ...form } as Location : d));
      ToastService.success('Location updated.');
    }
    close();
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Location Master"
      description="Manage specific locations within campus buildings for incident reporting."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Location Master' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'locationName', header: 'Location Name' },
            { field: 'building', header: 'Building' },
            { field: 'floor', header: 'Floor' },
            { field: 'description', header: 'Description' },
            {
              field: 'status', header: 'Status',
              cell: (item: Location) => <StatusBadge label={item.status} variant={item.status === 'Active' ? 'approved' : 'rejected'} />,
            },
            {
              field: 'id', header: 'Actions', sortable: false,
              cell: (item: Location) => (
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Button size="small" label="" icon="eye" variant="outlined" onClick={() => { setForm(item); setPopup({ mode: 'view', item }); }} />
                  <Button size="small" label="" icon="pencil" variant="outlined" onClick={() => { setForm(item); setPopup({ mode: 'edit', item }); }} />
                  <Button size="small" label="" icon="trash" variant="danger" onClick={() => { setData(prev => prev.filter(d => d.id !== item.id)); ToastService.success('Deleted.'); }} />
                </div>
              ),
            },
          ]}
          toolbar={<Button label="Add Location" icon="plus" variant="primary" onClick={() => { setForm(EMPTY); setPopup({ mode: 'create' }); }} />}
          searchBox searchPlaceholder="Search locations..."
        />
      </FormCard>

      <FormPopup visible={popup.mode !== 'closed'} onHide={close}
        title={popup.mode === 'create' ? 'Add Location' : popup.mode === 'edit' ? 'Edit Location' : 'View Location'}
        subtitle="Configure location details within a building." size="lg"
      >
        <FormGrid columns={2}>
          <TextBox label="Location Name" placeholder="e.g. Chemistry Lab" value={form.locationName ?? ''} onChange={v => setForm(f => ({ ...f, locationName: v }))} required disabled={isReadOnly} />
          <DropDownList label="Building" data={BUILDING_OPTIONS} textField="name" optionValue="value" value={form.building} onChange={v => setForm(f => ({ ...f, building: v as string }))} disabled={isReadOnly} />
          <DropDownList label="Floor" data={FLOOR_OPTIONS} textField="name" optionValue="value" value={form.floor} onChange={v => setForm(f => ({ ...f, floor: v as string }))} disabled={isReadOnly} />
          <DropDownList label="Status" data={STATUS_OPTIONS} textField="name" optionValue="value" value={form.status} onChange={v => setForm(f => ({ ...f, status: v as any }))} disabled={isReadOnly} />
        </FormGrid>
        <TextArea label="Description" placeholder="Description of the location" value={form.description ?? ''} onChange={v => setForm(f => ({ ...f, description: v }))} disabled={isReadOnly} rows={2} />
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
