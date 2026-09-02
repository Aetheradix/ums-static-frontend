import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  Checkbox,
  DatePicker,
  DropDownList,
  FileUpload,
  TextArea,
  TextBox,
} from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  PreviewField,
  PreviewSection,
  Stepper,
} from 'shared/new-components';
import { KeyValueTile, SectionNote } from '../components/ui';
import { ROOM_TYPE_OPTIONS, today, uid, useHms } from '../context/HmsContext';
import type { Application, StudentDirectoryEntry } from '../context/HmsContext';
import { hmsUrls } from '../urls';

const STEPS = [
  { label: 'Verify', icon: 'pi pi-id-card' },
  { label: 'Student Details', icon: 'pi pi-user' },
  { label: 'Parent & Guardian', icon: 'pi pi-users' },
  { label: 'Hostel & Emergency', icon: 'pi pi-home' },
  { label: 'Health & Consent', icon: 'pi pi-heart' },
  { label: 'Preview & Submit', icon: 'pi pi-check-circle' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(
  g => ({
    id: g,
    text: g,
  })
);

const RELATIONS = [
  'Father',
  'Mother',
  'Brother',
  'Sister',
  'Uncle',
  'Aunt',
  'Grandparent',
  'Other',
].map(r => ({ id: r, text: r }));

type FormState = Omit<
  Application,
  | 'id'
  | 'applicationNo'
  | 'submittedOn'
  | 'status'
  | 'remarks'
  | 'decisionDate'
  | 'decidedBy'
  | 'erpLoginId'
  | 'erpPassword'
>;

const blank = (): FormState => ({
  rollNumber: '',
  enrollmentNumber: '',
  studentName: '',
  photo: '',
  programme: '',
  branch: '',
  gender: '',
  category: '',
  email: '',
  mobileNumber: '',
  dateOfBirth: '',
  fatherName: '',
  motherName: '',
  parentMobile: '',
  parentEmail: '',
  permanentAddress: '',
  guardianName: '',
  guardianRelation: '',
  guardianContact: '',
  guardianAddress: '',
  preferredHostelId: '',
  preferredRoomType: '',
  emergencyName: '',
  emergencyRelation: '',
  emergencyContact: '',
  bloodGroup: '',
  medicalConditions: '',
  allergies: '',
  medication: '',
  healthCertificate: '',
  guardianConsent: false,
  declaration: false,
});

const fromDirectory = (e: StudentDirectoryEntry): FormState => ({
  ...blank(),
  rollNumber: e.rollNumber,
  enrollmentNumber: e.enrollmentNumber,
  studentName: e.studentName,
  photo: e.photo,
  programme: e.programme,
  branch: e.branch,
  gender: e.gender,
  category: e.category,
  email: e.email,
  mobileNumber: e.mobileNumber,
  dateOfBirth: e.dateOfBirth,
  fatherName: e.fatherName,
  motherName: e.motherName,
  parentMobile: e.parentMobile,
  parentEmail: e.parentEmail,
  permanentAddress: e.permanentAddress,
});

export default function AdmissionForm() {
  const { data, add } = useHms();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [lookup, setLookup] = useState({ identifier: '', mobileNumber: '' });
  const [form, setForm] = useState<FormState>(blank);
  const [submitted, setSubmitted] = useState<Application | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const hostelOptions = data.hostels
    .filter(h => h.status === 'Active')
    .map(h => ({ id: h.id, text: `${h.nameEn} — ${h.type}` }));

  const hostelName = (id: string) =>
    data.hostels.find(h => h.id === id)?.nameEn ?? '—';

  /**
   * Pre-fill from the university directory. A miss never blocks the flow —
   * the form simply opens with whatever was typed, ready to fill by hand.
   */
  const fetchDetails = () => {
    const key = lookup.identifier.trim().toLowerCase();
    const entry = data.studentDirectory.find(
      s =>
        (s.rollNumber.toLowerCase() === key ||
          s.enrollmentNumber.toLowerCase() === key) &&
        (!lookup.mobileNumber.trim() ||
          s.mobileNumber === lookup.mobileNumber.trim())
    );

    if (entry) {
      setForm(fromDirectory(entry));
      ToastService.success(`Details fetched for ${entry.studentName}.`);
    } else {
      setForm({
        ...blank(),
        rollNumber: lookup.identifier.trim(),
        mobileNumber: lookup.mobileNumber.trim(),
      });
      ToastService.success(
        'No university record matched — fill the details yourself.'
      );
    }
    setStep(1);
  };

  const submit = () => {
    const application: Application = {
      ...form,
      id: uid('AP'),
      applicationNo: `HSTL/${new Date().getFullYear()}/${String(data.applications.length + 1).padStart(4, '0')}`,
      submittedOn: today(),
      status: 'Pending',
      remarks: '',
      decisionDate: '',
      decidedBy: '',
      erpLoginId: '',
      erpPassword: '',
    };
    add('applications', application);
    setSubmitted(application);
    ToastService.success('Hostel admission form submitted successfully.');
  };

  if (submitted) {
    return (
      <FormPage
        title="Application Submitted"
        description="Your hostel admission form has reached the warden of the hostel you applied to."
      >
        <FormCard title="Acknowledgement" icon="check-circle">
          <div className="flex flex-col items-center gap-5 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
              <span className="material-symbols-outlined text-[34px] text-green-600 dark:text-green-400">
                task_alt
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Thank you, {submitted.studentName || 'applicant'}
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
                Your application has gone to{' '}
                {hostelName(submitted.preferredHostelId)} for approval. Track it
                with your application number — once the warden approves, your
                ERP login credentials appear on the tracking page.
              </p>
            </div>
            <div className="w-full max-w-md">
              <KeyValueTile
                label="Application Number"
                value={submitted.applicationNo}
                mono
                tone="success"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                label="Track Application"
                variant="primary"
                icon="search"
                onClick={() => navigate(hmsUrls.public.track)}
              />
              <Button
                label="Back to Public Forum"
                variant="outlined"
                onClick={() => navigate(hmsUrls.public.root)}
              />
            </div>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Hostel Admission Form"
      description="Apply for university hostel accommodation. Your academic details are fetched from the university record; you fill in guardian, hostel preference and health details."
    >
      <FormCard>
        <Stepper steps={STEPS} activeStep={step} onStepClick={setStep} />
      </FormCard>

      {step === 0 && (
        <FormCard
          title="Verify Your Identity"
          subtitle="Enter the roll number you appeared with and the mobile number registered with the university."
          icon="id-card"
        >
          <FormGrid columns={2}>
            <TextBox
              label="JEE Roll No. / Enrollment No."
              placeholder="e.g. JEE2026001"
              value={lookup.identifier}
              onChange={v => setLookup({ ...lookup, identifier: v })}
            />
            <TextBox
              label="Registered Mobile Number"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={lookup.mobileNumber}
              onChange={v =>
                setLookup({ ...lookup, mobileNumber: v.replace(/\D/g, '') })
              }
            />
          </FormGrid>
          <div className="mt-4">
            <SectionNote tone="info" title="Try a demo record">
              {data.studentDirectory
                .slice(0, 3)
                .map(s => `${s.rollNumber} / ${s.mobileNumber}`)
                .join('  ·  ')}
            </SectionNote>
          </div>
        </FormCard>
      )}

      {step === 1 && (
        <FormCard
          title="Student Details"
          subtitle="Fetched from the university student record — correct anything that has changed."
          icon="user"
        >
          <FormGrid columns={3}>
            <TextBox
              label="Student Name"
              value={form.studentName}
              onChange={v => set('studentName', v)}
            />
            <TextBox
              label="Roll Number"
              value={form.rollNumber}
              onChange={v => set('rollNumber', v)}
            />
            <TextBox
              label="Enrollment Number"
              value={form.enrollmentNumber}
              onChange={v => set('enrollmentNumber', v)}
            />
            <TextBox
              label="Programme"
              value={form.programme}
              onChange={v => set('programme', v)}
            />
            <TextBox
              label="Branch"
              value={form.branch}
              onChange={v => set('branch', v)}
            />
            <DropDownList
              label="Gender"
              data={['Male', 'Female', 'Other'].map(g => ({ id: g, text: g }))}
              textField="text"
              valueField="id"
              value={form.gender}
              onChange={v => set('gender', (v as string) ?? '')}
            />
            <DropDownList
              label="Category"
              data={['General', 'OBC', 'SC', 'ST', 'EWS'].map(c => ({
                id: c,
                text: c,
              }))}
              textField="text"
              valueField="id"
              value={form.category}
              onChange={v => set('category', (v as string) ?? '')}
            />
            <DatePicker
              label="Date of Birth"
              value={form.dateOfBirth ? new Date(form.dateOfBirth) : undefined}
              onChange={v =>
                set('dateOfBirth', v ? v.toISOString().split('T')[0] : '')
              }
            />
            <TextBox
              label="Email"
              value={form.email}
              onChange={v => set('email', v)}
            />
            <TextBox
              label="Mobile Number"
              maxLength={10}
              value={form.mobileNumber}
              onChange={v => set('mobileNumber', v.replace(/\D/g, ''))}
            />
            <FileUpload
              label="Photograph"
              mode="photo"
              accept="image/*"
              uploadNote="JPG or PNG, up to 200 KB"
              maxSizeKB={200}
              value={form.photo}
              onChange={f => set('photo', f ? f.name : '')}
            />
          </FormGrid>
        </FormCard>
      )}

      {step === 2 && (
        <>
          <FormCard title="Parent Details" icon="users">
            <FormGrid columns={3}>
              <TextBox
                label="Father's Name"
                value={form.fatherName}
                onChange={v => set('fatherName', v)}
              />
              <TextBox
                label="Mother's Name"
                value={form.motherName}
                onChange={v => set('motherName', v)}
              />
              <TextBox
                label="Parents' Mobile Number"
                maxLength={10}
                placeholder="Leave-approval OTPs go here"
                value={form.parentMobile}
                onChange={v => set('parentMobile', v.replace(/\D/g, ''))}
              />
              <TextBox
                label="Parents' Email"
                placeholder="Leave notifications are emailed here"
                value={form.parentEmail}
                onChange={v => set('parentEmail', v)}
              />
              <div className="md:col-span-2">
                <TextArea
                  label="Permanent Address"
                  rows={2}
                  value={form.permanentAddress}
                  onChange={v => set('permanentAddress', v)}
                />
              </div>
            </FormGrid>
          </FormCard>

          <FormCard
            title="Local Guardian Details"
            subtitle="Someone near the university who can be reached at short notice."
            icon="user-plus"
          >
            <FormGrid columns={3}>
              <TextBox
                label="Guardian Name"
                value={form.guardianName}
                onChange={v => set('guardianName', v)}
              />
              <DropDownList
                label="Relation"
                data={RELATIONS}
                textField="text"
                valueField="id"
                value={form.guardianRelation}
                onChange={v => set('guardianRelation', (v as string) ?? '')}
              />
              <TextBox
                label="Guardian Contact No."
                maxLength={10}
                value={form.guardianContact}
                onChange={v => set('guardianContact', v.replace(/\D/g, ''))}
              />
              <div className="md:col-span-3">
                <TextArea
                  label="Guardian Address"
                  rows={2}
                  value={form.guardianAddress}
                  onChange={v => set('guardianAddress', v)}
                />
              </div>
            </FormGrid>
          </FormCard>
        </>
      )}

      {step === 3 && (
        <>
          <FormCard
            title="Hostel Preference"
            subtitle="The warden allots your room after approval — your preference is taken into account."
            icon="home"
          >
            <FormGrid columns={2}>
              <DropDownList
                label="Preferred Hostel"
                data={hostelOptions}
                textField="text"
                valueField="id"
                value={form.preferredHostelId}
                onChange={v => set('preferredHostelId', (v as string) ?? '')}
              />
              <DropDownList
                label="Preferred Room Type"
                data={ROOM_TYPE_OPTIONS}
                textField="text"
                valueField="id"
                value={form.preferredRoomType}
                onChange={v => set('preferredRoomType', (v as string) ?? '')}
              />
            </FormGrid>
          </FormCard>

          <FormCard
            title="Emergency Contact"
            subtitle="Whom the hostel calls first in an emergency."
            icon="phone"
          >
            <FormGrid columns={3}>
              <TextBox
                label="Contact Name"
                value={form.emergencyName}
                onChange={v => set('emergencyName', v)}
              />
              <DropDownList
                label="Relation"
                data={RELATIONS}
                textField="text"
                valueField="id"
                value={form.emergencyRelation}
                onChange={v => set('emergencyRelation', (v as string) ?? '')}
              />
              <TextBox
                label="Contact Number"
                maxLength={10}
                value={form.emergencyContact}
                onChange={v => set('emergencyContact', v.replace(/\D/g, ''))}
              />
            </FormGrid>
          </FormCard>
        </>
      )}

      {step === 4 && (
        <>
          <FormCard title="Health Details" icon="heart">
            <FormGrid columns={3}>
              <DropDownList
                label="Blood Group"
                data={BLOOD_GROUPS}
                textField="text"
                valueField="id"
                value={form.bloodGroup}
                onChange={v => set('bloodGroup', (v as string) ?? '')}
              />
              <TextBox
                label="Allergies"
                placeholder="e.g. Dust, Penicillin"
                value={form.allergies}
                onChange={v => set('allergies', v)}
              />
              <TextBox
                label="Regular Medication"
                placeholder="e.g. Inhaler as needed"
                value={form.medication}
                onChange={v => set('medication', v)}
              />
              <div className="md:col-span-2">
                <TextArea
                  label="Existing Medical Conditions"
                  rows={2}
                  placeholder="Anything the hostel should be aware of"
                  value={form.medicalConditions}
                  onChange={v => set('medicalConditions', v)}
                />
              </div>
              <FileUpload
                label="Health Checkup Certificate"
                mode="file"
                accept=".pdf,image/*"
                uploadNote="PDF or image, up to 2 MB"
                maxSizeKB={2048}
                value={form.healthCertificate}
                onChange={f => set('healthCertificate', f ? f.name : '')}
              />
            </FormGrid>
          </FormCard>

          <FormCard title="Consent & Declaration" icon="verified">
            <div className="flex flex-col gap-4">
              <Checkbox
                label="My parent/guardian consents to my staying in the university hostel and to the hostel contacting them for approvals."
                checked={form.guardianConsent}
                onChange={v => set('guardianConsent', v)}
              />
              <Checkbox
                label="I declare that the information provided is true, and I agree to abide by the hostel rules, anti-ragging policy and curfew timings."
                checked={form.declaration}
                onChange={v => set('declaration', v)}
              />
            </div>
          </FormCard>
        </>
      )}

      {step === 5 && (
        <FormCard title="Review Your Application" icon="eye">
          <PreviewSection title="Student Details" step={1}>
            <PreviewField label="Student Name" value={form.studentName} />
            <PreviewField label="Roll Number" value={form.rollNumber} />
            <PreviewField
              label="Enrollment Number"
              value={form.enrollmentNumber}
            />
            <PreviewField label="Programme" value={form.programme} />
            <PreviewField label="Branch" value={form.branch} />
            <PreviewField label="Gender" value={form.gender} />
            <PreviewField label="Category" value={form.category} />
            <PreviewField label="Date of Birth" value={form.dateOfBirth} />
            <PreviewField label="Email" value={form.email} />
            <PreviewField label="Mobile Number" value={form.mobileNumber} />
            <PreviewField label="Photograph" value={form.photo} />
          </PreviewSection>

          <PreviewSection title="Parent & Guardian" step={2}>
            <PreviewField label="Father's Name" value={form.fatherName} />
            <PreviewField label="Mother's Name" value={form.motherName} />
            <PreviewField label="Parents' Mobile" value={form.parentMobile} />
            <PreviewField label="Parents' Email" value={form.parentEmail} />
            <PreviewField
              label="Permanent Address"
              value={form.permanentAddress}
              fullWidth
            />
            <PreviewField label="Guardian Name" value={form.guardianName} />
            <PreviewField label="Relation" value={form.guardianRelation} />
            <PreviewField
              label="Guardian Contact"
              value={form.guardianContact}
            />
            <PreviewField
              label="Guardian Address"
              value={form.guardianAddress}
              fullWidth
            />
          </PreviewSection>

          <PreviewSection title="Hostel & Emergency" step={3}>
            <PreviewField
              label="Preferred Hostel"
              value={hostelName(form.preferredHostelId)}
            />
            <PreviewField
              label="Preferred Room Type"
              value={form.preferredRoomType}
            />
            <PreviewField
              label="Emergency Contact"
              value={form.emergencyName}
            />
            <PreviewField label="Relation" value={form.emergencyRelation} />
            <PreviewField
              label="Contact Number"
              value={form.emergencyContact}
            />
          </PreviewSection>

          <PreviewSection title="Health & Consent" step={4}>
            <PreviewField label="Blood Group" value={form.bloodGroup} />
            <PreviewField label="Allergies" value={form.allergies} />
            <PreviewField label="Regular Medication" value={form.medication} />
            <PreviewField
              label="Medical Conditions"
              value={form.medicalConditions}
              fullWidth
            />
            <PreviewField
              label="Health Certificate"
              value={form.healthCertificate}
            />
            <PreviewField
              label="Guardian Consent"
              value={form.guardianConsent ? 'Given' : 'Not given'}
            />
            <PreviewField
              label="Declaration"
              value={form.declaration ? 'Accepted' : 'Not accepted'}
            />
          </PreviewSection>
        </FormCard>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          label="Back"
          variant="outlined"
          icon="arrow-left"
          disabled={step === 0}
          onClick={() => setStep(s => Math.max(s - 1, 0))}
        />
        {step === STEPS.length - 1 ? (
          <Button
            label="Submit Application"
            variant="primary"
            icon="check"
            onClick={submit}
          />
        ) : (
          <Button
            label={step === 0 ? 'Fetch Details' : 'Save & Continue'}
            variant="primary"
            icon={step === 0 ? 'search' : 'arrow-right'}
            onClick={() => (step === 0 ? fetchDetails() : setStep(s => s + 1))}
          />
        )}
      </div>
    </FormPage>
  );
}
