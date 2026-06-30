import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { type Helpline, helplines as initialData } from '../../../mocks';
import { smsUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Helpline }
  | { mode: 'view'; item: Helpline };

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];
const AVAILABILITY_OPTIONS = [
  { name: '24/7', value: '24/7' },
  { name: 'Mon-Sat 9AM-6PM', value: 'Mon-Sat 9AM-6PM' },
  { name: 'Mon-Fri 9AM-5PM', value: 'Mon-Fri 9AM-5PM' },
  { name: 'On Call', value: 'On Call' },
];
const DEPT_OPTIONS = [
  'ICC Cell',
  'University Health Centre',
  'Safety Cell',
  'Security Department',
  'External',
  'IT Department',
  'Student Affairs',
].map(d => ({ name: d, value: d }));

const EMPTY: Partial<Helpline> = {
  helplineName: '',
  department: '',
  contactNumber: '',
  alternateNumber: '',
  email: '',
  availability: '24/7',
  description: '',
  status: 'Active',
};

export default function HelplineManagement() {
  const [data, setData] = useState<Helpline[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Helpline>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.helplineName || !form.contactNumber) {
      ToastService.error('Helpline Name and Contact Number are required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as Helpline,
      ]);
      ToastService.success('Helpline added successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id ? ({ ...d, ...form } as Helpline) : d
        )
      );
      ToastService.success('Helpline updated successfully.');
    }
    close();
  };

  const handleDelete = (item: Helpline) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Helpline deleted.');
  };

  const isReadOnly = popup.mode === 'view';
  const viewItem = popup.mode === 'view' ? popup.item : null;

  return (
    <FormPage
      title="Helpline Management"
      description="Manage all university emergency helplines and departmental contact numbers."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Helpline Management' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'helplineName', header: 'Helpline Name' },
            { field: 'department', header: 'Department' },
            {
              field: 'contactNumber',
              header: 'Contact',
              cell: (item: Helpline) => (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <i
                    className="pi pi-phone"
                    style={{ color: '#16a34a', fontSize: '0.75rem' }}
                  />
                  <strong>{item.contactNumber}</strong>
                </span>
              ),
            },
            { field: 'availability', header: 'Availability' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Helpline) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'rejected'}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: Helpline) => (
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
                    onClick={() => handleDelete(item)}
                  />
                </div>
              ),
            },
          ]}
          toolbar={
            <Button
              label="Add Helpline"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search helplines..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Add Helpline'
            : popup.mode === 'edit'
              ? 'Edit Helpline'
              : `${viewItem?.helplineName ?? 'Helpline'} — Details`
        }
        subtitle={
          viewItem
            ? `${viewItem.department} · ${viewItem.availability}`
            : 'Configure university helpline details.'
        }
        size="xl"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Helpline Name"
            placeholder="e.g. Women's Helpline"
            value={form.helplineName ?? ''}
            onChange={v => setForm(f => ({ ...f, helplineName: v }))}
            required
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
          <TextBox
            label="Contact Number"
            placeholder="e.g. 1800-111-111"
            value={form.contactNumber ?? ''}
            onChange={v => setForm(f => ({ ...f, contactNumber: v }))}
            required
            disabled={isReadOnly}
          />
          <TextBox
            label="Alternate Number"
            placeholder="e.g. 9876500001"
            value={form.alternateNumber ?? ''}
            onChange={v => setForm(f => ({ ...f, alternateNumber: v }))}
            disabled={isReadOnly}
          />
          <TextBox
            label="Email"
            placeholder="e.g. helpline@university.edu"
            value={form.email ?? ''}
            onChange={v => setForm(f => ({ ...f, email: v }))}
            disabled={isReadOnly}
          />
          <DropDownList
            label="Availability"
            data={AVAILABILITY_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.availability}
            onChange={v => setForm(f => ({ ...f, availability: v as string }))}
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
        </FormGrid>
        <TextArea
          label="Description"
          placeholder="Brief description of this helpline"
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
                popup.mode === 'create' ? 'Add Helpline' : 'Update Helpline'
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
