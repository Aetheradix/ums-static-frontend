import { useEffect, useMemo, useState } from 'react';
import { Button } from 'shared/components/buttons';
import GridActionButtons from 'shared/components/grid/GridActionButtons';
import { Loader } from 'shared/components/progress';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  GridPanel,
  PreviewField,
  PreviewSection,
  PreviewSummary,
  StatusBadge,
} from 'shared/new-components';
import { formatDate } from 'shared/utils/dateUtils';
import { ToastService } from 'services';
import { useRegistrationApprovalForm } from '../components/form.hook';
import { RegistrationApprovalForm } from '../components/RegistrationApprovalForm';
import {
  useCollegeRegistrationApprovalsQuery,
  useCollegeRegistrationByIdQuery,
} from '../queries';
import './RegistrationApproval.css';

type ApprovalItem = AffiliationManagementSystem.CollegeRegistrationApprovalItem;

const APPROVAL_STATUS_LABEL: Record<number, string> = {
  1: 'Pending',
  2: 'Approved',
  3: 'Rejected',
};

type ApprovalStatusVariant = 'pending' | 'approved' | 'rejected' | 'neutral';

function getStatusLabel(status?: number) {
  return status ? (APPROVAL_STATUS_LABEL[status] ?? 'Pending') : 'Pending';
}

function getStatusVariant(status?: number): ApprovalStatusVariant {
  switch (status) {
    case 1:
      return 'pending';
    case 2:
      return 'approved';
    case 3:
      return 'rejected';
    default:
      return 'neutral';
  }
}

