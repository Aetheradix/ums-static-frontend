import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  Trash2,
  Printer,
  Download,
  HelpCircle,
} from 'lucide-react';
import { ToastService } from 'services';

interface Applicant {
  applicationNo: string;
  name: string;
  course: string;
  mobile: string;
  email: string;
}

const MOCK_APPLICANTS: Record<string, Applicant> = {
  APP12345: {
    applicationNo: 'APP12345',
    name: 'Rajesh Kumar',
    course: 'M.Sc. Chemistry (2 Year Course)',
    mobile: '9876543210',
    email: 'rajesh.k@gmail.com',
  },
  APP67890: {
    applicationNo: 'APP67890',
    name: 'Aarav Sharma',
    course: 'B.Tech. Computer Science & Engineering',
    mobile: '9123456789',
    email: 'aarav.s@gmail.com',
  },
  APP11223: {
    applicationNo: 'APP11223',
    name: 'Priya Patel',
    course: 'MBA (Marketing Management)',
    mobile: '9345678901',
    email: 'priya.patel@yahoo.com',
  },
};

const CATEGORIES_DATA = [
  {
    category: 'Admission Fees & Refunds',
    subCategories: [
      'Double Fee Payment Deducted',
      'Refund of Admission Cancellation',
      'Fee Receipt Missing',
      'Admission Registration Discount Issue',
    ],
  },
  {
    category: 'Document & Certificate Verification',
    subCategories: [
      'DigiLocker Verification Error',
      'Original Marksheet Return Delay',
      'Bonafide Certificate Request Pending',
      'Migration Certificate Delay',
    ],
  },
  {
    category: 'Technical Portal Issue',
    subCategories: [
      'Admission Portal OTP Not Received',
      'Profile Details Correction',
      'Payment Gateway Timeout',
      'Document Upload Failures',
    ],
  },
  {
    category: 'Seat Allotment & Counselling',
    subCategories: [
      'Counselling Round Discrepancy',
      'Category Quota Not Applied',
      'Seat Relinquishment Process',
      'Branch Upgrade Complaint',
    ],
  },
];

