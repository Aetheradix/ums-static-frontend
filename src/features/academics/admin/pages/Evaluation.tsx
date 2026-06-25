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
  type EvaluationComponent,
  evaluationComponents as initialData,
} from '../../data';
import { academicsUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: EvaluationComponent };

const EVAL_TYPE_OPTIONS = [
  { name: 'Internal', value: 'Internal' },
  { name: 'External', value: 'External' },
  { name: 'Practical', value: 'Practical' },
];

const STATUS_OPTIONS = [
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

const EMPTY_FORM = {
  name: '',
  course: '',
  weightage: '',
  maxMarks: '',
  evaluationType: '',
  status: 'Active',
};

export default function Evaluation() {
  const [data, setData] = useState<EvaluationComponent[]>(initialData);
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

  const openEdit = (item: EvaluationComponent) => {
    setForm({
      name: item.name,
      course: item.course,
      weightage: String(item.weightage),
      maxMarks: String(item.maxMarks),
      evaluationType: item.evaluationType,
      status: item.status,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      const newItem: EvaluationComponent = {
        id: String(Date.now()),
        name: form.name,
        course: form.course,
        weightage: Number(form.weightage),
        maxMarks: Number(form.maxMarks),
        evaluationType: form.evaluationType,
        status: form.status,
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Evaluation component created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(e =>
          e.id === popup.item.id
            ? {
                ...e,
                name: form.name,
                course: form.course,
                weightage: Number(form.weightage),
                maxMarks: Number(form.maxMarks),
                evaluationType: form.evaluationType,
                status: form.status,
              }
            : e
        )
      );
      ToastService.success('Evaluation component updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Evaluation Components"
      description="Manage evaluation components and weightages for courses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Academic Management', to: academicsUrls.portal },
        { label: 'Admin Portal', to: academicsUrls.admin.portal },
        { label: 'Evaluation Components' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          onEdit={openEdit}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
            },
            { field: 'name', header: 'Component Name' },
            { field: 'course', header: 'Course' },
            { field: 'weightage', header: 'Weightage (%)' },
            { field: 'maxMarks', header: 'Max Marks' },
            { field: 'evaluationType', header: 'Type' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: EvaluationComponent) => (
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
            ? 'Create Evaluation Component'
            : 'Edit Evaluation Component'
        }
        subtitle="Fill in the evaluation component details."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Component Name"
            placeholder="e.g. Mid-Term Exam"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
            required
          />
          <TextBox
            label="Course"
            placeholder="e.g. Data Structures"
            value={form.course}
            onChange={v => setForm(f => ({ ...f, course: v }))}
            required
          />
          <TextBox
            label="Weightage (%)"
            placeholder="e.g. 30"
            value={form.weightage}
            onChange={v => setForm(f => ({ ...f, weightage: v }))}
            required
          />
          <TextBox
            label="Max Marks"
            placeholder="e.g. 30"
            value={form.maxMarks}
            onChange={v => setForm(f => ({ ...f, maxMarks: v }))}
            required
          />
          <DropDownList
            label="Evaluation Type"
            data={EVAL_TYPE_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Type"
            value={form.evaluationType}
            onChange={v =>
              setForm(f => ({ ...f, evaluationType: String(v ?? '') }))
            }
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
