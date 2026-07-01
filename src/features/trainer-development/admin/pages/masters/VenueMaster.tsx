import { useCallback, useState } from 'react';
import { ToastService } from 'services';
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
import { type VenueMaster, venueMasters as initialData } from '../../../mocks';
import { tdmUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: VenueMaster }
  | { mode: 'view'; item: VenueMaster };

const EMPTY: Partial<VenueMaster> = {
  code: '',
  name: '',
  building: '',
  room: '',
  capacity: 30,
  facilities: [],
  status: 'Available',
};
const STATUS_OPTIONS = [
  { name: 'Available', value: 'Available' },
  { name: 'Occupied', value: 'Occupied' },
  { name: 'Under Maintenance', value: 'Under Maintenance' },
];

export default function VenueMasterPage() {
  const [data, setData] = useState<VenueMaster[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<VenueMaster>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.code || !form.name) {
      ToastService.error('Code and Name are required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        {
          ...form,
          id: String(Date.now()),
          facilities: form.facilities || [],
        } as VenueMaster,
      ]);
      ToastService.success('Venue created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as VenueMaster)
            : d
        )
      );
      ToastService.success('Venue updated.');
    }
    close();
  };

  const handleDelete = (item: VenueMaster) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Venue deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Venue Master"
      description="Manage training halls, labs, and auditoriums."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Masters', to: tdmUrls.admin.mastersPortal },
        { label: 'Venue Master' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Venue Name' },
            { field: 'building', header: 'Building' },
            { field: 'capacity', header: 'Capacity' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: VenueMaster) => (
                <StatusBadge
                  label={item.status}
                  variant={
                    item.status === 'Available'
                      ? 'approved'
                      : item.status === 'Occupied'
                        ? 'pending'
                        : 'rejected'
                  }
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: VenueMaster) => (
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
                    variant="primary"
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
                    onClick={() => handleDelete(item)}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Venue"
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
            ? 'Add Venue'
            : popup.mode === 'edit'
              ? 'Edit Venue'
              : 'View Venue'
        }
      >
        <FormGrid columns={2}>
          <TextBox
            label="Code"
            value={form.code ?? ''}
            onChange={v => setForm(f => ({ ...f, code: v }))}
            required
            readOnly={isReadOnly}
          />
          <TextBox
            label="Venue Name"
            value={form.name ?? ''}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
            readOnly={isReadOnly}
          />
          <TextBox
            label="Building"
            value={form.building ?? ''}
            onChange={v => setForm(f => ({ ...f, building: v }))}
            readOnly={isReadOnly}
          />
          <TextBox
            label="Room"
            value={form.room ?? ''}
            onChange={v => setForm(f => ({ ...f, room: v }))}
            readOnly={isReadOnly}
          />
          <TextBox
            label="Capacity"
            type="number"
            value={form.capacity?.toString() ?? ''}
            onChange={v => setForm(f => ({ ...f, capacity: Number(v) }))}
            readOnly={isReadOnly}
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v => setForm(f => ({ ...f, status: v as any }))}
          />
        </FormGrid>
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Create' : 'Save Changes'}
              variant="primary"
              icon="check"
              onClick={handleSave}
            />
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
