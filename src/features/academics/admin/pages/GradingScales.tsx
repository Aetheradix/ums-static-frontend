import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { type GradingScale, gradingScales as initialData } from '../../data';
import { academicsUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: GradingScale };

const EMPTY_FORM = {
  grade: '',
  minMarks: '',
  maxMarks: '',
  gradePoints: '',
  description: '',
};

export default function GradingScales() {
  const [data, setData] = useState<GradingScale[]>(initialData);
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

  const openEdit = (item: GradingScale) => {
    setForm({
      grade: item.grade,
      minMarks: String(item.minMarks),
      maxMarks: String(item.maxMarks),
      gradePoints: String(item.gradePoints),
      description: item.description,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      const newItem: GradingScale = {
        id: String(Date.now()),
        grade: form.grade,
        minMarks: Number(form.minMarks),
        maxMarks: Number(form.maxMarks),
        gradePoints: Number(form.gradePoints),
        description: form.description,
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Grading scale created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(g =>
          g.id === popup.item.id
            ? {
                ...g,
                grade: form.grade,
                minMarks: Number(form.minMarks),
                maxMarks: Number(form.maxMarks),
                gradePoints: Number(form.gradePoints),
                description: form.description,
              }
            : g
        )
      );
      ToastService.success('Grading scale updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Grading Scales"
      description="Define grade boundaries and grade point values."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Academic Management', to: academicsUrls.portal },
        { label: 'Admin Portal', to: academicsUrls.admin.portal },
        { label: 'Grading Scales' },
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
            { field: 'grade', header: 'Grade' },
            { field: 'minMarks', header: 'Min Marks' },
            { field: 'maxMarks', header: 'Max Marks' },
            { field: 'gradePoints', header: 'Grade Points' },
            { field: 'description', header: 'Description' },
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
            ? 'Create Grading Scale'
            : 'Edit Grading Scale'
        }
        subtitle="Define the grade boundaries and point values."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Grade"
            placeholder="e.g. A+"
            value={form.grade}
            onChange={v => setForm(f => ({ ...f, grade: v }))}
            required
          />
          <TextBox
            label="Description"
            placeholder="e.g. Excellent"
            value={form.description}
            onChange={v => setForm(f => ({ ...f, description: v }))}
            required
          />
          <TextBox
            label="Min Marks"
            placeholder="e.g. 81"
            value={form.minMarks}
            onChange={v => setForm(f => ({ ...f, minMarks: v }))}
            required
          />
          <TextBox
            label="Max Marks"
            placeholder="e.g. 90"
            value={form.maxMarks}
            onChange={v => setForm(f => ({ ...f, maxMarks: v }))}
            required
          />
          <TextBox
            label="Grade Points"
            placeholder="e.g. 9"
            value={form.gradePoints}
            onChange={v => setForm(f => ({ ...f, gradePoints: v }))}
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
