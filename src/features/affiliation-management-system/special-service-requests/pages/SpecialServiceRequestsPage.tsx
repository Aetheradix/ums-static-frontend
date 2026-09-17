import { useMemo, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { DropDownList, TextArea, TextBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';

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

  // Payment State
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] =
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

  // Reset form when changing service or category
  const handleReset = () => {
    setIsPaid(false);
    setTransactionId('');
    setDeclaration(false);
  };

  // Payment Handler
  const handlePayment = () => {
    if (totalPayable === 0) {
      setIsPaid(true);
      setTransactionId('EXEMPTED_GOVT_COLLEGE');
      ToastService.success(
        'Government College: Fee is NIL as per DAVV Page 2 rules. Form unlocked!'
      );
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaid(true);
      const randomTx = `TXN_MPONLINE_${Math.floor(100000 + Math.random() * 900000)}`;
      setTransactionId(randomTx);
      ToastService.success(
        `Payment of ₹${totalPayable.toLocaleString('en-IN')} Received! Transaction ID: ${randomTx}. Form fields are now UNLOCKED.`
      );
    }, 1000);
  };

  // Submit Application
  const handleSubmitApplication = () => {
    if (!isPaid) {
      ToastService.error(
        'Please pay the special service fee first to unlock submission.'
      );
      return;
    }
    if (!declaration) {
      ToastService.error('Please accept the verification declaration.');
      return;
    }

    const newId = `SR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    ToastService.success(
      `Special Service Request ${newId} (${currentService.name}) submitted successfully to University DCDC!`
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

  return (
    <FormPage
      title="Special Service Request"
      description="DAVV Circular Page 2: 7 Official Special Services - Select service, review fee, pay to unlock, and submit targeted fields"
    >
      <div className="space-y-6">
        {/* STEP 1: SERVICE DETAILS */}
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
                onChange={val => {
                  if (val) {
                    setCollegeTypeId(String(val));
                    handleReset();
                  }
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
                onChange={val => {
                  if (val !== null && val !== undefined) {
                    setSelectedServiceId(Number(val));
                    handleReset();
                  }
                }}
                required
              />
              <span className="text-[11px] text-blue-700 font-medium mt-1 block">
                {currentService.pdfReference}
              </span>
            </div>
          </FormGrid>

          {/* LIVE FEE CALCULATION BANNER */}
          <div className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded text-xs font-bold uppercase tracking-wider">
                    Fee Details
                  </span>
                  <span className="text-xs text-gray-600 font-medium">
                    Session:{' '}
                    <strong className="text-gray-900">{academicYearId}</strong>{' '}
                    | Category:{' '}
                    <strong className="text-gray-900">
                      {isGovt ? 'Government College' : 'Private College'}
                    </strong>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 mt-1.5">
                  {currentService.id}. {currentService.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {currentService.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-700">
                  <span>
                    Base Fee:{' '}
                    <strong className="text-gray-900">
                      {isGovtExempt
                        ? 'NIL (Exempted)'
                        : `₹${baseFee.toLocaleString('en-IN')}`}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    GST (18%):{' '}
                    <strong className="text-gray-900">
                      {isGovtExempt
                        ? '₹0'
                        : `₹${gstAmount.toLocaleString('en-IN')}`}
                    </strong>
                  </span>
                  <span>•</span>
                  <span className="text-sm font-extrabold text-blue-900">
                    Total Payable:{' '}
                    {isGovtExempt
                      ? 'NIL (₹0)'
                      : `₹${totalPayable.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              <div className="w-full md:w-auto flex justify-end">
                {!isPaid ? (
                  <Button
                    label={
                      isProcessingPayment
                        ? 'Connecting to MP Online...'
                        : isGovtExempt
                          ? 'Confirm Govt College Exemption (NIL Fee)'
                          : `Pay Special Fee ₹${totalPayable.toLocaleString('en-IN')}`
                    }
                    icon="pi pi-credit-card"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 text-xs shadow-md"
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                  />
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300 shadow-sm">
                    <i className="pi pi-check-circle text-emerald-600 text-sm" />
                    <span>Fee Paid ✔ (Txn: {transactionId})</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LOCK / UNLOCK BANNER */}
          <div
            className={`mt-3 p-3 rounded-lg text-xs flex items-center gap-2 ${
              isPaid
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            <i
              className={`pi ${isPaid ? 'pi-lock-open text-emerald-600' : 'pi-lock text-amber-600'}`}
            />
            <span>
              {isPaid
                ? `Payment of ₹${totalPayable.toLocaleString('en-IN')} confirmed! Targeted fields below are UNLOCKED for entry.`
                : 'Targeted form fields below are LOCKED in read-only mode. Complete fee payment above to unlock the form.'}
            </span>
          </div>
        </FormCard>

        {/* =========================================================
              STEP 2: TARGETED FIELDS STRICTLY FOR THE 7 SERVICES
             ========================================================= */}
        <fieldset
          disabled={!isPaid}
          className={!isPaid ? 'opacity-40 pointer-events-none' : ''}
        >
          <div className="space-y-6">
            {/* 1. LOCATION CHANGE (PDF Page 2, Item 2) */}
            {selectedServiceId === 1 && (
              <FormCard
                title="SERVICE 1: Location & Premises Change"
                icon="map-marker"
              >
                <div className="p-3 bg-gray-100 rounded-lg border border-gray-300 mb-4">
                  <span className="text-[11px] uppercase font-bold text-gray-500 block mb-1">
                    CURRENT REGISTERED CAMPUS ADDRESS (Read-Only)
                  </span>
                  <p className="text-xs font-medium text-gray-800">
                    {masterCollegeAddress}
                  </p>
                </div>

                <FormGrid columns={3}>
                  <TextBox label="State" value="Madhya Pradesh" readOnly />
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      New District <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={district}
                      onChange={val => setDistrict(val)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      New Tehsil / Block <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={tehsil}
                      onChange={val => setTehsil(val)}
                      required
                    />
                  </div>
                </FormGrid>

                <div className="mt-4">
                  <FormGrid columns={2}>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Pin Code <span className="text-red-500">*</span>
                      </label>
                      <TextBox
                        value={pinCode}
                        onChange={val => setPinCode(val)}
                        maxLength={6}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        New Campus Full Address{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <TextArea
                        value={newAddress}
                        onChange={val => setNewAddress(val)}
                        rows={2}
                        required
                      />
                    </div>
                  </FormGrid>
                </div>

                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mt-4 mb-2">
                  Land & Infrastructure Details (As per PDF Item 2, 9, 10)
                </h4>
                <FormGrid columns={3}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Land Area (Acres) <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={newLandArea}
                      onChange={val => setNewLandArea(val)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Khasra Numbers <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={khasraNo}
                      onChange={val => setKhasraNo(val)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Built-up Area (Sq. Ft.){' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={builtUpArea}
                      onChange={val => setBuiltUpArea(val)}
                      required
                    />
                  </div>
                </FormGrid>

                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mt-4 mb-2">
                  Mandatory Document Uploads (PDF)
                </h4>
                <FormGrid columns={2}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      1. Registered 30-Year Lease / Land Registry Deed (PDF Item
                      9) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      className="block w-full text-xs text-gray-500 border border-gray-300 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      2. Certified Building Map & Plan (PDF Item 10){' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      className="block w-full text-xs text-gray-500 border border-gray-300 rounded p-1.5"
                    />
                  </div>
                </FormGrid>
              </FormCard>
            )}

            {/* 2. NAME CHANGE (PDF Page 2, Item 1) */}
            {selectedServiceId === 2 && (
              <FormCard title="SERVICE 2: College Name Change" icon="pencil">
                <div className="p-3 bg-gray-100 rounded-lg border border-gray-300 mb-4">
                  <span className="text-[11px] uppercase font-bold text-gray-500 block mb-1">
                    CURRENT REGISTERED COLLEGE NAME (Read-Only)
                  </span>
                  <p className="text-xs font-medium text-gray-800">
                    {masterCollegeName}
                  </p>
                </div>

                <FormGrid columns={1}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Proposed New College Name{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={newCollegeName}
                      onChange={val => setNewCollegeName(val)}
                      maxLength={150}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Reason for Name Change{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextArea
                      value={nameChangeReason}
                      onChange={val => setNameChangeReason(val)}
                      rows={2}
                      required
                    />
                  </div>
                </FormGrid>

                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mt-4 mb-2">
                  Mandatory Document Uploads (PDF)
                </h4>
                <FormGrid columns={3}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      1. Society Resolution{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      className="block w-full text-xs text-gray-500 border border-gray-300 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      2. MP Govt / Gazette Notification{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      className="block w-full text-xs text-gray-500 border border-gray-300 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      3. ₹100 Stamp Affidavit (PDF Item 18){' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      className="block w-full text-xs text-gray-500 border border-gray-300 rounded p-1.5"
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
                <div className="p-3 bg-gray-100 rounded-lg border border-gray-300 mb-4">
                  <span className="text-[11px] uppercase font-bold text-gray-500 block mb-1">
                    CURRENT ACTIVE SOCIETY (Read-Only)
                  </span>
                  <p className="text-xs font-medium text-gray-800">
                    {masterSocietyName} (Reg No: SOC/IND/1998/102)
                  </p>
                </div>

                <FormGrid columns={2}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      New Society / Trust Name{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={newSocietyName}
                      onChange={val => setNewSocietyName(val)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      New Society Registration Number{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={societyRegNo}
                      onChange={val => setSocietyRegNo(val)}
                      required
                    />
                  </div>
                </FormGrid>

                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mt-4 mb-2">
                  Mandatory Document Uploads (PDF Item 6)
                </h4>
                <FormGrid columns={2}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      1. New Society Registration & Bylaws{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      className="block w-full text-xs text-gray-500 border border-gray-300 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      2. Transfer Deed & Handover NOC{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      className="block w-full text-xs text-gray-500 border border-gray-300 rounded p-1.5"
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Course Name <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={seatReductionCourse}
                      onChange={val => setSeatReductionCourse(val)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Current Approved Intake{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={String(currentApprovedSeats)}
                      onChange={val => setCurrentApprovedSeats(Number(val))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Proposed Reduced Intake{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={String(proposedReducedSeats)}
                      onChange={val => setProposedReducedSeats(Number(val))}
                      required
                    />
                  </div>
                </FormGrid>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Reason for Seat Reduction{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <TextArea
                    value={seatReductionReason}
                    onChange={val => setSeatReductionReason(val)}
                    rows={2}
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Course to be Closed{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={closureCourseName}
                      onChange={val => setClosureCourseName(val)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Last Enrolled Batch Status{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={closureBatchYear}
                      onChange={val => setClosureBatchYear(val)}
                      required
                    />
                  </div>
                </FormGrid>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Student Transfer & Teaching Staff Adjustment Plan{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <TextArea
                    value={studentTransferPlan}
                    onChange={val => setStudentTransferPlan(val)}
                    rows={2}
                    required
                  />
                </div>
              </FormCard>
            )}

            {/* 6. COLLEGE CLOSURE (PDF Page 2, Item 5) */}
            {selectedServiceId === 6 && (
              <FormCard title="SERVICE 6: Complete College Closure" icon="ban">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-xs text-red-800">
                  Caution: Complete College Closure is irrevocable. Ensure all
                  student records are transferred to University Examination
                  Cell.
                </div>
                <FormGrid columns={1}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Reason for Permanent College Closure{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextArea
                      value={collegeClosureReason}
                      onChange={val => setCollegeClosureReason(val)}
                      rows={2}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Staff Settlement & Gratuity Clearance Undertaking{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextArea
                      value={staffSettlementNoc}
                      onChange={val => setStaffSettlementNoc(val)}
                      rows={2}
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Add-on Course Title{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={addonCourseTitle}
                      onChange={val => setAddonCourseTitle(val)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
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
                      onChange={val => {
                        if (val) setAddonCourseType(String(val));
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Proposed Seat Intake{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <TextBox
                      value={String(addonIntake)}
                      onChange={val => setAddonIntake(Number(val))}
                      required
                    />
                  </div>
                </FormGrid>
              </FormCard>
            )}
          </div>

          {/* STEP 3: DECLARATION & SUBMISSION */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-300 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={declaration}
                onChange={e => setDeclaration(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700 leading-relaxed">
                I hereby declare that all information submitted for{' '}
                <strong className="text-blue-700">{currentService.name}</strong>{' '}
                is true and authentic according to our College Governing Body
                resolutions and DAVV Ordinances.
              </span>
            </label>

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-3">
              <Button
                label="Reset Application"
                icon="pi pi-refresh"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-4 py-2 font-medium"
                onClick={handleReset}
              />
              <Button
                label={`Submit Application (${currentService.name})`}
                icon="pi pi-send"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-6 py-2 font-bold shadow"
                onClick={handleSubmitApplication}
              />
            </div>
          </div>
        </fieldset>
      </div>
    </FormPage>
  );
}
