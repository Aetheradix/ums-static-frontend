import { useState } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  FormActions,
  GridPanel,
  StatusBadge,
  PreviewField,
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setErrors({});
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.complianceName.trim())
      newErrors.complianceName = 'Compliance Name is required';
    if (!formData.submittedBy.trim())
      newErrors.submittedBy = 'Submitted By is required';
    if (!formData.department.trim())
      newErrors.department = 'Department is required';
    if (!formData.remarks.trim()) newErrors.remarks = 'Remarks are required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (isEditMode && editingId) {
      setSubmissions(prev =>
        prev.map(sub =>
          sub.id === editingId
            ? {
                ...sub,
                complianceName: formData.complianceName,
                submittedBy: formData.submittedBy,
                department: formData.department,
                documents: formData.documents.split(',').map(d => d.trim()),
                remarks: formData.remarks,
              }
            : sub
        )
      );
    } else {
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
    }
    setShowForm(false);
    resetForm();
  };

  const handleEdit = (item: ComplianceSubmission) => {
    setFormData({
      complianceName: item.complianceName,
      submittedBy: item.submittedBy,
      department: item.department,
      documents: item.documents.join(', '),
      remarks: item.remarks || '',
    });
    setEditingId(item.id);
    setIsEditMode(true);
    setShowForm(true);
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
      <FormCard title="All Submissions" icon="file">
        <GridPanel
          data={submissions}
          columns={[
            { field: 'id', header: 'Sub ID', width: '120px' },
            { field: 'complianceName', header: 'Compliance' },
            { field: 'submittedBy', header: 'Submitted By' },
            { field: 'department', header: 'Department' },
            {
              field: 'submittedDate',
              header: 'Submitted',
              width: '110px',
              cell: (item: any) => {
                if (!item.submittedDate) return '';
                const parts = item.submittedDate.split('-');
                if (parts.length === 3) {
                  return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return item.submittedDate;
              },
            },
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
                <div className="flex gap-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-lg transition-colors p-1"
                    onClick={() => handleView(item)}
                    title="View"
                  >
                    <i className="pi pi-eye"></i>
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800 text-lg transition-colors p-1"
                    onClick={() => handleEdit(item)}
                    title="Edit"
                  >
                    <i className="pi pi-pencil"></i>
                  </button>
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search submissions..."
        />
      </FormCard>

      {/* ── Submit Form ── */}
      <FormPopup
        title={isEditMode ? 'Update Compliance' : 'Submit Compliance'}
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          resetForm();
        }}
        footer={
          <FormActions
            isEditMode={isEditMode}
            onSave={handleSubmit}
            onReset={resetForm}
            saveLabel={isEditMode ? 'Update' : 'Submit'}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Compliance Name <span className="text-red-500">*</span>
            </label>
            <InputText
              value={formData.complianceName}
              onChange={e => {
                setFormData({ ...formData, complianceName: e.target.value });
                if (errors.complianceName)
                  setErrors({ ...errors, complianceName: '' });
              }}
              placeholder="Enter compliance name"
              className={`w-full ${errors.complianceName ? 'p-invalid' : ''}`}
            />
            {errors.complianceName && (
              <small className="text-red-500">{errors.complianceName}</small>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Submitted By <span className="text-red-500">*</span>
            </label>
            <InputText
              value={formData.submittedBy}
              onChange={e => {
                setFormData({ ...formData, submittedBy: e.target.value });
                if (errors.submittedBy)
                  setErrors({ ...errors, submittedBy: '' });
              }}
              placeholder="Enter name"
              className={`w-full ${errors.submittedBy ? 'p-invalid' : ''}`}
            />
            {errors.submittedBy && (
              <small className="text-red-500">{errors.submittedBy}</small>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Department <span className="text-red-500">*</span>
            </label>
            <InputText
              value={formData.department}
              onChange={e => {
                setFormData({ ...formData, department: e.target.value });
                if (errors.department) setErrors({ ...errors, department: '' });
              }}
              placeholder="Enter department"
              className={`w-full ${errors.department ? 'p-invalid' : ''}`}
            />
            {errors.department && (
              <small className="text-red-500">{errors.department}</small>
            )}
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
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm font-semibold text-gray-700">
            Remarks <span className="text-red-500">*</span>
          </label>
          <InputTextarea
            value={formData.remarks}
            onChange={e => {
              setFormData({ ...formData, remarks: e.target.value });
              if (errors.remarks) setErrors({ ...errors, remarks: '' });
            }}
            rows={3}
            placeholder="Enter remarks..."
            className={`w-full ${errors.remarks ? 'p-invalid' : ''}`}
          />
          {errors.remarks && (
            <small className="text-red-500">{errors.remarks}</small>
          )}
        </div>
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
          <div className="space-y-6">
            <FormGrid columns={2}>
              <PreviewField
                label="Compliance"
                value={previewItem.complianceName}
              />
              <PreviewField
                label="Submitted By"
                value={previewItem.submittedBy}
              />
              <PreviewField label="Department" value={previewItem.department} />
              <PreviewField
                label="Status"
                value={
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
                }
              />
            </FormGrid>

            {previewItem.documents && previewItem.documents.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                  Documents
                </span>
                <div className="flex flex-col gap-3">
                  {previewItem.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 border border-blue-100 rounded-xl bg-blue-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <i className="pi pi-file-pdf text-red-500 text-xl"></i>
                        <span className="text-sm font-medium text-blue-600">
                          {doc}
                        </span>
                      </div>
                      <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                        <i className="pi pi-download"></i>
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewItem.remarks && (
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                  Remarks
                </span>
                <div className="p-4 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm leading-relaxed shadow-sm">
                  {previewItem.remarks}
                </div>
              </div>
            )}

            {previewItem.verificationRemarks && (
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                  Verification Remarks
                </span>
                <div
                  className={`p-4 border rounded-xl text-sm leading-relaxed shadow-sm ${
                    previewItem.status === 'Rejected'
                      ? 'bg-red-50/50 border-red-200 text-red-700'
                      : 'bg-green-50/50 border-green-200 text-green-700'
                  }`}
                >
                  {previewItem.verificationRemarks}
                </div>
              </div>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
