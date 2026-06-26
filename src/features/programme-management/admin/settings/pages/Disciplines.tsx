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
import { type Discipline, disciplines as initialData } from '../../../data';
import { programmeUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Discipline };

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

const EMPTY_FORM = { name: '', code: '', description: '', status: 'Active' };

export default function Disciplines() {
  const [data, setData] = useState<Discipline[]>(initialData);
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

  const openEdit = (item: Discipline) => {
    setForm({
      name: item.name,
      code: item.code,
      description: item.description,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      setData(prev => [...prev, { id: String(Date.now()), ...form }]);
      ToastService.success('Discipline created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d => (d.id === popup.item.id ? { ...d, ...form } : d))
      );
      ToastService.success('Discipline updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Disciplines"
      description="Manage academic disciplines and subject areas."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Programme Management', to: programmeUrls.portal },
        { label: 'Admin Portal', to: programmeUrls.admin.portal },
        { label: 'Settings', to: programmeUrls.admin.settings.portal },
        { label: 'Disciplines' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={openEdit}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            { field: 'description', header: 'Description' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: Discipline) => (
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
          popup.mode === 'create' ? 'Create Discipline' : 'Edit Discipline'
        }
        subtitle="Fill in the discipline details."
        size="default"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Name"
            placeholder="e.g. Computer Science & Engineering"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="Code"
            placeholder="e.g. CSE"
            value={form.code}
            onChange={v => setForm(f => ({ ...f, code: v }))}
            required
          />
          <TextBox
            label="Description"
            placeholder="Short description"
            value={form.description}
            onChange={v => setForm(f => ({ ...f, description: v }))}
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
