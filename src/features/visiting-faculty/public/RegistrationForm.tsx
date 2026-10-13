import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DatePicker,
  DropDownList,
  FileUpload,
  NumberBox,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { MultiPick, StageNote, UniqueIdChip } from '../components/ui';
import {
  BRANCH_OPTIONS,
  DEPARTMENT_OPTIONS,
  PROGRAM_OPTIONS,
  QUALIFICATION_OPTIONS,
  SEMESTER_OPTIONS,
  SESSION_OPTIONS,
  YEAR_OPTIONS,
  deptName,
} from '../data';
import { useVisitingFacultyStore, type ApplicationForm } from '../store';
import type { Application } from '../types';
import {
  EMAIL_PATTERN,
  PAN_PATTERN,
  currentSemester,
  currentSession,
  fromIso,
  makeUniqueId,
  toIso,
} from '../utils';
import { vfUrls } from '../urls';

const blank = (): ApplicationForm => ({
  fullName: '',
  mobile: '',
  email: '',
  address: '',
  qualifications: [],
  designation: 'Visiting Faculty',
  dateOfAppointment: '',
  pan: '',
  aadhar: '',
  session: currentSession(),
  semester: currentSemester(),
  programs: [],
  branches: [],
  years: [],
  subjects: ['', '', '', ''],
  labs: ['', '', '', '', '', '', '', ''],
  theoryHoursPerWeek: 0,
  practicalHoursPerWeek: 0,
  resume: '',
  qualificationDocument: '',
});

type Errors = Partial<Record<keyof ApplicationForm | 'departments', string>>;

