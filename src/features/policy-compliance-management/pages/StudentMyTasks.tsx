import { useState } from 'react';
import {
  FormCard,
  FormPage,
  FormPopup,
  GridPanel,
  StatusBadge,
  Stepper,
  FormActions,
} from 'shared/new-components';
import { Button } from 'shared/components/buttons';

import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { type ComplianceAssignment } from '../data';

export default function StudentMyTasks() {
  const studentInfo = {
    id: 'STU2024CS0120',
    name: 'Aditya Pratap Singh',
    department: 'Computer Science',
    ipAddress: '192.168.1.105',
  };

  const [assignments, setAssignments] = useState<ComplianceAssignment[]>([
    {
      id: 'ASGN-STU-001',
      complianceId: 'COMP-001',
      complianceName: 'Anti Ragging Declaration',
      assignedTo: studentInfo.name,
      assignedType: 'Student',
      deadline: '2026-07-31',
      status: 'Pending',
      assignedDate: '2026-06-15',
    },
    {
      id: 'ASGN-STU-002',
      complianceId: 'COMP-102',
      complianceName: 'Hostel Undertaking',
      assignedTo: studentInfo.name,
      assignedType: 'Student',
      deadline: '2026-08-10',
      status: 'Under Verification',
      assignedDate: '2026-07-01',
    },
  ]);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<ComplianceAssignment | null>(null);
  const [submitForm, setSubmitForm] = useState({ documents: '', remarks: '' });
  const [formErrors, setFormErrors] = useState({ documents: '', remarks: '' });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [trackAssignment, setTrackAssignment] =
    useState<ComplianceAssignment | null>(null);

  const handleOpenSubmit = (item: ComplianceAssignment) => {
    setSelectedAssignment(item);
    setSubmitForm({ documents: '', remarks: '' });
    setFormErrors({ documents: '', remarks: '' });
    setShowSubmitModal(true);
  };

  const handleSubmitCompliance = () => {
    if (!selectedAssignment) return;

    const errors = { documents: '', remarks: '' };
    let hasError = false;

    if (!submitForm.documents) {
      errors.documents = 'Please upload the required document.';
      hasError = true;
    }
    if (!submitForm.remarks.trim()) {
      errors.remarks = 'Remarks are mandatory.';
      hasError = true;
    }

    setFormErrors(errors);

    if (hasError) return;

    setAssignments(prev =>
      prev.map(a =>
        a.id === selectedAssignment.id ? { ...a, status: 'Submitted' } : a
      )
    );

    // Normally we'd also add to submissions state here, but since history is on another page,
    // we assume it hits an API which the history page fetches.
    setShowSubmitModal(false);
    setSelectedAssignment(null);
  };

  const handleTrackStatus = (item: ComplianceAssignment) => {
    setTrackAssignment(item);
    setShowStatusModal(true);
  };

  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Submitted':
        return 1;
      case 'Under Verification':
        return 2;
      case 'Verified':
      case 'Rejected':
        return 3;
      default:
        return 0;
    }
  };

  const trackSteps = [
    { label: 'Pending' },
    { label: 'Submitted' },
    { label: 'Under Verification' },
    { label: trackAssignment?.status === 'Rejected' ? 'Rejected' : 'Verified' },
  ];

  return (
    <FormPage
      title="My Compliance Tasks"
      description="View assigned compliance requirements, submit documents, and track status"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/my-policies',
        },
        { label: 'My Compliance Tasks' },
      ]}
    >
      <FormCard title="Assigned Compliance Tasks" icon="list">
        <GridPanel
          data={assignments}
          columns={[
            { field: 'complianceName', header: 'Task Name', width: '35%' },
            {
              field: 'deadline',
              header: 'Due Date',
              width: '130px',
              cell: (item: any) => {
                if (!item.deadline) return '';
                const parts = item.deadline.split('-');
                if (parts.length === 3) {
                  return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return item.deadline;
              },
            },
            {
              field: 'status',
              header: 'Status',
              width: '160px',
              cell: (item: any) => {
                const variant =
                  item.status === 'Verified'
                    ? 'approved'
                    : item.status === 'Rejected'
                      ? 'rejected'
                      : item.status === 'Pending'
                        ? 'neutral'
                        : 'pending';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              field: 'actions',
              header: 'Actions',
              width: '200px',
              cell: (item: any) => (
                <div className="flex gap-2">
                  {item.status === 'Pending' || item.status === 'Rejected' ? (
                    <Button
                      label="Submit"
                      icon="upload"
                      className="p-button-sm"
                      onClick={() => handleOpenSubmit(item)}
                    />
                  ) : (
                    <Button
                      label="Track Status"
                      icon="timeline"
                      variant="outlined"
                      className="p-button-sm"
                      onClick={() => handleTrackStatus(item)}
                    />
                  )}
                </div>
              ),
            },
          ]}
          searchBox={false}
        />
      </FormCard>

      {/* ── Submit Compliance Modal ── */}
      <FormPopup
        title={`Submit: ${selectedAssignment?.complianceName || ''}`}
        visible={showSubmitModal}
        onHide={() => {
          setShowSubmitModal(false);
          setSelectedAssignment(null);
        }}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <span className="text-xs font-semibold text-blue-800 uppercase">
              Due Date:{' '}
            </span>
            <span className="text-sm text-blue-900 font-bold">
              {selectedAssignment?.deadline
                ? selectedAssignment.deadline.split('-').reverse().join('-')
                : ''}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Required Documents <span className="text-red-500">*</span>
            </label>
            <FileUpload
              mode="basic"
              name="documents[]"
              url="/api/upload"
              accept=".pdf,.doc,.docx"
              maxFileSize={10000000}
              onUpload={e => {
                setSubmitForm({ ...submitForm, documents: e.files[0].name });
                if (formErrors.documents)
                  setFormErrors({ ...formErrors, documents: '' });
              }}
              onSelect={e => {
                setSubmitForm({ ...submitForm, documents: e.files[0].name });
                if (formErrors.documents)
                  setFormErrors({ ...formErrors, documents: '' });
              }}
              chooseLabel="Browse Files"
            />
            {submitForm.documents && (
              <span className="text-sm text-green-600 font-medium">
                <i className="pi pi-check-circle mr-1"></i>{' '}
                {submitForm.documents} selected
              </span>
            )}
            {formErrors.documents && (
              <span className="text-sm text-red-500 font-medium">
                {formErrors.documents}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Remarks <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              value={submitForm.remarks}
              onChange={e => {
                setSubmitForm({ ...submitForm, remarks: e.target.value });
                if (formErrors.remarks)
                  setFormErrors({ ...formErrors, remarks: '' });
              }}
              rows={3}
              placeholder="Enter any additional remarks..."
              className={formErrors.remarks ? 'p-invalid' : ''}
            />
            {formErrors.remarks && (
              <span className="text-sm text-red-500 font-medium">
                {formErrors.remarks}
              </span>
            )}
          </div>
          <FormActions
            onSave={handleSubmitCompliance}
            onReset={() => setShowSubmitModal(false)}
            saveLabel="Submit"
          />
        </div>
      </FormPopup>

      {/* ── Track Status Modal ── */}
      <FormPopup
        title="Track Submission Status"
        visible={showStatusModal}
        onHide={() => {
          setShowStatusModal(false);
          setTrackAssignment(null);
        }}
      >
        {trackAssignment && (
          <div className="space-y-6 pb-4 pt-2">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <span className="font-semibold">
                {trackAssignment.complianceName}
              </span>
              <StatusBadge
                label={trackAssignment.status}
                variant={
                  trackAssignment.status === 'Verified'
                    ? 'approved'
                    : trackAssignment.status === 'Rejected'
                      ? 'rejected'
                      : 'pending'
                }
              />
            </div>

            <Stepper
              steps={trackSteps}
              activeStep={getStatusIndex(trackAssignment.status)}
            />

            {trackAssignment.status === 'Rejected' && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
                <h4 className="font-semibold text-red-900 flex items-center gap-2">
                  <i className="pi pi-info-circle"></i> Verification Failed
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  Your submission was rejected. Please review the remarks and
                  resubmit the correct documents.
                </p>
                <div className="mt-3">
                  <Button
                    label="Resubmit"
                    icon="refresh"
                    className="p-button-sm p-button-danger"
                    onClick={() => {
                      setShowStatusModal(false);
                      handleOpenSubmit(trackAssignment);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
