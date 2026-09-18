import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import {
  FormCard,
  FormGrid,
  FormPage,
  PaymentDialog,
  ReceiptDialog,
  StatusBadge,
} from 'shared/new-components';
import { saveSpecialServiceRequest } from '../../specialServiceStore';
import type {
  SpecialServiceApprovalItem,
  SubmittedDocument,
} from '../../special-service-request-approval/types';

export interface SpecialServiceDefinition {
  id: number;
  code: string;
  name: string;
  baseFeePrivate: number;
  baseFeeGovt: number;
  gstRate: number;
  pdfReference: string;
  description: string;
}

// Exactly the 7 Official Special Services from Page 2 of DAVV Affiliation Fees Notification
// (Notification No. Academic/Affiliation/2022/339 Dated 24 Feb 2022 - Determination of Other Fees)
export const ALL_DAVV_SPECIAL_SERVICES: SpecialServiceDefinition[] = [
  {
    id: 1,
    code: 'LOCATION_CHANGE',
    name: 'Change of College Location / Premises',
    baseFeePrivate: 150000,
    baseFeeGovt: 0,
    gstRate: 18,
    pdfReference: 'Page 2, Item 2 (Private: ₹1,50,000/-, Govt: Nil)',
    description:
      'Relocating college campus to new land / premises. Land registry, building map, and Khasra verification.',
  },
  {
    id: 2,
    code: 'NAME_CHANGE',
    name: 'Change of College Name',
    baseFeePrivate: 50000,
    baseFeeGovt: 0,
    gstRate: 18,
    pdfReference: 'Page 2, Item 1 (Private: ₹50,000/-, Govt: Nil)',
    description:
      'Renaming college institution with Sponsoring Society resolution, MP Govt Gazette, and affidavit.',
  },
  {
    id: 3,
    code: 'SOCIETY_CHANGE',
    name: 'Change of Trust / Society / Company',
    baseFeePrivate: 300000,
    baseFeeGovt: 0,
    gstRate: 18,
    pdfReference: 'Page 2, Item 6 (Private: ₹3,00,000/-, Govt: Nil)',
    description:
      'Transfer of sponsoring society, new registration certificate, bylaws, and governing body handover.',
  },
  {
    id: 4,
    code: 'SEAT_REDUCTION',
    name: 'Course Seat Capacity Reduction',
    baseFeePrivate: 50000,
    baseFeeGovt: 0,
    gstRate: 18,
    pdfReference: 'Page 2, Item 3 (Private: ₹50,000/-, Govt: Nil)',
    description:
      'Voluntary downward reduction in approved student intake in an affiliated course.',
  },
  {
    id: 5,
    code: 'COURSE_CLOSURE',
    name: 'Course / Programme Progressive Closure',
    baseFeePrivate: 50000,
    baseFeeGovt: 0,
    gstRate: 18,
    pdfReference: 'Page 2, Item 4 (Private: ₹50,000/-, Govt: Nil)',
    description:
      'Permanent progressive closure of an affiliated course with student completion plan.',
  },
  {
    id: 6,
    code: 'COLLEGE_CLOSURE',
    name: 'Complete College Closure',
    baseFeePrivate: 50000,
    baseFeeGovt: 0,
    gstRate: 18,
    pdfReference: 'Page 2, Item 5 (Private: ₹50,000/-, Govt: Nil)',
    description:
      'Complete shutdown of college operations with staff gratuity clearance and student transfer.',
  },
  {
    id: 7,
    code: 'ADD_ON_COURSE',
    name: 'Add-on Course (Certificate / Diploma / Adv. Diploma - 1 Year)',
    baseFeePrivate: 50000,
    baseFeeGovt: 30000,
    gstRate: 18,
    pdfReference: 'Page 2, Item 7 (Private: ₹50,000/-, Govt: ₹30,000/-)',
    description:
      'Approval of one-year skill/career oriented certificate, diploma, or advanced diploma add-on course.',
  },
];

