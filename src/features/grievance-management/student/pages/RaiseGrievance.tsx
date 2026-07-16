import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormCard, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox, TextArea, DropDownList } from 'shared/components/forms';
import { ToastService } from 'services';
import { grievanceCategories } from '../../mocks';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
const MAX_SIZE_MB = 5;

export default function RaiseGrievance() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployee = location.pathname.includes('/teacher');
  const portalUrls = isEmployee ? grvUrls.teacher : grvUrls.student;

  // Applicant Info
  const [appId, setAppId] = useState('');
  const [verified, setVerified] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [courseDept, setCourseDept] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  // Grievance Details
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [otherCategory, setOtherCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState('');

  const selectedCategory = grievanceCategories.find(c => c.name === category);
  const subCatOptions = selectedCategory
    ? selectedCategory.subCategories.map(s => ({ name: s, value: s }))
    : [];
  const categoryOptions = [
    ...grievanceCategories.map(c => ({ name: c.name, value: c.name })),
    { name: 'Other', value: 'Other' },
  ];

  const handleVerify = () => {
    if (!appId.trim()) {
      ToastService.error('Please enter your Application / Employee ID.');
      return;
    }
    // Simulate auto-fill from ERP
    setApplicantName(isEmployee ? 'Dr. Vivek Kumar' : 'Arjun Sharma');
    setCourseDept(
      isEmployee ? 'Associate Professor — SCSIT' : 'B.Tech CSE — SCSIT'
    );
    setMobile(isEmployee ? '9876543210' : '9123456789');
    setEmail(
      isEmployee ? 'vivek.kumar@davv.ac.in' : 'arjun.sharma@students.davv.ac.in'
    );
    setVerified(true);
    ToastService.success('Identity verified successfully!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const invalid = selected.filter(f => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (invalid.length > 0) {
      ToastService.error(`File(s) exceed ${MAX_SIZE_MB}MB limit.`);
      return;
    }
    setFiles(prev => [...prev, ...selected].slice(0, 5));
  };

  const removeFile = (idx: number) =>
    setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!verified) {
      ToastService.error('Please verify your ID first.');
      return;
    }
    if (!category || !subject || !description.trim()) {
      ToastService.error('Please fill Category, Subject, and Description.');
      return;
    }
    if (category === 'Other' && !otherCategory.trim()) {
      ToastService.error('Please specify the Other Category.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const ticket = `GRV/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`;
      setTicketNo(ticket);
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  // ─── Success Screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <FormPage
        title="Grievance Submitted Successfully"
        description="Your complaint has been registered and assigned a unique Ticket Number."
        breadcrumbs={[
          { label: 'Home', to: '/home' },
          { label: 'Grievance Management', to: grvUrls.portal },
          {
            label: isEmployee ? 'Employee Login' : 'Student Login',
            to: portalUrls.portal,
          },
          { label: 'Raise Grievance' },
        ]}
      >
        <FormCard title="">
          <div className="flex flex-col items-center py-12 gap-5">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-5xl">
                check_circle
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Grievance Registered!
            </h2>
            <p className="text-slate-500 text-sm text-center max-w-lg">
              Your grievance has been received and assigned to the concerned
              department. You can track its progress using the ticket number
              below.
            </p>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl px-8 py-4 text-center">
              <p className="text-xs text-blue-500 font-medium mb-1">
                YOUR TICKET NUMBER
              </p>
              <p className="text-2xl font-mono font-bold text-blue-700">
                {ticketNo}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-lg text-xs text-slate-500">
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                <span className="material-symbols-outlined text-slate-400 text-base">
                  schedule
                </span>
                <div>
                  <p className="font-semibold text-slate-700">Submitted</p>
                  <p>{new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                <span className="material-symbols-outlined text-slate-400 text-base">
                  category
                </span>
                <div>
                  <p className="font-semibold text-slate-700">Category</p>
                  <p>{category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                <span className="material-symbols-outlined text-slate-400 text-base">
                  hourglass_top
                </span>
                <div>
                  <p className="font-semibold text-slate-700">Status</p>
                  <p>Under Review</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <Button
                label="Track My Grievance →"
                variant="primary"
                onClick={() => navigate(portalUrls.track)}
              />
              <Button
                label="Back to Dashboard"
                variant="outlined"
                onClick={() => navigate(portalUrls.portal)}
              />
            </div>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  // ─── Main Form ───────────────────────────────────────────────────
  return (
    <FormPage
      title={
        isEmployee ? 'Raise Employee Grievance' : 'Raise Student Grievance'
      }
      description="Fill in your details and describe your grievance. All submissions are confidential."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        {
          label: isEmployee ? 'Employee Login' : 'Student Login',
          to: portalUrls.portal,
        },
        { label: 'Raise Grievance' },
      ]}
    >
      <div className="mb-3">
        <Button
          label="← Back to Dashboard"
          variant="outlined"
          onClick={() => navigate(portalUrls.portal)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── LEFT: Form (2/3 width) ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section 1: Applicant Information */}
          <FormCard title="Applicant Information">
            <div className="space-y-3">
              {/* ID + Verify */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <TextBox
                    label={
                      isEmployee
                        ? 'Employee ID *'
                        : 'Application / Enrollment Number *'
                    }
                    placeholder={
                      isEmployee ? 'e.g. EMP2024001' : 'e.g. 2021CS0047'
                    }
                    value={appId}
                    onChange={setAppId}
                  />
                </div>
                <div className="mb-[1px]">
                  <Button
                    label={verified ? '✓ Verified' : 'Verify'}
                    variant={verified ? 'primary' : 'outlined'}
                    onClick={handleVerify}
                  />
                </div>
              </div>

              {verified && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-in">
                  <TextBox
                    label="Applicant Name"
                    value={applicantName}
                    onChange={setApplicantName}
                  />
                  <TextBox
                    label={
                      isEmployee
                        ? 'Designation — Department'
                        : 'Course — Department'
                    }
                    value={courseDept}
                    onChange={setCourseDept}
                  />
                  <TextBox
                    label="Mobile Number"
                    value={mobile}
                    onChange={setMobile}
                  />
                  <TextBox
                    label="Email Address"
                    value={email}
                    onChange={setEmail}
                  />
                </div>
              )}
            </div>
          </FormCard>

          <FormCard title="Grievance Details">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DropDownList
                  label="Grievance Category *"
                  data={categoryOptions}
                  textField="name"
                  optionValue="value"
                  value={category}
                  onChange={v => {
                    setCategory(v as string);
                    setSubCategory('');
                    setOtherCategory('');
                  }}
                />
                {category && category !== 'Other' && (
                  <DropDownList
                    label="Sub-Category *"
                    data={subCatOptions}
                    textField="name"
                    optionValue="value"
                    value={subCategory}
                    onChange={v => setSubCategory(v as string)}
                  />
                )}
                {category === 'Other' && (
                  <TextBox
                    label="Sub-Category *"
                    placeholder="Specify the sub-category"
                    value={subCategory}
                    onChange={setSubCategory}
                  />
                )}
              </div>

              {category === 'Other' && (
                <TextBox
                  label="Please Specify Category *"
                  placeholder="Describe the category of your grievance"
                  value={otherCategory}
                  onChange={setOtherCategory}
                />
              )}

              <TextBox
                label="Subject of Grievance *"
                placeholder="Write a brief, clear subject line (max 120 characters)"
                value={subject}
                onChange={setSubject}
              />

              <div>
                <TextArea
                  label="Detailed Description *"
                  placeholder="Clearly describe the issue, including relevant dates, persons involved, and any previous attempts to resolve it. The more detail you provide, the faster your grievance can be addressed."
                  value={description}
                  onChange={setDescription}
                  rows={6}
                />
                <p className="text-xs text-slate-400 text-right mt-1">
                  {description.length} / 2000 characters
                </p>
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Supporting Documents (Optional)
                </label>
                <label
                  htmlFor="grv-doc-upload"
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-6 cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50"
                >
                  <span className="material-symbols-outlined text-slate-400 text-4xl">
                    cloud_upload
                  </span>
                  <p className="text-sm font-medium text-slate-600">
                    Click to upload or drag files here
                  </p>
                  <p className="text-xs text-slate-400">
                    PDF, JPG, PNG, DOC, DOCX — Max {MAX_SIZE_MB}MB each — Up to
                    5 files
                  </p>
                </label>
                <input
                  id="grv-doc-upload"
                  type="file"
                  accept={ACCEPTED_TYPES}
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />

                {files.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {files.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-500 text-base">
                            attach_file
                          </span>
                          <span className="font-medium text-slate-700 truncate max-w-xs">
                            {f.name}
                          </span>
                          <span className="text-slate-400">
                            ({(f.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          className="text-red-400 hover:text-red-600 ml-2"
                        >
                          <span className="material-symbols-outlined text-base">
                            close
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FormCard>

          {/* Submit */}
          <div className="flex justify-end gap-3 pb-4">
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => navigate(portalUrls.portal)}
            />
            <Button
              label={submitting ? 'Submitting...' : 'Submit Grievance →'}
              variant="primary"
              onClick={handleSubmit}
            />
          </div>
        </div>

        {/* ── RIGHT: Helper Side Panel (1/3 width) ── */}
        <div className="space-y-4">
          {/* Allowed file types */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-blue-600 text-lg">
                attach_file
              </span>
              <h3 className="text-sm font-bold text-blue-800">
                Allowed File Types
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['PDF', 'JPG', 'PNG', 'DOC', 'DOCX'].map(ext => (
                <span
                  key={ext}
                  className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-mono font-bold"
                >
                  .{ext.toLowerCase()}
                </span>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Maximum size: <strong>{MAX_SIZE_MB}MB</strong> per file
            </p>
            <p className="text-xs text-blue-600">
              Maximum files: <strong>5 documents</strong>
            </p>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-amber-600 text-lg">
                lightbulb
              </span>
              <h3 className="text-sm font-bold text-amber-800">
                Tips for Writing
              </h3>
            </div>
            <ul className="text-xs text-amber-700 space-y-1.5">
              <li className="flex gap-1.5">
                <span>•</span>
                <span>
                  Be specific about dates and locations of the incident.
                </span>
              </li>
              <li className="flex gap-1.5">
                <span>•</span>
                <span>Mention names of concerned persons or departments.</span>
              </li>
              <li className="flex gap-1.5">
                <span>•</span>
                <span>
                  Describe any previous attempts to resolve the issue.
                </span>
              </li>
              <li className="flex gap-1.5">
                <span>•</span>
                <span>
                  Attach relevant evidence documents (receipts, emails,
                  screenshots).
                </span>
              </li>
              <li className="flex gap-1.5">
                <span>•</span>
                <span>Use factual, professional language.</span>
              </li>
            </ul>
          </div>

          {/* Resolution Timeline */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-green-600 text-lg">
                schedule
              </span>
              <h3 className="text-sm font-bold text-green-800">
                Expected Resolution
              </h3>
            </div>
            <div className="space-y-2">
              {[
                {
                  level: 'Department Level',
                  days: '7–10 Working Days',
                  color: 'text-green-700',
                },
                {
                  level: 'HOD Review',
                  days: '15 Working Days',
                  color: 'text-amber-700',
                },
                {
                  level: 'Grievance Cell',
                  days: '30 Working Days',
                  color: 'text-orange-700',
                },
                {
                  level: 'Committee Review',
                  days: '45 Working Days',
                  color: 'text-red-700',
                },
              ].map(r => (
                <div key={r.level} className="flex justify-between text-xs">
                  <span className="text-slate-600">{r.level}</span>
                  <span className={`font-semibold ${r.color}`}>{r.days}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Process Overview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-slate-600 text-lg">
                account_tree
              </span>
              <h3 className="text-sm font-bold text-slate-700">How It Works</h3>
            </div>
            <div className="space-y-2">
              {[
                {
                  step: '1',
                  label: 'You Submit',
                  desc: 'Grievance auto-routed to Department',
                },
                {
                  step: '2',
                  label: 'Dept Reviews',
                  desc: 'Officer initiates notesheet & forwards',
                },
                {
                  step: '3',
                  label: 'HOD Evaluates',
                  desc: 'Sends to Grievance Cell if needed',
                },
                {
                  step: '4',
                  label: 'Resolution',
                  desc: 'Registrar issues formal order & notifies you',
                },
              ].map(s => (
                <div key={s.step} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {s.label}
                    </p>
                    <p className="text-xs text-slate-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FormPage>
  );
}