export default function PublicGrievance() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Submit Public Grievance | DAVV Indore CMS';
    window.scrollTo(0, 0);
  }, []);
  // Form State
  const [appNo, setAppNo] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [applicantInfo, setApplicantInfo] = useState<Applicant | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [tempInfo, setTempInfo] = useState<Applicant | null>(null);

  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [declaration, setDeclaration] = useState(false);

  // File Upload State
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
  } | null>(null);

  // Validation Errors
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Success Dialog State
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [generatedTicketNo, setGeneratedTicketNo] = useState('');

  // Handle Applicant Verification
  const handleVerify = () => {
    setVerifyError('');
    setIsVerified(false);
    setApplicantInfo(null);
    setShowOtpInput(false);
    setOtpError('');

    const formattedNo = appNo.trim().toUpperCase();
    if (!formattedNo) {
      setVerifyError('Application Number is required.');
      return;
    }

    // Simulate search
    if (MOCK_APPLICANTS[formattedNo]) {
      setTempInfo(MOCK_APPLICANTS[formattedNo]);
      setShowOtpInput(true);
      setVerifyError('');
    } else {
      setVerifyError('Application Number not found.');
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = () => {
    setOtpError('');
    if (!otpCode.trim()) {
      setOtpError('OTP is required.');
      return;
    }

    // Simulated check (test credentials: 123456 or 111111)
    if (otpCode.trim() === '123456' || otpCode.trim() === '111111') {
      setIsVerified(true);
      setApplicantInfo(tempInfo);
      setShowOtpInput(false);
      setOtpCode('');
      // Reset validation error for appNo
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy.appNo;
        return copy;
      });
    } else {
      setOtpError(
        'Invalid OTP code. Please enter 123456 or 111111 for simulation.'
      );
    }
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
    setOtpCode('');
    setOtpError('');
    ToastService.success(
      'A new 6-digit OTP code has been re-sent to your registered contacts.'
    );
  };

  // Reset form helper
  const handleReset = () => {
    setAppNo('');
    setIsVerified(false);
    setVerifyError('');
    setApplicantInfo(null);
    setCategory('');
    setSubCategory('');
    setSubject('');
    setDescription('');
    setDeclaration(false);
    setAttachedFile(null);
    setValidationErrors({});
    setShowOtpInput(false);
    setOtpCode('');
    setOtpError('');
    setTempInfo(null);
  };

  // Toast Import placeholder check or direct service use
  // We imported ToastService at the top earlier.

  // Mock File Selection
  const handleSimulateFile = () => {
    setAttachedFile({
      name: `Evidence_Document_${Math.floor(Math.random() * 900 + 100)}.pdf`,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
    });
    setValidationErrors(prev => {
      const copy = { ...prev };
      delete copy.file;
      return copy;
    });
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  // Validate on submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!isVerified) {
      errors.appNo = 'Please verify your Application Number before submitting.';
    }
    if (!category) {
      errors.category = 'Please select a grievance category.';
    }
    if (!subCategory) {
      errors.subCategory = 'Please select a grievance sub-category.';
    }
    if (!subject.trim()) {
      errors.subject = 'Subject heading is required.';
    }
    if (!description.trim()) {
      errors.description = 'Please provide a detailed description.';
    } else if (description.trim().length < 20) {
      errors.description = 'Description must be at least 20 characters long.';
    }
    if (!declaration) {
      errors.declaration = 'You must agree to the declaration statement.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(`error-anchor-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Success Simulation
    const ticketNo = `GRV2026${Math.floor(Math.random() * 90000 + 10000)}`;
    setGeneratedTicketNo(ticketNo);
    setShowSuccessDialog(true);
  };

  // Get active subcategories based on selection
  const activeCategoryObj = CATEGORIES_DATA.find(c => c.category === category);
  const subCategoryOptions = activeCategoryObj
    ? activeCategoryObj.subCategories
    : [];

  return (
    <main className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <span
            className="hover:text-blue-700 cursor-pointer"
            onClick={() => navigate('/octagon-cms')}
          >
            Home
          </span>
          <span>/</span>
          <span className="text-slate-700 font-bold">
            Public Grievance Submission
          </span>
        </nav>

        {/* Heading Card */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 md:p-8 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner">
                D
              </span>
              <div>
                <h1 className="font-display text-lg font-bold text-slate-900 tracking-wide uppercase">
                  Devi Ahilya Vishwavidyalaya
                </h1>
                <p className="text-xs text-slate-500 font-medium font-mono">
                  DAVV Indore ERP • CMS Portal
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight pt-3 border-t border-slate-100">
              Public Grievance Redressal Form
            </h2>
            <p className="text-xs text-slate-500">
              For external applicants seeking redressal regarding admission
              applications, fees recheck or counselling issues.
            </p>
          </div>

          {/* Help Info Card */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-sm flex items-start gap-3 shrink-0">
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 text-xs">
                Need Assistance?
              </h4>
              <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                Provide your active application code from your receipt. If
                verified, the system imports your contact details automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Verification Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />

            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-mono text-xs">
                1
              </span>
              Applicant Verification
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    Admission Application Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter App Code (e.g. APP12345, APP67890)"
                    value={appNo}
                    onChange={e => setAppNo(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-lg p-3 text-sm focus:border-blue-600 outline-none transition-colors font-mono font-bold ${
                      verifyError || validationErrors.appNo
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-slate-200'
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerify}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-lg transition-colors shadow-sm cursor-pointer shrink-0"
                >
                  Verify Application
                </button>
              </div>

              {/* Helper suggestion tool for validation testing */}
              {!isVerified && !verifyError && (
                <p className="text-[10px] text-slate-400">
                  Tip: Use demo codes{' '}
                  <strong className="text-slate-600">APP12345</strong>,{' '}
                  <strong className="text-slate-600">APP67890</strong> or{' '}
                  <strong className="text-slate-600">APP11223</strong> for
                  testing validation success.
                </p>
              )}

              {verifyError && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-bold p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{verifyError}</span>
                </div>
              )}

              {validationErrors.appNo && (
                <p
                  id="error-anchor-appNo"
                  className="text-red-500 text-xs font-bold flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {validationErrors.appNo}
                </p>
              )}

              {showOtpInput && tempInfo && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-5 mt-4 space-y-4">
                  <div className="flex items-center gap-2 border-b border-amber-100 pb-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                    <span className="text-xs font-bold text-amber-800">
                      Security Verification: OTP Sent
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    A 6-digit OTP code has been dispatched to applicant's
                    registered contact channels ending in:
                    <strong className="text-slate-800 block mt-0.5">
                      Mobile: +91 ******{tempInfo.mobile.slice(-4)} · Email:{' '}
                      {tempInfo.email.split('@')[0].slice(0, 3)}***@
                      {tempInfo.email.split('@')[1]}
                    </strong>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider">
                        Enter 6-Digit OTP *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 123456 (or 111111)"
                        value={otpCode}
                        onChange={e =>
                          setOtpCode(e.target.value.replace(/\D/g, ''))
                        }
                        className={`w-full bg-white border rounded-lg p-2.5 text-sm outline-none transition-colors font-mono font-bold tracking-widest text-center text-lg ${
                          otpError
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-slate-200 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Verify OTP
                      </button>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 px-4 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>

                  {otpError && (
                    <div className="flex items-center gap-2 text-red-500 text-[11px] font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <p className="text-[10px] text-amber-800 bg-amber-100/30 p-2 rounded border border-amber-200/50">
                    Use simulated test code{' '}
                    <strong className="text-amber-950 font-mono">123456</strong>{' '}
                    or{' '}
                    <strong className="text-amber-950 font-mono">111111</strong>{' '}
                    to complete the verification step.
                  </p>
                </div>
              )}

              {/* Verified Output Card */}
              {isVerified && applicantInfo && (
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-5 mt-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Application Number Verified
                    </span>
                    <span className="bg-emerald-600 text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded">
                      VALID PETITIONER
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">
                        Applicant Name
                      </span>
                      <span className="font-bold text-slate-800">
                        {applicantInfo.name}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">
                        Course / Program Applied
                      </span>
                      <span className="font-bold text-slate-800">
                        {applicantInfo.course}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">
                        Registered Mobile Number
                      </span>
                      <span className="font-bold text-slate-800 font-mono">
                        +91 {applicantInfo.mobile}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-bold">
                        Registered Email ID
                      </span>
                      <span className="font-bold text-slate-800 font-mono">
                        {applicantInfo.email}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isVerified && (
            <>
              {/* Section 2: Grievance Details Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />

                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-6">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-mono text-xs">
                    2
                  </span>
                  Grievance Details
                </h3>

                <div className="space-y-5">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-wider">
                      Grievance Category *
                    </label>
                    <select
                      value={category}
                      onChange={e => {
                        setCategory(e.target.value);
                        setSubCategory('');
                      }}
                      className={`w-full bg-slate-50 border rounded-lg p-3 text-sm focus:border-blue-600 outline-none transition-colors ${
                        validationErrors.category
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-slate-200'
                      }`}
                    >
                      <option value="">-- Select Grievance Category --</option>
                      {CATEGORIES_DATA.map(c => (
                        <option key={c.category} value={c.category}>
                          {c.category}
                        </option>
                      ))}
                    </select>
                    {validationErrors.category && (
                      <p
                        id="error-anchor-category"
                        className="text-red-500 text-xs font-bold flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {validationErrors.category}
                      </p>
                    )}
                  </div>

                  {/* Sub Category */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-wider">
                      Grievance Sub-Category *
                    </label>
                    <select
                      value={subCategory}
                      onChange={e => setSubCategory(e.target.value)}
                      disabled={!category}
                      className={`w-full bg-slate-50 border rounded-lg p-3 text-sm focus:border-blue-600 outline-none transition-colors disabled:bg-slate-100 disabled:text-slate-400 ${
                        validationErrors.subCategory
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-slate-200'
                      }`}
                    >
                      <option value="">-- Select Sub-Category --</option>
                      {subCategoryOptions.map(sub => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                    {validationErrors.subCategory && (
                      <p
                        id="error-anchor-subCategory"
                        className="text-red-500 text-xs font-bold flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {validationErrors.subCategory}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        Brief Subject *
                      </label>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {subject.length}/100 Chars
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={100}
                      placeholder="Short heading of the problem"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className={`w-full bg-slate-50 border rounded-lg p-3 text-sm focus:border-blue-600 outline-none transition-colors ${
                        validationErrors.subject
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-slate-200'
                      }`}
                    />
                    {validationErrors.subject && (
                      <p
                        id="error-anchor-subject"
                        className="text-red-500 text-xs font-bold flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {validationErrors.subject}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        Detailed Grievance Description *
                      </label>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {description.length}/1000 Chars
                      </span>
                    </div>
                    <textarea
                      maxLength={1000}
                      rows={6}
                      placeholder="Please state details regarding your dispute (e.g. transaction dates, cancelled seats, document numbers, counselling details to help us investigate faster)..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className={`w-full bg-slate-50 border rounded-lg p-3 text-sm focus:border-blue-600 outline-none transition-colors resize-none ${
                        validationErrors.description
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-slate-200'
                      }`}
                    />
                    {validationErrors.description && (
                      <p
                        id="error-anchor-description"
                        className="text-red-500 text-xs font-bold flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {validationErrors.description}
                      </p>
                    )}
                  </div>

                  {/* Supporting Document */}
                  <div className="space-y-2">
                    <label className="block text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-wider">
                      Supporting Document (Optional)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <button
                        type="button"
                        onClick={handleSimulateFile}
                        className="border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Simulate Upload File (.pdf, .jpg, .png)
                      </button>
                      <span className="text-[10px] text-slate-400 sm:self-center font-bold">
                        Maximum allowed size: 5MB
                      </span>
                    </div>

                    {attachedFile && (
                      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs mt-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="font-bold text-slate-800 block leading-tight">
                              {attachedFile.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Size: {attachedFile.size} · Verification Ready
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Declaration Checkbox */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={declaration}
                    onChange={e => setDeclaration(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    I hereby declare that the information provided is true and
                    correct to the best of my knowledge.
                  </span>
                </label>
                {validationErrors.declaration && (
                  <p
                    id="error-anchor-declaration"
                    className="text-red-500 text-xs font-bold flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {validationErrors.declaration}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 py-4 px-2 sm:px-6 shadow-lg sm:shadow-none sm:relative sm:border-none sm:bg-transparent flex flex-row justify-end gap-3 z-10 rounded-xl">
                <button
                  type="button"
                  onClick={() => navigate('/octagon-cms')}
                  className="border border-slate-300 hover:border-slate-400 text-slate-700 bg-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="border border-slate-300 hover:border-slate-400 text-slate-700 bg-slate-50 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-lg transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-lg transition-colors shadow-md cursor-pointer"
                >
                  Submit Grievance
                </button>
              </div>
            </>
          )}

          {!isVerified && (
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/octagon-cms')}
                className="border border-slate-300 hover:border-slate-400 text-slate-700 bg-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-lg transition-colors cursor-pointer"
              >
                Cancel and Go Back
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Success Dialog Popup */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-150 rounded-2xl max-w-lg w-full p-8 text-center shadow-2xl relative">
            <span className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
            </span>

            <h3 className="text-xl font-black text-slate-900 mb-2">
              Grievance Submitted Successfully
            </h3>

            <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 my-4 inline-block">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">
                Grievance Ticket No
              </span>
              <span className="text-lg font-mono font-black text-blue-700">
                {generatedTicketNo}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-6">
              Your grievance has been successfully registered. Tracking details
              and access instructions have been sent to your registered Email ID
              and Mobile Number.
            </p>

            {/* Action buttons in success dialog */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs p-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                Print Ack
              </button>
              <button
                type="button"
                onClick={() => {
                  const dataStr =
                    'data:text/json;charset=utf-8,' +
                    encodeURIComponent(
                      JSON.stringify({
                        ticketNo: generatedTicketNo,
                        applicant: applicantInfo?.name,
                        category,
                        subject,
                        timestamp: new Date().toISOString(),
                      })
                    );
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute(
                    'download',
                    `acknowledgement_${generatedTicketNo}.json`
                  );
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs p-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4 text-blue-600" />
                Download Ack
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  handleReset();
                  setShowSuccessDialog(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg cursor-pointer transition-all shadow"
              >
                Raise Another Grievance
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessDialog(false);
                  navigate('/octagon-cms');
                }}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 rounded-lg cursor-pointer transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
