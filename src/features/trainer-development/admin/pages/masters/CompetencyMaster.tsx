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
import { type Competency, competencies as initialData } from '../../../mocks';
import { tdmUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Competency }
  | { mode: 'view'; item: Competency };

const EMPTY: Partial<Competency> = {
  code: '',
  name: '',
  category: 'Technical',
  description: '',
  levels: 5,
  applicableTo: [],
  status: 'Active',
};
const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];
const CATEGORY_OPTIONS = [
  { name: 'Technical', value: 'Technical' },
  { name: 'Behavioral', value: 'Behavioral' },
  { name: 'Leadership', value: 'Leadership' },
  { name: 'Domain', value: 'Domain' },
  { name: 'Functional', value: 'Functional' },
];

export default function CompetencyMaster() {
  const [data, setData] = useState<Competency[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState<Partial<Competency>>(EMPTY);

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
          applicableTo: form.applicableTo?.length
            ? form.applicableTo
            : ['All Departments'],
        } as Competency,
      ]);
      ToastService.success('Competency created.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(d =>
          d.id === (popup as any).item.id
            ? ({ ...d, ...form } as Competency)
            : d
        )
      );
      ToastService.success('Competency updated.');
    }
    close();
  };

  const handleDelete = (item: Competency) => {
    setData(prev => prev.filter(d => d.id !== item.id));
    ToastService.success('Competency deleted.');
  };

  const isReadOnly = popup.mode === 'view';

  return (
    <FormPage
      title="Competency Master"
      description="Define competency frameworks, skill categories and level definitions."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Admin Portal', to: tdmUrls.admin.portal },
        { label: 'Competency Master' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Competency Name' },
            { field: 'category', header: 'Category' },
            { field: 'levels', header: 'Levels' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: Competency) => (
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
              cell: (item: Competency) => (
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
              label="Add Competency"
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
            ? 'Add Competency'
            : popup.mode === 'edit'
              ? 'Edit Competency'
              : 'View Competency'
        }
      >
        <FormGrid columns={2}>
          <TextBox
            label="Competency Code"
            value={form.code ?? ''}
            onChange={v => setForm(f => ({ ...f, code: v }))}
            required
            readOnly={isReadOnly}
          />
          <TextBox
            label="Competency Name"
            value={form.name ?? ''}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
            readOnly={isReadOnly}
          />
          <DropDownList
            label="Category"
            data={CATEGORY_OPTIONS}
            textField="name"
            optionValue="value"
            value={form.category}
            onChange={v => setForm(f => ({ ...f, category: v as any }))}
          />
          <TextBox
            label="Levels"
            type="number"
            value={form.levels?.toString() ?? ''}
            onChange={v => setForm(f => ({ ...f, levels: Number(v) }))}
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
        <TextArea
          label="Description"
          value={form.description ?? ''}
          onChange={v => setForm(f => ({ ...f, description: v }))}
          rows={3}
        />
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
