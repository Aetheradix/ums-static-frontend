import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  FileUpload,
  NumberBox,
  RadioButtonList,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  PreviewField,
  PreviewSection,
} from 'shared/new-components';
import {
  MultiPick,
  StageNote,
  SubjectCodeField,
  UniqueIdChip,
} from '../components/ui';
import {
  DEPT_BRANCHES,
  DEPARTMENT_OPTIONS,
  DESIGNATION_OPTIONS,
  PROGRAM_OPTIONS,
  QUALIFICATION_OPTIONS,
  SEMESTER_NUMBER_OPTIONS,
  SEMESTER_OPTIONS,
  SESSION_OPTIONS,
  deptName,
} from '../data';
import { useVisitingFacultyStore, type ApplicationForm } from '../store';
import type { Application } from '../types';
import {
  EMAIL_PATTERN,
  PAN_PATTERN,
  currentSemester,
  currentSession,
  formatDate,
  makeUniqueId,
  semesterLabel,
} from '../utils';
import { vfUrls } from '../urls';

type Mode = 'new' | 'reapply';
type ReapplyFor = NonNullable<Application['reapplyFor']>;

const blank = (): ApplicationForm => ({
  fullName: '',
  mobile: '',
  email: '',
  address: '',
  qualifications: [],
  designation: 'Visiting Faculty',
  experienceYears: 0,
  pan: '',
  aadhar: '',
  session: currentSession(),
  semester: currentSemester(),
  programs: [],
  branches: [],
  semesters: [],
  subjects: ['', '', '', ''],
  labs: ['', '', '', '', '', '', '', ''],
  theoryHoursPerWeek: 0,
  practicalHoursPerWeek: 0,
  resume: '',
  qualificationDocument: '',
  panCardDocument: '',
});

/** Statuses that mean an application is still being processed. */
const IN_PROCESS: Application['status'][] = [
  'Submitted',
  'In Scrutiny List',
  'Interview Scheduled',
  'In Merit List',
  'Forwarded to UTD',
  'Pending Approval',
  'Returned by Registrar & VC',
];

const yearsSince = (iso?: string) => {
  if (!iso) return 0;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(Math.floor(ms / (365.25 * 24 * 3600 * 1000)), 0);
};

type Errors = Partial<
  Record<keyof ApplicationForm | 'departments' | 'lookup', string>
>;

/**
 * The public registration form. `new` is the full first-time form;
 * `reapply` first looks the applicant up by PAN + mobile, fills their
 * personal details from the earlier registration, and lets them apply for
 * another subject or another UTD Department.
 */