export default function SpecialServiceRequestsPage() {
  // Existing Registered Details (Read-Only Reference)
  const masterCollegeAddress = '12, MG Road, Indore - 452001';
  const masterCollegeName = 'Global Institute of Technology & Management';
  const masterSocietyName = 'Shri Balaji Educational Society';

  // STEP 1 Controls
  const [academicYearId, setAcademicYearId] = useState<string>('2025-2026');
  const [collegeTypeId, setCollegeTypeId] = useState<string>('private'); // 'private' or 'govt'
  const [selectedServiceId, setSelectedServiceId] = useState<number>(1);

  // Form Submission & Application State (Form is submitted FIRST)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [applicationId, setApplicationId] = useState<string>('');
  const [submissionDate, setSubmissionDate] = useState<string>('');
  const [isEditingAfterSubmit, setIsEditingAfterSubmit] =
    useState<boolean>(false);

  // Payment State (Payment occurs AFTER form submission)
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] =
    useState<boolean>(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] =
    useState<boolean>(false);

  // --- Strict Fields Per Service (Only what is in the PDF for that service) ---
  // 1. Location Change (PDF Item 2, 9, 10)
  const [newAddress, setNewAddress] = useState<string>(
    'Khasra No 14/2, Super Corridor, Sanwer Road'
  );
  const [district, setDistrict] = useState<string>('Indore');
  const [tehsil, setTehsil] = useState<string>('Sanwer');
  const [pinCode, setPinCode] = useState<string>('453551');
  const [newLandArea, setNewLandArea] = useState<string>('6.50');
  const [khasraNo, setKhasraNo] = useState<string>('14/2, 14/3, 15/1');
  const [builtUpArea, setBuiltUpArea] = useState<string>('48000');

  // 2. Name Change (PDF Item 1, 18)
  const [newCollegeName, setNewCollegeName] = useState<string>(
    'DAVV Institute of Technology & Advanced Studies'
  );
  const [nameChangeReason, setNameChangeReason] = useState<string>(
    'To align with NEP 2020 multidisciplinary expansion.'
  );

  // 3. Society Change (PDF Item 6)
  const [newSocietyName, setNewSocietyName] = useState<string>(
    'Vidyasagar Higher Education Foundation'
  );
  const [societyRegNo, setSocietyRegNo] = useState<string>('SOC/IND/2026/9821');

  // 4. Seat Reduction (PDF Item 3)
  const [seatReductionCourse, setSeatReductionCourse] = useState<string>(
    'B.Com (Computer Applications)'
  );
  const [currentApprovedSeats, setCurrentApprovedSeats] = useState<number>(120);
  const [proposedReducedSeats, setProposedReducedSeats] = useState<number>(60);
  const [seatReductionReason, setSeatReductionReason] = useState<string>(
    'Declining student admissions in computing subjects.'
  );

  // 5. Course Closure (PDF Item 4)
  const [closureCourseName, setClosureCourseName] =
    useState<string>('B.Sc (Electronics)');
  const [closureBatchYear, setClosureBatchYear] = useState<string>(
    '2024-2027 (Last enrolled batch)'
  );
  const [studentTransferPlan, setStudentTransferPlan] = useState<string>(
    'All existing 18 students will complete exams with no fresh intake.'
  );

  // 6. College Closure (PDF Item 5, 18)
  const [collegeClosureReason, setCollegeClosureReason] = useState<string>(
    'Financial consolidation and lack of eligible admissions.'
  );
  const [staffSettlementNoc, setStaffSettlementNoc] = useState<string>(
    'All 24 staff members gratuity and provident funds fully settled.'
  );

  // 7. Add-on Course (PDF Item 7)
  const [addonCourseTitle, setAddonCourseTitle] = useState<string>(
    'Certificate Course in AI & Data Science'
  );
  const [addonCourseType, setAddonCourseType] = useState<string>('Certificate');
  const [addonIntake, setAddonIntake] = useState<number>(40);

  const [declaration, setDeclaration] = useState<boolean>(false);

  // Current Selected Service
  const currentService = useMemo(() => {
    return (
      ALL_DAVV_SPECIAL_SERVICES.find(s => s.id === selectedServiceId) ??
      ALL_DAVV_SPECIAL_SERVICES[0]
    );
  }, [selectedServiceId]);

  // Fee calculation strictly per DAVV Page 2 rules
  const isGovt = collegeTypeId === 'govt';

  const { baseFee, gstAmount, totalPayable, isGovtExempt } = useMemo(() => {
    const fee = isGovt
      ? currentService.baseFeeGovt
      : currentService.baseFeePrivate;
    const exempt = isGovt && fee === 0;
    const gst = exempt ? 0 : Math.round((fee * currentService.gstRate) / 100);
    const total = fee + gst;

    return {
      baseFee: fee,
      gstAmount: gst,
      totalPayable: total,
      isGovtExempt: exempt,
    };
  }, [currentService, isGovt]);

  // Full reset (start a fresh application)
  const handleReset = () => {
    setIsSubmitted(false);
    setApplicationId('');
    setSubmissionDate('');
    setIsEditingAfterSubmit(false);
    setIsPaid(false);
    setTransactionId('');
    setDeclaration(false);
  };

  // Switch service or category (only if not submitted)
  const handleServiceChange = (newServiceId: number) => {
    setSelectedServiceId(newServiceId);
    setDeclaration(false);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCollegeTypeId(newCategory);
    setDeclaration(false);
  };

  // Submit Application (Step 3 Action: FIRST FORM SUBMISSION)
  const handleSubmitApplication = () => {
    // Validate service-specific mandatory fields
    if (selectedServiceId === 1) {
      if (
        !district.trim() ||
        !tehsil.trim() ||
        !pinCode.trim() ||
        !newAddress.trim() ||
        !newLandArea.trim() ||
        !khasraNo.trim() ||
        !builtUpArea.trim()
      ) {
        ToastService.error(
          'Please fill in all mandatory location and land/infrastructure details.'
        );
        return;
      }
    } else if (selectedServiceId === 2) {
      if (!newCollegeName.trim() || !nameChangeReason.trim()) {
        ToastService.error(
          'Please provide the proposed new college name and reason for name change.'
        );
        return;
      }
    } else if (selectedServiceId === 3) {
      if (!newSocietyName.trim() || !societyRegNo.trim()) {
        ToastService.error(
          'Please provide the new society/trust name and registration number.'
        );
        return;
      }
    } else if (selectedServiceId === 4) {
      if (
        !seatReductionCourse.trim() ||
        !seatReductionReason.trim() ||
        !proposedReducedSeats
      ) {
        ToastService.error(
          'Please fill in course name, proposed reduced seats, and reduction reason.'
        );
        return;
      }
    } else if (selectedServiceId === 5) {
      if (!closureCourseName.trim() || !studentTransferPlan.trim()) {
        ToastService.error(
          'Please provide closure course name and student transfer plan.'
        );
        return;
      }
    } else if (selectedServiceId === 6) {
      if (!collegeClosureReason.trim() || !staffSettlementNoc.trim()) {
        ToastService.error(
          'Please provide complete college closure reason and staff settlement undertaking.'
        );
        return;
      }
    } else if (selectedServiceId === 7) {
      if (!addonCourseTitle.trim() || !addonIntake) {
        ToastService.error(
          'Please provide add-on course title and proposed intake seats.'
        );
        return;
      }
    }

    if (!declaration) {
      ToastService.error('Please accept the verification declaration.');
      return;
    }

    const generatedId =
      applicationId || `SR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    setApplicationId(generatedId);
    setSubmissionDate(formattedDate);
    setIsSubmitted(true);
    setIsEditingAfterSubmit(false);

    // Build documents array based on service
    const getInitialDocuments = (): SubmittedDocument[] => {
      switch (selectedServiceId) {
        case 1:
          return [
            {
              id: `doc-${Date.now()}-1`,
              name: 'Registered_30Year_Lease_Deed.pdf',
              documentType:
                '1. Registered 30-Year Lease / Land Registry Deed (PDF Item 9)',
              fileSize: '4.2 MB',
              isVerified: false,
            },
            {
              id: `doc-${Date.now()}-2`,
              name: 'Certified_Building_Map_Plan.pdf',
              documentType: '2. Certified Building Map & Plan (PDF Item 10)',
              fileSize: '5.1 MB',
              isVerified: false,
            },
          ];
        case 2:
          return [
            {
              id: `doc-${Date.now()}-1`,
              name: 'Society_Resolution_NameChange.pdf',
              documentType: 'Society Resolution for Name Change',
              fileSize: '1.8 MB',
              isVerified: false,
            },
            {
              id: `doc-${Date.now()}-2`,
              name: 'MP_Govt_Gazette_Notification.pdf',
              documentType: 'MP Govt Gazette Notification',
              fileSize: '2.4 MB',
              isVerified: false,
            },
            {
              id: `doc-${Date.now()}-3`,
              name: 'Affidavit_Stamp_100.pdf',
              documentType: 'Affidavit on ₹100 Stamp Paper',
              fileSize: '890 KB',
              isVerified: false,
            },
          ];
        case 3:
          return [
            {
              id: `doc-${Date.now()}-1`,
              name: 'New_Society_Reg_Certificate.pdf',
              documentType: 'Society Registration Certificate',
              fileSize: '1.2 MB',
              isVerified: false,
            },
            {
              id: `doc-${Date.now()}-2`,
              name: 'Transfer_Deed_Handover_NOC.pdf',
              documentType: 'Transfer Deed & Handover Resolution',
              fileSize: '3.6 MB',
              isVerified: false,
            },
          ];
        case 4:
          return [
            {
              id: `doc-${Date.now()}-1`,
              name: 'Governing_Body_Seat_Reduction.pdf',
              documentType: 'College Governing Body Resolution',
              fileSize: '1.5 MB',
              isVerified: false,
            },
          ];
        case 5:
          return [
            {
              id: `doc-${Date.now()}-1`,
              name: 'Progressive_Closure_Plan.pdf',
              documentType:
                'Course Closure Roadmap & Governing Body Resolution',
              fileSize: '2.1 MB',
              isVerified: false,
            },
            {
              id: `doc-${Date.now()}-2`,
              name: 'Student_Exam_Undertaking.pdf',
              documentType: 'Student Exam Completion & Protection Plan',
              fileSize: '1.1 MB',
              isVerified: false,
            },
          ];
        case 6:
          return [
            {
              id: `doc-${Date.now()}-1`,
              name: 'Staff_NOC_Gratuity.pdf',
              documentType: 'Staff Gratuity & PF Settlement Undertaking / NOC',
              fileSize: '2.0 MB',
              isVerified: false,
            },
          ];
        case 7:
        default:
          return [
            {
              id: `doc-${Date.now()}-1`,
              name: 'Curriculum_Syllabus_Proposal.pdf',
              documentType: 'Detailed Syllabus & NEP Framework Proposal',
              fileSize: '3.4 MB',
              isVerified: false,
            },
          ];
      }
    };

    const newApprovalItem: SpecialServiceApprovalItem = {
      id: `SSR-${Math.floor(100 + Math.random() * 900)}`,
      applicationNo: generatedId,
      collegeCode: 'COL001',
      collegeName: masterCollegeName,
      collegeType: collegeTypeId as 'private' | 'govt',
      academicYear: academicYearId,
      serviceId: currentService.id,
      serviceCode: currentService.code as any,
      serviceName: currentService.name,
      baseFee,
      gstAmount,
      feeAmount: totalPayable,
      isFeeExempted: isGovtExempt,
      paymentStatus: isGovtExempt ? 'Exempted' : 'Pending',
      transactionId: isGovtExempt ? 'EXEMPTED_GOVT_COLLEGE' : undefined,
      paymentDate: isGovtExempt ? formattedDate : undefined,
      submissionDate: formattedDate,
      status: 'Pending Scrutiny',
      declarationAccepted: true,
      documents: getInitialDocuments(),
      details: {
        currentAddress: masterCollegeAddress,
        state: 'Madhya Pradesh',
        district,
        tehsil,
        pinCode,
        proposedAddress: newAddress,
        landArea: `${newLandArea} Acres`,
        khasraNo,
        builtUpArea: `${builtUpArea} Sq. Ft.`,
        currentCollegeName: masterCollegeName,
        proposedCollegeName: newCollegeName,
        nameChangeReason,
        currentSocietyName: masterSocietyName,
        proposedSocietyName: newSocietyName,
        societyRegNo,
        courseName: seatReductionCourse,
        currentSeats: currentApprovedSeats,
        proposedSeats: proposedReducedSeats,
        seatReductionReason,
        closureCourseName,
        batchYear: closureBatchYear,
        studentTransferPlan,
        collegeClosureReason,
        staffSettlementNoc,
        addonCourseTitle,
        addonCourseType,
        addonIntake,
      },
    };

    saveSpecialServiceRequest(newApprovalItem);

    if (isGovtExempt) {
      setIsPaid(true);
      setTransactionId('EXEMPTED_GOVT_COLLEGE');
      ToastService.success(
        `Special Service Request ${generatedId} (${currentService.name}) submitted successfully! Govt College: Fee is NIL.`
      );
    } else {
      ToastService.success(
        `Special Service Request ${generatedId} (${currentService.name}) submitted successfully! Please proceed to fee payment below.`
      );
    }
  };

  // Payment Success Handler (Step 4: Executed AFTER form submission)
  const handlePaymentSuccess = (newTxnId: string) => {
    const formattedPaymentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    setIsPaid(true);
    setTransactionId(newTxnId);
    setIsPaymentDialogOpen(false);
    setIsReceiptDialogOpen(true);

    if (applicationId) {
      saveSpecialServiceRequest({
        id: `SSR-${applicationId}`,
        applicationNo: applicationId,
        paymentStatus: 'Paid',
        transactionId: newTxnId,
        paymentDate: formattedPaymentDate,
      } as any);
    }

    ToastService.success(
      `Payment of ₹${totalPayable.toLocaleString('en-IN')} Received! Transaction ID: ${newTxnId}. Application is finalized.`
    );
  };

  // Dropdown options
  const academicYearOptions = [
    { text: '2025-2026', value: '2025-2026' },
    { text: '2026-2027', value: '2026-2027' },
  ];

  const collegeTypeOptions = [
    { text: 'Private / Unaided College', value: 'private' },
    { text: 'Government College (Exempted - Nil Fee)', value: 'govt' },
  ];

  // Exactly the 7 Page 2 services
  const specialServiceDropdownData = useMemo(() => {
    return ALL_DAVV_SPECIAL_SERVICES.map(s => {
      const fee = isGovt ? s.baseFeeGovt : s.baseFeePrivate;
      const feeText =
        isGovt && fee === 0 ? 'Nil Fee' : `₹${fee.toLocaleString('en-IN')}`;
      return {
        text: `${s.id}. ${s.name} - [${feeText}]`,
        value: s.id,
      };
    });
  }, [isGovt]);

  const isFormFieldsDisabled = isSubmitted && !isEditingAfterSubmit;

  return (
    <FormPage
      title="Special Service Request"
      description="DAVV Circular Page 2: 7 Official Special Services - Submit your application details first, then complete the fee payment."
      breadcrumbs={[
        { label: 'Home', to: '/affiliation-management-system' },
        {
          label: 'College Portal',
          to: '/affiliation-management-system/college-login',
        },
        { label: 'Special Service Requests' },
      ]}
    >
      <div className="space-y-6">
        {/* POST-SUBMISSION STATUS BANNER */}
        {isSubmitted && (
          <div
            className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
              isPaid
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
                : 'bg-amber-50/90 border-amber-300 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isPaid
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                }`}
              >
                <i
                  className={`pi ${isPaid ? 'pi-check-circle' : 'pi-clock'} text-xl`}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold">
                    Application Ref: {applicationId}
                  </h3>
                  <StatusBadge
                    label={
                      isPaid
                        ? isGovtExempt
                          ? 'Submitted (Exempted)'
                          : 'Submitted & Fee Paid'
                        : 'Form Submitted - Fee Pending'
                    }
                    variant={isPaid ? 'approved' : 'pending'}
                  />
                </div>
                <p className="text-xs opacity-90 mt-0.5">
                  Applied for:{' '}
                  <strong>
                    {currentService.id}. {currentService.name}
                  </strong>{' '}
                  • Submitted on: {submissionDate}
                </p>
                <p className="text-xs font-medium mt-1">
                  {isPaid
                    ? `Payment confirmed (Txn: ${transactionId}). Your request is now under university DCDC review.`
                    : `Your form has been successfully submitted! Please complete the fee payment in Step 4 below to finalize.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              {isSubmitted && !isPaid && !isEditingAfterSubmit && (
                <Button
                  label="Edit Form Details"
                  icon="pi pi-pencil"
                  variant="outlined"
                  size="small"
                  onClick={() => setIsEditingAfterSubmit(true)}
                />
              )}
              {isPaid && !isGovtExempt && (
                <Button
                  label="View Receipt"
                  icon="pi pi-file"
                  variant="outlined"
                  size="small"
                  onClick={() => setIsReceiptDialogOpen(true)}
                />
              )}
              <Button
                label="New Request"
                icon="pi pi-plus"
                variant="primary"
                size="small"
                onClick={handleReset}
              />
            </div>
          </div>
        )}

        {/* STEP 1: SERVICE DETAILS & FEE SCHEDULE PREVIEW */}
        <FormCard title="Step 1: Select Service" icon="file-edit">
          <p className="text-xs text-gray-500 mb-4">
            DAVV Notification No. 339 (Page 2) - 7 Official Special Services:
            Location Change, Name Change, Society/Trust Change, Seat Capacity
            Reduction, Course Closure, College Closure, and Add-on Courses.
          </p>

          <FormGrid columns={3}>
            {/* 1. Academic Year (Session) */}
            <div>
              <DropDownList
                label="Academic Year (Session)"
                data={academicYearOptions}
                value={academicYearId}
                textField="text"
                valueField="value"
                optionValue="value"
                disabled={isFormFieldsDisabled}
                onChange={val => {
                  if (val) setAcademicYearId(String(val));
                }}
                required
              />
            </div>

            {/* 2. College Type */}
            <div>
              <DropDownList
                label="College Type"
                data={collegeTypeOptions}
                value={collegeTypeId}
                textField="text"
                valueField="value"
                optionValue="value"
                disabled={isFormFieldsDisabled}
                onChange={val => {
                  if (val) handleCategoryChange(String(val));
                }}
                required
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Govt colleges are fee-exempted for Page 2 services (Items 1-6).
              </span>
            </div>

            {/* 3. Select Special Service (Strictly the 7 Services) */}
            <div>
              <DropDownList
                label="Service / Application Type"
                data={specialServiceDropdownData}
                value={selectedServiceId}
                textField="text"
                valueField="value"
                optionValue="value"
                disabled={isFormFieldsDisabled}
                onChange={val => {
                  if (val !== null && val !== undefined) {
                    handleServiceChange(Number(val));
                  }
                }}
                required
              />
              <span className="text-[11px] text-blue-700 font-medium mt-1 block">
                {currentService.pdfReference}
              </span>
            </div>
          </FormGrid>

          {/* FEE BREAKDOWN PREVIEW BANNER (NO PRE-PAYMENT LOCK) */}
          <div className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 rounded-xl border border-blue-200 dark:border-slate-700">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded text-xs font-bold uppercase tracking-wider">
                    Fee Schedule
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                    Session:{' '}
                    <strong className="text-gray-900 dark:text-white">
                      {academicYearId}
                    </strong>{' '}
                    | Category:{' '}
                    <strong className="text-gray-900 dark:text-white">
                      {isGovt ? 'Government College' : 'Private College'}
                    </strong>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-1.5">
                  {currentService.id}. {currentService.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {currentService.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-700 dark:text-gray-300">
                  <span>
                    Base Fee:{' '}
                    <strong className="text-gray-900 dark:text-white">
                      {isGovtExempt
                        ? 'NIL (Exempted)'
                        : `₹${baseFee.toLocaleString('en-IN')}`}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    GST (18%):{' '}
                    <strong className="text-gray-900 dark:text-white">
                      {isGovtExempt
                        ? '₹0'
                        : `₹${gstAmount.toLocaleString('en-IN')}`}
                    </strong>
                  </span>
                  <span>•</span>
                  <span className="text-sm font-extrabold text-blue-900 dark:text-blue-300">
                    Applicable Fee:{' '}
                    {isGovtExempt
                      ? 'NIL (₹0)'
                      : `₹${totalPayable.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              <div className="text-xs bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-lg border border-blue-100 dark:border-slate-700 text-gray-600 dark:text-gray-300 max-w-sm">
                <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-400 font-semibold mb-1">
                  <i className="pi pi-info-circle text-xs" />
                  <span>Workflow Order</span>
                </div>
                Fill the required details below and submit your application. Fee
                payment will be initiated in Step 4 after form submission.
              </div>
            </div>
          </div>
        </FormCard>

        {/* =========================================================
              STEP 2: TARGETED FIELDS (IMMEDIATELY EDITABLE)
             ========================================================= */}
        <fieldset
          disabled={isFormFieldsDisabled}
          className={isFormFieldsDisabled ? 'opacity-70' : ''}
        >
          <div className="space-y-6">
            {/* 1. LOCATION CHANGE (PDF Page 2, Item 2) */}
            {selectedServiceId === 1 && (
              <FormCard
                title="SERVICE 1: Location & Premises Change"
                icon="map-marker"
              >
                <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-700 mb-4">
                  <span className="text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 block mb-1">
                    CURRENT REGISTERED CAMPUS ADDRESS (Read-Only)
                  </span>
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    {masterCollegeAddress}
                  </p>
                </div>

                <FormGrid columns={3}>
                  <TextBox label="State" value="Madhya Pradesh" readOnly />
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New District <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={district}
                      onChange={val => setDistrict(val)}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Tehsil / Block <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={tehsil}
                      onChange={val => setTehsil(val)}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                </FormGrid>

                <div className="mt-4">
                  <FormGrid columns={2}>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Pin Code <span className="text-red-500">*</span>
                      </label>
                      <TextBox
                        value={pinCode}
                        onChange={val => setPinCode(val)}
                        maxLength={6}
                        disabled={isFormFieldsDisabled}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Campus Full Address{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <TextArea
                        value={newAddress}
                        onChange={val => setNewAddress(val)}
                        rows={2}
                        disabled={isFormFieldsDisabled}
                        required
                      />
                    </div>
                  </FormGrid>
                </div>

                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mt-4 mb-2">
                  Land & Infrastructure Details (As per PDF Item 2, 9, 10)
                </h4>
                <FormGrid columns={3}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Land Area (Acres) <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={newLandArea}
                      onChange={val => setNewLandArea(val)}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Khasra Numbers <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={khasraNo}
                      onChange={val => setKhasraNo(val)}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Built-up Area (Sq. Ft.){' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={builtUpArea}
                      onChange={val => setBuiltUpArea(val)}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                </FormGrid>

                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mt-4 mb-2">
                  Mandatory Document Uploads (PDF)
                </h4>
                <FormGrid columns={2}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      1. Registered 30-Year Lease / Land Registry Deed (PDF Item
                      9) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      disabled={isFormFieldsDisabled}
                      className="block w-full text-xs text-gray-500 border border-gray-300 dark:border-slate-700 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      2. Certified Building Map & Plan (PDF Item 10){' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      disabled={isFormFieldsDisabled}
                      className="block w-full text-xs text-gray-500 border border-gray-300 dark:border-slate-700 rounded p-1.5"
                    />
                  </div>
                </FormGrid>
              </FormCard>
            )}

            {/* 2. NAME CHANGE (PDF Page 2, Item 1) */}
            {selectedServiceId === 2 && (
              <FormCard title="SERVICE 2: College Name Change" icon="pencil">
                <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-700 mb-4">
                  <span className="text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 block mb-1">
                    CURRENT REGISTERED COLLEGE NAME (Read-Only)
                  </span>
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    {masterCollegeName}
                  </p>
                </div>

                <FormGrid columns={1}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Proposed New College Name{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={newCollegeName}
                      onChange={val => setNewCollegeName(val)}
                      maxLength={150}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reason for Name Change{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextArea
                      value={nameChangeReason}
                      onChange={val => setNameChangeReason(val)}
                      rows={2}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                </FormGrid>

                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mt-4 mb-2">
                  Mandatory Document Uploads (PDF)
                </h4>
                <FormGrid columns={3}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      1. Society Resolution{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      disabled={isFormFieldsDisabled}
                      className="block w-full text-xs text-gray-500 border border-gray-300 dark:border-slate-700 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      2. MP Govt / Gazette Notification{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      disabled={isFormFieldsDisabled}
                      className="block w-full text-xs text-gray-500 border border-gray-300 dark:border-slate-700 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      3. ₹100 Stamp Affidavit (PDF Item 18){' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      disabled={isFormFieldsDisabled}
                      className="block w-full text-xs text-gray-500 border border-gray-300 dark:border-slate-700 rounded p-1.5"
                    />
                  </div>
                </FormGrid>
              </FormCard>
            )}

            {/* 3. SOCIETY CHANGE (PDF Page 2, Item 6) */}
            {selectedServiceId === 3 && (
              <FormCard
                title="SERVICE 3: Change of Trust / Society / Company"
                icon="users"
              >
                <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-700 mb-4">
                  <span className="text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 block mb-1">
                    CURRENT ACTIVE SOCIETY (Read-Only)
                  </span>
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    {masterSocietyName} (Reg No: SOC/IND/1998/102)
                  </p>
                </div>

                <FormGrid columns={2}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Society / Trust Name{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={newSocietyName}
                      onChange={val => setNewSocietyName(val)}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Society Registration Number{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={societyRegNo}
                      onChange={val => setSocietyRegNo(val)}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                </FormGrid>

                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mt-4 mb-2">
                  Mandatory Document Uploads (PDF Item 6)
                </h4>
                <FormGrid columns={2}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      1. New Society Registration & Bylaws{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      disabled={isFormFieldsDisabled}
                      className="block w-full text-xs text-gray-500 border border-gray-300 dark:border-slate-700 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      2. Transfer Deed & Handover NOC{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      disabled={isFormFieldsDisabled}
                      className="block w-full text-xs text-gray-500 border border-gray-300 dark:border-slate-700 rounded p-1.5"
                    />
                  </div>
                </FormGrid>
              </FormCard>
            )}

            {/* 4. SEAT REDUCTION (PDF Page 2, Item 3) */}
            {selectedServiceId === 4 && (
              <FormCard
                title="SERVICE 4: Course Seat Capacity Reduction"
                icon="arrow-down-right"
              >
                <FormGrid columns={3}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course Name <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={seatReductionCourse}
                      onChange={val => setSeatReductionCourse(val)}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Approved Intake{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={String(currentApprovedSeats)}
                      onChange={val => setCurrentApprovedSeats(Number(val))}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Proposed Reduced Intake{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={String(proposedReducedSeats)}
                      onChange={val => setProposedReducedSeats(Number(val))}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                </FormGrid>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reason for Seat Reduction{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <TextArea
                    value={seatReductionReason}
                    onChange={val => setSeatReductionReason(val)}
                    rows={2}
                    disabled={isFormFieldsDisabled}
                    required
                  />
                </div>
              </FormCard>
            )}

            {/* 5. COURSE CLOSURE (PDF Page 2, Item 4) */}
            {selectedServiceId === 5 && (
              <FormCard
                title="SERVICE 5: Course / Programme Closure"
                icon="times-circle"
              >
                <FormGrid columns={2}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course to be Closed{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={closureCourseName}
                      onChange={val => setClosureCourseName(val)}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Enrolled Batch Status{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={closureBatchYear}
                      onChange={val => setClosureBatchYear(val)}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                </FormGrid>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Student Transfer & Teaching Staff Adjustment Plan{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <TextArea
                    value={studentTransferPlan}
                    onChange={val => setStudentTransferPlan(val)}
                    rows={2}
                    disabled={isFormFieldsDisabled}
                    required
                  />
                </div>
              </FormCard>
            )}

            {/* 6. COLLEGE CLOSURE (PDF Page 2, Item 5) */}
            {selectedServiceId === 6 && (
              <FormCard title="SERVICE 6: Complete College Closure" icon="ban">
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg mb-4 text-xs text-red-800 dark:text-red-300">
                  Caution: Complete College Closure is irrevocable. Ensure all
                  student records are transferred to University Examination
                  Cell.
                </div>
                <FormGrid columns={1}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reason for Permanent College Closure{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextArea
                      value={collegeClosureReason}
                      onChange={val => setCollegeClosureReason(val)}
                      rows={2}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Staff Settlement & Gratuity Clearance Undertaking{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextArea
                      value={staffSettlementNoc}
                      onChange={val => setStaffSettlementNoc(val)}
                      rows={2}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                </FormGrid>
              </FormCard>
            )}

            {/* 7. ADD-ON COURSE (PDF Page 2, Item 7) */}
            {selectedServiceId === 7 && (
              <FormCard
                title="SERVICE 7: Add-on Course (1 Year Duration)"
                icon="plus-circle"
              >
                <FormGrid columns={3}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Add-on Course Title{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={addonCourseTitle}
                      onChange={val => setAddonCourseTitle(val)}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course Type <span className="text-red-500">*</span>
                    </label>
                    <DropDownList
                      data={[
                        { text: 'Certificate', value: 'Certificate' },
                        { text: 'Diploma', value: 'Diploma' },
                        { text: 'Advance Diploma', value: 'Advance Diploma' },
                      ]}
                      value={addonCourseType}
                      textField="text"
                      valueField="value"
                      optionValue="value"
                      disabled={isFormFieldsDisabled}
                      onChange={val => {
                        if (val) setAddonCourseType(String(val));
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Proposed Seat Intake{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={String(addonIntake)}
                      onChange={val => setAddonIntake(Number(val))}
                      disabled={isFormFieldsDisabled}
                      required
                    />
                  </div>
                </FormGrid>
              </FormCard>
            )}
          </div>

          {/* STEP 3: DECLARATION & SUBMISSION */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
              Step 3: Verification Undertaking & Submission
            </h4>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={declaration}
                disabled={isFormFieldsDisabled}
                onChange={e => setDeclaration(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                I hereby declare that all information submitted for{' '}
                <strong className="text-blue-700 dark:text-blue-400">
                  {currentService.name}
                </strong>{' '}
                is true and authentic according to our College Governing Body
                resolutions and DAVV Ordinances.
              </span>
            </label>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {isSubmitted && !isEditingAfterSubmit ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <i className="pi pi-check" /> Form submitted. Proceed to
                    Step 4 below to complete fee payment.
                  </span>
                ) : (
                  <span>
                    Upon submitting, an official Application Reference Number
                    will be generated.
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                {isSubmitted && isEditingAfterSubmit ? (
                  <>
                    <Button
                      label="Cancel Changes"
                      variant="outlined"
                      size="small"
                      onClick={() => setIsEditingAfterSubmit(false)}
                    />
                    <Button
                      label="Update Application"
                      icon="pi pi-save"
                      variant="primary"
                      size="small"
                      onClick={handleSubmitApplication}
                    />
                  </>
                ) : !isSubmitted ? (
                  <>
                    <Button
                      label="Reset Form"
                      icon="pi pi-refresh"
                      variant="outlined"
                      size="small"
                      onClick={handleReset}
                    />
                    <Button
                      label={
                        isGovtExempt
                          ? 'Submit Application (Govt Exempted)'
                          : `Submit Application & Proceed to Payment`
                      }
                      icon="pi pi-send"
                      variant="primary"
                      size="small"
                      onClick={handleSubmitApplication}
                    />
                  </>
                ) : (
                  <Button
                    label="Edit Form Details"
                    icon="pi pi-pencil"
                    variant="outlined"
                    size="small"
                    disabled={isPaid}
                    onClick={() => setIsEditingAfterSubmit(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </fieldset>

        {/* =========================================================
              STEP 4: FEE PAYMENT (ACTIVE ONLY AFTER FORM SUBMISSION)
             ========================================================= */}
        <FormCard title="Step 4: Fee Payment & Receipt" icon="credit-card">
          {!isSubmitted ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50/50 dark:bg-slate-800/40">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                <i className="pi pi-lock text-xl" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Payment Step Unlocks After Form Submission
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1">
                Please review and fill the service fields in Step 2, accept the
                declaration, and click <strong>Submit Application</strong>. Once
                submitted, your official application number will appear here to
                complete the fee payment.
              </p>
            </div>
          ) : isGovtExempt ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <i className="pi pi-check-circle text-emerald-600 dark:text-emerald-400 text-2xl mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Government College Exemption Confirmed (NIL Fee)
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                    As per DAVV Notification No. 339 (Page 2), Government
                    colleges are 100% exempted from fee for this service.
                    Application Reference: <strong>{applicationId}</strong> has
                    been accepted and forwarded to DCDC.
                  </p>
                </div>
              </div>
              <Button
                label="Submit Another Request"
                icon="pi pi-plus"
                variant="primary"
                size="small"
                onClick={handleReset}
              />
            </div>
          ) : isPaid ? (
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-300 dark:border-emerald-800 rounded-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <i className="pi pi-check-circle text-2xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                        Payment Successful - Application Finalized
                      </h4>
                      <StatusBadge label="Paid & Completed" variant="success" />
                    </div>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
                      Fee of{' '}
                      <strong>₹{totalPayable.toLocaleString('en-IN')}</strong>{' '}
                      received against Application ID:{' '}
                      <span className="font-mono font-bold">
                        {applicationId}
                      </span>
                      .
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-300">
                      <span>
                        Transaction ID:{' '}
                        <strong className="font-mono text-gray-900 dark:text-white">
                          {transactionId}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Paid On:{' '}
                        <strong className="text-gray-900 dark:text-white">
                          {submissionDate}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>Gateway: MP Online Aggregator</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Button
                    label="View Receipt"
                    icon="pi pi-file"
                    variant="outlined"
                    size="small"
                    onClick={() => setIsReceiptDialogOpen(true)}
                  />
                  <Button
                    label="New Request"
                    icon="pi pi-plus"
                    variant="primary"
                    size="small"
                    onClick={handleReset}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-300 dark:border-amber-800 rounded-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-600 text-white rounded text-xs font-bold uppercase tracking-wider">
                      Payment Required
                    </span>
                    <span className="text-xs text-amber-900 dark:text-amber-300 font-medium">
                      Application ID:{' '}
                      <strong className="font-mono">{applicationId}</strong>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-2">
                    Special Service Fee for {currentService.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Your form details are saved. Pay the prescribed fee via MP
                    Online gateway to submit this request to University DCDC.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-700 dark:text-gray-300">
                    <span>
                      Base Fee:{' '}
                      <strong className="text-gray-900 dark:text-white">
                        ₹{baseFee.toLocaleString('en-IN')}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      GST (18%):{' '}
                      <strong className="text-gray-900 dark:text-white">
                        ₹{gstAmount.toLocaleString('en-IN')}
                      </strong>
                    </span>
                    <span>•</span>
                    <span className="text-base font-extrabold text-blue-900 dark:text-blue-300">
                      Total Payable: ₹{totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto justify-end">
                  <Button
                    label="Edit Application Details"
                    icon="pi pi-pencil"
                    variant="outlined"
                    size="small"
                    onClick={() => setIsEditingAfterSubmit(true)}
                  />
                  <Button
                    label={`Pay Special Fee ₹${totalPayable.toLocaleString('en-IN')}`}
                    icon="pi pi-credit-card"
                    variant="primary"
                    onClick={() => setIsPaymentDialogOpen(true)}
                  />
                </div>
              </div>
            </div>
          )}
        </FormCard>
      </div>

      {/* PAYMENT MODAL DIALOG */}
      <PaymentDialog
        visible={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        amount={totalPayable}
        title="Special Service Fee Payment"
        description={`Application No: ${applicationId} - ${currentService.name}`}
        onSuccess={handlePaymentSuccess}
      />

      {/* PAYMENT RECEIPT DIALOG */}
      <ReceiptDialog
        visible={isReceiptDialogOpen}
        onClose={() => setIsReceiptDialogOpen(false)}
        transactionId={transactionId}
        amount={totalPayable}
        date={submissionDate}
        title="Special Service Payment Receipt"
      />
    </FormPage>
  );
}
