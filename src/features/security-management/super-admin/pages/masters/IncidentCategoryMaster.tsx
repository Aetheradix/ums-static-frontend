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
  type IncidentCategory,
  incidentCategories as initialData,
} from '../../../mocks';
import { smsUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: IncidentCategory }
  | { mode: 'view'; item: IncidentCategory };

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

const EMPTY: Partial<IncidentCategory> = {
  categoryName: '',
  description: '',
  status: 'Active',
};

export default function IncidentCategoryMaster() {
  const [data, setData] = useState<IncidentCategory[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<IncidentCategory>>(EMPTY);

  const close = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY);
  }, []);

  const handleSave = () => {
    if (!form.categoryName) {
      ToastService.error('Category Name is required.');
      return;
    }
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        { ...form, id: String(Date.now()) } as IncidentCategory,
      ]);
      ToastService.success('Incident category created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as IncidentCategory)
            : d
        )
      );
      ToastService.success('Incident category updated.');
    }
    close();
  };

  const handleDelete = (item: IncidentCategory) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Incident category deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Incident Category Master"
      description="Create and manage incident categories for security management."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Security Management', to: smsUrls.portal },
        { label: 'Super Admin', to: smsUrls.superAdmin.portal },
        { label: 'Incident Category' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'categoryName', header: 'Category Name' },
            { field: 'description', header: 'Description' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: IncidentCategory) => (
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
              cell: (item: IncidentCategory) => (
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
              label="Add Category"
              icon="plus"
              variant="primary"
              onClick={() => {
                setForm(EMPTY);
                setPopup({ mode: 'create' });
              }}
            />
          }
          searchBox
          searchPlaceholder="Search categories..."
        />
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title={
          popup.mode === 'create'
            ? 'Add Incident Category'
            : popup.mode === 'edit'
              ? 'Edit Incident Category'
              : 'View Incident Category'
        }
        subtitle="Configure incident category details."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Category Name"
            placeholder="e.g. Physical Security"
            value={form.categoryName ?? ''}
            onChange={v => setForm(f => ({ ...f, categoryName: v }))}
            required
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
          placeholder="Brief description of this incident category"
          value={form.description ?? ''}
          onChange={v => setForm(f => ({ ...f, description: v }))}
          disabled={isReadOnly}
          rows={3}
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
