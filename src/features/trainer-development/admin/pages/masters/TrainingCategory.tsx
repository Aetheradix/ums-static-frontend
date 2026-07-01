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
  type TrainingCategory,
  trainingCategories as initialData,
} from '../../../mocks';
import { tdmUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: TrainingCategory }
  | { mode: 'view'; item: TrainingCategory };

const EMPTY: Partial<TrainingCategory> = {
  code: '',
  name: '',
  description: '',
  icon: 'school',
  status: 'Active',
};
const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

export default function TrainingCategoryMaster() {
  const [data, setData] = useState<TrainingCategory[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<TrainingCategory>>(EMPTY);

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
        { ...form, id: String(Date.now()) } as TrainingCategory,
      ]);
      ToastService.success('Training category created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as TrainingCategory)
            : d
        )
      );
      ToastService.success('Training category updated.');
    }
    close();
  };

  const handleDelete = (item: TrainingCategory) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Category deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Training Category Master"
      description="Define and manage training categories like FDP, Workshop, Seminar, MOOC, and Certification programmes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Masters', to: tdmUrls.admin.mastersPortal },
        { label: 'Training Category' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Category Name' },
            { field: 'description', header: 'Description' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: TrainingCategory) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'neutral'}
                />
              ),
            },
            {
              field: 'id',
              header: 'Actions',
              sortable: false,
              cell: (item: TrainingCategory) => (
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
            ? 'Add Training Category'
            : popup.mode === 'edit'
              ? 'Edit Category'
              : 'View Category'
        }
        subtitle="Training category configuration"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Category Code"
            placeholder="e.g. FDP"
            value={form.code ?? ''}
            onChange={v => setForm(f => ({ ...f, code: v }))}
            required
            readOnly={isReadOnly}
          />
          <TextBox
            label="Category Name"
            placeholder="e.g. Faculty Development Programme"
            value={form.name ?? ''}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
            readOnly={isReadOnly}
          />
          <DropDownList
            label="Status"
            data={STATUS_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.status}
            onChange={v =>
              setForm(f => ({ ...f, status: v as 'Active' | 'Inactive' }))
            }
          />
          <TextBox
            label="Icon"
            placeholder="e.g. school"
            value={form.icon ?? ''}
            onChange={v => setForm(f => ({ ...f, icon: v }))}
            readOnly={isReadOnly}
          />
        </FormGrid>
        <TextArea
          label="Description"
          placeholder="Brief description of the training category..."
          value={form.description ?? ''}
          onChange={v => setForm(f => ({ ...f, description: v }))}
          rows={3}
        />
        {!isReadOnly && (
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={close} />
            <Button
              label={
                popup.mode === 'create' ? 'Create Category' : 'Save Changes'
              }
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
