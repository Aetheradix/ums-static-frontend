import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, NumberBox, TextArea } from 'shared/components/forms';
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
import {
  DEPT_BRANCHES,
  PROGRAM_OPTIONS,
  SEMESTER_NUMBER_OPTIONS,
  SEMESTER_OPTIONS,
  SESSION_OPTIONS,
  hodBranchOf,
} from '../../data';
import { useVisitingFacultyStore } from '../../store';
import type { FacultyRequirement } from '../../types';
import {
  currentSession,
  formatDate,
  semesterLabel,
  todayIso,
} from '../../utils';

type Row = FacultyRequirement & {
  subjectName: string;
  type: string;
  applied: number;
  appointed: number;
};

const blank = (department: string, branch: string): FacultyRequirement => ({
  id: '',
  department,
  branch,
  session: currentSession(),
  semesterPeriod: 'Odd',
  program: '',
  semester: '',
  subjectCode: '',
  facultyRequired: 1,
  hoursPerWeek: 4,
  remarks: '',
  createdOn: '',
});

/**
 * Visiting faculty needed per subject, by academic session and semester
 * period. The branch HOD maintains it; the UTD Department views it.
 */
export default function Requirements() {
  const scope = useScope();
  const subjects = useVisitingFacultyStore(s => s.subjects);
  const requirements = useVisitingFacultyStore(s => s.requirements);
  const applications = useVisitingFacultyStore(s => s.applications);
  const saveRequirement = useVisitingFacultyStore(s => s.saveRequirement);
  const removeRequirement = useVisitingFacultyStore(s => s.removeRequirement);

  const [session, setSession] = useState(currentSession());
  const [period, setPeriod] = useState('');
  const [branch, setBranch] = useState('');
  const [editing, setEditing] = useState<FacultyRequirement | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subjectOf = (code: string) => subjects.find(s => s.code === code);

  const rows: Row[] = requirements
    .filter(
      r =>
        r.department === scope.dept &&
        (scope.isHod
          ? r.branch === scope.branch
          : !branch || r.branch === branch) &&
        (!session || r.session === session) &&
        (!period || r.semesterPeriod === period)
    )
    .map(r => {
      // Applications that offer this subject in the same branch and session.
      const matching = applications.filter(
        a =>
          a.department === r.department &&
          hodBranchOf(a) === r.branch &&
          a.session === r.session &&
          [...a.subjects, ...a.labs].includes(r.subjectCode) &&
          !['Rejected', 'Not Selected'].includes(a.status)
      );
      const s = subjectOf(r.subjectCode);
      return {
        ...r,
        subjectName: s?.name ?? '—',
        type: s?.type ?? '—',
        applied: matching.length,
        appointed: matching.filter(a => a.status === 'Joined').length,
      };
    })
    .sort(
      (a, b) =>
        b.semesterPeriod.localeCompare(a.semesterPeriod) ||
        a.branch.localeCompare(b.branch) ||
        a.semester.localeCompare(b.semester)
    );

  const totalRequired = rows.reduce((s, r) => s + r.facultyRequired, 0);
  const totalAppointed = rows.reduce(
    (s, r) => s + Math.min(r.appointed, r.facultyRequired),
    0
  );

  const branchSubjects = subjects.filter(
    s => s.department === scope.dept && s.branch === scope.branch
  );

  const open = (r?: Row) => {
    setErrors({});
    setEditing(r ? { ...r } : blank(scope.dept, scope.branch ?? ''));
  };

  const save = () => {
    if (!editing) return;
    const e: Record<string, string> = {};
    if (!editing.session) e.session = 'Select the session.';
    if (!editing.program) e.program = 'Select the program.';
    if (!editing.semester) e.semester = 'Select the semester.';
    if (!editing.subjectCode) e.subjectCode = 'Select the subject or lab.';
    if (!editing.facultyRequired || editing.facultyRequired < 1)
      e.facultyRequired = 'At least 1.';
    setErrors(e);
    if (Object.keys(e).length) return;
    saveRequirement({
      ...editing,
      remarks: editing.remarks?.trim() || undefined,
      createdOn: editing.createdOn || todayIso(),
    });
    ToastService.success(
      `Requirement for ${editing.subjectCode} ${editing.id ? 'updated' : 'added'}.`
    );
    setEditing(null);
  };

  const columns: Controls.ColumnProps<Row>[] = [
    { field: 'session', header: 'Session' },
    {
      header: 'Semester Period',
      cell: r => <span>{semesterLabel(r.semesterPeriod)}</span>,
    },
    ...(scope.isHod
      ? []
      : [{ field: 'branch' as const, header: 'Branch (HOD)' }]),
    { field: 'program', header: 'Program' },
    { field: 'semester', header: 'Semester' },
    { field: 'subjectCode', header: 'Code', sortable: true },
    { field: 'subjectName', header: 'Subject / Lab' },
    {
      header: 'Type',
      cell: r => (
        <StatusBadge
          label={r.type === 'Practical' ? 'Lab' : 'Theory'}
          variant={r.type === 'Practical' ? 'approved' : 'info'}
        />
      ),
    },
    { field: 'facultyRequired', header: 'Faculty Required' },
    { field: 'hoursPerWeek', header: 'Hours / Week' },
    {
      header: 'Applications',
      cell: r => <span>{r.applied}</span>,
    },
    {
      header: 'Appointed',
      cell: r => (
        <span
          className={
            r.appointed >= r.facultyRequired
              ? 'font-semibold text-green-700 dark:text-green-400'
              : 'font-semibold text-amber-600 dark:text-amber-400'
          }
        >
          {r.appointed} / {r.facultyRequired}
        </span>
      ),
    },
    { header: 'Remarks', cell: r => <span>{r.remarks ?? '—'}</span> },
    ...(scope.isHod
      ? [
          {
            header: 'Actions',
            width: '170px',
            cell: (r: Row) => (
              <div className="flex gap-1">
                <Button
                  label="Edit"
                  icon="pencil"
                  variant="text"
                  size="small"
                  onClick={() => open(r)}
                />
                <Button
                  label="Delete"
                  icon="trash"
                  variant="text"
                  size="small"
                  onClick={() => setDeleting(r)}
                />
              </div>
            ),
          },
        ]
      : [
          {
            header: 'Added On',
            cell: (r: Row) => <span>{formatDate(r.createdOn)}</span>,
          },
        ]),
  ];

  return (
    <FormPage
      title="Visiting Faculty Requirement"
      description={
        scope.isHod
          ? `Subjects of ${scope.branch} that need visiting faculty, and how many — by academic session and semester period.`
          : `Visiting faculty needed by every branch of ${scope.dept}, as entered by the HODs. View only.`
      }
      breadcrumbs={crumbs(scope.login, 'Faculty Requirement')}
      headerAction={<scope.Switcher />}
    >
      {!scope.isHod && (
        <StageNote>
          Requirements are added by each branch HOD from the HOD login. The UTD
          Department sees them here for review.
        </StageNote>
      )}

      <FormCard title="Filters" icon="filter">
        <FormGrid columns={3}>
          <DropDownList
            label="Academic Session"
            data={[{ id: '', text: 'All Sessions' }, ...SESSION_OPTIONS]}
            textField="text"
            valueField="id"
            value={session}
            onChange={v => setSession((v as string) ?? '')}
          />
          <DropDownList
            label="Semester Period"
            data={[{ id: '', text: 'All' }, ...SEMESTER_OPTIONS]}
            textField="text"
            valueField="id"
            value={period}
            onChange={v => setPeriod((v as string) ?? '')}
          />
          {!scope.isHod && (
            <DropDownList
              label="Branch (HOD)"
              data={[
                { id: '', text: 'All Branches' },
                ...(DEPT_BRANCHES[scope.dept] ?? []).map(b => ({
                  id: b,
                  text: b,
                })),
              ]}
              textField="text"
              valueField="id"
              value={branch}
              onChange={v => setBranch((v as string) ?? '')}
            />
          )}
        </FormGrid>
      </FormCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Requirements"
          value={rows.length}
          icon="list"
          colorScheme="blue"
          subtitle="Subjects / labs"
        />
        <StatCard
          title="Faculty Required"
          value={totalRequired}
          icon="users"
          colorScheme="purple"
        />
        <StatCard
          title="Appointed"
          value={totalAppointed}
          icon="check-circle"
          colorScheme="green"
          subtitle="Against these requirements"
        />
        <StatCard
          title="Still Open"
          value={Math.max(totalRequired - totalAppointed, 0)}
          icon="hourglass"
          colorScheme="amber"
        />
      </div>

      <FormCard>
        <GridPanel
          data={rows}
          searchBox
          searchPlaceholder="Search by code or subject..."
          searchFields={['subjectCode', 'subjectName', 'branch', 'program']}
          toolbar={
            scope.isHod ? (
              <Button
                label="Add Requirement"
                icon="plus"
                variant="primary"
                onClick={() => open()}
              />
            ) : undefined
          }
          columns={columns}
        />
      </FormCard>

      <FormPopup
        visible={!!editing}
        onHide={() => setEditing(null)}
        title={editing?.id ? 'Edit Requirement' : 'Add Requirement'}
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
          <FormGrid columns={2}>
            <DropDownList
              label="Academic Session"
              required
              data={SESSION_OPTIONS}
              textField="text"
              valueField="id"
              value={editing.session}
              errorMessage={errors.session}
              onChange={v =>
                setEditing({ ...editing, session: (v as string) ?? '' })
              }
            />
            <DropDownList
              label="Semester Period"
              required
              data={SEMESTER_OPTIONS}
              textField="text"
              valueField="id"
              value={editing.semesterPeriod}
              onChange={v =>
                setEditing({
                  ...editing,
                  semesterPeriod: ((v as string) ?? 'Odd') as 'Odd' | 'Even',
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
            <div className="md:col-span-2">
              <DropDownList
                label="Subject / Lab"
                required
                filter
                placeholder="— Select from the Subject Master —"
                data={branchSubjects
                  .filter(
                    s => !editing.semester || s.semester === editing.semester
                  )
                  .map(s => ({
                    id: s.code,
                    text: `${s.code} — ${s.name} (${s.type === 'Practical' ? 'Lab' : 'Theory'})`,
                  }))}
                textField="text"
                valueField="id"
                value={editing.subjectCode}
                errorMessage={errors.subjectCode}
                onChange={v =>
                  setEditing({ ...editing, subjectCode: (v as string) ?? '' })
                }
              />
            </div>
            <NumberBox
              label="Visiting Faculty Required"
              required
              min={1}
              max={20}
              value={editing.facultyRequired}
              errorMessage={errors.facultyRequired}
              onChange={v =>
                setEditing({ ...editing, facultyRequired: v ?? 0 })
              }
            />
            <NumberBox
              label="Hours / Week"
              min={0}
              max={40}
              value={editing.hoursPerWeek}
              onChange={v => setEditing({ ...editing, hoursPerWeek: v ?? 0 })}
            />
            <div className="md:col-span-2">
              <TextArea
                label="Remarks"
                rows={2}
                value={editing.remarks ?? ''}
                onChange={v => setEditing({ ...editing, remarks: v })}
              />
            </div>
          </FormGrid>
        )}
      </FormPopup>

      <ConfirmDialog
        visible={!!deleting}
        onHide={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return;
          removeRequirement(deleting.id);
          ToastService.success(
            `Requirement for ${deleting.subjectCode} removed.`
          );
          setDeleting(null);
        }}
        title="Delete Requirement"
        message={
          deleting
            ? `Remove the requirement of ${deleting.facultyRequired} faculty for ${deleting.subjectCode} — ${deleting.subjectName}?`
            : ''
        }
        confirmLabel="Delete"
        variant="danger"
      />
    </FormPage>
  );
}
