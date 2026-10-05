import { useState } from 'react';
import {
  FormGrid,
  FormPopup,
  GridPanel,
  PreviewField,
  PreviewSummary,
  StatusBadge,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { DropDownList } from 'shared/components/forms';
import { ToastService } from 'services';
import type { CollegeProfileDetails } from '../data';
import SectionRejectModal from './SectionRejectModal';
import DocumentViewerModal from './DocumentViewerModal';

export interface SectionRejectionRecord {
  stepNumber: number;
  stepTitle: string;
  reason: string;
}

interface CollegeProfileReviewModalProps {
  visible: boolean;
  onClose: () => void;
  profile: CollegeProfileDetails;
  initialRejections?: Record<number, string>;
  onSubmitRejections: (rejections: Record<number, string>) => void;
  onApprove?: (remarks?: string, decision?: string) => void;
  onFinalReject?: (reason: string) => void;
}

export default function CollegeProfileReviewModal({
  visible,
  onClose,
  profile,
  initialRejections = {},
  onSubmitRejections,
  onApprove,
  onFinalReject,
}: CollegeProfileReviewModalProps) {
  // Section Rejection State: stepId -> reason
  const [rejections, setRejections] =
    useState<Record<number, string>>(initialRejections);

  // Dialog to reject a specific step
  const [rejectingStep, setRejectingStep] = useState<{
    id: number;
    title: string;
  } | null>(null);

  // Document Viewer State
  const [viewingDoc, setViewingDoc] = useState<{
    title: string;
    fileName: string;
  } | null>(null);

  // Final Reject State
  const [isFinalRejectOpen, setIsFinalRejectOpen] = useState(false);
  const [finalRejectDecision, setFinalRejectDecision] = useState('Reject');
  const [finalRejectReason, setFinalRejectReason] = useState('');
  const [finalRejectError, setFinalRejectError] = useState<string | null>(null);

  // Approve State
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<string>('Approve');
  const [approveRemarks, setApproveRemarks] = useState('');

  if (!visible) return null;

  const handleOpenReject = (stepId: number, stepTitle: string) => {
    setRejectingStep({ id: stepId, title: stepTitle });
  };

  const handleSaveReject = (stepNumber: number, reason: string) => {
    setRejections(prev => ({
      ...prev,
      [stepNumber]: reason,
    }));
    ToastService.warn(
      `Step ${stepNumber} marked as Rejected with deficiency remark.`
    );
  };

  const handleUndoReject = (stepNumber: number) => {
    setRejections(prev => {
      const next = { ...prev };
      delete next[stepNumber];
      return next;
    });
    ToastService.info(`Rejection cancelled for Step ${stepNumber}.`);
  };

  const rejectedCount = Object.keys(rejections).length;

  const handleSubmitAllRejections = () => {
    onSubmitRejections(rejections);
    onClose();
  };

  const handleOpenFinalReject = () => {
    setFinalRejectDecision('Reject');
    setFinalRejectReason('');
    setFinalRejectError(null);
    setIsFinalRejectOpen(true);
  };

  const handleConfirmFinalReject = () => {
    if (!finalRejectReason.trim()) {
      setFinalRejectError('Please enter rejection remark.');
      return;
    }
    if (onFinalReject) {
      onFinalReject(finalRejectReason.trim());
    } else {
      ToastService.warn('Application rejected.');
      onClose();
    }
    setIsFinalRejectOpen(false);
  };

  const handleOpenApprove = () => {
    setApprovalDecision('Approve');
    setApproveRemarks('');
    setIsApproveOpen(true);
  };

  const handleConfirmApprove = () => {
    if (approvalDecision === 'Reject') {
      if (onFinalReject) {
        onFinalReject(approveRemarks.trim());
      } else {
        ToastService.warn('Application rejected.');
        onClose();
      }
    } else {
      if (onApprove) {
        onApprove(approveRemarks.trim(), approvalDecision);
      } else {
        ToastService.success(`Application marked as ${approvalDecision}.`);
        onClose();
      }
    }
    setIsApproveOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenDoc = (title: string, fileName?: string) => {
    setViewingDoc({
      title,
      fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
    });
  };

  const renderSectionHeaderAction = (stepId: number, stepTitle: string) => {
    const isRejected = Boolean(rejections[stepId]);

    if (isRejected) {
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="bg-rose-100 text-rose-700 border border-rose-200 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 shadow-2xs">
            <i className="pi pi-times-circle text-rose-600 text-xs" />
            Rejected
          </span>
          <Button
            variant="outlined"
            size="small"
            label="Edit Reason"
            icon="pi pi-pencil"
            onClick={() => handleOpenReject(stepId, stepTitle)}
          />
          <Button
            variant="outlined"
            size="small"
            label="Cancel"
            icon="pi pi-undo"
            onClick={() => handleUndoReject(stepId)}
          />
        </div>
      );
    }

    return (
      <Button
        variant="outlined"
        size="small"
        label="Reject Section"
        icon="pi pi-times"
        className="text-rose-600 border-rose-300 hover:bg-rose-50 hover:border-rose-400"
        onClick={() => handleOpenReject(stepId, stepTitle)}
        tooltip={`Raise deficiency or reject Step ${stepId}`}
      />
    );
  };

  const renderDeficiencyBanner = (stepId: number) => {
    const reason = rejections[stepId];
    if (!reason) return null;

    return (
      <div className="bg-rose-50/90 border border-rose-200 rounded-xl p-3 my-3 flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
          <i className="pi pi-exclamation-triangle text-xs" />
        </div>
        <div className="flex-1 text-xs">
          <span className="font-bold text-rose-800 uppercase tracking-wider block mb-0.5">
            Deficiency / Section Rejection Reason:
          </span>
          <p className="text-rose-900 font-medium m-0 whitespace-pre-line leading-relaxed">
            {reason}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <FormPopup
        visible={visible}
        onHide={onClose}
        title="College Affiliation Profile Review"
        subtitle="Review detailed college registration data before assignment."
        size="xl"
        footer={
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            <div>
              <Button
                variant="outlined"
                icon="pi pi-print"
                label="Print"
                onClick={handlePrint}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {rejectedCount > 0 && (
                <Button
                  variant="outlined"
                  icon="pi pi-exclamation-triangle"
                  label={`Submit Deficiencies (${rejectedCount})`}
                  onClick={handleSubmitAllRejections}
                />
              )}
              <Button variant="outlined" label="Close" onClick={onClose} />
            </div>
          </div>
        }
      >
        <div className="p-2 sm:p-4 flex flex-col gap-5">
          {/* Top Summary Cards */}
          <PreviewSummary
            items={[
              {
                label: 'College Name',
                value: profile.collegeName,
                icon: 'building',
              },
              {
                label: 'Application Number',
                value: profile.applicationNumber,
                icon: 'file',
              },
              {
                label: 'Verified Date',
                value: profile.verifiedDate,
                icon: 'calendar',
              },
              {
                label: 'Inspection Status',
                value: (
                  <StatusBadge
                    label={profile.inspectionStatus}
                    variant={
                      profile.inspectionStatus === 'Assigned'
                        ? 'approved'
                        : 'pending'
                    }
                  />
                ),
                icon: 'check-circle',
              },
            ]}
          />

          {/* Assigned Inspection Team Card */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-blue-950 m-0">
                  Assigned Inspection Team
                </h4>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                  {profile.inspectionTeam.length} Members
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outlined"
                  size="small"
                  icon="pi pi-file-pdf"
                  label="Inspection Order"
                  onClick={() =>
                    handleOpenDoc(
                      'Inspection Order',
                      profile.inspectionOrderDocName
                    )
                  }
                />
                <span className="text-xs font-semibold text-blue-800">
                  Scheduled: {profile.inspectionScheduledDate}
                </span>
              </div>
            </div>

            <GridPanel
              data={profile.inspectionTeam}
              pagination={false}
              columns={[
                {
                  cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                  width: '50px',
                  header: '#',
                },
                {
                  field: 'name',
                  header: 'Member Name',
                  sortable: true,
                  cell: item => (
                    <span className="font-semibold text-slate-900">
                      {item.name}
                    </span>
                  ),
                },
                {
                  field: 'designation',
                  header: 'Designation',
                  sortable: true,
                },
                {
                  field: 'department',
                  header: 'Department',
                  sortable: true,
                },
                {
                  field: 'mobileNumber',
                  header: 'Mobile Number',
                  sortable: true,
                  cell: item => (
                    <span className="font-mono text-xs text-slate-700">
                      {item.mobileNumber}
                    </span>
                  ),
                },
              ]}
            />
          </div>

          {/* Step 1: College Registration Details */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <i className="pi pi-building text-base" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 m-0">
                  Step 1: College Registration Details
                </h3>
              </div>
              {renderSectionHeaderAction(
                1,
                'Step 1: College Registration Details'
              )}
            </div>

            {renderDeficiencyBanner(1)}

            <div className="pt-3">
              <FormGrid columns={3}>
                <PreviewField
                  label="College Name"
                  value={profile.collegeName}
                />
                <PreviewField
                  label="College Type"
                  value={profile.collegeType}
                />
                <PreviewField
                  label="College Official Email"
                  value={profile.collegeEmail}
                  breakWord
                />
                <PreviewField
                  label="Principal Name"
                  value={profile.principalName}
                />
                <PreviewField
                  label="Principal Mobile Number"
                  value={profile.principalMobileNumber}
                />
                <PreviewField
                  label="Principal Email ID"
                  value={profile.principalEmailId}
                  breakWord
                />
                <PreviewField label="State" value={profile.state} />
                <PreviewField label="District" value={profile.district} />
                <PreviewField
                  label="Block / Tehsil"
                  value={profile.blockTehsil}
                />
                <PreviewField label="PIN Code" value={profile.pinCode} />
                <PreviewField
                  label="College Address"
                  value={profile.collegeAddress}
                  fullWidth
                />
              </FormGrid>
            </div>
          </div>

          {/* Step 2: General Info */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <i className="pi pi-id-card text-base" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 m-0">
                  Step 2: General Info
                </h3>
              </div>
              {renderSectionHeaderAction(2, 'Step 2: General Info')}
            </div>

            {renderDeficiencyBanner(2)}

            <div className="pt-3 flex flex-col gap-5">
              <FormGrid columns={3}>
                <PreviewField
                  label="Ownership Entity Name"
                  value={profile.ownershipEntityName}
                />
                <PreviewField
                  label="Chairman Name"
                  value={profile.chairmanName}
                />
                <PreviewField
                  label="Chairman Qualification"
                  value={profile.chairmanQualification}
                />
                <PreviewField
                  label="Chairman Mobile"
                  value={profile.chairmanMobile}
                />
                <PreviewField
                  label="Executive Name"
                  value={profile.executiveName}
                />
                <PreviewField
                  label="Executive Mobile"
                  value={profile.executiveMobile}
                />
              </FormGrid>

              <div>
                <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider block mb-1.5">
                  Ownership Document
                </span>
                <Button
                  variant="outlined"
                  size="small"
                  icon="pi pi-eye"
                  label="View Document"
                  onClick={() =>
                    handleOpenDoc(
                      'Ownership Document',
                      profile.ownershipDocument
                    )
                  }
                />
              </div>

              {/* Governing Body Members */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Governing Body Members
                </h4>
                <GridPanel
                  data={profile.governingBodyMembers}
                  pagination={false}
                  columns={[
                    {
                      field: 'memberName',
                      header: 'Member Name',
                      sortable: true,
                    },
                    {
                      field: 'qualification',
                      header: 'Qualification',
                      sortable: true,
                    },
                    { field: 'age', header: 'Age', sortable: true },
                    {
                      field: 'mobileNumber',
                      header: 'Mobile Number',
                      sortable: true,
                    },
                    {
                      field: 'address',
                      header: 'Address',
                      sortable: true,
                    },
                  ]}
                />
              </div>

              {/* Additional Institutions Run by Society */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Additional Institutions Run by Society
                </h4>
                <GridPanel
                  data={profile.additionalInstitutions}
                  pagination={false}
                  columns={[
                    {
                      field: 'institutionName',
                      header: 'Institution Name',
                      sortable: true,
                    },
                    { field: 'programme', header: 'Programme', sortable: true },
                    { field: 'seats', header: 'Seats', sortable: true },
                    { field: 'year', header: 'Year', sortable: true },
                    {
                      field: 'affiliationType',
                      header: 'Affiliation Type',
                      sortable: true,
                    },
                    { field: 'address', header: 'Address' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Step 3: Course Registration */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <i className="pi pi-book text-base" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 m-0">
                  Step 3: Course Registration
                </h3>
              </div>
              {renderSectionHeaderAction(3, 'Step 3: Course Registration')}
            </div>

            {renderDeficiencyBanner(3)}

            <div className="pt-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Proposed / Existing Courses & Fees
              </h4>
              <GridPanel
                data={profile.courses}
                pagination={false}
                columns={[
                  {
                    field: 'courseName',
                    header: 'Course Name',
                    sortable: true,
                  },
                  { field: 'seats', header: 'Seats', sortable: true },
                  { field: 'class', header: 'Class', sortable: true },
                  {
                    field: 'academicYear',
                    header: 'Academic Year',
                    sortable: true,
                  },
                  { field: 'type', header: 'Type', sortable: true },
                  { field: 'status', header: 'Status', sortable: true },
                  {
                    field: 'conditions',
                    header: 'Conditions',
                    sortable: true,
                    cell: item => (
                      <span className="text-xs text-slate-700 font-medium">
                        {item.conditions && item.conditions !== '-'
                          ? item.conditions
                          : 'Subject to fulfillment of University & Council Norms'}
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          </div>

          {/* Step 4: Land & Building Details */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <i className="pi pi-map-marker text-base" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 m-0">
                  Step 4: Land & Building Details
                </h3>
              </div>
              {renderSectionHeaderAction(4, 'Step 4: Land & Building Details')}
            </div>

            {renderDeficiencyBanner(4)}

            <div className="pt-3 flex flex-col gap-5">
              <FormGrid columns={3}>
                <PreviewField label="Land Type" value={profile.landType} />
                <PreviewField
                  label="Building Type"
                  value={profile.buildingType}
                />
                <PreviewField
                  label="Land Total Area"
                  value={profile.landTotalArea}
                />
                <PreviewField
                  label="Total Building Area"
                  value={profile.totalBuildingArea}
                />
                <PreviewField
                  label="Building Built-Up Area"
                  value={profile.buildingBuiltUpArea}
                />
                <PreviewField
                  label="Quality of Building"
                  value={profile.qualityOfBuilding}
                />
                <PreviewField
                  label="Land Norms Fulfilled"
                  value={profile.landNormsFulfilled}
                />
                <PreviewField
                  label="Accommodation Details"
                  value={profile.accommodationDetails}
                />
                <PreviewField
                  label="Shared Campus"
                  value={profile.sharedCampus}
                />
                <PreviewField
                  label="Shared Campus Area"
                  value={profile.sharedCampusArea}
                />
                <PreviewField
                  label="Latitude / Longitude"
                  value={profile.latitudeLongitude}
                />
              </FormGrid>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Land & Building Documents / Proofs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider block mb-1">
                      Land Document
                    </span>
                    <Button
                      variant="outlined"
                      size="small"
                      icon="pi pi-eye"
                      label="View Document"
                      className="w-full justify-center"
                      onClick={() =>
                        handleOpenDoc(
                          'Land Document',
                          profile.documents.landDocument
                        )
                      }
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider block mb-1">
                      Other Land Document
                    </span>
                    <Button
                      variant="outlined"
                      size="small"
                      icon="pi pi-eye"
                      label="View Document"
                      className="w-full justify-center"
                      onClick={() =>
                        handleOpenDoc(
                          'Other Land Document',
                          profile.documents.otherLandDocument
                        )
                      }
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider block mb-1">
                      Building Document
                    </span>
                    <Button
                      variant="outlined"
                      size="small"
                      icon="pi pi-eye"
                      label="View Document"
                      className="w-full justify-center"
                      onClick={() =>
                        handleOpenDoc(
                          'Building Document',
                          profile.documents.buildingDocument
                        )
                      }
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider block mb-1">
                      Other Building Document
                    </span>
                    <Button
                      variant="outlined"
                      size="small"
                      icon="pi pi-eye"
                      label="View Document"
                      className="w-full justify-center"
                      onClick={() =>
                        handleOpenDoc(
                          'Other Building Document',
                          profile.documents.otherBuildingDocument
                        )
                      }
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider block mb-1">
                      Building Map
                    </span>
                    <Button
                      variant="outlined"
                      size="small"
                      icon="pi pi-eye"
                      label="View Document"
                      className="w-full justify-center"
                      onClick={() =>
                        handleOpenDoc(
                          'Building Map',
                          profile.documents.buildingMap
                        )
                      }
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider block mb-1">
                      Building Plan & Safety
                    </span>
                    <Button
                      variant="outlined"
                      size="small"
                      icon="pi pi-eye"
                      label="View Document"
                      className="w-full justify-center"
                      onClick={() =>
                        handleOpenDoc(
                          'Building Plan & Safety',
                          profile.documents.buildingPlanSafety
                        )
                      }
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider block mb-1">
                      Council Approvals
                    </span>
                    <Button
                      variant="outlined"
                      size="small"
                      icon="pi pi-eye"
                      label="View Document"
                      className="w-full justify-center"
                      onClick={() =>
                        handleOpenDoc(
                          'Council Approvals',
                          profile.documents.councilApprovals
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Academic Facilities */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <i className="pi pi-graduation-cap text-base" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 m-0">
                  Step 5: Academic Facilities
                </h3>
              </div>
              {renderSectionHeaderAction(5, 'Step 5: Academic Facilities')}
            </div>

            {renderDeficiencyBanner(5)}

            <div className="pt-3">
              <FormGrid columns={3}>
                <PreviewField
                  label="Total Classrooms"
                  value={profile.totalClassrooms}
                />
                <PreviewField
                  label="Classrooms As Per Norms"
                  value={profile.classroomsAsPerNorms}
                />
                <PreviewField
                  label="Accessible To Public"
                  value={profile.accessibleToPublic}
                />
                <PreviewField
                  label="Library Building Available"
                  value={profile.libraryBuildingAvailable}
                />
                <PreviewField label="Total Books" value={profile.totalBooks} />
                <PreviewField
                  label="Reading Room Available"
                  value={profile.readingRoomAvailable}
                />
              </FormGrid>
            </div>
          </div>

          {/* Step 6: Computers & Equipment */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <i className="pi pi-desktop text-base" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 m-0">
                  Step 6: Computers & Equipment
                </h3>
              </div>
              {renderSectionHeaderAction(6, 'Step 6: Computers & Equipment')}
            </div>

            {renderDeficiencyBanner(6)}

            <div className="pt-3">
              <FormGrid columns={3}>
                <PreviewField
                  label="Latest Computers"
                  value={profile.latestComputers}
                />
                <PreviewField
                  label="Working Computers"
                  value={profile.workingComputers}
                />
                <PreviewField
                  label="Internet Availability & Speed"
                  value={profile.internetAvailability}
                />
                <PreviewField
                  label="Printers / Scanners"
                  value={profile.printersScanners}
                />
                <PreviewField
                  label="Computer : Student Ratio"
                  value={profile.computerStudentRatio}
                />
                <PreviewField
                  label="Computer Trained Staff"
                  value={profile.computerTrainedStaff}
                />
                <PreviewField
                  label="Student Desks / Benches"
                  value={profile.studentDesksBenches}
                />
                <PreviewField
                  label="Tables / Chairs"
                  value={profile.tablesChairs}
                />
                <PreviewField
                  label="Board Available"
                  value={profile.boardAvailable}
                />
              </FormGrid>
            </div>
          </div>

          {/* Step 7: Teaching & Non-Teaching Staff */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <i className="pi pi-users text-base" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 m-0">
                  Step 7: Teaching & Non-Teaching Staff
                </h3>
              </div>
              {renderSectionHeaderAction(
                7,
                'Step 7: Teaching & Non-Teaching Staff'
              )}
            </div>

            {renderDeficiencyBanner(7)}

            <div className="pt-3">
              {profile.staff && profile.staff.length > 0 ? (
                <GridPanel
                  data={profile.staff}
                  pagination={false}
                  columns={[
                    {
                      cell: (_, option) => <span>{option.rowIndex + 1}</span>,
                      width: '50px',
                      header: '#',
                    },
                    { field: 'name', header: 'Staff Name', sortable: true },
                    {
                      field: 'role',
                      header: 'Designation / Role',
                      sortable: true,
                    },
                    {
                      field: 'qualification',
                      header: 'Qualification',
                      sortable: true,
                    },
                    {
                      field: 'department',
                      header: 'Department',
                      sortable: true,
                    },
                    {
                      field: 'experience',
                      header: 'Experience',
                      sortable: true,
                    },
                    { field: 'mobileNumber', header: 'Mobile Number' },
                  ]}
                />
              ) : (
                <p className="text-xs text-slate-500 italic py-2 m-0">
                  No teaching staff records.
                </p>
              )}
            </div>
          </div>

          {/* Step 8: Compliance */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <i className="pi pi-check-circle text-base" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 m-0">
                  Step 8: Compliance
                </h3>
              </div>
              {renderSectionHeaderAction(8, 'Step 8: Compliance')}
            </div>

            {renderDeficiencyBanner(8)}

            <div className="pt-3">
              <FormGrid columns={3}>
                <PreviewField
                  label="Annual Projected Income / Budget"
                  value={profile.annualProjectedIncome}
                />
                <PreviewField
                  label="Source of Funding"
                  value={profile.sourceOfFunding}
                />
                <PreviewField
                  label="Regular Books Maintained"
                  value={profile.regularBooksMaintained}
                />
                <PreviewField
                  label="Accounts Audited"
                  value={profile.accountsAudited}
                />
                <PreviewField
                  label="MP Govt Permission"
                  value={profile.mpGovtPermission}
                />
                <PreviewField
                  label="Session Permission Granted"
                  value={profile.sessionPermissionGranted}
                />
                <PreviewField
                  label="Statutory Conditions"
                  value={profile.statutoryConditions}
                />
                <PreviewField
                  label="State Govt Conditions"
                  value={profile.stateGovtConditions}
                />
                <PreviewField
                  label="Statute Fulfilled"
                  value={profile.statuteFulfilled}
                />
                <PreviewField
                  label="Statutory Norms Adhered"
                  value={profile.statutoryNormsAdhered}
                />
                <PreviewField
                  label="Fee Structure Adhered"
                  value={profile.feeStructureAdhered}
                />
                <PreviewField
                  label="Reservation Norms Followed"
                  value={profile.reservationNormsFollowed}
                />
              </FormGrid>
            </div>
          </div>

          {/* Step 9: Others */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <i className="pi pi-ellipsis-h text-base" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 m-0">
                  Step 9: Others
                </h3>
              </div>
              {renderSectionHeaderAction(9, 'Step 9: Others')}
            </div>

            {renderDeficiencyBanner(9)}

            <div className="pt-3">
              <FormGrid columns={3}>
                <PreviewField
                  label="Parking Space"
                  value={profile.parkingSpace}
                />
                <PreviewField
                  label="First Aid Facility"
                  value={profile.firstAidFacility}
                />
                <PreviewField
                  label="Drinking Water / Purifier"
                  value={profile.drinkingWater}
                />
                <PreviewField
                  label="CCTV Surveillance"
                  value={profile.cctvSurveillance}
                />
                <PreviewField
                  label="Transport Facility"
                  value={profile.transportFacility}
                />
                <PreviewField
                  label="Safety Guards"
                  value={profile.safetyGuards}
                />
                <PreviewField
                  label="Fire Safety (Extinguishers / Alarm)"
                  value={profile.fireSafety}
                />
                <PreviewField
                  label="Medical Attendant"
                  value={profile.medicalAttendant}
                />
                <PreviewField
                  label="Ramp / Lift Facility"
                  value={profile.rampLiftFacility}
                />
              </FormGrid>
            </div>
          </div>

          {/* Step 10: Signature & Declaration */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <i className="pi pi-file-edit text-base" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 m-0">
                  Step 10: Signature & Declaration
                </h3>
              </div>
              {renderSectionHeaderAction(
                10,
                'Step 10: Signature & Declaration'
              )}
            </div>

            {renderDeficiencyBanner(10)}

            <div className="pt-3">
              <FormGrid columns={3}>
                <PreviewField
                  label="Principal Name (Signatory)"
                  value={profile.principalSignatory}
                />
                <PreviewField
                  label="Date of Certification"
                  value={profile.dateOfCertification}
                />
                <PreviewField
                  label="Declaration Status"
                  value={profile.declarationStatus}
                />
                <div>
                  <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider block mb-1">
                    Principal Signature
                  </span>
                  <Button
                    variant="outlined"
                    size="small"
                    icon="pi pi-eye"
                    label="View Document"
                    onClick={() =>
                      handleOpenDoc(
                        'Principal Signature',
                        'Principal_Signature_Endorsement.pdf'
                      )
                    }
                  />
                </div>
                <div>
                  <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider block mb-1">
                    Management Signature
                  </span>
                  <Button
                    variant="outlined"
                    size="small"
                    icon="pi pi-eye"
                    label="View Document"
                    onClick={() =>
                      handleOpenDoc(
                        'Management Signature',
                        'Management_Signature_Endorsement.pdf'
                      )
                    }
                  />
                </div>
              </FormGrid>
            </div>
          </div>

          {/* Standing Committee Final Decision Action Card at the end of the form */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-700 shadow-2xs">
                <i className="pi pi-verified text-xl" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">
                  Standing Committee Final Decision
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Complete the review of all 10 registration steps and
                  inspection committee recommendations to record final approval
                  or rejection.
                </p>
                {rejectedCount > 0 && (
                  <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
                    <i className="pi pi-exclamation-circle text-xs" />
                    {rejectedCount} section(s) currently marked with
                    deficiencies.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <Button
                variant="danger"
                icon="pi pi-times-circle"
                label="Final Reject"
                onClick={handleOpenFinalReject}
              />
              <Button
                variant="success"
                icon="pi pi-check"
                label="Approve"
                onClick={handleOpenApprove}
              />
            </div>
          </div>
        </div>
      </FormPopup>

      {/* Section-Wise Reject Modal */}
      <SectionRejectModal
        visible={rejectingStep !== null}
        onClose={() => setRejectingStep(null)}
        stepNumber={rejectingStep?.id ?? null}
        stepTitle={rejectingStep?.title ?? ''}
        initialReason={rejectingStep ? rejections[rejectingStep.id] || '' : ''}
        collegeName={profile.collegeName}
        onSave={handleSaveReject}
      />

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        visible={viewingDoc !== null}
        onClose={() => setViewingDoc(null)}
        documentTitle={viewingDoc?.title ?? ''}
        fileName={viewingDoc?.fileName}
        collegeName={profile.collegeName}
        applicationNumber={profile.applicationNumber}
      />

      {/* Final Rejection Confirmation Modal */}
      <FormPopup
        visible={isFinalRejectOpen}
        onHide={() => setIsFinalRejectOpen(false)}
        title="Final Rejection - Affiliation Application"
        subtitle={`Confirm final rejection for ${profile.collegeName} (${profile.applicationNumber})`}
        size="default"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button
              variant="outlined"
              label="Cancel"
              onClick={() => setIsFinalRejectOpen(false)}
            />
            <Button
              variant="danger"
              label="Confirm Final Rejection"
              icon="pi pi-times-circle"
              onClick={handleConfirmFinalReject}
            />
          </div>
        }
      >
        <div className="p-4 flex flex-col gap-3">
          <div>
            <DropDownList
              label="Select Decision / Status"
              data={[{ value: 'Reject', text: 'Reject' }]}
              textField="text"
              valueField="value"
              value={finalRejectDecision}
              onChange={val =>
                setFinalRejectDecision((val as string) || 'Reject')
              }
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">
              Reject Remark <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              className={`w-full text-sm rounded-xl border p-3 focus:outline-none transition-all ${
                finalRejectError
                  ? 'border-rose-500 ring-2 ring-rose-100'
                  : 'border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
              }`}
              value={finalRejectReason}
              onChange={e => {
                setFinalRejectReason(e.target.value);
                if (finalRejectError) setFinalRejectError(null);
              }}
              autoFocus
            />
            {finalRejectError && (
              <span className="text-xs text-rose-600 font-medium mt-1 block">
                {finalRejectError}
              </span>
            )}
          </div>
        </div>
      </FormPopup>

      {/* Affiliation Approval Confirmation Modal */}
      <FormPopup
        visible={isApproveOpen}
        onHide={() => setIsApproveOpen(false)}
        title="Approve College Affiliation"
        subtitle={`Confirm affiliation approval for ${profile.collegeName} (${profile.applicationNumber})`}
        size="default"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button
              variant="outlined"
              label="Cancel"
              onClick={() => setIsApproveOpen(false)}
            />
            <Button
              variant={approvalDecision === 'Reject' ? 'danger' : 'success'}
              label={
                approvalDecision === 'Reject'
                  ? 'Confirm Rejection'
                  : approvalDecision === 'Approve with Conditions'
                    ? 'Confirm Conditional Approval'
                    : approvalDecision === 'Provisional Approval'
                      ? 'Confirm Provisional Approval'
                      : 'Confirm Approval'
              }
              icon={
                approvalDecision === 'Reject'
                  ? 'pi pi-times-circle'
                  : 'pi pi-check'
              }
              onClick={handleConfirmApprove}
            />
          </div>
        }
      >
        <div className="p-4 flex flex-col gap-3">
          {approvalDecision === 'Reject' ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg flex items-start gap-2.5">
              <i className="pi pi-times-circle text-rose-600 mt-0.5 text-sm shrink-0" />
              <div>
                <p className="font-semibold">Rejection Decision Notice</p>
                <p className="mt-0.5 text-rose-700">
                  This action will mark the entire affiliation application as{' '}
                  <strong>Rejected</strong>.
                </p>
              </div>
            </div>
          ) : rejectedCount > 0 ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg flex items-start gap-2.5">
              <i className="pi pi-info-circle text-amber-600 mt-0.5 text-sm shrink-0" />
              <div>
                <p className="font-semibold">
                  Notice: Section Deficiencies Overridden
                </p>
                <p className="mt-0.5 text-amber-700">
                  You currently have {rejectedCount} section(s) marked with
                  deficiencies. Confirming approval will override those flags
                  and approve the affiliation application.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-start gap-2.5">
              <i className="pi pi-check-circle text-emerald-600 mt-0.5 text-sm shrink-0" />
              <div>
                <p className="font-semibold">All Compliance Verified</p>
                <p className="mt-0.5 text-emerald-700">
                  All 10 registration steps and inspection committee
                  recommendations satisfy statutory criteria.
                </p>
              </div>
            </div>
          )}

          <div>
            <DropDownList
              label="Select Decision / Status"
              data={[
                { value: 'Approve', text: 'Approve' },
                {
                  value: 'Approve with Conditions',
                  text: 'Approve with Conditions',
                },
                { value: 'Provisional Approval', text: 'Provisional Approval' },
                { value: 'Reject', text: 'Reject' },
              ]}
              textField="text"
              valueField="value"
              value={approvalDecision}
              onChange={val =>
                setApprovalDecision((val as string) || 'Approve')
              }
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">
              Approval Remarks / Resolution
            </label>
            <textarea
              rows={4}
              className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
              value={approveRemarks}
              onChange={e => setApproveRemarks(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </FormPopup>
    </>
  );
}
