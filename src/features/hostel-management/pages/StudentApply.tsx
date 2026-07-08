import { useState } from 'react';
import { Checkbox, DropDownList, TextBox } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import FormWizard, {
  type WizardStep,
} from 'shared/components/forms/FormWizard';
import { useHostel } from '../context';
import '../hostel.css';
import { BLOOD_GROUPS, COLLEGE_OPTIONS, SEMESTERS } from '../data';

type App = HostelManagement.Application;

const BLANK: Partial<App> = {
  id: '',
  enrollmentNo: '',
  name: '',
  fatherName: '',
  motherName: '',
  gender: 'Male',
  dob: '',
  mobile: '',
  email: '',
  university: 'State Technological University',
  college: COLLEGE_OPTIONS[0],
  course: 'Bachelor of Technology',
  branch: '',
  semester: SEMESTERS[0],
  admissionYear: new Date().getFullYear().toString(),
  permanentAddress: '',
  state: 'Madhya Pradesh',
  district: 'Bhopal',
  city: 'Bhopal',
  pincode: '',
  distance: '',
  hostelPreference: '',
  roomPreference: 'Double',
  needMess: 'Yes',
  checkInDate: '',
  specialRequirement: '',
  guardianName: '',
  relationship: '',
  guardianMobile: '',
  guardianAddress: '',
  emergencyName: '',
  emergencyMobile: '',
  emergencyRelationship: '',
  bloodGroup: 'A+',
  medicalCondition: '',
  disabilityDetails: '',
  allergies: '',
  documents: {
    photo: 'photo_uploaded_default.png',
    aadhaar: 'aadhaar_secured_redacted.pdf',
    admissionReceipt: 'admission_receipt_verified.pdf',
    collegeId: 'college_id_issued.pdf',
  },
  declaration: false,
  signature: '',
  status: 'Pending',
  adminRemarks: '',
  allottedHostel: '',
  allottedRoom: '',
  allottedBed: '',
  feeStatus: 'Unpaid',
};

const GENDER_OPTIONS: Data.DataItem<string>[] = [
  { id: 'Male', text: 'Male' },
  { id: 'Female', text: 'Female' },
  { id: 'Other', text: 'Other' },
];
const COLLEGE_DD: Data.DataItem<string>[] = COLLEGE_OPTIONS.map(c => ({
  id: c,
  text: c,
}));
const SEMESTER_DD: Data.DataItem<string>[] = SEMESTERS.map(s => ({
  id: s,
  text: s,
}));
const BLOOD_GROUP_DD: Data.DataItem<string>[] = BLOOD_GROUPS.map(b => ({
  id: b,
  text: b,
}));
const ROOM_PREF_DD: Data.DataItem<string>[] = [
  { id: 'Single', text: 'Single' },
  { id: 'Double', text: 'Double' },
  { id: 'Triple', text: 'Triple' },
];
const MESS_DD: Data.DataItem<string>[] = [
  { id: 'Yes', text: 'Yes' },
  { id: 'No', text: 'No' },
];

