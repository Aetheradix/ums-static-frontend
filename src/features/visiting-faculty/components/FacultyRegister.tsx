import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DatePicker, DropDownList } from 'shared/components/forms';
import {
  ConfirmDialog,
  FormCard,
  FormGrid,
  FormPopup,
  GridPanel,
} from 'shared/new-components';
import { deptName } from '../data';
import { useVisitingFacultyStore } from '../store';
import type { Faculty } from '../types';
import { formatDate, fromIso, toIso } from '../utils';
import { useFaculty } from './hooks';
import { StageNote, UniqueIdChip } from './ui';

type Appointment = Faculty['appointments'][number];

/**
 * Joined visiting faculty — one row per Unique ID with every UTD they teach
 * in. `department` limits the list to faculty joined in that UTD and lets
 * that department enter the joining date once, after Registrar & VC
 * approval. A joining date, once saved, cannot be changed.
 */
export default function FacultyRegister({
  department,
  branch,
  canEdit = false,
}: {
  department?: string;
  /** Limits the list to one branch — the HOD login. */
  branch?: string;
  /** Only the branch HOD enters joining dates; the UTD Department views them. */
  canEdit?: boolean;
}) {
  const setJoiningDate = useVisitingFacultyStore(s => s.setJoiningDate);
  const faculty = useFaculty().filter(
    f =>
      !department ||
      f.appointments.some(
        a => a.department === department && (!branch || a.branch === branch)
      )
  );

  const [editing, setEditing] = useState<{
    faculty: Faculty;
    appointment: Appointment;
  } | null>(null);
  const [date, setDate] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [dateFilter, setDateFilter] = useState<'' | 'assigned' | 'pending'>('');

  /** This department's appointments of a faculty (two if re-applied for another subject). */
  const own = (f: Faculty) =>
    f.appointments.filter(
      a => a.department === department && (!branch || a.branch === branch)
    );
  const pending = department
    ? faculty.flatMap(f =>
        own(f)
          .filter(a => !a.joiningDate)
          .map(a => ({ f, a }))
      )
    : [];

  /** Joining date still to be entered (for this department, or any UTD). */
  const awaitingDate = (f: Faculty) =>
    (department ? own(f) : f.appointments).some(a => !a.joiningDate);
  const assignedCount = faculty.filter(f => !awaitingDate(f)).length;
  const pendingCount = faculty.length - assignedCount;
  const visible = faculty.filter(f =>
    dateFilter === 'assigned'
      ? !awaitingDate(f)
      : dateFilter === 'pending'
        ? awaitingDate(f)
        : true
  );

  const open = (f: Faculty, a: Appointment) => {
    setEditing({ faculty: f, appointment: a });
    setDate('');
  };

  const requestSave = () => {
    if (!date) {
      ToastService.error('Select the joining date.');
      return;
    }
    setConfirming(true);
  };

  const save = () => {
    if (!editing) return;
    setJoiningDate(editing.appointment.appId, date);
    ToastService.success(
      `Joining date ${formatDate(date)} saved for ${editing.faculty.fullName}. It is now final.`
    );
    setConfirming(false);
    setEditing(null);
  };

  const joiningCell = (f: Faculty) => {
    if (!department) {
      return (
        <div className="flex flex-col gap-0.5 text-sm">
          {f.appointments.map(a => (
            <span key={a.appId}>
              {a.department}:{' '}
              {a.joiningDate ? (
                formatDate(a.joiningDate)
              ) : (
                <span className="text-amber-600 dark:text-amber-400">
                  Not entered
                </span>
              )}
            </span>
          ))}
        </div>
      );
    }
    return (
      <div className="flex flex-col items-start gap-1">
        {own(f).map(a =>
          a.joiningDate ? (
            <span
              key={a.appId}
              className="inline-flex items-center gap-1 text-sm font-medium"
              title="Final — cannot be changed"
            >
              <i className="pi pi-lock text-xs text-slate-400" />
              {formatDate(a.joiningDate)}
            </span>
          ) : !canEdit ? (
            <span
              key={a.appId}
              className="text-sm text-amber-600 dark:text-amber-400"
            >
              Awaiting {a.branch} HOD
            </span>
          ) : (
            <Button
              key={a.appId}
              label="Add Joining Date"
              icon="calendar-plus"
              variant="outlined"
              size="small"
              onClick={() => open(f, a)}
            />
          )
        )}
      </div>
    );
  };

  return (
    <>
      {pending.length > 0 && (
        <StageNote tone="warning">
          {pending.length} faculty approved by Registrar &amp; VC are waiting
          for their joining date: {pending.map(p => p.f.fullName).join(', ')}.
          {canEdit
            ? 'Enter it once they join — it cannot be changed later.'
            : 'The branch HOD enters it once they join.'}
        </StageNote>
      )}
      <FormCard title="Filter" icon="filter">
        <FormGrid columns={3}>
          <DropDownList
            label="Joining Date"
            data={[
              { id: '', text: `All Faculty (${faculty.length})` },
              { id: 'assigned', text: `Date Assigned (${assignedCount})` },
              { id: 'pending', text: `Date Not Assigned (${pendingCount})` },
            ]}
            textField="text"
            valueField="id"
            value={dateFilter}
            onChange={v =>
              setDateFilter(
                ((v as string) ?? '') as '' | 'assigned' | 'pending'
              )
            }
          />
        </FormGrid>
      </FormCard>
      <FormCard
        title="Joined Visiting Faculty"
        subtitle="One Unique ID per faculty for the whole university — every department is linked under it."
        icon="id-card"
      >
        <GridPanel
          data={visible}
          searchBox
          searchPlaceholder="Search by name, Unique ID or PAN..."
          searchFields={['fullName', 'uniqueId', 'pan']}
          columns={[
            {
              header: 'Unique ID',
              cell: (f: Faculty) => <UniqueIdChip value={f.uniqueId} />,
            },
            { field: 'fullName', header: 'Name', sortable: true },
            { field: 'pan', header: 'PAN' },
            { field: 'mobile', header: 'Mobile' },
            {
              header: 'Departments',
              cell: (f: Faculty) => (
                <div className="flex flex-wrap gap-1">
                  {f.departments.map(d => (
                    <span
                      key={d}
                      className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                        d === department
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              ),
            },
            {
              header: 'Subjects / Labs',
              cell: (f: Faculty) => (
                <span>{[...f.subjects, ...f.labs].join(', ')}</span>
              ),
            },
            {
              header: 'Approved by Registrar & VC',
              cell: (f: Faculty) => (
                <span>
                  {formatDate(
                    department
                      ? own(f)[0]?.approvedOn
                      : f.appointments[0]?.approvedOn
                  )}
                </span>
              ),
            },
            { header: 'Joining Date', cell: joiningCell },
          ]}
        />
      </FormCard>

      <FormPopup
        visible={!!editing}
        onHide={() => setEditing(null)}
        title="Add Joining Date"
        subtitle={
          editing
            ? `${editing.faculty.fullName} · ${editing.faculty.uniqueId} · ${deptName(editing.appointment.department)}`
            : undefined
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setEditing(null)}
            />
            <Button
              label="Save Joining Date"
              icon="lock"
              variant="primary"
              onClick={requestSave}
            />
          </div>
        }
      >
        {editing && (
          <div className="flex flex-col gap-4">
            <StageNote tone="warning">
              The joining date can be added <b>only once</b>. After you save it,
              it is final and cannot be edited.
            </StageNote>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Approved by Registrar &amp; VC on{' '}
              <b>{formatDate(editing.appointment.approvedOn)}</b>. The joining
              date cannot be earlier than this.
            </p>
            <DatePicker
              label="Joining Date"
              required
              minDate={fromIso(editing.appointment.approvedOn)}
              maxDate={new Date()}
              value={fromIso(date)}
              onChange={v => setDate(v ? toIso(v) : '')}
            />
          </div>
        )}
      </FormPopup>

      <ConfirmDialog
        visible={confirming}
        onHide={() => setConfirming(false)}
        onConfirm={save}
        title="Confirm Joining Date"
        message={
          editing
            ? `Set ${formatDate(date)} as the joining date of ${editing.faculty.fullName} in ${editing.appointment.department}? This is final — it cannot be changed later.`
            : ''
        }
        confirmLabel="Yes, Save — Final"
        variant="warning"
      />
    </>
  );
}
