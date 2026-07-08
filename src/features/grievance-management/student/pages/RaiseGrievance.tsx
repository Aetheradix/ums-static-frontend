import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import {
  DropDownList,
  TextBox,
  TextArea,
  Checkbox,
  DatePicker,
} from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { grievanceCategories } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

const STEPS = [
  'Personal Information',
  'Grievance Intake Info',
  'Upload Evidences',
  'Compliance & Submission',
];

const DEPARTMENTS = [
  { name: 'SCSIT', value: 'SCSIT' },
  { name: 'School of Commerce', value: 'School of Commerce' },
  { name: 'School of Law', value: 'School of Law' },
  { name: 'School of Science', value: 'School of Science' },
  { name: 'Accounts & Finance', value: 'Accounts & Finance' },
  { name: 'Administration Office', value: 'Administration Office' },
];

const PRIORITIES = [
  { name: 'Low', value: 'Low' },
  { name: 'Medium', value: 'Medium' },
  { name: 'High', value: 'High' },
  { name: 'Critical (UGC/SGRC Statutory)', value: 'Critical' },
];

export default function StudentRaiseGrievance() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    // Step 1
    fullName: 'Arjun Sharma',
    enrollmentNo: 'CS2021001',
    course: 'B.Tech CSE',
    mobile: '9876543210',
    email: 'arjun.sharma@davv.ac.in',
    department: 'SCSIT',
    isAnonymous: false,

    // Step 2
    category: '',
    subCategory: '',
    subject: '',
    description: '',
    priority: 'Medium',
    incidentDate: undefined as Date | undefined,
    location: '',

    // Step 3
    documentName: '',
    fileSize: '',

    // Step 4
    complianceAcknowledge: false,
    declaration: false,
    remarks: '',
  });

  const selectedCategory = grievanceCategories.find(
    c => c.name === form.category
  );
  const subCategoryOptions = selectedCategory
    ? selectedCategory.subCategories.map(s => ({ name: s, value: s }))
    : [];

  const handleNext = () => {
    if (currentStep === 0) {
      if (!form.fullName || !form.enrollmentNo || !form.course) {
        ToastService.error('Personal information must be completed.');
        return;
      }
    }
    if (currentStep === 1) {
      if (!form.category || !form.subject || !form.description) {
        ToastService.error('Please fill category, subject, and description.');
        return;
      }
    }
    setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep(s => Math.max(s - 1, 0));
  };

  const handleSaveDraft = () => {
    ToastService.success('Grievance draft application saved successfully.');
  };

  const handleSubmit = () => {
    if (!form.declaration || !form.complianceAcknowledge) {
      ToastService.error(
        'You must accept compliance acknowledgement and declaration.'
      );
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      ToastService.success(
        'Grievance ticket generated: GRV/DAVV/2026/00452. Notification sent via SMS & In-App.'
      );
      navigate(grvUrls.student.track);
    }, 1000);
  };

  return (
    <FormPage
      title="File a New Grievance"
      description="Lodge your complaint under SGRC, Anti-Ragging, ICC, Women Cell, or SC/ST Cell regulations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Student Portal', to: grvUrls.student.portal },
        { label: 'Raise Grievance' },
      ]}
    >
      {/* Stepper display */}
      <div className="grv-stepper">
        {STEPS.map((step, idx) => (
          <div key={step} className="grv-step">
            <div
              className={`grv-step-num ${idx < currentStep ? 'done' : idx === currentStep ? 'active' : ''}`}
            >
              {idx < currentStep ? (
                <i className="pi pi-check text-xs"></i>
              ) : (
                idx + 1
              )}
            </div>
            <span
              className={`grv-step-label ${idx <= currentStep ? 'active' : ''}`}
            >
              {step}
            </span>
            {idx < STEPS.length - 1 && (
              <div
                className={`grv-step-connector ${idx < currentStep ? 'done' : ''}`}
                style={{ width: 60 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {currentStep === 0 && (
        <FormCard title="Step 1: Complainant Details" icon="person">
          <div className="mb-4">
            <Checkbox
              label="Submit Anonymously (Identity hidden except to Internal Review Panel)"
              checked={form.isAnonymous}
              onChange={val => setForm(f => ({ ...f, isAnonymous: val }))}
            />
          </div>
          {!form.isAnonymous && (
            <FormGrid columns={3}>
              <TextBox
                label="Full Name"
                value={form.fullName}
                onChange={val => setForm(f => ({ ...f, fullName: val }))}
                required
              />
              <TextBox
                label="Enrollment No."
                value={form.enrollmentNo}
                onChange={val => setForm(f => ({ ...f, enrollmentNo: val }))}
                required
              />
              <TextBox
                label="Course / Program"
                value={form.course}
                onChange={val => setForm(f => ({ ...f, course: val }))}
                required
              />
              <TextBox
                label="Mobile No."
                value={form.mobile}
                onChange={val => setForm(f => ({ ...f, mobile: val }))}
              />
              <TextBox
                label="University Email"
                value={form.email}
                onChange={val => setForm(f => ({ ...f, email: val }))}
              />
              <DropDownList
                label="Primary Department"
                data={DEPARTMENTS}
                textField="name"
                optionValue="value"
                value={form.department}
                onChange={val =>
                  setForm(f => ({ ...f, department: String(val ?? '') }))
                }
              />
            </FormGrid>
          )}
          {form.isAnonymous && (
            <div className="grv-alert warning">
              <i className="pi pi-exclamation-triangle"></i>
              <div>
                <strong>Anonymous Lodging:</strong> Your personal details will
                not be printed on the digital notesheet. However, you will still
                be able to track this complaint via your dashboard token.
              </div>
            </div>
          )}
        </FormCard>
      )}

      {/* Step 2: Grievance Details */}
      {currentStep === 1 && (
        <FormCard title="Step 2: Grievance Information" icon="edit_note">
          <FormGrid columns={2}>
            <DropDownList
              label="Grievance Category"
              data={grievanceCategories.map(c => ({
                name: c.name,
                value: c.name,
              }))}
              textField="name"
              optionValue="value"
              value={form.category}
              onChange={val =>
                setForm(f => ({
                  ...f,
                  category: String(val ?? ''),
                  subCategory: '',
                }))
              }
              required
            />
            <DropDownList
              label="Sub Category"
              data={subCategoryOptions}
              textField="name"
              optionValue="value"
              value={form.subCategory}
              onChange={val =>
                setForm(f => ({ ...f, subCategory: String(val ?? '') }))
              }
              disabled={!form.category}
              required
            />
            <DropDownList
              label="Priority Level"
              data={PRIORITIES}
              textField="name"
              optionValue="value"
              value={form.priority}
              onChange={val =>
                setForm(f => ({ ...f, priority: String(val ?? 'Medium') }))
              }
            />
            <DatePicker
              label="Incident Date"
              value={form.incidentDate}
              onChange={val =>
                setForm(f => ({ ...f, incidentDate: val as Date }))
              }
            />
            <TextBox
              label="Location of Incident"
              placeholder="e.g. Science block classroom, online portal, mess..."
              value={form.location}
              onChange={val => setForm(f => ({ ...f, location: val }))}
            />
          </FormGrid>

          <div className="mt-4">
            <TextBox
              label="Brief Subject Heading"
              placeholder="Short title of the problem"
              value={form.subject}
              onChange={val => setForm(f => ({ ...f, subject: val }))}
              required
            />
          </div>

          <div className="mt-4">
            <TextArea
              label="Detailed Description of Grievance"
              placeholder="Provide a comprehensive timeline of events, names if any, and other relevant details..."
              value={form.description}
              onChange={val => setForm(f => ({ ...f, description: val }))}
              rows={5}
              required
            />
          </div>
        </FormCard>
      )}

      {/* Step 3: Document Upload */}
      {currentStep === 2 && (
        <FormCard title="Step 3: Upload Evidence Materials" icon="cloud_upload">
          <p className="text-xs text-gray-500 mb-4">
            You can upload fee receipts, screenshot proofs, marksheet drafts, or
            medical certificates. Allowed formats: PDF, PNG, JPG. Max size: 5MB.
          </p>
          <FormGrid columns={2}>
            <TextBox
              label="Document Title / Name"
              placeholder="e.g. Fees Receipt Dec 2025"
              value={form.documentName}
              onChange={val => setForm(f => ({ ...f, documentName: val }))}
            />
            <div className="flex flex-col justify-end">
              <Button
                label="Simulate File Attachment"
                icon="upload"
                variant="outlined"
                onClick={() => {
                  setForm(f => ({
                    ...f,
                    documentName: 'Evidence_receipt.pdf',
                    fileSize: '412 KB',
                  }));
                  ToastService.success(
                    'Evidence_receipt.pdf attached successfully.'
                  );
                }}
              />
            </div>
          </FormGrid>

          {form.documentName && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <i className="pi pi-file text-emerald-600 text-lg"></i>
                <div>
                  <span className="text-xs font-bold block text-emerald-800">
                    {form.documentName}
                  </span>
                  <span className="text-[10px] text-emerald-600">
                    {form.fileSize || '350 KB'} · Uploaded Ready
                  </span>
                </div>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() =>
                  setForm(f => ({ ...f, documentName: '', fileSize: '' }))
                }
              >
                <i className="pi pi-trash"></i>
              </button>
            </div>
          )}
        </FormCard>
      )}

      {/* Step 4: Submission */}
      {currentStep === 3 && (
        <FormCard
          title="Step 4: Statutory Disclosures & Compliance"
          icon="verified_user"
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <span className="font-bold text-slate-800">
                Compliance & Regulatory Undertaking:
              </span>
              <p>
                As per the UGC Student Grievance Redressal Regulations (2019),
                filing a false or malicious complaint is a serious disciplinary
                offence. Action may be initiated against complainants who raise
                unsubstantiated malicious complaints.
              </p>
            </div>

            <Checkbox
              label="I acknowledge the compliance statement and understand the rules regarding false complaints."
              checked={form.complianceAcknowledge}
              onChange={val =>
                setForm(f => ({ ...f, complianceAcknowledge: val }))
              }
            />

            <Checkbox
              label="I declare that all the information provided in this grievance petition is true and correct to the best of my knowledge."
              checked={form.declaration}
              onChange={val => setForm(f => ({ ...f, declaration: val }))}
            />

            <TextArea
              label="Closing Remarks / Proposed Solution (Optional)"
              placeholder="Suggest a possible corrective action that you would consider satisfactory..."
              value={form.remarks}
              onChange={val => setForm(f => ({ ...f, remarks: val }))}
              rows={3}
            />
          </div>
        </FormCard>
      )}

      {/* Buttons */}
      <div className="flex justify-between items-center mt-6">
        <div>
          {currentStep > 0 && (
            <Button
              label="Previous Step"
              icon="arrow-left"
              variant="outlined"
              onClick={handlePrev}
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button
            label="Save Draft"
            icon="save"
            variant="outlined"
            onClick={handleSaveDraft}
          />
          {currentStep < STEPS.length - 1 ? (
            <Button
              label="Next Step"
              icon="arrow-right"
              variant="primary"
              onClick={handleNext}
            />
          ) : (
            <Button
              label="Lodge Grievance"
              icon="send"
              variant="primary"
              isLoading={submitting}
              onClick={handleSubmit}
            />
          )}
        </div>
      </div>
    </FormPage>
  );
}
