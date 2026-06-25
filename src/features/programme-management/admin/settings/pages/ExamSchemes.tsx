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
import { type ExamScheme, examSchemes as initialData } from '../../../data';
import { programmeUrls } from '../../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: ExamScheme };

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

const EMPTY_FORM = {
  name: '',
  passingMarks: '',
  maxMarks: '',
  description: '',
  status: 'Active',
};

export default function ExamSchemes() {
  const [data, setData] = useState<ExamScheme[]>(initialData);
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

  const openEdit = (item: ExamScheme) => {
    setForm({
      name: item.name,
      passingMarks: String(item.passingMarks),
      maxMarks: String(item.maxMarks),
      description: item.description,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      setData(prev => [
        ...prev,
        {
          id: String(Date.now()),
          ...form,
          passingMarks: Number(form.passingMarks),
          maxMarks: Number(form.maxMarks),
        },
      ]);
      ToastService.success('Exam scheme created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(s =>
          s.id === popup.item.id
            ? {
                ...s,
                ...form,
                passingMarks: Number(form.passingMarks),
                maxMarks: Number(form.maxMarks),
              }
            : s
        )
      );
      ToastService.success('Exam scheme updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Exam Schemes"
      description="Configure examination scheme patterns and passing criteria."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Programme Management', to: programmeUrls.portal },
        { label: 'Admin Portal', to: programmeUrls.admin.portal },
        { label: 'Settings', to: programmeUrls.admin.settings.portal },
        { label: 'Exam Schemes' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={openEdit}
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '50px' },
            { field: 'name', header: 'Scheme Name' },
            { field: 'passingMarks', header: 'Passing Marks' },
            { field: 'maxMarks', header: 'Max Marks' },
            { field: 'description', header: 'Description' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: ExamScheme) => (
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
          popup.mode === 'create' ? 'Create Exam Scheme' : 'Edit Exam Scheme'
        }
        subtitle="Fill in the exam scheme details."
        size="default"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Scheme Name"
            placeholder="e.g. Semester"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="Passing Marks"
            placeholder="e.g. 35"
            value={form.passingMarks}
            onChange={v => setForm(f => ({ ...f, passingMarks: v }))}
            required
          />
          <TextBox
            label="Max Marks"
            placeholder="e.g. 100"
            value={form.maxMarks}
            onChange={v => setForm(f => ({ ...f, maxMarks: v }))}
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
          <TextBox
            label="Description"
            placeholder="Short description"
            value={form.description}
            onChange={v => setForm(f => ({ ...f, description: v }))}
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
