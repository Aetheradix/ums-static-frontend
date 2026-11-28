import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox } from 'shared/components/forms';
import {
  ConfirmDialog,
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  StatCard,
  StatusBadge,
} from 'shared/new-components';
import { crumbs } from '../../components/hooks';
import { useScope } from '../../components/scope';
import { StageNote } from '../../components/ui';
import { PROGRAM_OPTIONS, SEMESTER_NUMBER_OPTIONS } from '../../data';
import { useVisitingFacultyStore } from '../../store';
import type { SubjectMaster as Subject } from '../../types';

const TYPE_OPTIONS = [
  { id: 'Theory', text: 'Theory — Subject' },
  { id: 'Practical', text: 'Practical — Lab' },
];

const blank = (department: string, branch: string): Subject => ({
  id: '',
  department,
  branch,
  code: '',
  name: '',
  type: 'Theory',
  program: '',
  semester: '',
});

/**
 * HOD — subjects and labs of the branch. The registration form fetches the
 * name from here when an applicant types a subject or lab code.
 */
export default function SubjectMaster() {
  const scope = useScope();
  const subjects = useVisitingFacultyStore(s => s.subjects);
  const saveSubject = useVisitingFacultyStore(s => s.saveSubject);
  const removeSubject = useVisitingFacultyStore(s => s.removeSubject);

  const [type, setType] = useState('');
  const [editing, setEditing] = useState<Subject | null>(null);
  const [deleting, setDeleting] = useState<Subject | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Subject, string>>>(
    {}
  );

  const mine = subjects.filter(
    s =>
      s.department === scope.dept &&
      (!scope.branch || s.branch === scope.branch)
  );
  const rows = mine.filter(s => !type || s.type === type);

  const open = (s?: Subject) => {
    setErrors({});
    setEditing(s ? { ...s } : blank(scope.dept, scope.branch ?? ''));
  };

  const save = () => {
    if (!editing) return;
    const e: typeof errors = {};
    if (!editing.code.trim()) e.code = 'Enter the code.';
    if (!editing.name.trim()) e.name = 'Enter the name.';
    if (!editing.program) e.program = 'Select the program.';
    if (!editing.semester) e.semester = 'Select the semester.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const clash = saveSubject({ ...editing, name: editing.name.trim() });
    if (clash) {
      setErrors({ code: clash });
      return;
    }
    ToastService.success(
      `${editing.code.toUpperCase()} — ${editing.name.trim()} ${editing.id ? 'updated' : 'added'}.`
    );
    setEditing(null);
  };

  return (
    <FormPage
      title="Subject Master"
      description={`Subjects and labs of ${scope.branch} (${scope.dept}). Applicants type a code in the registration form and the name is fetched from here.`}
      breadcrumbs={crumbs(scope.login, 'Subject Master')}
      headerAction={<scope.Switcher />}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total"
          value={mine.length}
          icon="book"
          colorScheme="blue"
          subtitle={`${scope.branch}`}
        />
        <StatCard
          title="Theory Subjects"
          value={mine.filter(s => s.type === 'Theory').length}
          icon="file"
          colorScheme="purple"
          subtitle="Subject 1–4 in the form"
        />
        <StatCard
          title="Labs"
          value={mine.filter(s => s.type === 'Practical').length}
          icon="desktop"
          colorScheme="teal"
          subtitle="Lab 1–8 in the form"
        />
      </div>

      <FormCard title="Filter" icon="filter">
        <FormGrid columns={3}>
          <DropDownList
            label="Type"
            data={[{ id: '', text: 'All' }, ...TYPE_OPTIONS]}
            textField="text"
            valueField="id"
            value={type}
            onChange={v => setType((v as string) ?? '')}
          />
        </FormGrid>
      </FormCard>

      <FormCard>
        <GridPanel
          data={rows}
          searchBox
          searchPlaceholder="Search by code or name..."
          searchFields={['code', 'name']}
          toolbar={
            <Button
              label="Add Subject / Lab"
              icon="plus"
              variant="primary"
              onClick={() => open()}
            />
          }
          columns={[
            { field: 'code', header: 'Code', sortable: true },
            { field: 'name', header: 'Name', sortable: true },
            {
              header: 'Type',
              cell: (s: Subject) => (
                <StatusBadge
                  label={
                    s.type === 'Theory' ? 'Theory — Subject' : 'Practical — Lab'
                  }
                  variant={s.type === 'Theory' ? 'info' : 'approved'}
                />
              ),
            },
            { field: 'program', header: 'Program' },
            { field: 'semester', header: 'Semester', sortable: true },
            {
              header: 'Actions',
              width: '170px',
              cell: (s: Subject) => (
                <div className="flex gap-1">
                  <Button
                    label="Edit"
                    icon="pencil"
                    variant="text"
                    size="small"
                    onClick={() => open(s)}
                  />
                  <Button
                    label="Delete"
                    icon="trash"
                    variant="text"
                    size="small"
                    onClick={() => setDeleting(s)}
                  />
                </div>
              ),
            },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={!!editing}
        onHide={() => setEditing(null)}
        title={editing?.id ? 'Edit Subject / Lab' : 'Add Subject / Lab'}
        subtitle={`${scope.dept} · ${scope.branch}`}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setEditing(null)}
            />
            <Button
              label="Save"
              icon="check"
              variant="primary"
              onClick={save}
            />
          </div>
        }
      >
        {editing && (
          <div className="flex flex-col gap-4">
            <StageNote>
              Use <b>Theory — Subject</b> for codes applicants enter in Subject
              1–4, and <b>Practical — Lab</b> for Lab 1–8.
            </StageNote>
            <FormGrid columns={2}>
              <TextBox
                label="Code"
                required
                placeholder="e.g. CER301 or CERL30"
                value={editing.code}
                errorMessage={errors.code}
                onChange={v =>
                  setEditing({
                    ...editing,
                    code: v.toUpperCase().replace(/\s/g, ''),
                  })
                }
              />
              <TextBox
                label="Subject / Lab Name"
                required
                placeholder="e.g. Data Structures"
                value={editing.name}
                errorMessage={errors.name}
                onChange={v => setEditing({ ...editing, name: v })}
              />
              <DropDownList
                label="Type"
                required
                data={TYPE_OPTIONS}
                textField="text"
                valueField="id"
                value={editing.type}
                onChange={v =>
                  setEditing({
                    ...editing,
                    type: ((v as string) ?? 'Theory') as Subject['type'],
                  })
                }
              />
              <DropDownList
                label="Program"
                required
                placeholder="— Select —"
                data={PROGRAM_OPTIONS}
                textField="text"
                valueField="id"
                value={editing.program}
                errorMessage={errors.program}
                onChange={v =>
                  setEditing({ ...editing, program: (v as string) ?? '' })
                }
              />
              <DropDownList
                label="Semester"
                required
                placeholder="— Select —"
                data={SEMESTER_NUMBER_OPTIONS}
                textField="text"
                valueField="id"
                value={editing.semester}
                errorMessage={errors.semester}
                onChange={v =>
                  setEditing({ ...editing, semester: (v as string) ?? '' })
                }
              />
            </FormGrid>
          </div>
        )}
      </FormPopup>

      <ConfirmDialog
        visible={!!deleting}
        onHide={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return;
          removeSubject(deleting.id);
          ToastService.success(
            `${deleting.code} removed from the subject master.`
          );
          setDeleting(null);
        }}
        title="Delete Subject / Lab"
        message={
          deleting
            ? `Remove ${deleting.code} — ${deleting.name} from the subject master? Applicants will no longer be able to use this code.`
            : ''
        }
        confirmLabel="Delete"
        variant="danger"
      />
    </FormPage>
  );
}
