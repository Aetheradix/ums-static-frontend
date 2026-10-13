import { DropDownList, MultiSelectList } from 'shared/components/forms';
import {
  PreviewField,
  PreviewSection,
  StatusBadge,
} from 'shared/new-components';
import { DEPARTMENT_OPTIONS, deptName } from '../data';
import { useVisitingFacultyStore } from '../store';
import type { Application } from '../types';
import { applicationVariant, formatDate, makeUniqueId } from '../utils';

type Option = { id: string; text: string };

/** Multi-select over `{ id, text }` options that reads and writes `string[]`. */
export function MultiPick({
  label,
  subLabel,
  options,
  value,
  onChange,
  required,
  errorMessage,
  placeholder = '— Select —',
}: {
  label: string;
  subLabel?: string;
  options: Option[];
  value: string[];
  onChange: (v: string[]) => void;
  required?: boolean;
  errorMessage?: string;
  placeholder?: string;
}) {
  return (
    <MultiSelectList
      label={label}
      subLabel={subLabel}
      required={required}
      errorMessage={errorMessage}
      placeholder={placeholder}
      data={options}
      textField="text"
      valueField="id"
      value={value as unknown as Option[]}
      onChange={v => onChange((v as unknown as string[]) ?? [])}
    />
  );
}

/**
 * Auth is mocked, so the department login lets the reviewer pick which UTD
 * they are signed in as. Every department page filters by this choice.
 */
export function DeptSwitcher() {
  const currentDept = useVisitingFacultyStore(s => s.currentDept);
  const setCurrentDept = useVisitingFacultyStore(s => s.setCurrentDept);
  return (
    <div className="w-72 max-w-full">
      <DropDownList
        label="Signed in as UTD"
        data={DEPARTMENT_OPTIONS}
        textField="text"
        valueField="id"
        value={currentDept}
        onChange={v => v && setCurrentDept(v as string)}
      />
    </div>
  );
}

export function StageNote({
  tone = 'info',
  children,
}: {
  tone?: 'info' | 'warning' | 'success';
  children: React.ReactNode;
}) {
  const tones = {
    info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200',
    warning:
      'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
    success:
      'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-200',
  };
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${tones[tone]}`}
    >
      <i className="pi pi-info-circle mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

export function UniqueIdChip({ value }: { value: string }) {
  return (
    <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-mono text-xs font-semibold tracking-wide text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
      {value}
    </span>
  );
}

/** Everything the applicant submitted, on one screen (stage J2). */
export function ApplicationDetails({ app }: { app: Application }) {
  const list = (v: string[]) => v.filter(Boolean).join(', ') || '—';
  return (
    <div className="flex flex-col gap-4">
      <PreviewSection title="Application">
        <PreviewField label="Application No." value={app.applicationNo} />
        <PreviewField
          label="Unique ID"
          value={<UniqueIdChip value={makeUniqueId(app.fullName, app.pan)} />}
        />
        <PreviewField
          label="Status"
          value={
            <StatusBadge
              label={app.status}
              variant={applicationVariant(app.status)}
            />
          }
        />
        <PreviewField
          label="Submitted On"
          value={formatDate(app.submittedOn)}
        />
        <PreviewField label="Department" value={deptName(app.department)} />
        <PreviewField label="Designation" value={app.designation} />
      </PreviewSection>
      <PreviewSection title="Personal Information">
        <PreviewField label="Full Name" value={app.fullName} />
        <PreviewField label="Mobile No" value={app.mobile} />
        <PreviewField label="E-Mail" value={app.email} />
        <PreviewField label="PAN No" value={app.pan} />
        <PreviewField label="Aadhar No" value={app.aadhar} />
        <PreviewField
          label="Date of Appointment"
          value={formatDate(app.dateOfAppointment)}
        />
        <PreviewField label="Qualification" value={list(app.qualifications)} />
        <PreviewField label="Address" value={app.address} fullWidth />
      </PreviewSection>
      <PreviewSection title="Teaching / Lab Assignment">
        <PreviewField label="Session" value={app.session} />
        <PreviewField label="Semester" value={app.semester} />
        <PreviewField label="Program" value={list(app.programs)} />
        <PreviewField label="Branch" value={list(app.branches)} />
        <PreviewField label="Year" value={list(app.years)} />
        <PreviewField label="Subjects" value={list(app.subjects)} />
        <PreviewField label="Labs" value={list(app.labs)} />
        <PreviewField
          label="Hours / Week"
          value={`${app.theoryHoursPerWeek} theory · ${app.practicalHoursPerWeek} practical`}
        />
      </PreviewSection>
      <PreviewSection title="Documents">
        <PreviewField
          label="Resume"
          value={
            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <i className="pi pi-file-pdf" /> {app.resume}
            </span>
          }
        />
        <PreviewField
          label="Highest Qualification"
          value={
            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <i className="pi pi-file-pdf" /> {app.qualificationDocument}
            </span>
          }
        />
      </PreviewSection>
      {(app.interview || app.rejectionReason || app.headOfficeRemarks) && (
        <PreviewSection title="Workflow">
          {app.rejectionReason && (
            <PreviewField
              label="Rejection Reason"
              value={app.rejectionReason}
              fullWidth
            />
          )}
          {app.interview && (
            <>
              <PreviewField
                label="Interview"
                value={`${formatDate(app.interview.date)}, ${app.interview.time}`}
              />
              <PreviewField label="Venue" value={app.interview.venue} />
              <PreviewField label="Committee" value={app.interview.committee} />
              <PreviewField
                label="Result"
                value={
                  app.interview.result
                    ? `${app.interview.result}${app.interview.marks !== undefined ? ` · ${app.interview.marks}/100` : ''}`
                    : 'Awaited'
                }
              />
              {app.interview.remarks && (
                <PreviewField
                  label="Committee Remarks"
                  value={app.interview.remarks}
                  fullWidth
                />
              )}
            </>
          )}
          {app.headOfficeRemarks && (
            <PreviewField
              label="Head Office Remarks"
              value={app.headOfficeRemarks}
              fullWidth
            />
          )}
        </PreviewSection>
      )}
    </div>
  );
}
