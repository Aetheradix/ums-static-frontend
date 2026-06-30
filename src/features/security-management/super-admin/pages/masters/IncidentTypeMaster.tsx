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
import {
  type IncidentType,
  incidentTypes as initialData,
  incidentCategories,
} from '../../../mocks';
import { smsUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: IncidentType }
  | { mode: 'view'; item: IncidentType };

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];
const CATEGORY_OPTIONS = incidentCategories.map(c => ({
  name: c.categoryName,
  value: c.categoryName,
}));
const EMPTY: Partial<IncidentType> = {
  typeName: '',
  categoryId: '',
  category: '',
  description: '',
  status: 'Active',
};

export default function IncidentTypeMaster() {
  const [data, setData] = useState<IncidentType[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<IncidentType>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.typeName || !form.category) {
      ToastService.error('Type Name and Category are required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as IncidentType,
      ]);
      ToastService.success('Incident type created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as IncidentType)
            : d
        )
      );
      ToastService.success('Incident type updated.');
    }
    close();
  };

  const handleDelete = (item: IncidentType) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Incident type deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Incident Type Master"
      description="Manage incident types linked to their respective categories."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Incident Type' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'typeName', header: 'Type Name' },
            { field: 'category', header: 'Category' },
            { field: 'description', header: 'Description' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: IncidentType) => (
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
              cell: (item: IncidentType) => (
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
              label="Add Incident Type"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search incident types..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Add Incident Type'
            : popup.mode === 'edit'
              ? 'Edit Incident Type'
              : 'View Incident Type'
        }
        subtitle="Link incident type to a category."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Type Name"
            placeholder="e.g. Unauthorized Entry"
            value={form.typeName ?? ''}
            onChange={v => setForm(f => ({ ...f, typeName: v }))}
            required
            disabled={isReadOnly}
          />
          <DropDownList
            label="Category"
            data={CATEGORY_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.category}
            onChange={v => setForm(f => ({ ...f, category: v as string }))}
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
          placeholder="Brief description"
          value={form.description ?? ''}
          onChange={v => setForm(f => ({ ...f, description: v }))}
          disabled={isReadOnly}
          rows={2}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={popup.mode === 'create' ? 'Create' : 'Update'}
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
