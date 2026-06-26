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
  type EnrolmentStatusItem,
  enrolmentStatusItems as initialData,
} from '../../../data';
import { programmeUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: EnrolmentStatusItem };

const ACTIVE_OPTIONS = [
  { name: 'Yes', value: 'Yes' },
  { name: 'No', value: 'No' },
];

const EMPTY_FORM = { name: '', code: '', description: '', isActive: 'Yes' };

export default function EnrolmentStatus() {
  const [data, setData] = useState<EnrolmentStatusItem[]>(initialData);
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

  const openEdit = (item: EnrolmentStatusItem) => {
    setForm({
      name: item.name,
      code: item.code,
      description: item.description,
      isActive: item.isActive ? 'Yes' : 'No',
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    const isActive = form.isActive === 'Yes';
    if (popup.mode === 'create') {
      setData(prev => [...prev, { id: String(Date.now()), ...form, isActive }]);
      ToastService.success('Enrolment status created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(s =>
          s.id === popup.item.id ? { ...s, ...form, isActive } : s
        )
      );
      ToastService.success('Enrolment status updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Enrolment Status"
      description="Manage enrolment status options for students."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Programme Management', to: programmeUrls.portal },
        { label: 'Admin Portal', to: programmeUrls.admin.portal },
        { label: 'Settings', to: programmeUrls.admin.settings.portal },
        { label: 'Enrolment Status' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={openEdit}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'name', header: 'Status Name' },
            { field: 'code', header: 'Code' },
            { field: 'description', header: 'Description' },
            {
              field: 'isActive',
              header: 'Status',
              sortable: false,
              cell: (item: EnrolmentStatusItem) => (
                <StatusBadge
                  label={item.isActive ? 'Active' : 'Inactive'}
                  variant={item.isActive ? 'approved' : 'neutral'}
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
            ? 'Create Enrolment Status'
            : 'Edit Enrolment Status'
        }
        subtitle="Fill in the enrolment status details."
        size="default"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Status Name"
            placeholder="e.g. Enrolled"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="Code"
            placeholder="e.g. ENR"
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
            label="Is Active"
            data={ACTIVE_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select"
            value={form.isActive}
            onChange={v =>
              setForm(f => ({ ...f, isActive: String(v ?? 'Yes') }))
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
