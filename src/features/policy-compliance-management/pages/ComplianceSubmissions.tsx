import { useState } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  FormActions,
  GridPanel,
  StatusBadge,
} from 'shared/new-components';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'shared/components/buttons';
import {
  INITIAL_COMPLIANCE_SUBMISSIONS,
  type ComplianceSubmission,
} from '../data';

export default function ComplianceSubmissions() {
  const [submissions, setSubmissions] = useState<ComplianceSubmission[]>(
    INITIAL_COMPLIANCE_SUBMISSIONS
  );
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<ComplianceSubmission | null>(
    null
  );

  const [formData, setFormData] = useState({
    complianceName: '',
    submittedBy: '',
    department: '',
    documents: '',
    remarks: '',
  });

  const resetForm = () => {
    setFormData({
      complianceName: '',
      submittedBy: '',
      department: '',
      documents: '',
      remarks: '',
    });
  };

  const handleSubmit = () => {
    const newSubmission: ComplianceSubmission = {
      id: `SUB-${String(submissions.length + 1).padStart(3, '0')}`,
      assignmentId: `ASGN-${String(submissions.length + 1).padStart(3, '0')}`,
      complianceName: formData.complianceName,
      submittedBy: formData.submittedBy,
      department: formData.department,
      documents: formData.documents.split(',').map(d => d.trim()),
      remarks: formData.remarks,
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
    };
    setSubmissions(prev => [...prev, newSubmission]);
    setShowForm(false);
    resetForm();
  };

  const handleView = (item: ComplianceSubmission) => {
    setPreviewItem(item);
    setShowPreview(true);
  };

  return (
    <FormPage
      title="Compliance Submissions"
      description="Submit compliance documents, reports, certificates, and evidence"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Compliance Submissions' },
      ]}
      headerAction={
        <Button
          label="Submit Compliance"
          icon="upload"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        />
      }
    >
      <FormCard title="All Submissions" icon="upload_file">
        <GridPanel
          data={submissions}
          columns={[
            { field: 'id', header: 'Sub ID', width: '90px' },
            { field: 'complianceName', header: 'Compliance' },
            { field: 'submittedBy', header: 'Submitted By' },
            { field: 'department', header: 'Department' },
            { field: 'submittedDate', header: 'Submitted', width: '110px' },
            {
              field: 'status',
              header: 'Status',
              width: '140px',
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
              width: '100px',
              cell: (item: any) => (
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => handleView(item)}
                >
                  <i className="pi pi-eye mr-1"></i>View
                </button>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search submissions..."
        />
      </FormCard>

      {/* ── Submit Form ── */}
      <FormPopup
        title="Submit Compliance"
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          resetForm();
        }}
      >
        <FormGrid columns={2}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Compliance Name *
            </label>
            <InputText
              value={formData.complianceName}
              onChange={e =>
                setFormData({ ...formData, complianceName: e.target.value })
              }
              placeholder="Enter compliance name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Submitted By *
            </label>
            <InputText
              value={formData.submittedBy}
              onChange={e =>
                setFormData({ ...formData, submittedBy: e.target.value })
              }
              placeholder="Enter name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Department *
            </label>
            <InputText
              value={formData.department}
              onChange={e =>
                setFormData({ ...formData, department: e.target.value })
              }
              placeholder="Enter department"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Documents (comma separated)
            </label>
            <InputText
              value={formData.documents}
              onChange={e =>
                setFormData({ ...formData, documents: e.target.value })
              }
              placeholder="e.g. report.pdf, certificate.pdf"
            />
          </div>
        </FormGrid>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm font-semibold text-gray-700">Remarks</label>
          <InputTextarea
            value={formData.remarks}
            onChange={e =>
              setFormData({ ...formData, remarks: e.target.value })
            }
            rows={3}
            placeholder="Enter remarks..."
          />
        </div>
        <FormActions
          onSave={handleSubmit}
          onReset={resetForm}
          saveLabel="Submit"
        />
      </FormPopup>

      {/* ── Preview Dialog ── */}
      <FormPopup
        title={`Submission: ${previewItem?.id || ''}`}
        visible={showPreview}
        onHide={() => {
          setShowPreview(false);
          setPreviewItem(null);
        }}
      >
        {previewItem && (
          <div className="space-y-4">
            <FormGrid columns={2}>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Compliance
                </span>
                <span className="text-sm font-medium">
                  {previewItem.complianceName}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Submitted By
                </span>
                <span className="text-sm font-medium">
                  {previewItem.submittedBy}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Department
                </span>
                <span className="text-sm font-medium">
                  {previewItem.department}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Status
                </span>
                <StatusBadge
                  label={previewItem.status}
                  variant={
                    previewItem.status === 'Verified'
                      ? 'approved'
                      : previewItem.status === 'Rejected'
                        ? 'rejected'
                        : 'pending'
                  }
                />
              </div>
            </FormGrid>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Documents
              </span>
              <div className="flex flex-col gap-2">
                {previewItem.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <i className="pi pi-file text-blue-500"></i>
                    <span className="text-sm text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Remarks
              </span>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {previewItem.remarks}
              </p>
            </div>

            {previewItem.verificationRemarks && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Verification Remarks
                </span>
                <p
                  className={`text-sm p-3 rounded-lg ${
                    previewItem.status === 'Rejected'
                      ? 'text-red-700 bg-red-50'
                      : 'text-green-700 bg-green-50'
                  }`}
                >
                  {previewItem.verificationRemarks}
                </p>
              </div>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