export default function RegistrationForm() {
  const navigate = useNavigate();
  const applications = useVisitingFacultyStore(s => s.applications);
  const submitApplication = useVisitingFacultyStore(s => s.submitApplication);

  const [form, setForm] = useState<ApplicationForm>(blank);
  const [departments, setDepartments] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<Application[] | null>(null);

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

  /** PAN already belongs to a joined faculty — the same Unique ID is reused. */
  const existingFaculty = useMemo(() => {
    if (!PAN_PATTERN.test(form.pan)) return null;
    return (
      applications.find(a => a.pan === form.pan && a.status === 'Joined') ??
      null
    );
  }, [applications, form.pan]);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!/^[6-9]\d{9}$/.test(form.mobile))
      e.mobile = 'Enter a valid 10-digit mobile number.';
    if (!EMAIL_PATTERN.test(form.email)) e.email = 'Enter a valid e-mail.';
    if (!form.address.trim()) e.address = 'Address is required.';
    if (!form.qualifications.length)
      e.qualifications = 'Select at least one qualification.';
    if (!form.dateOfAppointment)
      e.dateOfAppointment = 'Date of appointment is required.';
    if (!departments.length) e.departments = 'Select at least one department.';
    if (!PAN_PATTERN.test(form.pan))
      e.pan = 'PAN must be in the format ABCDE1234F.';
    if (!/^\d{12}$/.test(form.aadhar)) e.aadhar = 'Aadhar must be 12 digits.';
    if (!form.programs.length) e.programs = 'Select at least one program.';
    if (!form.branches.length) e.branches = 'Select at least one branch.';
    if (!form.years.length) e.years = 'Select at least one year.';
    if (!form.subjects.some(Boolean) && !form.labs.some(Boolean))
      e.subjects = 'Enter at least one subject or lab code.';
    if (!form.theoryHoursPerWeek && !form.practicalHoursPerWeek)
      e.theoryHoursPerWeek = 'Enter theory or practical hours per week.';
    if (!form.resume) e.resume = 'Upload your resume.';
    if (!form.qualificationDocument)
      e.qualificationDocument = 'Upload your highest qualification document.';

    // One live application per PAN per department.
    const clash = departments.find(d =>
      applications.some(
        a =>
          a.pan === form.pan &&
          a.department === d &&
          !['Rejected', 'Not Selected'].includes(a.status)
      )
    );
    if (clash && !e.pan)
      e.departments = `An application with this PAN is already active in ${clash}.`;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      ToastService.error('Please correct the highlighted fields.');
      return;
    }
    const created = submitApplication(
      { ...form, fullName: form.fullName.trim() },
      departments
    );
    setSubmitted(created);
    ToastService.success('Registration submitted successfully.');
  };

  if (submitted) {
    const first = submitted[0];
    return (
      <FormPage title="Registration Submitted">
        <FormCard>
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300">
              <i className="pi pi-check text-3xl" />
            </span>
            <div>
              <h3 className="text-lg font-bold">Thank you, {first.fullName}</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
                Your application has gone to the login of each department you
                selected. Track it with the application number or your PAN — the
                interview call and final approval appear on the tracking page.
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
              Your Unique ID will be{' '}
              <UniqueIdChip value={makeUniqueId(first.fullName, first.pan)} />{' '}
              once joining is approved.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                label="Track Application"
                variant="primary"
                icon="search"
                onClick={() => navigate(vfUrls.public.track)}
              />
              <Button
                label="New Registration"
                variant="outlined"
                onClick={() => {
                  setForm(blank());
                  setDepartments([]);
                  setSubmitted(null);
                }}
              />
            </div>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Visiting Faculty Registration — DAVV"
      description="Apply as visiting faculty in one or more University Teaching Departments. Your application goes to each selected department for verification, scrutiny and interview."
    >
      <FormCard title="Personal Information" icon="id-card">
        <FormGrid columns={3}>
          <TextBox
            label="Full Name"
            subLabel="(As per PAN & Aadhar)"
            required
            placeholder="Full Name as per PAN and Aadhar"
            value={form.fullName}
            errorMessage={errors.fullName}
            onChange={v => set('fullName', v)}
          />
          <TextBox
            label="Mobile No"
            required
            maxLength={10}
            placeholder="10-digit mobile"
            value={form.mobile}
            errorMessage={errors.mobile}
            onChange={v => set('mobile', v.replace(/\D/g, ''))}
          />
          <TextBox
            label="E-Mail"
            required
            placeholder="Email address"
            value={form.email}
            errorMessage={errors.email}
            onChange={v => set('email', v.trim())}
          />
          <div className="md:col-span-3">
            <TextArea
              label="Address"
              required
              rows={2}
              placeholder="Full address"
              value={form.address}
              errorMessage={errors.address}
              onChange={v => set('address', v)}
            />
          </div>
          <MultiPick
            label="Qualification"
            subLabel="(select all that apply)"
            required
            options={QUALIFICATION_OPTIONS}
            value={form.qualifications}
            errorMessage={errors.qualifications}
            onChange={v => set('qualifications', v)}
          />
          <TextBox label="Designation" value={form.designation} disabled />
          <DatePicker
            label="Date of Appointment"
            required
            value={fromIso(form.dateOfAppointment)}
            errorMessage={errors.dateOfAppointment}
            onChange={v => set('dateOfAppointment', v ? toIso(v) : '')}
          />
          <MultiPick
            label="Department"
            subLabel="(select all that apply)"
            required
            placeholder="— Select Department(s) —"
            options={DEPARTMENT_OPTIONS}
            value={departments}
            errorMessage={errors.departments}
            onChange={v => {
              setDepartments(v);
              setErrors(prev => ({ ...prev, departments: undefined }));
            }}
          />
          <TextBox
            label="PAN No"
            required
            maxLength={10}
            placeholder="ABCDE1234F"
            value={form.pan}
            errorMessage={errors.pan}
            onChange={v => set('pan', v.toUpperCase().replace(/\s/g, ''))}
          />
          <TextBox
            label="Aadhar No"
            required
            maxLength={12}
            placeholder="12-digit Aadhar"
            value={form.aadhar}
            errorMessage={errors.aadhar}
            onChange={v => set('aadhar', v.replace(/\D/g, ''))}
          />
        </FormGrid>
        {existingFaculty && (
          <div className="mt-4">
            <StageNote tone="success">
              This PAN already belongs to a joined visiting faculty (Unique ID{' '}
              <UniqueIdChip
                value={makeUniqueId(existingFaculty.fullName, form.pan)}
              />
              ). No new ID will be created — on approval the new department is
              added under the same Unique ID.
            </StageNote>
          </div>
        )}
      </FormCard>

      <FormCard title="Teaching / Lab Assignment" icon="book">
        <FormGrid columns={4}>
          <DropDownList
            label="Session"
            data={SESSION_OPTIONS}
            textField="text"
            valueField="id"
            value={form.session}
            onChange={v => set('session', (v as string) ?? form.session)}
          />
          <DropDownList
            label="Semester"
            subLabel="Auto-detected from current month"
            data={SEMESTER_OPTIONS}
            textField="text"
            valueField="id"
            value={form.semester}
            disabled
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
          <MultiPick
            label="Branch"
            subLabel="(select all that apply)"
            required
            options={BRANCH_OPTIONS}
            value={form.branches}
            errorMessage={errors.branches}
            onChange={v => set('branches', v)}
          />
          <MultiPick
            label="Year"
            subLabel="(select all that apply)"
            required
            options={YEAR_OPTIONS}
            value={form.years}
            errorMessage={errors.years}
            onChange={v => set('years', v)}
          />
          {form.subjects.map((s, i) => (
            <TextBox
              key={`subject-${i}`}
              label={`Subject ${i + 1}`}
              placeholder="Subject Code"
              value={s}
              errorMessage={i === 0 ? errors.subjects : undefined}
              onChange={v => setAt('subjects', i, v)}
            />
          ))}
        </FormGrid>
        <div className="mt-4">
          <FormGrid columns={4}>
            {form.labs.map((l, i) => (
              <TextBox
                key={`lab-${i}`}
                label={`Lab ${i + 1}`}
                placeholder="Subject code"
                value={l}
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
        subtitle="PDF, up to 2 MB each. Both documents are compulsory."
        icon="paperclip"
      >
        <FormGrid columns={2}>
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
        </FormGrid>
      </FormCard>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          label="Register"
          icon="user-plus"
          variant="primary"
          onClick={handleSubmit}
        />
        <Button
          label="Reset"
          variant="outlined"
          onClick={() => {
            setForm(blank());
            setDepartments([]);
            setErrors({});
          }}
        />
      </div>
    </FormPage>
  );
}
