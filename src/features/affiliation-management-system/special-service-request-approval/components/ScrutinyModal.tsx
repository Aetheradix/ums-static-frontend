import { useEffect, useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextArea, TextBox } from 'shared/components/forms';
import {
  FormGrid,
  FormPopup,
  PreviewField,
  PreviewSection,
  PreviewSummary,
  ReceiptDialog,
  StatusBadge,
} from 'shared/new-components';
import '../../college-registration-approval/pages/RegistrationApproval.css';
import type {
  SpecialServiceApprovalItem,
  SpecialServiceApprovalStatus,
} from '../types';

interface ScrutinyModalProps {
  visible: boolean;
  item: SpecialServiceApprovalItem | null;
  onClose: () => void;
  onSaveDecision: (
    updatedItem: SpecialServiceApprovalItem,
    decision: SpecialServiceApprovalStatus,
    orderNo: string,
    remarks: string
  ) => void;
  onRaiseDeficiency?: (id: string, remarks: string) => void;
}

export default function ScrutinyModal({
  visible,
  item,
  onClose,
  onSaveDecision,
  onRaiseDeficiency,
}: ScrutinyModalProps) {
  // Sub-dialogs
  const [isDeficiencyPopupOpen, setIsDeficiencyPopupOpen] =
    useState<boolean>(false);
  const [isApprovePopupOpen, setIsApprovePopupOpen] = useState<boolean>(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  // Approval fields
  const [orderNo, setOrderNo] = useState<string>('');
  const [approvalRemarks, setApprovalRemarks] = useState<string>('');

  // Deficiency fields
  const [deficiencyRemarks, setDeficiencyRemarks] = useState<string>('');

  useEffect(() => {
    if (item) {
      setOrderNo(
        item.committeeOrderNo ||
          `DAVV/AFF/2026/SP-${Math.floor(100 + Math.random() * 900)}`
      );
      setApprovalRemarks(
        item.scrutinyRemarks ||
          'Documents scrutinized and verified. Approved by Standing Committee.'
      );
      setDeficiencyRemarks(item.deficiencyDetails?.remarks || '');
      setIsDeficiencyPopupOpen(false);
      setIsApprovePopupOpen(false);
    }
  }, [item]);

  if (!item) return null;

  const handleConfirmApproval = () => {
    if (!orderNo.trim()) {
      ToastService.error(
        'Please enter the Committee Order / Resolution Number.'
      );
      return;
    }

    const updatedItem: SpecialServiceApprovalItem = {
      ...item,
      status: 'Approved',
      committeeOrderNo: orderNo.trim(),
      scrutinyRemarks: approvalRemarks.trim(),
      reviewedBy: 'University DCDC Standing Committee',
      reviewedDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    setIsApprovePopupOpen(false);
    onSaveDecision(updatedItem, 'Approved', orderNo, approvalRemarks);
  };

  const handleConfirmDeficiency = () => {
    if (!deficiencyRemarks.trim()) {
      ToastService.error(
        'Please enter detailed deficiency remarks and required compliance.'
      );
      return;
    }

    setIsDeficiencyPopupOpen(false);

    if (onRaiseDeficiency) {
      onRaiseDeficiency(item.id, deficiencyRemarks);
    } else {
      const updatedItem: SpecialServiceApprovalItem = {
        ...item,
        status: 'Deficiency Raised',
        scrutinyRemarks: deficiencyRemarks.trim(),
        deficiencyDetails: {
          remarks: deficiencyRemarks.trim(),
          raisedDate: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          raisedBy: 'University DCDC Standing Committee',
        },
      };
      onSaveDecision(updatedItem, 'Deficiency Raised', '', deficiencyRemarks);
    }
  };

  const mainFooter = (
    <>
      <Button label="Close" variant="outlined" onClick={onClose} />
      {item.paymentStatus === 'Paid' && (
        <Button
          label="View Receipt"
          icon="eye"
          variant="outlined"
          onClick={() => setIsReceiptOpen(true)}
        />
      )}
      <Button
        label="Raise Deficiency"
        icon="times"
        variant="danger"
        onClick={() => setIsDeficiencyPopupOpen(true)}
      />
      <Button
        label="Approve Application"
        icon="check"
        variant="primary"
        onClick={() => setIsApprovePopupOpen(true)}
      />
    </>
  );

  return (
    <>
      {/* MAIN SCRUTINY PREVIEW POPUP */}
      <FormPopup
        visible={visible}
        onHide={onClose}
        title="Registration Preview"
        subtitle="Detailed view of the special service request data."
        size="xl"
        className="registration-preview-popup"
        bodyClassName="registration-preview-body"
        footer={mainFooter}
      >
        <div className="registration-preview-content">
          {/* HEADER SUMMARY BAR (Same as college-registration-approval) */}
          <PreviewSummary
            items={[
              {
                label: 'College Name',
                value: item.collegeName,
                icon: 'building',
              },
              {
                label: 'Application Number',
                value: item.applicationNo,
                icon: 'file',
              },
              {
                label: 'Submitted Date',
                value: item.submissionDate,
                icon: 'calendar',
              },
              {
                label: 'Approval Status',
                value: (
                  <StatusBadge
                    label={item.status}
                    variant={
                      item.status === 'Approved'
                        ? 'approved'
                        : item.status === 'Deficiency Raised'
                          ? 'rejected'
                          : 'pending'
                    }
                  />
                ),
                icon: 'check-circle',
              },
            ]}
          />

          {/* ACTIVE DEFICIENCY NOTICE (IF APPLICABLE) */}
          {(item.status === 'Deficiency Raised' || item.deficiencyDetails) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 flex items-start gap-3">
              <i className="pi pi-exclamation-triangle text-red-600 text-lg mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-semibold text-red-900">
                    Deficiency Notice Issued
                  </h5>
                  <span className="text-xs text-red-600">
                    Raised:{' '}
                    {item.deficiencyDetails?.raisedDate || item.submissionDate}
                  </span>
                </div>
                <p className="text-sm text-red-800 mt-1">
                  {item.deficiencyDetails?.remarks || item.scrutinyRemarks}
                </p>
              </div>
            </div>
          )}

          {/* STEP 1: SERVICE SELECTION & FEE SCHEDULE */}
          <PreviewSection
            step={1}
            title="Service Selection & Fee Schedule"
            subtitle="Application category, session, and prescribed fee determination."
          >
            <FormGrid columns={3}>
              <PreviewField
                label="Academic Year (Session)"
                value={item.academicYear}
              />
              <PreviewField
                label="College Type"
                value={
                  item.collegeType === 'govt'
                    ? 'Government'
                    : 'Private / Unaided'
                }
              />
              <PreviewField
                label="Service / Application Type"
                value={item.serviceName}
              />
              <PreviewField
                label="Base Service Fee"
                value={
                  item.isFeeExempted
                    ? 'Nil (Exempted)'
                    : `₹${(item.baseFee || 0).toLocaleString('en-IN')}`
                }
              />
              <PreviewField
                label="Applicable GST (18%)"
                value={
                  item.isFeeExempted
                    ? 'Nil'
                    : `₹${(item.gstAmount || 0).toLocaleString('en-IN')}`
                }
              />
              <PreviewField
                label="Total Applicable Fee"
                value={
                  item.isFeeExempted
                    ? 'Nil (Exempted)'
                    : `₹${(item.feeAmount || 0).toLocaleString('en-IN')}`
                }
              />
            </FormGrid>
          </PreviewSection>

          {/* STEP 2: SERVICE DETAILS */}
          <PreviewSection
            step={2}
            title="Service Details"
            subtitle={`Specific details submitted for ${item.serviceName}.`}
          >
            {item.serviceCode === 'LOCATION_CHANGE' && (
              <>
                <FormGrid columns={2}>
                  <PreviewField
                    label="Current Registered Campus Address"
                    value={
                      item.details.currentAddress ||
                      '12, MG Road, Indore - 452001'
                    }
                    fullWidth
                  />
                  <PreviewField
                    label="New Campus Full Address"
                    value={item.details.proposedAddress}
                    fullWidth
                  />
                </FormGrid>
                <div className="mt-2">
                  <FormGrid columns={4}>
                    <PreviewField
                      label="State"
                      value={item.details.state || 'Madhya Pradesh'}
                    />
                    <PreviewField
                      label="District"
                      value={item.details.district || 'Indore'}
                    />
                    <PreviewField
                      label="Block / Tehsil"
                      value={item.details.tehsil || 'Sanwer'}
                    />
                    <PreviewField
                      label="PIN Code"
                      value={item.details.pinCode || '453551'}
                    />
                  </FormGrid>
                </div>
                <div className="mt-2">
                  <FormGrid columns={3}>
                    <PreviewField
                      label="Land Area"
                      value={
                        item.details.landArea
                          ? item.details.landArea.includes('Acre')
                            ? item.details.landArea
                            : `${item.details.landArea} Acres`
                          : '6.50 Acres'
                      }
                    />
                    <PreviewField
                      label="Khasra Numbers"
                      value={item.details.khasraNo || '14/2, 14/3, 15/1'}
                    />
                    <PreviewField
                      label="Built-up Area"
                      value={
                        item.details.builtUpArea
                          ? item.details.builtUpArea.includes('Sq')
                            ? item.details.builtUpArea
                            : `${item.details.builtUpArea} Sq. Ft.`
                          : '48,000 Sq. Ft.'
                      }
                    />
                  </FormGrid>
                </div>
              </>
            )}

            {item.serviceCode === 'NAME_CHANGE' && (
              <>
                <FormGrid columns={2}>
                  <PreviewField
                    label="Current Registered College Name"
                    value={item.details.currentCollegeName || item.collegeName}
                  />
                  <PreviewField
                    label="Proposed New College Name"
                    value={item.details.proposedCollegeName}
                  />
                </FormGrid>
                <div className="mt-2">
                  <PreviewField
                    label="Reason for Name Change"
                    value={item.details.nameChangeReason}
                    fullWidth
                  />
                </div>
              </>
            )}

            {item.serviceCode === 'SOCIETY_CHANGE' && (
              <FormGrid columns={2}>
                <PreviewField
                  label="Current Sponsoring Society"
                  value={item.details.currentSocietyName}
                />
                <PreviewField
                  label="Proposed New Society Name"
                  value={`${item.details.proposedSocietyName} (Reg: ${item.details.societyRegNo})`}
                />
              </FormGrid>
            )}

            {item.serviceCode === 'SEAT_REDUCTION' && (
              <>
                <FormGrid columns={3}>
                  <PreviewField
                    label="Targeted Course"
                    value={item.details.courseName}
                  />
                  <PreviewField
                    label="Current Approved Seats"
                    value={item.details.currentSeats}
                  />
                  <PreviewField
                    label="Proposed Reduced Seats"
                    value={item.details.proposedSeats}
                  />
                </FormGrid>
                <div className="mt-2">
                  <PreviewField
                    label="Reason for Seat Reduction"
                    value={item.details.seatReductionReason}
                    fullWidth
                  />
                </div>
              </>
            )}

            {item.serviceCode === 'COURSE_CLOSURE' && (
              <>
                <FormGrid columns={2}>
                  <PreviewField
                    label="Course for Closure"
                    value={item.details.closureCourseName}
                  />
                  <PreviewField
                    label="Last Enrolled Batch"
                    value={item.details.batchYear}
                  />
                </FormGrid>
                <div className="mt-2">
                  <PreviewField
                    label="Student Transfer & Protection Plan"
                    value={item.details.studentTransferPlan}
                    fullWidth
                  />
                </div>
              </>
            )}

            {item.serviceCode === 'COLLEGE_CLOSURE' && (
              <div className="space-y-2">
                <PreviewField
                  label="College Closure Reason"
                  value={item.details.collegeClosureReason}
                  fullWidth
                />
                <PreviewField
                  label="Staff Gratuity & Settlement NOC"
                  value={item.details.staffSettlementNoc}
                  fullWidth
                />
              </div>
            )}

            {item.serviceCode === 'ADD_ON_COURSE' && (
              <FormGrid columns={3}>
                <PreviewField
                  label="Add-on Course Title"
                  value={item.details.addonCourseTitle}
                />
                <PreviewField
                  label="Course Type"
                  value={item.details.addonCourseType}
                />
                <PreviewField
                  label="Proposed Intake Seats"
                  value={item.details.addonIntake}
                />
              </FormGrid>
            )}
          </PreviewSection>

          {/* STEP 3: MANDATORY UPLOADED DOCUMENTS */}
          <PreviewSection
            step={3}
            title="Uploaded Documents"
            subtitle="Mandatory scanned copies and enclosures submitted by the college."
          >
            <FormGrid columns={2}>
              {item.documents.map(doc => (
                <PreviewField
                  key={doc.id}
                  label={doc.documentType}
                  value={
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        ToastService.success(`Opening ${doc.name}...`);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1.5"
                    >
                      <i className="pi pi-file-pdf text-red-500 text-base" />
                      <span>{doc.name}</span>
                      <span className="text-xs text-gray-500">
                        ({doc.fileSize})
                      </span>
                    </a>
                  }
                />
              ))}
            </FormGrid>
          </PreviewSection>

          {/* STEP 4: PAYMENT & UNDERTAKING */}
          <PreviewSection
            step={4}
            title="Payment & Undertaking Details"
            subtitle="Fee payment receipt reference and Governing Body declaration."
          >
            <FormGrid columns={3}>
              <PreviewField
                label="Prescribed Fee"
                value={
                  item.isFeeExempted
                    ? 'Exempted (Nil)'
                    : `₹${item.feeAmount.toLocaleString('en-IN')}`
                }
              />
              <PreviewField label="Payment Status" value={item.paymentStatus} />
              <PreviewField
                label="Transaction Reference ID"
                value={item.transactionId || 'N/A'}
              />
              <PreviewField
                label="Payment Date"
                value={item.paymentDate || item.submissionDate}
              />
              <PreviewField
                label="Application Submission Date"
                value={item.submissionDate}
              />
              <PreviewField
                label="Governing Body Undertaking"
                value="Declaration Accepted & Authenticated under DAVV Ordinances"
              />
            </FormGrid>
          </PreviewSection>
        </div>
      </FormPopup>

      {/* DEFICIENCY RAISING POPUP DIALOG */}
      <FormPopup
        visible={isDeficiencyPopupOpen}
        onHide={() => setIsDeficiencyPopupOpen(false)}
        title={`Raise Deficiency — ${item.applicationNo}`}
        subtitle={`Notify ${item.collegeName} to rectify issues or submit missing requirements.`}
        size="default"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button
              label="Cancel"
              variant="outlined"
              size="small"
              onClick={() => setIsDeficiencyPopupOpen(false)}
            />
            <Button
              label="Submit Deficiency Notice"
              icon="times"
              variant="danger"
              size="small"
              onClick={handleConfirmDeficiency}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
            <strong>Note:</strong> Raising a deficiency will mark this request
            as <strong>"Deficiency Raised"</strong> and communicate the
            rectification notice to the college portal.
          </div>

          <div>
            <TextArea
              label="Deficiency Remarks / Required Rectification"
              value={deficiencyRemarks}
              onChange={val => setDeficiencyRemarks(val)}
              rows={4}
              placeholder="Detail the exact issues (e.g. Registered 30-year lease deed boundary mismatch, Khasra numbers map alignment pending, certified Society bylaws missing)..."
              required
            />
          </div>
        </div>
      </FormPopup>

      {/* APPROVE APPLICATION POPUP DIALOG */}
      <FormPopup
        visible={isApprovePopupOpen}
        onHide={() => setIsApprovePopupOpen(false)}
        title={`Approve Special Service Request — ${item.applicationNo}`}
        subtitle={`Grant official approval for ${item.serviceName} to ${item.collegeName}.`}
        size="default"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button
              label="Cancel"
              variant="outlined"
              size="small"
              onClick={() => setIsApprovePopupOpen(false)}
            />
            <Button
              label="Confirm & Issue Approval Order"
              icon="check"
              variant="primary"
              size="small"
              onClick={handleConfirmApproval}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
            <strong>Approval Confirmation:</strong> The application details and
            enclosures have been scrutinized and verified according to DAVV
            Ordinances.
          </div>

          <div>
            <TextBox
              label="Committee Order / Minute Number"
              value={orderNo}
              onChange={val => setOrderNo(val)}
              placeholder="e.g. DAVV/AFF/2026/SP-402"
              required
            />
          </div>

          <div>
            <TextArea
              label="Approval Remarks / Observations"
              value={approvalRemarks}
              onChange={val => setApprovalRemarks(val)}
              rows={3}
              placeholder="Standing committee resolution and approval remarks..."
            />
          </div>
        </div>
      </FormPopup>

      {/* PAYMENT RECEIPT POPUP */}
      <ReceiptDialog
        visible={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="DAVV Affiliation Cell — Payment Receipt"
        transactionId={item.transactionId || 'TXN_MPONLINE_849201'}
        amount={item.feeAmount}
        date={item.paymentDate || item.submissionDate}
      />
    </>
  );
}
