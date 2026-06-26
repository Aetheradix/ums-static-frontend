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
import { type UgcDegree, ugcDegrees as initialData } from '../../../data';
import { programmeUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: UgcDegree };

const LEVEL_OPTIONS = [
  { name: 'UG', value: 'UG' },
  { name: 'PG', value: 'PG' },
  { name: 'Doctorate', value: 'Doctorate' },
];

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

const EMPTY_FORM = { name: '', code: '', level: '', status: 'Active' };

export default function UgcDegrees() {
  const [data, setData] = useState<UgcDegree[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: UgcDegree) => {
    setForm({
      name: item.name,
      code: item.code,
      level: item.level,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      setData(prev => [...prev, { id: String(Date.now()), ...form }]);
      ToastService.success('UGC Degree created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d => (d.id === popup.item.id ? { ...d, ...form } : d))
      );
      ToastService.success('UGC Degree updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="UGC Degrees"
      description="Manage UGC recognized degree types and qualification levels."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Programme Management', to: programmeUrls.portal },
        { label: 'Admin Portal', to: programmeUrls.admin.portal },
        { label: 'Settings', to: programmeUrls.admin.settings.portal },
        { label: 'UGC Degrees' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={openEdit}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'name', header: 'Degree Name' },
            { field: 'code', header: 'Code' },
            { field: 'level', header: 'Level' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: UgcDegree) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'rejected'}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Create"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={closePopup}
        title={
          popup.mode === 'create' ? 'Create UGC Degree' : 'Edit UGC Degree'
        }
        subtitle="Fill in the UGC degree details."
        size="default"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Degree Name"
            placeholder="e.g. Bachelor of Technology"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="Code"
            placeholder="e.g. B.Tech"
            value={form.code}
            onChange={v => setForm(f => ({ ...f, code: v }))}
            required
          />
          <DropDownList
            label="Level"
            data={LEVEL_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Level"
            value={form.level}
            onChange={v => setForm(f => ({ ...f, level: String(v ?? '') }))}
            required
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Status"
            value={form.status}
            onChange={v =>
              setForm(f => ({ ...f, status: String(v ?? 'Active') }))
            }
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Save" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