export default function RegistrationForm({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const applications = useVisitingFacultyStore(s => s.applications);
  const submitApplication = useVisitingFacultyStore(s => s.submitApplication);
  const subjectMaster = useVisitingFacultyStore(s => s.subjects);

  const [form, setForm] = useState<ApplicationForm>(blank);
  const [departments, setDepartments] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<Application[] | null>(null);

  // Re-apply only
  const [lookup, setLookup] = useState({ pan: '', mobile: '' });
  const [previous, setPrevious] = useState<Application[] | null>(null);
  const [reapplyFor, setReapplyFor] = useState<ReapplyFor>('Another Subject');
  const [davvExperience, setDavvExperience] = useState(0);
  const [reSemester, setReSemester] = useState<'' | 'Odd' | 'Even'>('');

  const isReapply = mode === 'reapply';

  /** Branches (one HOD each) offered by the selected UTD Departments. */
  const branchOptions = [
    ...new Set(
      (departments.length ? departments : Object.keys(DEPT_BRANCHES)).flatMap(
        d => DEPT_BRANCHES[d] ?? []
      )
    ),
  ].map(b => ({ id: b, text: b }));
  const locked = isReapply; // personal details come from the earlier registration

  const set = <K extends keyof ApplicationForm>(
    key: K,
    value: ApplicationForm[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const setAt = (key: 'subjects' | 'labs', i: number, value: string) =>
    set(
      key,
      form[key].map((v, idx) => (idx === i ? value.toUpperCase() : v))
    );

  // ── Re-apply: earlier registration ──────────────────────────
  const joinedBefore = useMemo(
    () =>
      (previous ?? [])
        .filter(a => a.status === 'Joined')
        .sort((a, b) => (a.joinedOn ?? '').localeCompare(b.joinedOn ?? '')),
    [previous]
  );
  const firstAppointment = joinedBefore[0];
  const joinedDepts = joinedBefore.map(a => a.department);
  const blockedDepts = (previous ?? [])
    .filter(a => a.status === 'Joined' || IN_PROCESS.includes(a.status))
    .map(a => a.department);

  const deptOptions = !isReapply
    ? DEPARTMENT_OPTIONS
    : reapplyFor === 'Another Subject'
      ? DEPARTMENT_OPTIONS.filter(o =>
          (joinedDepts.length
            ? joinedDepts
            : (previous ?? []).map(a => a.department)
          ).includes(o.id)
        )
      : DEPARTMENT_OPTIONS.filter(o => !blockedDepts.includes(o.id));

  const demoFaculty = useMemo(() => {
    const seen = new Set<string>();
    return applications
      .filter(a => a.status === 'Joined' && !seen.has(a.pan) && seen.add(a.pan))
      .slice(0, 3);
  }, [applications]);

  const findRegistration = () => {
    const pan = lookup.pan.trim().toUpperCase();
    const mobile = lookup.mobile.trim();
    if (!PAN_PATTERN.test(pan) || !/^\d{10}$/.test(mobile)) {
      setErrors({ lookup: 'Enter a valid PAN and 10-digit mobile number.' });
      return;
    }
    const matches = applications.filter(
      a => a.pan === pan && a.mobile === mobile
    );
    if (!matches.length) {
      setErrors({
        lookup:
          'No registration found for this PAN and mobile number. Use New Registration instead.',
      });
      return;
    }
    const joined = matches
      .filter(a => a.status === 'Joined')
      .sort((a, b) => (a.joinedOn ?? '').localeCompare(b.joinedOn ?? ''));
    const base =
      joined[0] ??
      [...matches].sort((a, b) =>
        b.submittedOn.localeCompare(a.submittedOn)
      )[0];

    setPrevious(matches);
    setForm({
      ...blank(),
      fullName: base.fullName,
      mobile: base.mobile,
      email: base.email,
      address: base.address,
      pan: base.pan,
      aadhar: base.aadhar,
      experienceYears: base.experienceYears,
      qualifications: base.qualifications,
      designation: base.designation,
      // Teaching / Lab Assignment is left empty — the applicant fills it fresh.
      session: '',
    });
    const mode: ReapplyFor = joined.length
      ? 'Another Subject'
      : 'Another UTD Department';
    setReapplyFor(mode);
    setDepartments(mode === 'Another Subject' ? [joined[0].department] : []);
    setDavvExperience(yearsSince(joined[0]?.joinedOn));
    setReSemester('');
    setErrors({});
    ToastService.success(`Welcome back, ${base.fullName}. Details filled in.`);
  };

  // ── New registration: PAN already on record ─────────────────
  const panOnRecord = useMemo(() => {
    if (isReapply || !PAN_PATTERN.test(form.pan)) return null;
    return applications.find(a => a.pan === form.pan) ?? null;
  }, [applications, form.pan, isReapply]);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!/^[6-9]\d{9}$/.test(form.mobile))
      e.mobile = 'Enter a valid 10-digit mobile number.';
    if (!EMAIL_PATTERN.test(form.email)) e.email = 'Enter a valid e-mail.';
    if (!form.address.trim()) e.address = 'Address is required.';
    if (!form.qualifications.length)
      e.qualifications = 'Select at least one qualification.';
    if (form.experienceYears < 0 || form.experienceYears > 60)
      e.experienceYears = 'Enter experience in years (0–60).';
    if (!departments.length)
      e.departments = 'Select at least one UTD Department.';
    if (!PAN_PATTERN.test(form.pan))
      e.pan = 'PAN must be in the format ABCDE1234F.';
    else if (panOnRecord)
      e.pan = 'This PAN is already registered — use Re-apply instead.';
    if (!/^\d{12}$/.test(form.aadhar)) e.aadhar = 'Aadhar must be 12 digits.';
    if (!form.programs.length) e.programs = 'Select at least one program.';
    if (!form.branches.length) e.branches = 'Select the branch.';
    else {
      const notOffered = departments.find(
        d => !DEPT_BRANCHES[d]?.includes(form.branches[0])
      );
      if (notOffered)
        e.branches = `${form.branches[0]} is not a branch of ${notOffered}.`;
    }
    if (!form.semesters.length) e.semesters = 'Select at least one semester.';
    if (!form.session) e.session = 'Select the session.';
    if (isReapply && !reSemester)
      e.semester = 'Select July – Dec or Jan – June.';
    if (!form.subjects.some(Boolean) && !form.labs.some(Boolean))
      e.subjects = 'Enter at least one subject or lab code.';
    const unknown = (codes: string[], type: 'Theory' | 'Practical') =>
      codes
        .filter(Boolean)
        .find(c => !subjectMaster.some(m => m.code === c && m.type === type));
    const badSubject = unknown(form.subjects, 'Theory');
    if (badSubject && !e.subjects)
      e.subjects = `${badSubject} is not a theory subject in the subject master.`;
    const badLab = unknown(form.labs, 'Practical');
    if (badLab) e.labs = `${badLab} is not a lab in the subject master.`;
    if (!form.theoryHoursPerWeek && !form.practicalHoursPerWeek)
      e.theoryHoursPerWeek = 'Enter theory or practical hours per week.';
    if (!form.resume) e.resume = 'Upload your resume.';
    if (!form.qualificationDocument)
      e.qualificationDocument = 'Upload your highest qualification document.';
    if (!form.panCardDocument) e.panCardDocument = 'Upload your PAN card.';

    // One application in process per PAN per department.
    const clash = departments.find(d =>
      applications.some(
        a =>
          a.pan === form.pan &&
          a.department === d &&
          IN_PROCESS.includes(a.status)
      )
    );
    if (clash && !e.departments)
      e.departments = `An application with this PAN is already in process in ${clash}.`;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      ToastService.error('Please correct the highlighted fields.');
      return;
    }
    const created = submitApplication(
      {
        ...form,
        semester: isReapply && reSemester ? reSemester : form.semester,
        fullName: form.fullName.trim(),
        applicationType: isReapply ? 'Re-apply' : 'New Registration',
        ...(isReapply
          ? { reapplyFor, davvExperienceYears: davvExperience }
          : {}),
      },
      departments
    );
    setSubmitted(created);
    ToastService.success(
      isReapply
        ? 'Re-application submitted successfully.'
        : 'Registration submitted successfully.'
    );
  };

  const reset = () => {
    setForm(blank());
    setDepartments([]);
    setErrors({});
    setSubmitted(null);
    setPrevious(null);
    setLookup({ pan: '', mobile: '' });
  };

  // ── Submitted ───────────────────────────────────────────────
  if (submitted) {
    const first = submitted[0];
    return (
      <FormPage
        title={
          isReapply ? 'Re-application Submitted' : 'Registration Submitted'
        }
      >
        <FormCard>
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300">
              <i className="pi pi-check text-3xl" />
            </span>
            <div>
              <h3 className="text-lg font-bold">Thank you, {first.fullName}</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
                Your application has gone to the login of each UTD Department
                you selected. Track it with the application number or your PAN —
                the interview call and final approval appear on the tracking
                page.
              </p>
            </div>
            <div className="w-full max-w-xl overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              {submitted.map(a => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-2 text-sm last:border-b-0 dark:border-slate-700"
                >
                  <span className="text-left">{deptName(a.department)}</span>
                  <span className="font-mono font-semibold">
                    {a.applicationNo}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {firstAppointment
                ? 'Your Unique ID stays '
                : 'Your Unique ID will be '}
              <UniqueIdChip value={makeUniqueId(first.fullName, first.pan)} />
              {firstAppointment
                ? ' — the new subject / department is added under it on approval.'
                : ' once joining is approved.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                label="Track Application"
                variant="primary"
                icon="search"
                onClick={() => navigate(vfUrls.public.track)}
              />
              <Button
                label="Back to Registration"
                variant="outlined"
                onClick={() => {
                  reset();
                  navigate(vfUrls.public.register);
                }}
              />
            </div>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  // ── Re-apply: PAN + mobile lookup ───────────────────────────
  if (isReapply && !previous) {
    return (
      <FormPage
        title="Re-apply — Visiting Faculty"
        description="Already registered with DAVV? Enter your PAN and registered mobile number. Your details are filled in automatically."
      >
        <FormCard title="Find Your Registration" icon="search">
          <FormGrid columns={3}>
            <TextBox
              label="PAN No"
              required
              maxLength={10}
              placeholder="ABCDE1234F"
              value={lookup.pan}
              onChange={v =>
                setLookup({
                  ...lookup,
                  pan: v.toUpperCase().replace(/\s/g, ''),
                })
              }
            />
            <TextBox
              label="Mobile No"
              required
              maxLength={10}
              placeholder="Registered 10-digit mobile"
              value={lookup.mobile}
              errorMessage={errors.lookup}
              onChange={v =>
                setLookup({ ...lookup, mobile: v.replace(/\D/g, '') })
              }
            />
          </FormGrid>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              label="Fetch My Details"
              icon="search"
              variant="primary"
              onClick={findRegistration}
            />
            <Button
              label="Back"
              variant="outlined"
              onClick={() => navigate(vfUrls.public.register)}
            />
          </div>
          {demoFaculty.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Demo:</span>
              {demoFaculty.map(a => (
                <button
                  key={a.pan}
                  type="button"
                  className="rounded-full bg-slate-100 px-2 py-1 font-mono text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  onClick={() => setLookup({ pan: a.pan, mobile: a.mobile })}
                >
                  {a.pan} / {a.mobile}
                </button>
              ))}
            </div>
          )}
        </FormCard>
      </FormPage>
    );
  }

  // ── The form (new registration, or re-apply after lookup) ───
  return (
    <FormPage
      title={
        isReapply
          ? 'Re-apply — Visiting Faculty'
          : 'Visiting Faculty Registration — DAVV'
      }
      description={
        isReapply
          ? 'Your personal details are filled in from your earlier registration. Choose another subject or another UTD Department and complete the teaching details.'
          : 'Apply as visiting faculty in one or more University Teaching Departments. Your application goes to each selected department for verification, scrutiny and interview.'
      }
    >
      {isReapply && (
        <FormCard title="Your Registration with DAVV" icon="id-card">
          {firstAppointment ? (
            <PreviewSection title="First Appointment">
              <PreviewField
                label="Unique ID"
                value={
                  <UniqueIdChip
                    value={makeUniqueId(
                      firstAppointment.fullName,
                      firstAppointment.pan
                    )}
                  />
                }
              />
              <PreviewField
                label="UTD Department"
                value={deptName(firstAppointment.department)}
              />
              <PreviewField label="Session" value={firstAppointment.session} />
              <PreviewField
                label="Semester"
                value={`${semesterLabel(firstAppointment.semester)}${
                  firstAppointment.semesters?.length
                    ? ` · ${firstAppointment.semesters.join(', ')}`
                    : ''
                }`}
              />
              <PreviewField
                label="Joined On"
                value={formatDate(firstAppointment.joinedOn)}
              />
              <PreviewField
                label="Currently Teaching In"
                value={joinedDepts.join(', ')}
              />
            </PreviewSection>
          ) : (
            <StageNote tone="warning">
              No joining on record yet — your earlier application(s):{' '}
              {(previous ?? [])
                .map(a => `${a.department} (${a.status})`)
                .join(', ')}
              . You can apply to another UTD Department.
            </StageNote>
          )}
          <div className="mt-4">
            <RadioButtonList
              name="reapply-for"
              label="Re-apply for"
              optionLayout="horizontal"
              options={[
                {
                  label: 'Another Subject (same UTD Department)',
                  value: 'Another Subject',
                  disabled: !joinedDepts.length,
                },
                {
                  label: 'Another UTD Department',
                  value: 'Another UTD Department',
                },
              ]}
              value={reapplyFor}
              onChange={e => {
                const next = e.target.value as ReapplyFor;
                setReapplyFor(next);
                setDepartments(
                  next === 'Another Subject' && joinedDepts[0]
                    ? [joinedDepts[0]]
                    : []
                );
              }}
            />
          </div>
        </FormCard>
      )}

      <FormCard
        title="Personal Information"
        subtitle={
          locked
            ? 'Filled in from your earlier registration — contact the department to change these.'
            : undefined
        }
        icon="id-card"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Full Name"
            subLabel="(As per PAN & Aadhar)"
            required
            disabled={locked}
            placeholder="Full Name as per PAN and Aadhar"
            value={form.fullName}
            errorMessage={errors.fullName}
            onChange={v => set('fullName', v)}
          />
          <TextBox
            label="Mobile No"
            required
            disabled={locked}
            maxLength={10}
            placeholder="10-digit mobile"
            value={form.mobile}
            errorMessage={errors.mobile}
            onChange={v => set('mobile', v.replace(/\D/g, ''))}
          />
          <TextBox
            label="E-Mail"
            required
            disabled={locked}
            placeholder="Email address"
            value={form.email}
            errorMessage={errors.email}
            onChange={v => set('email', v.trim())}
          />
          <div className="md:col-span-3">
            <TextArea
              label="Address"
              required
              disabled={locked}
              rows={2}
              placeholder="Full address"
              value={form.address}
              errorMessage={errors.address}
              onChange={v => set('address', v)}
            />
          </div>
          <TextBox
            label="PAN No"
            required
            disabled={locked}
            maxLength={10}
            placeholder="ABCDE1234F"
            value={form.pan}
            errorMessage={errors.pan}
            onChange={v => set('pan', v.toUpperCase().replace(/\s/g, ''))}
          />
          <TextBox
            label="Aadhar No"
            required
            disabled={locked}
            maxLength={12}
            placeholder="12-digit Aadhar"
            value={form.aadhar}
            errorMessage={errors.aadhar}
            onChange={v => set('aadhar', v.replace(/\D/g, ''))}
          />
          <NumberBox
            label="Total Experience (Years)"
            required
            min={0}
            max={60}
            placeholder="e.g. 5"
            disabled={locked}
            value={form.experienceYears}
            errorMessage={errors.experienceYears}
            onChange={v => set('experienceYears', v ?? 0)}
          />
        </FormGrid>
        {panOnRecord && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <StageNote tone="warning">
              This PAN is already registered with DAVV. Use Re-apply to apply
              for another subject or another UTD Department.
            </StageNote>
            <Button
              label="Go to Re-apply"
              icon="replay"
              variant="outlined"
              onClick={() => navigate(vfUrls.public.reapply)}
            />
          </div>
        )}
      </FormCard>

      <FormCard title="Qualification & Appointment" icon="briefcase">
        <FormGrid columns={3}>
          <MultiPick
            label="Qualification"
            subLabel="(select all that apply)"
            required
            options={QUALIFICATION_OPTIONS}
            value={form.qualifications}
            errorMessage={errors.qualifications}
            onChange={v => set('qualifications', v)}
          />
          {isReapply ? (
            <DropDownList
              label="Designation"
              data={DESIGNATION_OPTIONS}
              textField="text"
              valueField="id"
              value={form.designation}
              onChange={v =>
                set('designation', (v as string) ?? form.designation)
              }
            />
          ) : (
            <TextBox label="Designation" value={form.designation} disabled />
          )}
          <MultiPick
            label="UTD Department"
            subLabel="(select all that apply)"
            required
            placeholder="— Select UTD Department(s) —"
            options={deptOptions}
            value={departments}
            errorMessage={errors.departments}
            onChange={v => {
              setDepartments(v);
              setErrors(prev => ({ ...prev, departments: undefined }));
            }}
          />
          {isReapply && (
            <NumberBox
              label="Experience in DAVV (Years)"
              min={0}
              max={60}
              value={davvExperience}
              onChange={v => setDavvExperience(v ?? 0)}
            />
          )}
        </FormGrid>
      </FormCard>

      <FormCard title="Teaching / Lab Assignment" icon="book">
        <FormGrid columns={4}>
          <DropDownList
            label="Session"
            required
            data={SESSION_OPTIONS}
            textField="text"
            valueField="id"
            placeholder="— Select —"
            value={form.session}
            errorMessage={errors.session}
            onChange={v => set('session', (v as string) ?? '')}
          />
          <DropDownList
            label="Semester Period"
            subLabel={
              isReapply
                ? 'July – Dec or Jan – June'
                : 'Pre-selected from the current month'
            }
            required
            placeholder="— Select —"
            data={SEMESTER_OPTIONS}
            textField="text"
            valueField="id"
            value={isReapply ? reSemester : form.semester}
            errorMessage={errors.semester}
            onChange={v => {
              const next = ((v as string) ?? '') as '' | 'Odd' | 'Even';
              if (isReapply) setReSemester(next);
              else if (next) set('semester', next);
              setErrors(prev => ({ ...prev, semester: undefined }));
            }}
          />
          <MultiPick
            label="Program"
            subLabel="(select all that apply)"
            required
            options={PROGRAM_OPTIONS}
            value={form.programs}
            errorMessage={errors.programs}
            onChange={v => set('programs', v)}
          />
          <DropDownList
            label="Branch"
            subLabel="Your application goes to this branch's HOD"
            required
            placeholder="— Select —"
            data={branchOptions}
            textField="text"
            valueField="id"
            value={form.branches[0] ?? ''}
            errorMessage={errors.branches}
            onChange={v => set('branches', v ? [v as string] : [])}
          />
          <MultiPick
            label="Semester"
            subLabel="(select all that apply)"
            required
            options={SEMESTER_NUMBER_OPTIONS}
            value={form.semesters}
            errorMessage={errors.semesters}
            onChange={v => set('semesters', v)}
          />
          {form.subjects.map((s, i) => (
            <SubjectCodeField
              key={`subject-${i}`}
              label={`Subject ${i + 1}`}
              placeholder="Subject Code"
              expected="Theory"
              value={s}
              errorMessage={i === 0 ? errors.subjects : undefined}
              onChange={v => setAt('subjects', i, v)}
            />
          ))}
        </FormGrid>
        <div className="mt-4">
          <FormGrid columns={4}>
            {form.labs.map((l, i) => (
              <SubjectCodeField
                key={`lab-${i}`}
                label={`Lab ${i + 1}`}
                placeholder="Lab code"
                expected="Practical"
                value={l}
                errorMessage={i === 0 ? errors.labs : undefined}
                onChange={v => setAt('labs', i, v)}
              />
            ))}
            <NumberBox
              label="Theory hours/Week"
              required
              min={0}
              max={40}
              placeholder="e.g. 3"
              value={form.theoryHoursPerWeek || undefined}
              errorMessage={errors.theoryHoursPerWeek}
              onChange={v => set('theoryHoursPerWeek', v ?? 0)}
            />
            <NumberBox
              label="Practical hours/Week"
              required
              min={0}
              max={40}
              placeholder="e.g. 2"
              value={form.practicalHoursPerWeek || undefined}
              onChange={v => set('practicalHoursPerWeek', v ?? 0)}
            />
          </FormGrid>
        </div>
      </FormCard>

      <FormCard
        title="Documents"
        subtitle="PDF, up to 2 MB each. All three documents are compulsory."
        icon="paperclip"
      >
        <FormGrid columns={3}>
          <FileUpload
            label="Resume / Bio-data"
            required
            mode="file"
            accept=".pdf"
            maxSizeKB={2048}
            uploadNote="PDF, up to 2 MB"
            value={form.resume}
            errorMessage={errors.resume}
            onChange={f => set('resume', f ? f.name : '')}
          />
          <FileUpload
            label="Highest Qualification Document"
            required
            mode="file"
            accept=".pdf"
            maxSizeKB={2048}
            uploadNote="Degree / mark sheet of the highest qualification — PDF, up to 2 MB"
            value={form.qualificationDocument}
            errorMessage={errors.qualificationDocument}
            onChange={f => set('qualificationDocument', f ? f.name : '')}
          />
          <FileUpload
            label="PAN Card"
            required
            mode="file"
            accept=".pdf,image/*"
            maxSizeKB={2048}
            uploadNote="Self-attested copy of your PAN card — PDF or image, up to 2 MB"
            value={form.panCardDocument}
            errorMessage={errors.panCardDocument}
            onChange={f => set('panCardDocument', f ? f.name : '')}
          />
        </FormGrid>
      </FormCard>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          label={isReapply ? 'Submit Re-application' : 'Register'}
          icon={isReapply ? 'replay' : 'user-plus'}
          variant="primary"
          onClick={handleSubmit}
        />
        <Button
          label={isReapply ? 'Start Over' : 'Reset'}
          variant="outlined"
          onClick={reset}
        />
        <Button
          label="Back"
          variant="text"
          onClick={() => navigate(vfUrls.public.register)}
        />
      </div>
    </FormPage>
  );
}
