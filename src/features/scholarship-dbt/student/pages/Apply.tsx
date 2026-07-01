import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextBox, TextArea } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { scholarshipSchemes, studentApplications } from '../../mocks';
import { dbtUrls } from '../../urls';
import '../../Scholarship.css';

const STUDENT = studentApplications[0];
const SCHEME_OPTIONS = scholarshipSchemes
  .filter(s => s.status === 'Open')
  .map(s => ({ name: s.name, value: s.id }));

const STEPS = [
  'Personal Details',
  'Admission Details',
  'Academic Details',
  'Bank Details',
  'Aadhaar Details',
  'Guardian Details',
  'Declaration',
];

export default function StudentApply() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Form State
  const [form, setForm] = useState({
    scheme: '',
    fullName: STUDENT.studentName,
    dob: '05 Mar 2002',
    gender: 'Female',
    mobile: '9876543210',
    email: 'priya.sharma@davv.ac.in',
    address: '12, Vijay Nagar, Indore, MP - 452010',
    enrollmentNo: STUDENT.enrollmentNo,
    course: STUDENT.course,
    branch: STUDENT.branch,
    semester: STUDENT.semester,
    department: STUDENT.department,
    category: STUDENT.category,
    annualIncome: STUDENT.annualIncome.toString(),
    hostelStatus: 'Day Scholar',
    disability: 'No',
    minority: 'No',
    prevScholarship: 'No',
    bankName: STUDENT.bankName,
    accountNo: STUDENT.bankAccount,
    ifsc: STUDENT.ifsc,
    bankBranch: 'Vijay Nagar, Indore',
    aadhaarNo: '2345 6789 0123 7890',
    virtualId: 'VID892345678901234',
    guardianName: 'Ramesh Sharma',
    guardianRelation: 'Father',
    guardianMobile: '9876501234',
    guardianOccupation: 'Farmer',
    declaration: false,
  });

  const set = (key: string, val: string | boolean) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleNext = () => {
    if (currentStep === 0 && !form.scheme) {
      ToastService.error('Please select a scholarship scheme.');
      return;
    }
    setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      ToastService.success('Application saved as draft.');
    }, 600);
  };

  const handleSubmit = () => {
    if (!form.declaration) {
      ToastService.error('Please accept the declaration.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      ToastService.success(
        'Application submitted! Track status under Track Application.'
      );
      navigate(dbtUrls.student.track);
    }, 1000);
  };

  return (
    <FormPage
      title="Apply for Scholarship"
      description="Fill all sections and submit your scholarship application."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Scholarship & DBT', to: dbtUrls.portal },
        { label: 'Student Portal', to: dbtUrls.student.portal },
        { label: 'Apply Scholarship' },
      ]}
    >
      {/* Stepper */}
      <div className="dbt-stepper" style={{ marginBottom: '1.5rem' }}>
        {STEPS.map((step, i) => (
          <>
            <div key={step} className="dbt-step">
              <div
                className={`dbt-step-num ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`}
              >
                {i < currentStep ? (
                  <i className="pi pi-check" style={{ fontSize: '0.625rem' }} />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`dbt-step-label ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`dbt-step-connector ${i < currentStep ? 'done' : ''}`}
              />
            )}
          </>
        ))}
      </div>

      <div className="w-full">
        {/* Step 0: Personal + Scheme */}
        {currentStep === 0 && (
          <>
            <FormCard
              title="Select Scholarship Scheme"
              icon="workspace_premium"
            >
              <DropDownList
                label="Scholarship Scheme"
                data={SCHEME_OPTIONS}
                textField="name"
                optionValue="value"
                placeholder="Select scheme to apply..."
                value={form.scheme}
                onChange={v => set('scheme', String(v ?? ''))}
                required
              />
            </FormCard>
            <FormCard title="Personal Details" className="mt-4">
              <FormGrid columns={3}>
                <TextBox
                  label="Full Name"
                  value={form.fullName}
                  onChange={v => set('fullName', v)}
                />
                <TextBox
                  label="Date of Birth"
                  value={form.dob}
                  onChange={v => set('dob', v)}
                />
                <DropDownList
                  label="Gender"
                  data={[
                    { name: 'Male', value: 'Male' },
                    { name: 'Female', value: 'Female' },
                    { name: 'Other', value: 'Other' },
                  ]}
                  textField="name"
                  optionValue="value"
                  value={form.gender}
                  onChange={v => set('gender', String(v ?? ''))}
                />
                <TextBox
                  label="Mobile Number"
                  value={form.mobile}
                  onChange={v => set('mobile', v)}
                />
                <TextBox
                  label="Email Address"
                  value={form.email}
                  onChange={v => set('email', v)}
                />
                <DropDownList
                  label="Category"
                  data={['General', 'OBC', 'SC', 'ST', 'EWS'].map(c => ({
                    name: c,
                    value: c,
                  }))}
                  textField="name"
                  optionValue="value"
                  value={form.category}
                  onChange={v => set('category', String(v ?? ''))}
                />
              </FormGrid>
              <TextArea
                label="Permanent Address"
                value={form.address}
                onChange={v => set('address', v)}
                rows={2}
              />
            </FormCard>
          </>
        )}

        {/* Step 1: Admission Details */}
        {currentStep === 1 && (
          <FormCard title="Admission & Course Details" icon="school">
            <FormGrid columns={3}>
              <TextBox
                label="Enrollment No."
                value={form.enrollmentNo}
                onChange={v => set('enrollmentNo', v)}
              />
              <TextBox
                label="Course"
                value={form.course}
                onChange={v => set('course', v)}
              />
              <TextBox
                label="Branch / Specialization"
                value={form.branch}
                onChange={v => set('branch', v)}
              />
              <TextBox
                label="Semester"
                value={form.semester}
                onChange={v => set('semester', v)}
              />
              <TextBox
                label="Department"
                value={form.department}
                onChange={v => set('department', v)}
              />
              <DropDownList
                label="Hosteller / Day Scholar"
                data={[
                  { name: 'Hosteller', value: 'Hosteller' },
                  { name: 'Day Scholar', value: 'Day Scholar' },
                ]}
                textField="name"
                optionValue="value"
                value={form.hostelStatus}
                onChange={v => set('hostelStatus', String(v ?? ''))}
              />
              <TextBox
                label="Annual Family Income (₹)"
                value={form.annualIncome}
                onChange={v => set('annualIncome', v)}
              />
              <DropDownList
                label="Person with Disability"
                data={[
                  { name: 'No', value: 'No' },
                  { name: 'Yes', value: 'Yes' },
                ]}
                textField="name"
                optionValue="value"
                value={form.disability}
                onChange={v => set('disability', String(v ?? ''))}
              />
              <DropDownList
                label="Minority Community"
                data={[
                  { name: 'No', value: 'No' },
                  { name: 'Yes', value: 'Yes' },
                ]}
                textField="name"
                optionValue="value"
                value={form.minority}
                onChange={v => set('minority', String(v ?? ''))}
              />
              <DropDownList
                label="Previous Scholarship Received"
                data={[
                  { name: 'No', value: 'No' },
                  { name: 'Yes', value: 'Yes' },
                ]}
                textField="name"
                optionValue="value"
                value={form.prevScholarship}
                onChange={v => set('prevScholarship', String(v ?? ''))}
              />
            </FormGrid>
          </FormCard>
        )}

        {/* Step 2: Academic */}
        {currentStep === 2 && (
          <FormCard title="Academic Performance Details">
            <div
              style={{
                padding: '0.75rem',
                background: '#f0fdf4',
                borderRadius: 8,
                border: '1px solid #bbf7d0',
                marginBottom: '1rem',
              }}
            >
              <p
                style={{
                  fontSize: '0.813rem',
                  color: '#15803d',
                  fontWeight: 600,
                }}
              >
                Current CGPA: {STUDENT.cgpa} &nbsp;|&nbsp; Attendance:{' '}
                {STUDENT.attendancePct}%
              </p>
            </div>
            <FormGrid columns={3}>
              {[
                ['Previous Class', '12th (MP Board)'],
                ['Percentage / CGPA', '88.5%'],
                ['Passing Year', '2023'],
                ['Current CGPA', String(STUDENT.cgpa)],
                ['Current Attendance', `${STUDENT.attendancePct}%`],
                ['Backlog', 'None'],
                ['Internal Marks (Sem I)', '87/100'],
                ['Internal Marks (Sem II)', '91/100'],
                ['Internal Marks (Sem III)', '85/100'],
              ].map(([label, value]) => (
                <div key={label} className="dbt-info-field">
                  <p className="dbt-info-label">{label}</p>
                  <input
                    defaultValue={value}
                    style={{
                      width: '100%',
                      padding: '0.375rem 0.625rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: 6,
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>
              ))}
            </FormGrid>
          </FormCard>
        )}

        {/* Step 3: Bank Details */}
        {currentStep === 3 && (
          <FormCard title="Bank Account Details" icon="account_balance">
            <div
              style={{
                padding: '0.75rem',
                background: '#fef3c7',
                borderRadius: 8,
                border: '1px solid #fde68a',
                marginBottom: '1rem',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#b45309',
                  fontWeight: 600,
                }}
              >
                ⚠ Ensure your bank account is Aadhaar-seeded (NPCI linked) for
                direct DBT transfer.
              </p>
            </div>
            <FormGrid columns={2}>
              <TextBox
                label="Bank Name"
                value={form.bankName}
                onChange={v => set('bankName', v)}
              />
              <TextBox
                label="Account Number"
                value={form.accountNo}
                onChange={v => set('accountNo', v)}
              />
              <TextBox
                label="IFSC Code"
                value={form.ifsc}
                onChange={v => set('ifsc', v)}
              />
              <TextBox
                label="Bank Branch"
                value={form.bankBranch}
                onChange={v => set('bankBranch', v)}
              />
            </FormGrid>
            <div
              style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}
            >
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  background: STUDENT.npciSeeded ? '#d1fae5' : '#fee2e2',
                  borderRadius: 4,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: STUDENT.npciSeeded ? '#065f46' : '#b91c1c',
                }}
              >
                NPCI Seeding: {STUDENT.npciSeeded ? 'Active ✓' : 'Pending ✗'}
              </span>
            </div>
          </FormCard>
        )}

        {/* Step 4: Aadhaar */}
        {currentStep === 4 && (
          <FormCard title="Aadhaar Identity Details" icon="verified_user">
            <FormGrid columns={2}>
              <TextBox
                label="Aadhaar Number"
                value={form.aadhaarNo}
                onChange={v => set('aadhaarNo', v)}
              />
              <TextBox
                label="Virtual ID (VID)"
                value={form.virtualId}
                onChange={v => set('virtualId', v)}
              />
              <TextBox
                label="Masked Aadhaar"
                value="XXXX XXXX 7890"
                onChange={() => {}}
              />
              <div className="dbt-info-field">
                <p className="dbt-info-label">OTP Verification</p>
                <Button
                  label="Send OTP to Registered Mobile"
                  variant="outlined"
                  size="small"
                  icon="key"
                  onClick={() =>
                    ToastService.success('OTP sent to registered mobile.')
                  }
                />
              </div>
            </FormGrid>
          </FormCard>
        )}

        {/* Step 5: Guardian */}
        {currentStep === 5 && (
          <FormCard title="Guardian / Parent Details">
            <FormGrid columns={2}>
              <TextBox
                label="Guardian Full Name"
                value={form.guardianName}
                onChange={v => set('guardianName', v)}
              />
              <TextBox
                label="Relation"
                value={form.guardianRelation}
                onChange={v => set('guardianRelation', v)}
              />
              <TextBox
                label="Mobile Number"
                value={form.guardianMobile}
                onChange={v => set('guardianMobile', v)}
              />
              <TextBox
                label="Occupation"
                value={form.guardianOccupation}
                onChange={v => set('guardianOccupation', v)}
              />
            </FormGrid>
          </FormCard>
        )}

        {/* Step 6: Declaration */}
        {currentStep === 6 && (
          <FormCard title="Declaration & Submission">
            <div
              style={{
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                marginBottom: '1rem',
                fontSize: '0.813rem',
                color: '#374151',
                lineHeight: 1.7,
              }}
            >
              <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                Declaration by the Applicant:
              </p>
              <p>
                I hereby declare that all the information provided in this
                application form is true and correct to the best of my
                knowledge. I understand that if any information is found to be
                false or incorrect, my scholarship application will be rejected
                and legal action may be initiated as per the government's
                guidelines.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                I agree to abide by the terms and conditions of the scholarship
                scheme and confirm that I have not availed any duplicate
                scholarship from any other government/university source for the
                same academic year.
              </p>
            </div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#111827',
              }}
            >
              <input
                type="checkbox"
                checked={form.declaration}
                onChange={e => set('declaration', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#3b82f6' }}
              />
              I accept the above declaration and confirm all details are
              correct.
            </label>
          </FormCard>
        )}

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1rem',
          }}
        >
          <Button
            label="Previous"
            variant="outlined"
            icon="arrow-left"
            onClick={() => setCurrentStep(s => Math.max(s - 1, 0))}
            disabled={currentStep === 0}
          />
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <Button
              label="Save Draft"
              variant="outlined"
              icon="save"
              isLoading={saving}
              onClick={handleSaveDraft}
            />
            {currentStep < STEPS.length - 1 ? (
              <Button
                label="Next"
                variant="primary"
                icon="arrow-right"
                onClick={handleNext}
              />
            ) : (
              <Button
                label="Submit Application"
                variant="primary"
                icon="send"
                isLoading={saving}
                onClick={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </FormPage>
  );
}
