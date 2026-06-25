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
import { type Course, courses as initialData, programmes } from '../../data';
import { academicsUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: Course };

const TYPE_OPTIONS = [
  { name: 'Core', value: 'Core' },
  { name: 'Elective', value: 'Elective' },
];

const SEMESTER_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8'].map(s => ({
  name: `Semester ${s}`,
  value: s,
}));

const EMPTY_FORM = {
  code: '',
  title: '',
  credits: '',
  type: '',
  programme: '',
  semester: '',
  evaluatorName: '',
};

export default function Courses() {
  const [data, setData] = useState<Course[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const programmeOptions = programmes.map(p => ({
    name: p.title,
    value: p.title,
  }));

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: Course) => {
    setForm({
      code: item.code,
      title: item.title,
      credits: String(item.credits),
      type: item.type,
      programme: item.programme,
      semester: item.semester,
      evaluatorName: item.evaluatorName,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      const newItem: Course = {
        id: String(Date.now()),
        code: form.code,
        title: form.title,
        credits: Number(form.credits),
        type: form.type,
        programme: form.programme,
        semester: form.semester,
        evaluatorName: form.evaluatorName,
        status: 'Active',
      };
      setData(prev => [...prev, newItem]);
      ToastService.success('Course created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(c =>
          c.id === popup.item.id
            ? {
                ...c,
                code: form.code,
                title: form.title,
                credits: Number(form.credits),
                type: form.type,
                programme: form.programme,
                semester: form.semester,
                evaluatorName: form.evaluatorName,
              }
            : c
        )
      );
      ToastService.success('Course updated successfully.');
    }
    closePopup();
  };

  return (
    <FormPage
      title="Course Management"
      description="Add and configure courses for academic programmes."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Academic Management', to: academicsUrls.portal },
        { label: 'Admin Portal', to: academicsUrls.admin.portal },
        { label: 'Courses' },
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
            { field: 'code', header: 'Code' },
            { field: 'title', header: 'Course Title' },
            { field: 'credits', header: 'Credits' },
            { field: 'type', header: 'Type' },
            { field: 'programme', header: 'Programme' },
            { field: 'semester', header: 'Semester' },
            { field: 'evaluatorName', header: 'Evaluator' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: Course) => (
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
        title={popup.mode === 'create' ? 'Create Course' : 'Edit Course'}
        subtitle="Fill in the course details."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Course Code"
            placeholder="e.g. CS101"
            value={form.code}
            onChange={v => setForm(f => ({ ...f, code: v }))}
            required
          />
          <TextBox
            label="Course Title"
            placeholder="e.g. Data Structures"
            value={form.title}
            onChange={v => setForm(f => ({ ...f, title: v }))}
            required
          />
          <TextBox
            label="Credits"
            placeholder="e.g. 4"
            value={form.credits}
            onChange={v => setForm(f => ({ ...f, credits: v }))}
            required
          />
          <DropDownList
            label="Type"
            data={TYPE_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Type"
            value={form.type}
            onChange={v => setForm(f => ({ ...f, type: String(v ?? '') }))}
            required
          />
          <DropDownList
            label="Programme"
            data={programmeOptions}
            textField="name"
            optionValue="value"
            placeholder="Select Programme"
            value={form.programme}
            onChange={v => setForm(f => ({ ...f, programme: String(v ?? '') }))}
            required
          />
          <DropDownList
            label="Semester"
            data={SEMESTER_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Semester"
            value={form.semester}
            onChange={v => setForm(f => ({ ...f, semester: String(v ?? '') }))}
            required
          />
          <TextBox
            label="Evaluator Name"
            placeholder="Faculty name"
            value={form.evaluatorName}
            onChange={v => setForm(f => ({ ...f, evaluatorName: v }))}
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
