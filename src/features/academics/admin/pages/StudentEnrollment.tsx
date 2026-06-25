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
  type EnrolledStudent,
  enrolledStudents as initialData,
  programmes,
} from '../../data';
import { academicsUrls } from '../../urls';

type PopupState = { mode: 'closed' } | { mode: 'create' };

const SECTION_OPTIONS = ['A', 'B', 'C'].map(s => ({ name: s, value: s }));
const TERM_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8'].map(t => ({
  name: `Term ${t}`,
  value: t,
}));

const EMPTY_FORM = {
  rollNo: '',
  name: '',
  programme: '',
  batch: '',
  section: '',
  term: '',
};

export default function StudentEnrollment() {
  const [data, setData] = useState<EnrolledStudent[]>(initialData);
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

  const handleSave = () => {
    const newItem: EnrolledStudent = {
      id: String(Date.now()),
      rollNo: form.rollNo,
      name: form.name,
      programme: form.programme,
      batch: form.batch,
      section: form.section,
      term: form.term,
      status: 'Enrolled',
    };
    setData(prev => [...prev, newItem]);
    ToastService.success('Student enrolled successfully.');
    closePopup();
  };

  return (
    <FormPage
      title="Student Enrollment"
      description="Enroll students into academic programmes and sections."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Academic Management', to: academicsUrls.portal },
        { label: 'Admin Portal', to: academicsUrls.admin.portal },
        { label: 'Student Enrollment' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '50px',
            },
            { field: 'rollNo', header: 'Roll No' },
            { field: 'name', header: 'Student Name' },
            { field: 'programme', header: 'Programme' },
            { field: 'batch', header: 'Batch' },
            { field: 'section', header: 'Section' },
            { field: 'term', header: 'Term' },
            {
              field: 'status',
              header: 'Status',
              sortable: false,
              cell: (item: EnrolledStudent) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Enrolled' ? 'approved' : 'pending'}
                />
              ),
            },
          ]}
          toolbar={
            <Button
              label="Enroll Student"
              icon="plus"
              variant="primary"
              onClick={() => setPopup({ mode: 'create' })}
            />
          }
          searchBox
        />
      </FormCard>

      <FormPopup
        visible={popup.mode === 'create'}
        onHide={closePopup}
        title="Enroll Student"
        subtitle="Fill in the student enrollment details."
        size="lg"
      >
        <FormGrid columns={2}>
          <TextBox
            label="Roll Number"
            placeholder="e.g. BTCS2401"
            value={form.rollNo}
            onChange={v => setForm(f => ({ ...f, rollNo: v }))}
            required
          />
          <TextBox
            label="Student Name"
            placeholder="Full name"
            value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))}
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
          <TextBox
            label="Batch"
            placeholder="e.g. 2024-28"
            value={form.batch}
            onChange={v => setForm(f => ({ ...f, batch: v }))}
            required
          />
          <DropDownList
            label="Section"
            data={SECTION_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Section"
            value={form.section}
            onChange={v => setForm(f => ({ ...f, section: String(v ?? '') }))}
            required
          />
          <DropDownList
            label="Term"
            data={TERM_OPTIONS}
            textField="name"
            optionValue="value"
            placeholder="Select Term"
            value={form.term}
            onChange={v => setForm(f => ({ ...f, term: String(v ?? '') }))}
            required
          />
        </FormGrid>
        <div className="flex justify-end gap-3 mt-4">
          <Button label="Cancel" variant="outlined" onClick={closePopup} />
          <Button label="Enroll" variant="primary" onClick={handleSave} />
        </div>
      </FormPopup>
    </FormPage>
  );
}