export default function List() {
  const { data, isLoading } = useCollegeRegistrationApprovalsQuery();

  const {
    isPending,
    rejectingId,
    rejectionReason,
    setRejectionReason,
    handleApprove,
    handleOpenReject,
    handleCloseReject,
    handleRejectSubmit,
  } = useRegistrationApprovalForm();

  const [previewId, setPreviewId] = useState<number | null>(null);

  const { data: previewData, isLoading: isPreviewLoading } =
    useCollegeRegistrationByIdQuery(previewId);

  const selectedApproval = useMemo(
    () => data.find(item => item.collegeRegistrationId === previewId),
    [data, previewId]
  );

  const isSelectedApprovalPending = selectedApproval?.approvalStatus === 1;

  const handleClosePreview = () => {
    setPreviewId(null);
  };

  const handleApproveFromPreview = async () => {
    if (previewId === null) return;

    const id = previewId;
    handleClosePreview();
    await handleApprove(id);
  };

  const handleRejectFromPreview = () => {
    if (previewId === null) return;

    const id = previewId;
    handleClosePreview();
    handleOpenReject(id);
  };

  const preview: any = previewData;

  const [sectionStatuses, setSectionStatuses] = useState<
    Record<number, 'neutral' | 'rejected'>
  >({
    1: 'neutral',
    2: 'neutral',
    3: 'neutral',
    4: 'neutral',
    5: 'neutral',
    6: 'neutral',
  });

  const [sectionRemarks, setSectionRemarks] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
  });

  const [rejectingSectionId, setRejectingSectionId] = useState<number | null>(
    null
  );
  const [tempReason, setTempReason] = useState('');

  // Dynamically set section statuses and remarks based on overall application status
  useEffect(() => {
    if (previewId === null) {
      setSectionStatuses({
        1: 'neutral',
        2: 'neutral',
        3: 'neutral',
        4: 'neutral',
        5: 'neutral',
        6: 'neutral',
      });
      setSectionRemarks({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });
      return;
    }

    if (selectedApproval) {
      if (selectedApproval.approvalStatus === 3) {
        setSectionStatuses({
          1: 'rejected',
          2: 'neutral',
          3: 'neutral',
          4: 'neutral',
          5: 'neutral',
          6: 'neutral',
        });
        setSectionRemarks({
          1: selectedApproval.rejectionReason || 'Deficiency identified.',
          2: '',
          3: '',
          4: '',
          5: '',
          6: '',
        });
      } else {
        setSectionStatuses({
          1: 'neutral',
          2: 'neutral',
          3: 'neutral',
          4: 'neutral',
          5: 'neutral',
          6: 'neutral',
        });
        setSectionRemarks({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });
      }
    }
  }, [previewId, selectedApproval]);

  const isAnySectionRejected = useMemo(() => {
    return Object.values(sectionStatuses).some(status => status === 'rejected');
  }, [sectionStatuses]);

  const handleSectionWiseSubmit = async () => {
    if (previewId === null) return;
    const rejectedSections = Object.entries(sectionStatuses)
      .filter(([_, status]) => status === 'rejected')
      .map(([step, _]) => {
        const stepNum = Number(step);
        const sectionName =
          stepNum === 1
            ? 'College Registration Details'
            : stepNum === 2
              ? 'Ownership & Management'
              : stepNum === 3
                ? 'Ecosystem & Academics'
                : stepNum === 4
                  ? 'Infrastructure & Facilities'
                  : stepNum === 5
                    ? 'Compliance & Funding'
                    : 'Uploaded Documents';
        return `• ${sectionName}: ${sectionRemarks[stepNum] || 'No reason'}`;
      })
      .join('\n');

    const aggregatedReason = `Deficiencies identified in the following sections:\n${rejectedSections}`;

    setRejectionReason(aggregatedReason);
    handleClosePreview();
    handleOpenReject(previewId);
  };

  const renderSectionAction = (stepId: number) => {
    const isApprovalPending = selectedApproval?.approvalStatus === 1;
    const status = sectionStatuses[stepId] || 'neutral';
    const remark = sectionRemarks[stepId] || '';

    if (status === 'rejected') {
      return (
        <div className="flex items-center gap-2">
          <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            <i className="pi pi-times-circle" /> Rejected
          </span>
          {isApprovalPending && (
            <>
              <Button
                variant="outlined"
                size="small"
                label="Edit Reason"
                icon="pi pi-pencil"
                onClick={() => {
                  setRejectingSectionId(stepId);
                  setTempReason(remark);
                }}
              />
              <Button
                variant="outlined"
                size="small"
                label="Cancel Rejection"
                icon="pi pi-undo"
                onClick={() => {
                  setSectionStatuses(prev => ({
                    ...prev,
                    [stepId]: 'neutral',
                  }));
                  setSectionRemarks(prev => ({ ...prev, [stepId]: '' }));
                }}
              />
            </>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {isApprovalPending && (
          <Button
            variant="outlined"
            size="small"
            label="Reject Section"
            icon="pi pi-times"
            onClick={() => {
              setRejectingSectionId(stepId);
              setTempReason('');
            }}
          />
        )}
      </div>
    );
  };

  return (
    <FormPage
      title="College Registration Approvals"
      description="Manage, review, and approve or reject college registrations."
    >
      <FormCard>
        {isLoading ? <Loader /> : undefined}

        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search colleges..."
          searchFields={[
            'collegeName',
            'collegeCategoryId',
            'applicationNumber',
          ]}
          emptyMessage="No college registration approvals found."
          className="registration-approval-grid"
          columns={[
            {
              cell: (_, option) => <span>{option.rowIndex + 1}</span>,
              width: '60px',
              sortable: false,
            },
            {
              field: 'collegeName',
              header: 'College Name',
            },
            {
              field: 'collegeCategoryId',
              header: 'Category',
            },
            {
              field: 'applicationNumber',
              header: 'Application Number',
              cell: (item: ApprovalItem) => (
                <span>{item.applicationNumber || '-'}</span>
              ),
            },
            {
              field: 'createdOn',
              header: 'Action Date',
              cell: (item: ApprovalItem) => (
                <span>{formatDate(item.createdOn)}</span>
              ),
            },
            {
              field: 'approvalStatus',
              header: 'Approval Status',
              cell: (item: ApprovalItem) => (
                <div className="registration-status-cell">
                  <StatusBadge
                    label={getStatusLabel(item.approvalStatus)}
                    variant={getStatusVariant(item.approvalStatus)}
                  />

                  {item.approvalStatus === 3 && item.rejectionReason && (
                    <span className="registration-rejection-reason">
                      {item.rejectionReason}
                    </span>
                  )}
                </div>
              ),
            },
            {
              header: 'Actions',
              sortable: false,
              width: '140px',
              cell: (item: ApprovalItem) => {
                const isApprovalPending = item.approvalStatus === 1;

                return (
                  <GridActionButtons
                    onView={() => setPreviewId(item.collegeRegistrationId)}
                    viewTooltip="Preview"
                    onApprove={
                      isApprovalPending
                        ? () => handleApprove(item.collegeRegistrationId)
                        : undefined
                    }
                    onReject={
                      isApprovalPending
                        ? () => handleOpenReject(item.collegeRegistrationId)
                        : undefined
                    }
                  />
                );
              },
            },
          ]}
        />
      </FormCard>

      <RegistrationApprovalForm
        visible={rejectingId !== null}
        isPending={isPending}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onClose={handleCloseReject}
        onSubmit={handleRejectSubmit}
      />

      <FormPopup
        visible={previewId !== null}
        onHide={handleClosePreview}
        title="Registration Preview"
        subtitle="Detailed view of the college registration data."
        size="xl"
        className="registration-preview-popup"
        bodyClassName="registration-preview-body"
        footer={
          <>
            <Button
              label="Close"
              variant="outlined"
              onClick={handleClosePreview}
            />

            {isSelectedApprovalPending && (
              <>
                {isAnySectionRejected ? (
                  <Button
                    label="Submit Section-wise Deficiencies"
                    icon="times"
                    variant="danger"
                    disabled={isPending}
                    onClick={handleSectionWiseSubmit}
                  />
                ) : (
                  <>
                    <Button
                      label="Reject Application"
                      icon="times"
                      variant="danger"
                      disabled={isPending}
                      onClick={handleRejectFromPreview}
                    />

                    <Button
                      label="Approve Application"
                      icon="check"
                      variant="primary"
                      isLoading={isPending}
                      onClick={handleApproveFromPreview}
                    />
                  </>
                )}
              </>
            )}
          </>
        }
      >
        {isPreviewLoading ? (
          <Loader />
        ) : preview ? (
          <div className="registration-preview-content">
            <PreviewSummary
              items={[
                {
                  label: 'College Name',
                  value: preview.collegeName,
                  icon: 'building',
                },
                {
                  label: 'Application Number',
                  value: selectedApproval?.applicationNumber,
                  icon: 'file',
                },
                {
                  label: 'Submitted Date',
                  value: selectedApproval?.createdOn
                    ? formatDate(selectedApproval.createdOn)
                    : undefined,
                  icon: 'calendar',
                },
                {
                  label: 'Approval Status',
                  value: (
                    <StatusBadge
                      label={getStatusLabel(selectedApproval?.approvalStatus)}
                      variant={getStatusVariant(
                        selectedApproval?.approvalStatus
                      )}
                    />
                  ),
                  icon: 'check-circle',
                },
              ]}
            />

            <PreviewSection
              step={1}
              title="College Registration Details"
              subtitle="Basic registration details submitted by the college."
              headerAction={renderSectionAction(1)}
            >
              <FormGrid columns={3}>
                <PreviewField
                  label="College Name"
                  value={preview.collegeName}
                />
                <PreviewField
                  label="College Type"
                  value={
                    preview.collegeTypeId === 1
                      ? 'Government'
                      : preview.collegeTypeId === 2
                        ? 'Private'
                        : preview.collegeTypeId === 3
                          ? 'Aided'
                          : preview.collegeTypeId === 4
                            ? 'Unaided'
                            : 'Other'
                  }
                />
                <PreviewField
                  label="College Official Email"
                  value={preview.collegeEmail}
                  breakWord
                />
                <PreviewField
                  label="Principal Name"
                  value={
                    preview.affiliation?.principalDirectorName ||
                    preview.principalDirectorName
                  }
                />
                <PreviewField
                  label="Principal Mobile Number"
                  value={
                    preview.affiliation?.principalMobileNo ||
                    preview.principalMobileNo
                  }
                />
                <PreviewField
                  label="Principal Email ID"
                  value={
                    preview.affiliation?.principalEmail ||
                    preview.principalEmail
                  }
                  breakWord
                />
                <PreviewField label="State" value="Madhya Pradesh" />
                <PreviewField
                  label="District"
                  value={preview.districtName || 'Indore'}
                />
                <PreviewField
                  label="Block / Tehsil"
                  value={preview.blockTehsil || 'Indore'}
                />
                <PreviewField
                  label="PIN Code"
                  value={preview.pinCode || '452001'}
                />
                <PreviewField
                  label="College Address"
                  value={preview.collegeAddress}
                  fullWidth
                />
              </FormGrid>
              {sectionStatuses[1] === 'rejected' && (
                <div className="affiliation-grid-full bg-red-50 border border-red-200 rounded-lg p-3 mt-4 flex items-start gap-2">
                  <i className="pi pi-info-circle text-red-500 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-red-800">
                      Deficiency / Rejection Reason:
                    </h5>
                    <p className="text-sm text-red-700 mt-1">
                      {sectionRemarks[1] || 'No reason entered yet.'}
                    </p>
                  </div>
                </div>
              )}
            </PreviewSection>

            <PreviewSection
              step={2}
              title="Ownership & Management"
              subtitle="Ownership entity and chairman/secretary details."
              headerAction={renderSectionAction(2)}
            >
              <FormGrid columns={3}>
                <PreviewField
                  label="Ownership Entity Name"
                  value={preview.ownershipEntityName}
                />
                <PreviewField
                  label="Chairman Name"
                  value={preview.chairmanName}
                />
                <PreviewField
                  label="Chairman Qualification"
                  value={preview.chairmanQualification}
                />
                <PreviewField
                  label="Chairman Mobile"
                  value={preview.chairmanMobileNumber}
                />
                <PreviewField
                  label="Executive Name"
                  value={preview.executiveName}
                />
                <PreviewField
                  label="Executive Mobile"
                  value={preview.executiveMobileNumber}
                />
              </FormGrid>

              {preview.governingBodyMembers?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Governing Body Members
                  </h4>
                  <GridPanel
                    data={preview.governingBodyMembers}
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
              )}
              {sectionStatuses[2] === 'rejected' && (
                <div className="affiliation-grid-full bg-red-50 border border-red-200 rounded-lg p-3 mt-4 flex items-start gap-2">
                  <i className="pi pi-info-circle text-red-500 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-red-800">
                      Deficiency / Rejection Reason:
                    </h5>
                    <p className="text-sm text-red-700 mt-1">
                      {sectionRemarks[2] || 'No reason entered yet.'}
                    </p>
                  </div>
                </div>
              )}
            </PreviewSection>

            <PreviewSection
              step={3}
              title="Ecosystem & Academics"
              subtitle="Courses, staff and institutions details."
              headerAction={renderSectionAction(3)}
            >
              {preview.existingCourses?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Proposed / Existing Courses
                  </h4>
                  <GridPanel
                    data={preview.existingCourses}
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
              )}

              {preview.teachingStaff?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Teaching Staff
                  </h4>
                  <GridPanel
                    data={preview.teachingStaff}
                    pagination={false}
                    columns={[
                      { field: 'name', header: 'Name' },
                      { field: 'role', header: 'Role' },
                      { field: 'qualification', header: 'Qualification' },
                      { field: 'experience', header: 'Experience' },
                    ]}
                  />
                </div>
              )}

              {preview.additionalInstitutions?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Other Running Institutions
                  </h4>
                  <GridPanel
                    data={preview.additionalInstitutions}
                    pagination={false}
                    columns={[
                      { field: 'institutionName', header: 'Institution Name' },
                      { field: 'course', header: 'Course' },
                      { field: 'seats', header: 'Seats' },
                      { field: 'address', header: 'Address' },
                    ]}
                  />
                </div>
              )}
              {sectionStatuses[3] === 'rejected' && (
                <div className="affiliation-grid-full bg-red-50 border border-red-200 rounded-lg p-3 mt-4 flex items-start gap-2">
                  <i className="pi pi-info-circle text-red-500 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-red-800">
                      Deficiency / Rejection Reason:
                    </h5>
                    <p className="text-sm text-red-700 mt-1">
                      {sectionRemarks[3] || 'No reason entered yet.'}
                    </p>
                  </div>
                </div>
              )}
            </PreviewSection>

            <PreviewSection
              step={4}
              title="Infrastructure & Facilities"
              subtitle="Campus area, building, library and labs details."
              headerAction={renderSectionAction(4)}
            >
              <FormGrid columns={3}>
                <PreviewField label="Total Area" value={preview.totalArea} />
                <PreviewField
                  label="Building Type"
                  value={preview.isRentedBuilding}
                />
                <PreviewField
                  label="Quality of Building"
                  value={preview.qualityOfBuilding}
                />
                <PreviewField
                  label="Required Classrooms"
                  value={preview.requiredClassrooms}
                />
                <PreviewField
                  label="Accessible to Public"
                  value={preview.accessibleToPublic}
                />
                <PreviewField
                  label="Parking Space"
                  value={preview.parkingSpace}
                />
              </FormGrid>
              <div className="mt-2 mb-4">
                <PreviewField
                  label="Classrooms Details"
                  value={preview.classroomDetails}
                  fullWidth
                />
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Library Details
                </h4>
                <FormGrid columns={3}>
                  <PreviewField
                    label="Books Count"
                    value={preview.libraryBooksCount}
                  />
                  <PreviewField
                    label="Book-Student Ratio"
                    value={preview.bookStudentRatio}
                  />
                  <PreviewField
                    label="Reading Room Area"
                    value={preview.readingRoomDimensions}
                  />
                  <PreviewField
                    label="Journals Count"
                    value={preview.journalsCount}
                  />
                </FormGrid>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Laboratory & Facilities
                </h4>
                <FormGrid columns={3}>
                  <PreviewField
                    label="Laboratory Floor Space"
                    value={preview.labFloorSpace}
                  />
                  <PreviewField
                    label="Exclusive Labs"
                    value={preview.labExclusive}
                  />
                </FormGrid>
                <div className="mt-2">
                  <PreviewField
                    label="Lab Equipment Details"
                    value={preview.labEquipmentDetails}
                    fullWidth
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Hostel & Accommodation Details
                </h4>
                <FormGrid columns={3}>
                  <PreviewField
                    label="Hostel Available?"
                    value={preview.hostelAvailable}
                  />
                  <PreviewField
                    label="Type of Hostel"
                    value={preview.typeOfHostel}
                  />
                  <PreviewField
                    label="Boys Hostels Count"
                    value={preview.boysHostelsCount}
                  />
                  <PreviewField
                    label="Girls Hostels Count"
                    value={preview.girlsHostelsCount}
                  />
                  <PreviewField
                    label="Total Hostel Capacity"
                    value={preview.totalHostelCapacity}
                  />
                  <PreviewField
                    label="Accommodation Availability"
                    value={preview.accommodationAvailability}
                  />
                </FormGrid>
              </div>
              {sectionStatuses[4] === 'rejected' && (
                <div className="affiliation-grid-full bg-red-50 border border-red-200 rounded-lg p-3 mt-4 flex items-start gap-2">
                  <i className="pi pi-info-circle text-red-500 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-red-800">
                      Deficiency / Rejection Reason:
                    </h5>
                    <p className="text-sm text-red-700 mt-1">
                      {sectionRemarks[4] || 'No reason entered yet.'}
                    </p>
                  </div>
                </div>
              )}
            </PreviewSection>

            <PreviewSection
              step={5}
              title="Compliance & Funding"
              subtitle="Statutory guidelines and approvals status."
              headerAction={renderSectionAction(5)}
            >
              <FormGrid columns={3}>
                <PreviewField
                  label="Source of Funding"
                  value={preview.sourceOfFunding}
                />
                <PreviewField
                  label="Annual Projected Income"
                  value={preview.annualProjectedIncome}
                />
                <PreviewField
                  label="Accounts Audited"
                  value={preview.accountsAudited}
                />
                <PreviewField
                  label="Statute 28 Fulfilled"
                  value={preview.statute28Fulfilled}
                />
                <PreviewField
                  label="Endowment Fund"
                  value={preview.endowmentFundDetails}
                />
              </FormGrid>
              <div className="mt-2">
                <PreviewField
                  label="MP Govt Permission Details"
                  value={preview.mpGovtPermission}
                  fullWidth
                />
              </div>
              {sectionStatuses[5] === 'rejected' && (
                <div className="affiliation-grid-full bg-red-50 border border-red-200 rounded-lg p-3 mt-4 flex items-start gap-2">
                  <i className="pi pi-info-circle text-red-500 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-red-800">
                      Deficiency / Rejection Reason:
                    </h5>
                    <p className="text-sm text-red-700 mt-1">
                      {sectionRemarks[5] || 'No reason entered yet.'}
                    </p>
                  </div>
                </div>
              )}
            </PreviewSection>

            <PreviewSection
              step={6}
              title="Uploaded Documents"
              subtitle="Scanned copies of enclosures submitted by the college."
              headerAction={renderSectionAction(6)}
            >
              <FormGrid columns={2}>
                <PreviewField
                  label="Scanned copy of Affidavit"
                  value={
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        ToastService.success(
                          'Downloading Affidavit_Draft.pdf...'
                        );
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1.5"
                    >
                      <i className="pi pi-file-pdf text-red-500 text-base" />
                      <span>Affidavit_Draft.pdf</span>
                    </a>
                  }
                />
                <PreviewField
                  label="Other Documents"
                  value={
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        ToastService.success(
                          'Downloading Regular_Authority_NOC.pdf...'
                        );
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1.5"
                    >
                      <i className="pi pi-file-pdf text-red-500 text-base" />
                      <span>Regular_Authority_NOC.pdf</span>
                    </a>
                  }
                />
              </FormGrid>
              {sectionStatuses[6] === 'rejected' && (
                <div className="affiliation-grid-full bg-red-50 border border-red-200 rounded-lg p-3 mt-4 flex items-start gap-2">
                  <i className="pi pi-info-circle text-red-500 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-red-800">
                      Deficiency / Rejection Reason:
                    </h5>
                    <p className="text-sm text-red-700 mt-1">
                      {sectionRemarks[6] || 'No reason entered yet.'}
                    </p>
                  </div>
                </div>
              )}
            </PreviewSection>
          </div>
        ) : (
          <p>No preview data available.</p>
        )}
      </FormPopup>

      <FormPopup
        visible={rejectingSectionId !== null}
        onHide={() => setRejectingSectionId(null)}
        title={`Reject Section ${rejectingSectionId}`}
        subtitle="Provide the reason for rejecting this section of the college profile."
        size="default"
        footer={
          <>
            <Button
              label="Cancel"
              variant="outlined"
              onClick={() => setRejectingSectionId(null)}
            />
            <Button
              label="Save Rejection"
              variant="danger"
              disabled={!tempReason.trim()}
              onClick={() => {
                if (rejectingSectionId !== null) {
                  setSectionStatuses(prev => ({
                    ...prev,
                    [rejectingSectionId]: 'rejected',
                  }));
                  setSectionRemarks(prev => ({
                    ...prev,
                    [rejectingSectionId]: tempReason,
                  }));
                  setRejectingSectionId(null);
                }
              }}
            />
          </>
        }
      >
        <div className="flex flex-col gap-2 p-4">
          <label className="text-sm font-semibold text-gray-700">
            Deficiency / Rejection Reason *
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            rows={4}
            placeholder="Enter the deficiency details or reason for rejecting this section..."
            value={tempReason}
            onChange={e => setTempReason(e.target.value)}
            required
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
