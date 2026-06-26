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
import {
  type MarkEntryStudent,
  markEntryStudents as initialData,
} from '../../data';
import { academicsUrls } from '../../urls';

type PopupState = { mode: 'closed' } | { mode: 'edit'; item: MarkEntryStudent };

const EMPTY_FORM = {
  midTermMarks: '',
  endTermMarks: '',
  assignmentMarks: '',
};

function calcGrade(total: number): string {
  if (total >= 91) return 'O';
  if (total >= 81) return 'A+';
  if (total >= 71) return 'A';
  if (total >= 61) return 'B+';
  if (total >= 51) return 'B';
  if (total >= 40) return 'C';
  return 'F';
}

export default function MarkEntry() {
  const [data, setData] = useState<MarkEntryStudent[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openEdit = (item: MarkEntryStudent) => {
    setForm({
      midTermMarks: String(item.midTermMarks),
      endTermMarks: String(item.endTermMarks),
      assignmentMarks: String(item.assignmentMarks),
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode !== 'edit') return;
    const mid = Number(form.midTermMarks);
    const end = Number(form.endTermMarks);
    const asgn = Number(form.assignmentMarks);
    const total = mid + end + asgn;
    setData(prev =>
      prev.map(s =>
        s.id === popup.item.id
          ? {
              ...s,
              midTermMarks: mid,
              endTermMarks: end,
              assignmentMarks: asgn,
              totalMarks: total,
              grade: calcGrade(total),
            }
          : s
      )
    );
    ToastService.success('Marks saved successfully.');
    closePopup();
  };

  return (
    <FormPage
      title="Mark Entry"
      description="Enter and submit marks for students in your courses."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Academic Management', to: academicsUrls.portal },
        { label: 'Faculty Portal', to: academicsUrls.faculty.portal },
        { label: 'Mark Entry' },
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
            { field: 'rollNo', header: 'Roll No' },
            { field: 'name', header: 'Student Name' },
            { field: 'midTermMarks', header: 'Mid-Term' },
            { field: 'endTermMarks', header: 'End-Term' },
            { field: 'assignmentMarks', header: 'Assignment' },
            { field: 'totalMarks', header: 'Total' },
            { field: 'grade', header: 'Grade' },
          ]}
          toolbar={
            <Button
              label="Submit Marks"
              icon="check"
              variant="primary"
              onClick={() =>
                ToastService.success('Marks submitted successfully.')
              }
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'edit'}
        onHide={closePopup}
        title="Edit Marks"
        subtitle={
          popup.mode === 'edit'
            ? `Editing marks for ${popup.item.name}`
            : 'Edit student marks'
        }
        size="default"
      >
        <FormGrid columns={1}>
          <TextBox
            label="Mid-Term Marks"
            placeholder="e.g. 25"
            value={form.midTermMarks}
            onChange={v => setForm(f => ({ ...f, midTermMarks: v }))}
            required
          />
          <TextBox
            label="End-Term Marks"
            placeholder="e.g. 42"
            value={form.endTermMarks}
            onChange={v => setForm(f => ({ ...f, endTermMarks: v }))}
            required
          />
          <TextBox
            label="Assignment Marks"
            placeholder="e.g. 9"
            value={form.assignmentMarks}
            onChange={v => setForm(f => ({ ...f, assignmentMarks: v }))}
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
