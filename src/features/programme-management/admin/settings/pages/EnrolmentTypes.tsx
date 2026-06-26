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
import {
  type EnrolmentType,
  enrolmentTypes as initialData,
} from '../../../data';
import { programmeUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: EnrolmentType };

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

const EMPTY_FORM = { name: '', code: '', description: '', status: 'Active' };

export default function EnrolmentTypes() {
  const [data, setData] = useState<EnrolmentType[]>(initialData);
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

  const openEdit = (item: EnrolmentType) => {
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
      ToastService.success('Enrolment type created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(t => (t.id === popup.item.id ? { ...t, ...form } : t))
      );
      ToastService.success('Enrolment type updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Enrolment Types"
      description="Manage student enrolment type master data."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Programme Management', to: programmeUrls.portal },
        { label: 'Admin Portal', to: programmeUrls.admin.portal },
        { label: 'Settings', to: programmeUrls.admin.settings.portal },
        { label: 'Enrolment Types' },
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
              cell: (item: EnrolmentType) => (
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
          popup.mode === 'create'
            ? 'Create Enrolment Type'
            : 'Edit Enrolment Type'
        }
        subtitle="Fill in the enrolment type details."
        size="default"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Name"
            placeholder="e.g. Regular"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="Code"
            placeholder="e.g. REG"
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
