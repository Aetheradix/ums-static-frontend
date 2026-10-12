import { useMemo, useState } from 'react';
import { Button } from 'shared/components/buttons';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  PreviewField,
  PreviewSection,
  PreviewSummary,
  Stepper,
} from 'shared/new-components';
import { TextBox } from 'shared/components/forms';
import DocumentViewerModal from '../../standing-committee-meeting/components/DocumentViewerModal';
import { defaultApplicationSteps, mockTrackerRecords } from '../data';
import type { CollegeAffiliationTrackerRecord } from '../types';
import { getCollegeRegistration } from '../../registrationStore';

interface TwoColumnDetailRow {
  field1: string;
  value1: React.ReactNode;
  field2?: string;
  value2?: React.ReactNode;
}

export default function CollegeAffiliationTracker() {
  const [applicationNo, setApplicationNo] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    title: string;
    fileName: string;
  } | null>(null);

  const getMergedRecord = (
    rec: CollegeAffiliationTrackerRecord | null
  ): CollegeAffiliationTrackerRecord | null => {
    if (!rec) return null;
    const saved = getCollegeRegistration();
    if (!saved) return rec;
    return {
      ...rec,
      collegeName: saved.collegeName || rec.collegeName,
      collegeType: saved.collegeType || rec.collegeType,
      collegeEmail: saved.collegeEmail || rec.collegeEmail,
      principalName: saved.principalDirectorName || rec.principalName,
      principalMobileNo: saved.principalMobileNo || rec.principalMobileNo,
      principalEmail: saved.principalEmail || rec.principalEmail,
      state: saved.stateName || rec.state,
      district: saved.districtName || rec.district,
      blockTehsil: saved.blockTehsil || rec.blockTehsil,
      pinCode: saved.pinCode || rec.pinCode,
      collegeAddress: saved.collegeAddress || rec.collegeAddress,
    };
  };

  const [activeRecord, setActiveRecord] =
    useState<CollegeAffiliationTrackerRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const detailRows: TwoColumnDetailRow[] = useMemo(() => {
    if (!activeRecord) return [];
    return [
      {
        field1: 'Application No',
        value1: (
          <span className="font-mono font-bold text-red-700 dark:text-red-400">
            {activeRecord.applicationNo}
          </span>
        ),
        field2: 'Application Type',
        value2: (
          <span className="font-bold text-red-700 dark:text-red-400">
            {activeRecord.applicationType}
          </span>
        ),
      },
      {
        field1: 'College Name',
        value1: (
          <span className="font-semibold text-slate-900 dark:text-white">
            {activeRecord.collegeName}
          </span>
        ),
        field2: 'College Type',
        value2: activeRecord.collegeType,
      },
      {
        field1: 'College Official Email',
        value1: activeRecord.collegeEmail,
        field2: 'Session',
        value2: activeRecord.session || '2026-27',
      },
      {
        field1: 'Principal Name',
        value1: activeRecord.principalName,
        field2: 'Principal Mobile Number',
        value2: activeRecord.principalMobileNo,
      },
      {
        field1: 'Principal Email ID',
        value1: activeRecord.principalEmail,
        field2: 'Payment Date',
        value2: activeRecord.paymentDate,
      },
      {
        field1: 'State',
        value1: activeRecord.state,
        field2: 'District',
        value2: activeRecord.district,
      },
      {
        field1: 'Block / Tehsil',
        value1: activeRecord.blockTehsil,
        field2: 'PIN Code',
        value2: activeRecord.pinCode,
      },
      {
        field1: 'College Address',
        value1: activeRecord.collegeAddress,
        field2: '',
        value2: '',
      },
    ];
  }, [activeRecord]);

  const rejectedSteps = useMemo(() => {
    if (!activeRecord) return [];
    const steps = activeRecord.progressSteps || [];
    return steps.filter(
      s =>
        s.decision?.toLowerCase().includes('reject') ||
        s.decision?.toLowerCase().includes('disapprove') ||
        s.decision?.toLowerCase().includes('not recommend')
    );
  }, [activeRecord]);

  const currentStageInfo = useMemo(() => {
    if (!activeRecord) return null;
    const allSteps = activeRecord.progressSteps || defaultApplicationSteps;
    const activeIndex = activeRecord.activeStepIndex ?? 0;

    const isRejected =
      activeRecord.currentStatusCode === 'rejected' || rejectedSteps.length > 0;
    let targetStep = allSteps[0];
    if (isRejected && rejectedSteps.length > 0) {
      targetStep = rejectedSteps[0];
    } else if (activeIndex > 0) {
      targetStep = allSteps[Math.min(activeIndex - 1, allSteps.length - 1)];
    }

    return {
      label: targetStep?.label || 'Application Submitted',
      isRejected,
    };
  }, [activeRecord, rejectedSteps]);

  const trackerSteps = useMemo(() => {
    const rawSteps = activeRecord?.progressSteps || defaultApplicationSteps;
    return rawSteps.map(step => {
      const isRejected =
        step.decision?.toLowerCase().includes('reject') ||
        step.decision?.toLowerCase().includes('disapprove') ||
        step.decision?.toLowerCase().includes('not recommend');

      if (isRejected) {
        return {
          ...step,
          label: `${step.label} (Rejected)`,
        };
      }
      return step;
    });
  }, [activeRecord]);

  const governingBodyMembers = useMemo(() => {
    return [
      {
        memberName: 'Dr. S. K. Gupta',
        fathersName: 'Mr. R. C. Gupta',
        age: '58',
        qualification: 'Ph.D.',
        mobileNumber: '9425011223',
        occupationAddress: 'Scheme 54, Indore, MP',
      },
      {
        memberName: 'Prof. Anil Sharma',
        fathersName: 'Mr. M. P. Sharma',
        age: '45',
        qualification: 'Post Graduate',
        mobileNumber: '9893012345',
        occupationAddress: 'Arera Colony, Bhopal, MP',
      },
      {
        memberName: 'Mrs. Sunita Verma',
        fathersName: 'Mr. V. K. Verma',
        age: '50',
        qualification: 'M.Ed, M.Phil',
        mobileNumber: '9826011987',
        occupationAddress: 'South Tukoganj, Indore, MP',
      },
    ];
  }, []);

  const existingCourses = useMemo(() => {
    return [
      {
        courseName: 'Bachelor of Computer Applications (BCA)',
        seats: '60',
        class: '1st Year',
        type: 'Regular',
        statusOfCompliance: 'Complied',
      },
      {
        courseName: 'Bachelor of Business Administration (BBA)',
        seats: '60',
        class: '1st Year',
        type: 'Regular',
        statusOfCompliance: 'Complied',
      },
      {
        courseName: 'Bachelor of Science (B.Sc. Computer Science)',
        seats: '120',
        class: '1st Year',
        type: 'Regular',
        statusOfCompliance: 'Complied',
      },
      {
        courseName: 'Bachelor of Commerce (B.Com Honours)',
        seats: '60',
        class: '1st Year',
        type: 'Regular',
        statusOfCompliance: 'Complied',
      },
    ];
  }, []);

  const teachingStaff = useMemo(() => {
    return [
      {
        name: 'Mr. Rajesh Joshi',
        role: 'Assistant Professor',
        qualification: 'MCA, M.Tech',
        experience: '8 Years',
      },
      {
        name: 'Dr. Preeti Mishra',
        role: 'Associate Professor',
        qualification: 'Ph.D. in Computer Science',
        experience: '12 Years',
      },
      {
        name: 'Prof. Deepak Chouhan',
        role: 'Professor & HOD',
        qualification: 'Ph.D. in Management Studies',
        experience: '16 Years',
      },
      {
        name: 'Ms. Ananya Roy',
        role: 'Assistant Professor',
        qualification: 'M.Com, UGC NET',
        experience: '6 Years',
      },
    ];
  }, []);

  const additionalInstitutions = useMemo(() => {
    return [
      {
        institutionName: 'Pioneer International Higher Secondary School',
        course: 'Higher Secondary (Science & Commerce)',
        seats: '500',
        address: 'Airport Road, Indore, MP',
      },
      {
        institutionName: 'Global Institute of Paramedical Sciences',
        course: 'DMLT / BMLT',
        seats: '100',
        address: 'Knowledge Park, Phase 1, Indore, MP',
      },
    ];
  }, []);

  const inspectionMembers = useMemo(() => {
    return [
      {
        name: 'Dr. A. Sharma',
        contactNumber: '9876543210',
        designation: 'Professor (Physics) & Committee Chairman',
        department: 'School of Physical Sciences',
      },
      {
        name: 'Prof. K. Singh',
        contactNumber: '9876543211',
        designation: 'Associate Professor & Member',
        department: 'School of Chemical Sciences',
      },
      {
        name: 'Dr. Meena Patel',
        contactNumber: '9876543212',
        designation: 'Associate Professor & Member',
        department: 'School of Mathematics',
      },
      {
        name: 'Prof. Rajesh Verma',
        contactNumber: '9876543213',
        designation: 'Professor & Member Secretary',
        department: 'School of Languages & Humanities',
      },
    ];
  }, []);

  const handleApplicationNoChange = (val: string) => {
    setApplicationNo(val);
  };

  const executeSearch = (targetNo?: string) => {
    const rawNo = targetNo !== undefined ? targetNo : applicationNo;
    const trimmedNo = rawNo.trim().toLowerCase();
    setHasSearched(true);
    if (!trimmedNo) {
      setActiveRecord(null);
      return;
    }
    const found = mockTrackerRecords.find(
      r =>
        r.applicationNo.toLowerCase() === trimmedNo ||
        (r.udiseCode && r.udiseCode.toLowerCase() === trimmedNo) ||
        r.collegeName.toLowerCase().includes(trimmedNo)
    );
    setActiveRecord(getMergedRecord(found || null));
  };

  const handleSearch = () => {
    executeSearch();
  };

  const handleClear = () => {
    setApplicationNo('');
    setActiveRecord(null);
    setHasSearched(false);
  };

  return (
    <FormPage
      title="Application Progress Tracker"
      description="Track where your college affiliation application is in the approval process."
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Affiliation Management System' },
        { label: 'Application Progress Tracker' },
      ]}
    >
      <div className="space-y-6">
        {/* ===================== BOX 1: FILTER / SEARCH PANEL ===================== */}
        <FormCard
          title="Track Affiliation Application"
          subtitle="Enter your unique Application Number to view live affiliation progress, status, and college profile."
          icon="search"
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row items-end gap-2.5 max-w-2xl"
          >
            <div className="flex-1 w-full [&_.input-block]:!mb-0">
              <TextBox
                label="Application No. *"
                value={applicationNo}
                placeholder="Enter Application No. (e.g. 632609 or APP-92837)"
                onChange={handleApplicationNoChange}
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="submit"
                label="Search"
                icon="search"
                variant="primary"
                className="!h-10 !rounded-md"
              />
              <Button
                type="button"
                label="Clear"
                icon="times"
                variant="outlined"
                onClick={handleClear}
                className="!h-10 !rounded-md"
              />
            </div>
          </form>
        </FormCard>

        {/* ===================== BOX 2: DETAILS PANEL (Shown ONLY after Search) ===================== */}
        {hasSearched && (
          <>
            {!activeRecord ? (
              <FormCard
                title="Search Results"
                subtitle="Application not found in our records"
                icon="info-circle"
              >
                <div className="py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500">
                    <i className="pi pi-search text-xl" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    No Application Details Found
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                    Please verify the Application No. (Try{' '}
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      632609
                    </span>{' '}
                    for Approved, or{' '}
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      APP-92837
                    </span>{' '}
                    for Rejected)
                  </p>
                </div>
              </FormCard>
            ) : (
              <FormCard
                title="College & Application Details"
                subtitle={`${activeRecord.collegeName} • Session: ${activeRecord.session || '2026-27'}`}
                icon="building"
                headerAction={
                  <Button
                    type="button"
                    label="View Complete Details"
                    icon="eye"
                    size="small"
                    variant="primary"
                    onClick={() => setShowDetailsModal(true)}
                  />
                }
              >
                <div className="space-y-5">
                  {/* Highlighted Banner: Current Application Stage Only */}
                  {currentStageInfo && (
                    <div
                      className={`flex items-center gap-3.5 rounded-xl border px-4 py-2.5 shadow-xs ${
                        currentStageInfo.isRejected
                          ? 'border-rose-200 bg-rose-50/80 dark:border-rose-900/60 dark:bg-rose-950/30'
                          : 'border-teal-200 bg-teal-50/70 dark:border-teal-900/60 dark:bg-teal-950/30'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-xs ${
                          currentStageInfo.isRejected
                            ? 'bg-rose-600'
                            : 'bg-teal-600'
                        }`}
                      >
                        <i
                          className={`pi ${
                            currentStageInfo.isRejected
                              ? 'pi-times-circle'
                              : 'pi-compass'
                          } text-base`}
                        />
                      </span>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-semibold text-slate-700 dark:text-zinc-300">
                          {currentStageInfo.isRejected
                            ? 'Rejected Stage:'
                            : 'Current Stage:'}
                        </span>
                        <span
                          className={`font-bold ${
                            currentStageInfo.isRejected
                              ? 'text-rose-700 dark:text-rose-300'
                              : 'text-teal-900 dark:text-teal-200'
                          }`}
                        >
                          {currentStageInfo.label}
                        </span>
                        {currentStageInfo.isRejected && (
                          <span className="inline-flex items-center rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 1. APPLICATION & COLLEGE DETAILS */}
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800">
                    <GridPanel<TwoColumnDetailRow>
                      data={detailRows}
                      pagination={false}
                      columns={[
                        {
                          field: 'field1',
                          header: 'Parameter',
                          width: '24%',
                          sortable: false,
                          cell: row => (
                            <span className="font-semibold text-slate-700 dark:text-zinc-300">
                              {row.field1}
                            </span>
                          ),
                        },
                        {
                          field: 'value1',
                          header: 'Information',
                          width: '26%',
                          sortable: false,
                          cell: row => (
                            <span className="text-slate-800 dark:text-zinc-200">
                              {row.value1}
                            </span>
                          ),
                        },
                        {
                          field: 'field2',
                          header: 'Parameter',
                          width: '24%',
                          sortable: false,
                          cell: row => (
                            <span className="font-semibold text-slate-700 dark:text-zinc-300">
                              {row.field2 || ''}
                            </span>
                          ),
                        },
                        {
                          field: 'value2',
                          header: 'Information',
                          width: '26%',
                          sortable: false,
                          cell: row => (
                            <span className="text-slate-800 dark:text-zinc-200">
                              {row.value2 || ''}
                            </span>
                          ),
                        },
                      ]}
                    />
                  </div>
                </div>
              </FormCard>
            )}
          </>
        )}

        {/* ===================== BOX 3: APPLICATION PROGRESS STEPPER ===================== */}
        {hasSearched && activeRecord && (
          <FormCard
            title="Application Progress"
            subtitle="Stage-wise status of your affiliation request."
            icon="history"
          >
            {/* Small Rejection Box - Only rendered if a section is rejected */}
            {rejectedSteps.length > 0 && (
              <div className="mb-4 space-y-2.5">
                {rejectedSteps.map((rej, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-rose-300 bg-rose-50/90 p-3.5 shadow-xs dark:border-rose-900/60 dark:bg-rose-950/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200/80 pb-2 dark:border-rose-900/40">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-200 text-rose-700 dark:bg-rose-900 dark:text-rose-200">
                          <i className="pi pi-times text-[10px] font-bold" />
                        </span>
                        <span className="text-xs font-bold text-rose-800 dark:text-rose-200">
                          Section Rejected: {rej.label}
                        </span>
                      </div>
                      {rej.actionDate && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-rose-700 dark:bg-rose-900/60 dark:text-rose-200">
                          <i className="pi pi-calendar text-[10px]" />
                          Date: {rej.actionDate}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-rose-900 dark:text-rose-100 leading-relaxed font-sans">
                      <span className="font-bold">Rejection Remark: </span>
                      {rej.remark || 'Application rejected at this stage.'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Stepper
              steps={trackerSteps}
              activeStep={activeRecord.activeStepIndex ?? 3}
              orientation="vertical"
            />
          </FormCard>
        )}

        {/* ===================== VIEW ALL DETAILS & INSPECTION ASSIGNMENT POPUP ===================== */}
        {activeRecord && (
          <FormPopup
            visible={showDetailsModal}
            onHide={() => setShowDetailsModal(false)}
            title="College Affiliation Profile Review"
            subtitle="Review detailed college registration data and inspection assignment details."
            size="xl"
            footer={
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="small"
                  label="Close"
                  onClick={() => setShowDetailsModal(false)}
                />
              </div>
            }
          >
            <div className="registration-preview-content space-y-6">
              {/* Top Preview Summary (Matching inspection-assignment page) */}
              <PreviewSummary
                items={[
                  {
                    label: 'College Name',
                    value: activeRecord.collegeName,
                    icon: 'building',
                  },
                  {
                    label: 'Application Number',
                    value: activeRecord.applicationNo,
                    icon: 'file',
                  },
                  {
                    label: 'Verified Date',
                    value: activeRecord.paymentDate || '15/12/2025',
                    icon: 'calendar',
                  },
                ]}
              />

              {/* STEP 1: College Registration Details */}
              <PreviewSection
                step={1}
                title="College Registration Details"
                subtitle="Basic registration details submitted by the college."
              >
                <FormGrid columns={3}>
                  <PreviewField
                    label="College Name"
                    value={activeRecord.collegeName}
                  />
                  <PreviewField
                    label="College Type"
                    value={activeRecord.collegeType}
                  />
                  <PreviewField
                    label="College Official Email"
                    value={activeRecord.collegeEmail}
                    breakWord
                  />
                  <PreviewField
                    label="Principal Name"
                    value={activeRecord.principalName}
                  />
                  <PreviewField
                    label="Principal Mobile Number"
                    value={activeRecord.principalMobileNo}
                  />
                  <PreviewField
                    label="Principal Email ID"
                    value={activeRecord.principalEmail}
                    breakWord
                  />
                  <PreviewField label="State" value={activeRecord.state} />
                  <PreviewField
                    label="District"
                    value={activeRecord.district}
                  />
                  <PreviewField
                    label="Block / Tehsil"
                    value={activeRecord.blockTehsil}
                  />
                  <PreviewField label="PIN Code" value={activeRecord.pinCode} />
                  <PreviewField
                    label="Academic Session"
                    value={activeRecord.session || '2026-27'}
                  />
                  <PreviewField
                    label="Payment Date"
                    value={activeRecord.paymentDate}
                  />
                  <PreviewField
                    label="College Address"
                    value={activeRecord.collegeAddress}
                    fullWidth
                  />
                </FormGrid>
              </PreviewSection>

              {/* STEP 2: Ownership & Management */}
              <PreviewSection
                step={2}
                title="Ownership & Management"
                subtitle="Ownership entity and chairman/secretary details."
              >
                <FormGrid columns={3}>
                  <PreviewField
                    label="Ownership Entity Name"
                    value="Education Foundation Trust Society"
                  />
                  <PreviewField
                    label="Chairman Name"
                    value="Mr. Arvind Singh"
                  />
                  <PreviewField
                    label="Chairman Qualification"
                    value="Post Graduate"
                  />
                  <PreviewField label="Chairman Mobile" value="9826012345" />
                  <PreviewField
                    label="Executive Name"
                    value="Mrs. Neha Singh"
                  />
                  <PreviewField
                    label="Trust / Society Document"
                    value={
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-700 dark:text-zinc-300 truncate max-w-[140px]">
                          Society_Reg_{activeRecord.applicationNo}.pdf
                        </span>
                        <Button
                          type="button"
                          variant="outlined"
                          size="small"
                          icon="eye"
                          label="View"
                          onClick={() =>
                            setSelectedDoc({
                              title:
                                'Society / Trust Registration & Memorandum',
                              fileName: `Society_Reg_Certificate_${activeRecord.applicationNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
                            })
                          }
                        />
                      </div>
                    }
                  />
                </FormGrid>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Governing Body Members
                  </h4>
                  <GridPanel
                    data={governingBodyMembers}
                    pagination={false}
                    columns={[
                      { field: 'memberName', header: 'Member Name' },
                      { field: 'qualification', header: 'Qualification' },
                      { field: 'age', header: 'Age' },
                      { field: 'mobileNumber', header: 'Mobile Number' },
                      { field: 'occupationAddress', header: 'Address' },
                    ]}
                  />
                </div>
              </PreviewSection>

              {/* STEP 3: Ecosystem & Academics */}
              <PreviewSection
                step={3}
                title="Ecosystem & Academics"
                subtitle="Courses, staff and institutions details."
              >
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Proposed / Existing Courses
                  </h4>
                  <GridPanel
                    data={existingCourses}
                    pagination={false}
                    columns={[
                      { field: 'courseName', header: 'Course Name' },
                      { field: 'seats', header: 'Seats' },
                      { field: 'class', header: 'Class' },
                      { field: 'type', header: 'Type' },
                      { field: 'statusOfCompliance', header: 'Status' },
                    ]}
                  />
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Teaching Staff
                  </h4>
                  <GridPanel
                    data={teachingStaff}
                    pagination={false}
                    columns={[
                      { field: 'name', header: 'Name' },
                      { field: 'role', header: 'Role' },
                      { field: 'qualification', header: 'Qualification' },
                      { field: 'experience', header: 'Experience' },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Other Running Institutions
                  </h4>
                  <GridPanel
                    data={additionalInstitutions}
                    pagination={false}
                    columns={[
                      { field: 'institutionName', header: 'Institution Name' },
                      { field: 'course', header: 'Course' },
                      { field: 'seats', header: 'Seats' },
                      { field: 'address', header: 'Address' },
                    ]}
                  />
                </div>
              </PreviewSection>

              {/* STEP 4: Infrastructure & Facilities */}
              <PreviewSection
                step={4}
                title="Infrastructure & Facilities"
                subtitle="Campus area, building, library and labs details."
              >
                <FormGrid columns={3}>
                  <PreviewField
                    label="Total Area"
                    value={
                      <div>
                        <div>5.2 Acres (Owned Land)</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="font-mono text-xs text-slate-500 truncate max-w-[130px]">
                            Land_Deed_{activeRecord.applicationNo}.pdf
                          </span>
                          <Button
                            type="button"
                            variant="outlined"
                            size="small"
                            icon="eye"
                            label="View"
                            onClick={() =>
                              setSelectedDoc({
                                title: 'Land Ownership Registry Deed',
                                fileName: `Land_Ownership_Deed_${activeRecord.applicationNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
                              })
                            }
                          />
                        </div>
                      </div>
                    }
                  />
                  <PreviewField
                    label="Building Type"
                    value={
                      <div>
                        <div>Owned (CC Construction)</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="font-mono text-xs text-slate-500 truncate max-w-[130px]">
                            Master_Plan_{activeRecord.applicationNo}.pdf
                          </span>
                          <Button
                            type="button"
                            variant="outlined"
                            size="small"
                            icon="eye"
                            label="View"
                            onClick={() =>
                              setSelectedDoc({
                                title: 'Architectural Master Plan',
                                fileName: `Architectural_Master_Plan_${activeRecord.applicationNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
                              })
                            }
                          />
                        </div>
                      </div>
                    }
                  />
                  <PreviewField
                    label="Description & Safety"
                    value={
                      <div>
                        <div>Excellent (CC Construction)</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="font-mono text-xs text-slate-500 truncate max-w-[130px]">
                            Safety_PWD_{activeRecord.applicationNo}.pdf
                          </span>
                          <Button
                            type="button"
                            variant="outlined"
                            size="small"
                            icon="eye"
                            label="View"
                            onClick={() =>
                              setSelectedDoc({
                                title: 'Building Safety Certificate (PWD)',
                                fileName: `Structural_Safety_PWD_${activeRecord.applicationNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
                              })
                            }
                          />
                        </div>
                      </div>
                    }
                  />
                  <PreviewField
                    label="Required Classrooms"
                    value="12 Classrooms (24 Available)"
                  />
                  <PreviewField label="Accessible to Public" value="Yes" />
                  <PreviewField
                    label="Parking Space"
                    value="Available (50 cars, 150 two-wheelers)"
                  />
                </FormGrid>
                <div className="mt-2 mb-4">
                  <PreviewField
                    label="Classrooms Details"
                    value="All classrooms are ventilated, equipped with smart projectors and green boards."
                    fullWidth
                  />
                </div>

                <div className="border-t border-gray-100 pt-4 mb-4 dark:border-zinc-800">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Library Details
                  </h4>
                  <FormGrid columns={3}>
                    <PreviewField label="Books Count" value="5,200 Books" />
                    <PreviewField
                      label="Book-Student Ratio"
                      value="1:10 (UGC Norm Compliant)"
                    />
                    <PreviewField
                      label="Reading Room Area"
                      value="1,200 Sq. Ft."
                    />
                    <PreviewField
                      label="Journals Count"
                      value="15 Journals Subscribed"
                    />
                  </FormGrid>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-4 dark:border-zinc-800">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Laboratory & Facilities
                  </h4>
                  <FormGrid columns={3}>
                    <PreviewField
                      label="Laboratory Floor Space"
                      value="2,400 Sq. Ft."
                    />
                    <PreviewField
                      label="Exclusive Labs"
                      value="Yes (8 Departmental Labs)"
                    />
                  </FormGrid>
                  <div className="mt-2">
                    <PreviewField
                      label="Lab Equipment Details"
                      value="Equipped with 60 high-end computers, LAN connectivity, and server setup."
                      fullWidth
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 dark:border-zinc-800">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Hostel & Accommodation Details
                  </h4>
                  <FormGrid columns={3}>
                    <PreviewField label="Hostel Available?" value="Yes" />
                    <PreviewField
                      label="Type of Hostel"
                      value="Separate Boys & Girls Hostels"
                    />
                    <PreviewField
                      label="Boys Hostels Count"
                      value="1 Building"
                    />
                    <PreviewField
                      label="Girls Hostels Count"
                      value="1 Building"
                    />
                    <PreviewField
                      label="Total Hostel Capacity"
                      value="250 Students"
                    />
                    <PreviewField
                      label="Accommodation Availability"
                      value="Available for 100% Outstation Students"
                    />
                  </FormGrid>
                </div>
              </PreviewSection>

              {/* STEP 5: Compliance & Funding */}
              <PreviewSection
                step={5}
                title="Compliance & Funding"
                subtitle="Statutory guidelines and approvals status."
              >
                <FormGrid columns={3}>
                  <PreviewField
                    label="Source of Funding"
                    value="Self-Financed / Trust Endowments"
                  />
                  <PreviewField
                    label="Annual Projected Income"
                    value="₹ 1.85 Crores"
                  />
                  <PreviewField
                    label="Accounts Audited"
                    value="Yes (Audited by Chartered Accountant)"
                  />
                  <PreviewField
                    label="Statute 28 & Affidavit"
                    value={
                      <div>
                        <div>Complied</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="font-mono text-xs text-slate-500 truncate max-w-[130px]">
                            Affidavit_Draft.pdf
                          </span>
                          <Button
                            type="button"
                            variant="outlined"
                            size="small"
                            icon="eye"
                            label="View"
                            onClick={() =>
                              setSelectedDoc({
                                title: 'Scanned Copy of Affidavit',
                                fileName: 'Affidavit_Draft.pdf',
                              })
                            }
                          />
                        </div>
                      </div>
                    }
                  />
                  <PreviewField
                    label="Endowment Fund"
                    value={
                      <div>
                        <div>₹ 25.00 Lakh Fixed Deposit</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="font-mono text-xs text-slate-500 truncate max-w-[130px]">
                            Endowment_FDR_{activeRecord.applicationNo}.pdf
                          </span>
                          <Button
                            type="button"
                            variant="outlined"
                            size="small"
                            icon="eye"
                            label="View"
                            onClick={() =>
                              setSelectedDoc({
                                title: 'Endowment Fund FDR Receipt',
                                fileName: `Endowment_FDR_Receipt_${activeRecord.applicationNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
                              })
                            }
                          />
                        </div>
                      </div>
                    }
                  />
                </FormGrid>
                <div className="mt-2">
                  <FormGrid columns={2}>
                    <PreviewField
                      label="MP Govt Permission Details"
                      value="Valid Permission issued by Department of Higher Education, Govt. of MP (Ref #NOC/MP-HE/2025/1108)"
                    />
                    <PreviewField
                      label="Approval Authority NOC Document"
                      value={
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-700 dark:text-zinc-300">
                            Regular_Authority_NOC.pdf
                          </span>
                          <Button
                            type="button"
                            variant="outlined"
                            size="small"
                            icon="eye"
                            label="View"
                            onClick={() =>
                              setSelectedDoc({
                                title: 'Regulatory Authority NOC Document',
                                fileName: 'Regular_Authority_NOC.pdf',
                              })
                            }
                          />
                        </div>
                      }
                    />
                  </FormGrid>
                </div>
              </PreviewSection>

              {/* STEP 6: Inspection Assignment & Committee Team (From inspection-assignment) */}
              <PreviewSection
                step={6}
                title="Inspection Assignment & Committee Team"
                subtitle="Details of inspection date, appointment order, and committee team members."
              >
                <FormGrid columns={3}>
                  <PreviewField
                    label="Inspection Scheduled Date"
                    value={
                      <span className="font-semibold text-blue-700 dark:text-blue-300">
                        15/01/2026
                      </span>
                    }
                  />
                  <PreviewField
                    label="Inspection Authority"
                    value="University Physical Inspection Committee"
                  />
                  <PreviewField
                    label="Inspection Order"
                    value={
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-700 dark:text-zinc-300">
                          inspection_order_{activeRecord.applicationNo}.pdf
                        </span>
                        <Button
                          type="button"
                          variant="outlined"
                          size="small"
                          icon="eye"
                          label="View Order"
                          onClick={() =>
                            setSelectedDoc({
                              title: 'Inspection Appointment Order',
                              fileName: `inspection_order_${activeRecord.applicationNo}.pdf`,
                            })
                          }
                        />
                      </div>
                    }
                  />
                </FormGrid>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Assigned Inspection Committee Members (
                      {inspectionMembers.length})
                    </h4>
                    <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                      <i className="pi pi-check text-[10px]" />
                      Committee Quorum Satisfied (Min. 4 Members)
                    </span>
                  </div>

                  <GridPanel
                    data={inspectionMembers}
                    pagination={false}
                    columns={[
                      {
                        field: 'name',
                        header: 'Member Name',
                        cell: m => (
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {m.name}
                          </span>
                        ),
                      },
                      {
                        field: 'contactNumber',
                        header: 'Contact Number',
                        cell: m => (
                          <span className="font-mono text-xs text-slate-700 dark:text-zinc-300">
                            {m.contactNumber}
                          </span>
                        ),
                      },
                      {
                        field: 'designation',
                        header: 'Designation',
                      },
                      {
                        field: 'department',
                        header: 'Department / School',
                      },
                    ]}
                  />
                </div>
              </PreviewSection>
            </div>
          </FormPopup>
        )}

        {/* Embedded Document Viewer Modal */}
        {selectedDoc && (
          <DocumentViewerModal
            visible={selectedDoc !== null}
            onClose={() => setSelectedDoc(null)}
            documentTitle={selectedDoc.title}
            fileName={selectedDoc.fileName}
            collegeName={activeRecord?.collegeName}
            applicationNumber={activeRecord?.applicationNo}
          />
        )}
      </div>
    </FormPage>
  );
}
