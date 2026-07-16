import { useCallback, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import {
  type FeedbackAssignment,
  feedbackAssignments as initialData,
  feedbackTemplates,
  academicYearOptions,
  semesterOptions,
  departmentOptions,
  programmeOptions,
  sectionOptions,
  facultyOptions,
  courseOptions,
} from '../../data';
import { feedbackUrls } from '../../urls';

type PopupState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; item: FeedbackAssignment };

const EMPTY_FORM = {
  academicYear: '',
  semester: '',
  department: '',
  programme: '',
  section: '',
  course: '',
  faculty: '',
  templateId: '',
  studentsCount: 0,
};

const yearOpts = academicYearOptions.map(y => ({ name: y, value: y }));
const semOpts = semesterOptions.map(s => ({ name: s, value: s }));
const deptOpts = departmentOptions.map(d => ({ name: d, value: d }));
const progOpts = programmeOptions.map(p => ({ name: p, value: p }));
const sectOpts = sectionOptions.map(s => ({ name: s || 'N/A', value: s }));
const facOpts = facultyOptions.map(f => ({ name: f, value: f }));
const courseOpts = courseOptions.map(c => ({ name: c, value: c }));
const templateOpts = feedbackTemplates
  .filter(t => t.status !== 'Archived')
  .map(t => ({ name: t.name, value: t.id }));

export default function FeedbackAssignmentPage() {
  const [data, setData] = useState<FeedbackAssignment[]>(initialData);
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const [form, setForm] = useState(EMPTY_FORM);

  const closePopup = useCallback(() => {
    setPopup({ mode: 'closed' });
    setForm(EMPTY_FORM);
  }, []);

  const openCreate = () => {
    setForm({
      ...EMPTY_FORM,
      academicYear: yearOpts[0]?.value ?? '',
      semester: semOpts[0]?.value ?? '',
      templateId: templateOpts[0]?.value ?? '',
    });
    setPopup({ mode: 'create' });
  };

  const openEdit = (item: FeedbackAssignment) => {
    setForm({
      academicYear: item.academicYear,
      semester: item.semester,
      department: item.department,
      programme: item.programme,
      section: item.section,
      course: item.course,
      faculty: item.faculty,
      templateId: item.templateId,
      studentsCount: item.studentsCount,
    });
    setPopup({ mode: 'edit', item });
  };

  const handleSave = () => {
    if (popup.mode === 'create') {
      setData(prev => [...prev, { id: String(Date.now()), ...form }]);
      ToastService.success('Assignment created successfully.');
    } else if (popup.mode === 'edit') {
      setData(prev =>
        prev.map(a => (a.id === popup.item.id ? { ...a, ...form } : a))
      );
      ToastService.success('Assignment updated successfully.');
    }
    closePopup();
  };

  const handleRemove = (item: FeedbackAssignment) => {
    if (confirm('Are you sure you want to remove this assignment?')) {
      setData(prev => prev.filter(a => a.id !== item.id));
      ToastService.success('Assignment removed.');
    }
  };

  return (
    <FormPage
      title="Feedback Assignment"
      description="Assign feedback templates to courses, faculty, and student groups."
      breadcrumbs={[
        { label: 'Student Feedback Management', to: feedbackUrls.portal },
        { label: 'Admin Portal', to: feedbackUrls.admin.portal },
        { label: 'Feedback Assignments' },
      ]}
    >
      <FormCard>
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search assignments..."
          toolbar={
            <Button
              label="Create Assignment"
              icon="plus"
              variant="primary"
              onClick={openCreate}
            />
          }
          columns={[
            { field: 'academicYear', header: 'Academic Year' },
            { field: 'semester', header: 'Semester' },
            { field: 'department', header: 'Department' },
            { field: 'programme', header: 'Programme' },
            { field: 'section', header: 'Section' },
            { field: 'course', header: 'Course' },
            { field: 'faculty', header: 'Faculty' },
            { field: 'studentsCount', header: 'Students' },
            {
              header: 'Actions',
              width: '160px',
              cell: (item: FeedbackAssignment) => (
                <div className="flex gap-1">
                  <Button
                    icon="pencil"
                    label="Edit"
                    variant="outlined"
                    size="small"
                    onClick={() => openEdit(item)}
                  />
                  <Button
                    icon="trash"
                    label="Remove"
                    variant="outlined"
                    size="small"
                    onClick={() => handleRemove(item)}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      {popup.mode !== 'closed' && (
        <FormPopup
          visible
          onHide={closePopup}
          title={
            popup.mode === 'create' ? 'Create Assignment' : 'Edit Assignment'
          }
          subtitle="Assign a feedback template to a course section."
          size="lg"
        >
          <FormGrid columns={2}>
            <DropDownList
              label="Academic Year"
              data={yearOpts}
              textField="name"
              optionValue="value"
              value={form.academicYear}
              onChange={v =>
                setForm(f => ({ ...f, academicYear: String(v ?? '') }))
              }
              required
            />
            <DropDownList
              label="Semester"
              data={semOpts}
              textField="name"
              optionValue="value"
              value={form.semester}
              onChange={v =>
                setForm(f => ({ ...f, semester: String(v ?? '') }))
              }
              required
            />
            <DropDownList
              label="Department"
              data={deptOpts}
              textField="name"
              optionValue="value"
              value={form.department}
              onChange={v =>
                setForm(f => ({ ...f, department: String(v ?? '') }))
              }
            />
            <DropDownList
              label="Programme"
              data={progOpts}
              textField="name"
              optionValue="value"
              value={form.programme}
              onChange={v =>
                setForm(f => ({ ...f, programme: String(v ?? '') }))
              }
            />
            <DropDownList
              label="Section"
              data={sectOpts}
              textField="name"
              optionValue="value"
              value={form.section}
              onChange={v => setForm(f => ({ ...f, section: String(v ?? '') }))}
            />
            <DropDownList
              label="Course"
              data={courseOpts}
              textField="name"
              optionValue="value"
              value={form.course}
              onChange={v => setForm(f => ({ ...f, course: String(v ?? '') }))}
            />
            <DropDownList
              label="Faculty"
              data={facOpts}
              textField="name"
              optionValue="value"
              value={form.faculty}
              onChange={v => setForm(f => ({ ...f, faculty: String(v ?? '') }))}
            />
            <DropDownList
              label="Template"
              data={templateOpts}
              textField="name"
              optionValue="value"
              value={form.templateId}
              onChange={v =>
                setForm(f => ({ ...f, templateId: String(v ?? '') }))
              }
              required
            />
          </FormGrid>
          <div className="flex justify-end gap-3 mt-4">
            <Button label="Cancel" variant="outlined" onClick={closePopup} />
            <Button label="Save" variant="primary" onClick={handleSave} />
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