export default function StudentApply() {
  const { hostels, applications, setApplications, triggerNotification } =
    useHostel();
  const [form, setForm] = useState<Partial<App>>({ ...BLANK });
  const [correctionEnrollment, setCorrectionEnrollment] = useState('');

  const set = <K extends keyof App>(key: K, value: App[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const hostelDD: Data.DataItem<string>[] = hostels.map(h => ({
    id: h.code,
    text: h.name,
  }));

  const handlePullProfile = () => {
    if (!correctionEnrollment.trim()) {
      triggerNotification('Enter an Enrollment Number.', 'error');
      return;
    }
    const match = applications.find(
      a =>
        a.enrollmentNo.toLowerCase() === correctionEnrollment.toLowerCase() &&
        a.status === 'Sent Back'
    );
    if (match) {
      setForm({ ...match });
      triggerNotification(
        'Flagged profile loaded! Make corrections and resubmit.'
      );
    } else {
      triggerNotification(
        'No correction-queue profile found for this Enrollment Number.',
        'error'
      );
    }
  };

  const handleComplete = () => {
    if (!form.declaration) {
      triggerNotification('You must accept the declaration.', 'error');
      return;
    }
    if (!form.enrollmentNo || !form.name) {
      triggerNotification('Enrollment No. and Name are required.', 'error');
      return;
    }
    if (form.id) {
      setApplications(prev =>
        prev.map(a =>
          a.id === form.id
            ? {
                ...(form as App),
                status: 'Pending',
                adminRemarks: 'Corrected and resubmitted.',
              }
            : a
        )
      );
      triggerNotification(`Application ${form.id} resubmitted.`);
    } else {
      const newId = `APP-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      setApplications(prev => [
        ...prev,
        { ...(form as App), id: newId, status: 'Pending', feeStatus: 'Unpaid' },
      ]);
      triggerNotification(`Application submitted! ID: ${newId}`);
    }
    setForm({ ...BLANK });
  };

  const handleReset = () => {
    setForm({ ...BLANK });
    setCorrectionEnrollment('');
  };

  const steps: WizardStep[] = [
    {
      label: 'Student Info',
      icon: 'user',
      content: (
        <FormGrid columns={3}>
          <TextBox
            label="Enrollment No. *"
            value={form.enrollmentNo ?? ''}
            onChange={v => set('enrollmentNo', v)}
          />
          <TextBox
            label="Full Name *"
            value={form.name ?? ''}
            onChange={v => set('name', v)}
          />
          <TextBox
            label="Father's Name"
            value={form.fatherName ?? ''}
            onChange={v => set('fatherName', v)}
          />
          <TextBox
            label="Mother's Name"
            value={form.motherName ?? ''}
            onChange={v => set('motherName', v)}
          />
          <DropDownList
            label="Gender"
            data={GENDER_OPTIONS}
            textField="text"
            valueField="id"
            value={form.gender}
            onChange={v => set('gender', v as string)}
          />
          <TextBox
            label="Date of Birth"
            value={form.dob ?? ''}
            onChange={v => set('dob', v)}
          />
          <TextBox
            label="Mobile Number"
            value={form.mobile ?? ''}
            onChange={v => set('mobile', v)}
          />
          <TextBox
            label="Email Address"
            value={form.email ?? ''}
            onChange={v => set('email', v)}
          />
        </FormGrid>
      ),
    },
    {
      label: 'Academic Info',
      icon: 'book',
      content: (
        <FormGrid columns={3}>
          <TextBox
            label="University"
            value={form.university ?? ''}
            onChange={v => set('university', v)}
          />
          <DropDownList
            label="College"
            data={COLLEGE_DD}
            textField="text"
            valueField="id"
            value={form.college}
            onChange={v => set('college', v as string)}
          />
          <TextBox
            label="Course"
            value={form.course ?? ''}
            onChange={v => set('course', v)}
          />
          <TextBox
            label="Branch / Specialization"
            value={form.branch ?? ''}
            onChange={v => set('branch', v)}
          />
          <DropDownList
            label="Semester"
            data={SEMESTER_DD}
            textField="text"
            valueField="id"
            value={form.semester}
            onChange={v => set('semester', v as string)}
          />
          <TextBox
            label="Admission Year"
            value={form.admissionYear ?? ''}
            onChange={v => set('admissionYear', v)}
          />
        </FormGrid>
      ),
    },
    {
      label: 'Address',
      icon: 'map-marker',
      content: (
        <FormGrid columns={3}>
          <TextBox
            label="Permanent Address"
            value={form.permanentAddress ?? ''}
            onChange={v => set('permanentAddress', v)}
          />
          <TextBox
            label="State"
            value={form.state ?? ''}
            onChange={v => set('state', v)}
          />
          <TextBox
            label="District"
            value={form.district ?? ''}
            onChange={v => set('district', v)}
          />
          <TextBox
            label="City"
            value={form.city ?? ''}
            onChange={v => set('city', v)}
          />
          <TextBox
            label="Pincode"
            value={form.pincode ?? ''}
            onChange={v => set('pincode', v)}
          />
          <TextBox
            label="Distance from Hostel (km)"
            value={form.distance ?? ''}
            onChange={v => set('distance', v)}
          />
        </FormGrid>
      ),
    },
    {
      label: 'Hostel Preference',
      icon: 'building',
      content: (
        <FormGrid columns={3}>
          <DropDownList
            label="Preferred Hostel"
            data={hostelDD}
            textField="text"
            valueField="id"
            defaultOptionText="â€” Select â€”"
            value={form.hostelPreference}
            onChange={v => set('hostelPreference', v as string)}
          />
          <DropDownList
            label="Room Preference"
            data={ROOM_PREF_DD}
            textField="text"
            valueField="id"
            value={form.roomPreference}
            onChange={v => set('roomPreference', v as string)}
          />
          <DropDownList
            label="Mess Required?"
            data={MESS_DD}
            textField="text"
            valueField="id"
            value={form.needMess}
            onChange={v => set('needMess', v as string)}
          />
          <TextBox
            label="Expected Check-In Date"
            value={form.checkInDate ?? ''}
            onChange={v => set('checkInDate', v)}
          />
          <TextBox
            label="Special Requirements"
            value={form.specialRequirement ?? ''}
            onChange={v => set('specialRequirement', v)}
          />
        </FormGrid>
      ),
    },
    {
      label: 'Guardian Info',
      icon: 'users',
      content: (
        <FormGrid columns={3}>
          <TextBox
            label="Guardian Name"
            value={form.guardianName ?? ''}
            onChange={v => set('guardianName', v)}
          />
          <TextBox
            label="Relationship"
            value={form.relationship ?? ''}
            onChange={v => set('relationship', v)}
          />
          <TextBox
            label="Guardian Mobile"
            value={form.guardianMobile ?? ''}
            onChange={v => set('guardianMobile', v)}
          />
          <TextBox
            label="Guardian Address"
            value={form.guardianAddress ?? ''}
            onChange={v => set('guardianAddress', v)}
          />
        </FormGrid>
      ),
    },
    {
      label: 'Emergency Contact',
      icon: 'phone',
      content: (
        <FormGrid columns={3}>
          <TextBox
            label="Contact Name"
            value={form.emergencyName ?? ''}
            onChange={v => set('emergencyName', v)}
          />
          <TextBox
            label="Mobile"
            value={form.emergencyMobile ?? ''}
            onChange={v => set('emergencyMobile', v)}
          />
          <TextBox
            label="Relationship"
            value={form.emergencyRelationship ?? ''}
            onChange={v => set('emergencyRelationship', v)}
          />
        </FormGrid>
      ),
    },
    {
      label: 'Health & Medical',
      icon: 'heart',
      content: (
        <FormGrid columns={3}>
          <DropDownList
            label="Blood Group"
            data={BLOOD_GROUP_DD}
            textField="text"
            valueField="id"
            value={form.bloodGroup}
            onChange={v => set('bloodGroup', v as string)}
          />
          <TextBox
            label="Medical Condition (if any)"
            value={form.medicalCondition ?? ''}
            onChange={v => set('medicalCondition', v)}
          />
          <TextBox
            label="Disability Details"
            value={form.disabilityDetails ?? ''}
            onChange={v => set('disabilityDetails', v)}
          />
          <TextBox
            label="Known Allergies"
            value={form.allergies ?? ''}
            onChange={v => set('allergies', v)}
          />
        </FormGrid>
      ),
    },
    {
      label: 'Documents',
      icon: 'file',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Documents are simulated as uploaded for this static demo.
          </p>
          {(['photo', 'aadhaar', 'admissionReceipt', 'collegeId'] as const).map(
            doc => (
              <div
                key={doc}
                className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <i className="pi pi-file text-indigo-500 text-xl" />
                <div>
                  <p className="text-xs font-bold text-slate-700 capitalize">
                    {doc.replace(/([A-Z])/g, ' $1')}
                  </p>
                  <p className="text-xs text-slate-400">
                    {form.documents?.[doc]}
                  </p>
                </div>
                <span className="ml-auto px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-700 rounded font-bold">
                  Uploaded
                </span>
              </div>
            )
          )}
        </div>
      ),
    },
    {
      label: 'Declaration',
      icon: 'check-circle',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-800 leading-relaxed">
            I hereby declare that all information provided in this application
            is true and correct. I understand that providing false information
            may result in cancellation of hostel allotment. I agree to abide by
            all hostel rules and regulations as prescribed by the university
            administration.
          </div>
          <Checkbox
            label="I accept the declaration and the terms of the hostel accommodation policy."
            checked={form.declaration ?? false}
            onChange={v => set('declaration', v)}
          />
          <TextBox
            label="Full Name as Signature"
            placeholder="Type your full name"
            value={form.signature ?? ''}
            onChange={v => set('signature', v)}
          />
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm space-y-1">
            <p>
              <span className="font-bold text-slate-600">Name:</span>{' '}
              {form.name || 'â€”'}
            </p>
            <p>
              <span className="font-bold text-slate-600">Enrollment:</span>{' '}
              {form.enrollmentNo || 'â€”'}
            </p>
            <p>
              <span className="font-bold text-slate-600">College:</span>{' '}
              {form.college || 'â€”'}
            </p>
            <p>
              <span className="font-bold text-slate-600">
                Preferred Hostel:
              </span>{' '}
              {form.hostelPreference || 'â€”'}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <FormPage
      title="Student Hostel Application"
      description="Submit a new hostel intake application or make corrections to a sent-back form"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Hostel Management',
          to: '/hostel-management/hostel-registry',
        },
        { label: 'Student Apply' },
      ]}
    >
      {/* â”€â”€ Correction retrieval â”€â”€ */}
      <FormCard
        title="Retrieve Flagged Application for Correction"
        icon="search"
      >
        <FormGrid columns={3}>
          <TextBox
            label="Enrollment Number"
            placeholder="e.g. STU2025ME0043"
            value={correctionEnrollment}
            onChange={v => setCorrectionEnrollment(v)}
          />
          <div className="flex items-end">
            <Button
              label="Pull Profile"
              icon="download"
              variant="outlined"
              onClick={handlePullProfile}
            />
          </div>
        </FormGrid>
        {form.id && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-semibold">
            âœï¸ Editing correction for Application ID:{' '}
            <strong>{form.id}</strong> â€” {form.name}
          </div>
        )}
      </FormCard>

      {/* â”€â”€ Multi-step wizard â”€â”€ */}
      <FormCard title="Application Form" icon="file">
        <FormWizard
          steps={steps}
          onComplete={handleComplete}
          onReset={handleReset}
        />
      </FormCard>
    </FormPage>
  );
}
