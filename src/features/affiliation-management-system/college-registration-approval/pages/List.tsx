import { useMemo, useState } from 'react';
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
                <Button
                  label="Reject"
                  icon="times"
                  variant="danger"
                  disabled={isPending}
                  onClick={handleRejectFromPreview}
                />

                <Button
                  label="Approve"
                  icon="check"
                  variant="primary"
                  isLoading={isPending}
                  onClick={handleApproveFromPreview}
                />
              </>
            )}
          </>
        }
      >
        {isPreviewLoading ? (
          <Loader />
        ) : previewData ? (
          <div className="registration-preview-content">
            <PreviewSummary
              items={[
                {
                  label: 'College Name',
                  value: previewData.collegeName,
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
              title="College Details"
              subtitle="Basic registration and contact information."
            >
              <FormGrid columns={3}>
                <PreviewField
                  label="College Code"
                  value={previewData.collegeCode}
                />
                <PreviewField
                  label="Establishment Year"
                  value={previewData.establishmentYearId}
                />
                <PreviewField
                  label="College Name"
                  value={previewData.collegeName}
                />
                <PreviewField
                  label="District"
                  value={previewData.districtName}
                />
                <PreviewField
                  label="College Address"
                  value={previewData.collegeAddress}
                  fullWidth
                />
                <PreviewField
                  label="Telephone No."
                  value={previewData.telephoneNo}
                />
                <PreviewField
                  label="College Email"
                  value={previewData.collegeEmail}
                  breakWord
                />
                <PreviewField
                  label="College Category"
                  value={previewData.collegeCategoryId}
                />
                <PreviewField
                  label="College Type"
                  value={previewData.collegeTypeId}
                />
                <PreviewField
                  label="College Area"
                  value={previewData.collegeArea}
                />
                <PreviewField
                  label="Accommodation Type"
                  value={previewData.accommodationType}
                />
                <PreviewField
                  label="Number of Classrooms"
                  value={previewData.numberOfClassRooms}
                />
                <PreviewField
                  label="Any Deficiency"
                  value={
                    previewData.deficiencyEarlierRaisedByCommittee
                      ? 'Yes'
                      : 'No'
                  }
                />
                <PreviewField
                  label="Available Facilities"
                  value={
                    previewData.availableFacilities?.length
                      ? previewData.availableFacilities.join(', ')
                      : undefined
                  }
                  fullWidth
                />
              </FormGrid>
            </PreviewSection>

            {previewData.otherDetail && (
              <PreviewSection
                step={2}
                title="Other Details"
                subtitle="Principal, society, and registration information."
              >
                <FormGrid columns={3}>
                  <PreviewField
                    label="Principal Name"
                    value={previewData.otherDetail.principalDirectorName}
                  />
                  <PreviewField
                    label="Mobile No."
                    value={previewData.otherDetail.principalMobileNo}
                  />
                  <PreviewField
                    label="Email"
                    value={previewData.otherDetail.principalEmail}
                    breakWord
                  />
                  <PreviewField
                    label="Society Name"
                    value={previewData.otherDetail.societyName}
                  />
                  <PreviewField
                    label="Secretary Name"
                    value={previewData.otherDetail.secretaryName}
                  />
                  <PreviewField
                    label="Society Registration No."
                    value={previewData.otherDetail.societyRegistrationNo}
                  />
                  <PreviewField
                    label="Society Date of Registration"
                    value={
                      previewData.otherDetail.societyRegistrationDate
                        ? formatDate(
                            previewData.otherDetail.societyRegistrationDate
                          )
                        : undefined
                    }
                  />
                  <PreviewField
                    label="Other Institution Running"
                    value={
                      previewData.otherDetail.isOtherInstitutionRunning
                        ? 'Yes'
                        : 'No'
                    }
                  />
                </FormGrid>
              </PreviewSection>
            )}

            <PreviewSection
              step={3}
              title="Course Details"
              subtitle="Programme fee mapping and payment information."
            >
              <GridPanel
                data={previewData.courseDetails ?? []}
                pagination={false}
                emptyMessage="No course details available."
                columns={[
                  {
                    field: 'collegeCourseDetailId',
                    header: 'Course Detail ID',
                  },
                  {
                    field: 'programmeFeesMappingId',
                    header: 'Programme/Fees Mapping ID',
                  },
                  {
                    field: 'totalAmount',
                    header: 'Total Amount',
                    cell: course => <span>₹{course.totalAmount}</span>,
                  },
                  {
                    field: 'isFeePaid',
                    header: 'Fee Paid',
                    cell: course => (
                      <span>{course.isFeePaid ? 'Yes' : 'No'}</span>
                    ),
                  },
                ]}
              />
            </PreviewSection>

            <PreviewSection
              step={4}
              title="Enclosures"
              subtitle="Documents submitted with the registration."
            >
              {previewData.documents?.length ? (
                <div className="registration-document-list">
                  {previewData.documents?.map(document => (
                    <div
                      key={document.collegeAffiliationDocumentId}
                      className="registration-document-item"
                    >
                      <span className="registration-document-icon">
                        <i className="pi pi-file" />
                      </span>

                      <div className="registration-document-content">
                        <p className="registration-document-title">
                          {document.documentType || 'Document'}
                        </p>

                        <p className="registration-document-id">
                          {document.documentId || 'N/A'}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="registration-document-download"
                        aria-label={`Download ${document.documentType || 'document'}`}
                        title="Download document"
                      >
                        <i className="pi pi-download" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="registration-empty-text">
                  No documents available.
                </p>
              )}
            </PreviewSection>
          </div>
        ) : (
          <p>No preview data available.</p>
        )}
      </FormPopup>
    </FormPage>
  );
}
