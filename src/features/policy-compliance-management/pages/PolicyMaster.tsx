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
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'shared/components/buttons';
import {
  INITIAL_POLICIES,
  POLICY_CATEGORIES,
  DEPARTMENT_OPTIONS,
  APPLICABLE_TO_OPTIONS,
  type Policy,
} from '../data';

export default function PolicyMaster() {
  const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES);
  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPolicy, setPreviewPolicy] = useState<Policy | null>(null);

  // ── Form State ────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    description: '',
    effectiveDate: null as Date | null,
    expiryDate: null as Date | null,
    department: '',
    applicableTo: [] as string[],
    versionNumber: '1.0',
    attachment: '',
    approvalRequired: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      category: '',
      description: '',
      effectiveDate: null,
      expiryDate: null,
      department: '',
      applicableTo: [],
      versionNumber: '1.0',
      attachment: '',
      approvalRequired: true,
    });
    setEditingPolicy(null);
    setErrors({});
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormData({
      name: policy.name,
      code: policy.code,
      category: policy.category,
      description: policy.description,
      effectiveDate: new Date(policy.effectiveDate),
      expiryDate: policy.expiryDate ? new Date(policy.expiryDate) : null,
      department: policy.department,
      applicableTo: policy.applicableTo,
      versionNumber: policy.versionNumber,
      attachment: policy.attachment || '',
      approvalRequired: policy.approvalRequired,
    });
    setShowForm(true);
  };

  const handleView = (policy: Policy) => {
    setPreviewPolicy(policy);
    setShowPreview(true);
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Policy Name is required';
    if (!formData.code.trim()) newErrors.code = 'Policy Code is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.effectiveDate)
      newErrors.effectiveDate = 'Effective Date is required';
    if (formData.applicableTo.length === 0)
      newErrors.applicableTo = 'At least one applicable group is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingPolicy) {
      setPolicies(prev =>
        prev.map(p =>
          p.id === editingPolicy.id
            ? {
                ...p,
                ...formData,
                effectiveDate: formData.effectiveDate
                  ? formData.effectiveDate.toISOString().split('T')[0]
                  : p.effectiveDate,
                expiryDate: formData.expiryDate
                  ? formData.expiryDate.toISOString().split('T')[0]
                  : undefined,
              }
            : p
        )
      );
    } else {
      const newPolicy: Policy = {
        id: `POL-${String(policies.length + 1).padStart(3, '0')}`,
        name: formData.name,
        code: formData.code,
        category: formData.category,
        description: formData.description,
        effectiveDate: formData.effectiveDate
          ? formData.effectiveDate.toISOString().split('T')[0]
          : '',
        expiryDate: formData.expiryDate
          ? formData.expiryDate.toISOString().split('T')[0]
          : undefined,
        department: formData.department,
        applicableTo: formData.applicableTo,
        versionNumber: formData.versionNumber,
        attachment: formData.attachment || undefined,
        approvalRequired: formData.approvalRequired,
        status: 'Draft',
        createdBy: 'Current Admin User',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setPolicies(prev => [...prev, newPolicy]);
    }
    setShowForm(false);
    resetForm();
  };

  const categoryOptions = POLICY_CATEGORIES.map(c => ({
    label: c.name,
    value: c.name,
  }));

  const departmentOptions = DEPARTMENT_OPTIONS.map(d => ({
    label: d,
    value: d,
  }));

  const applicableOptions = APPLICABLE_TO_OPTIONS.map(a => ({
    label: a,
    value: a,
  }));

  return (
    <FormPage
      title="Policy Master"
      description="Create and manage university policies — all policies start as Draft"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Policies' },
      ]}
      headerAction={
        <Button label="Create New Policy" icon="add" onClick={handleCreate} />
      }
    >
      <FormCard title="All Policies" icon="file">
        <GridPanel
          data={policies}
          columns={[
            { field: 'id', header: 'Policy ID', width: '100px' },
            { field: 'code', header: 'Code', width: '120px' },
            { field: 'name', header: 'Policy Name' },
            { field: 'category', header: 'Category' },
            { field: 'department', header: 'Department' },
            { field: 'versionNumber', header: 'Ver.', width: '60px' },
            {
              field: 'status',
              header: 'Status',
              cell: (item: any) => {
                const variant =
                  item.status === 'Published'
                    ? 'approved'
                    : item.status === 'Draft'
                      ? 'neutral'
                      : item.status === 'Under Review' ||
                          item.status === 'Reviewed'
                        ? 'pending'
                        : item.status === 'Rejected'
                          ? 'rejected'
                          : 'neutral';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              field: 'effectiveDate',
              header: 'Effective Date',
              cell: (item: any) => {
                if (!item.effectiveDate) return '';
                const parts = item.effectiveDate.split('-');
                if (parts.length === 3) {
                  return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return item.effectiveDate;
              },
            },
            {
              field: 'actions',
              header: 'Actions',
              width: '100px',
              cell: (item: any) => (
                <div className="flex items-center gap-4">
                  <button
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    onClick={() => handleView(item)}
                    title="View"
                  >
                    <i className="pi pi-eye text-[18px]"></i>
                  </button>
                  <button
                    className="text-gray-500 hover:text-amber-600 transition-colors"
                    onClick={() => handleEdit(item)}
                    title="Edit"
                  >
                    <i className="pi pi-pencil text-[18px]"></i>
                  </button>
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search policies..."
        />
      </FormCard>

      {/* ── Create/Edit Form Popup ── */}
      <FormPopup
        title={editingPolicy ? 'Edit Policy' : 'Create New Policy'}
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          resetForm();
        }}
        size="lg"
      >
        <div className="space-y-6">
          {/* Basic Details Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 border-b pb-2">
              Basic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Policy Name <span className="text-red-500">*</span>
                </label>
                <InputText
                  value={formData.name}
                  onChange={e => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g. Anti-Ragging Policy"
                  className={errors.name ? 'w-full p-invalid' : 'w-full'}
                />
                {errors.name && (
                  <small className="text-red-500 mt-0.5">{errors.name}</small>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Policy Code <span className="text-red-500">*</span>
                </label>
                <InputText
                  value={formData.code}
                  onChange={e => {
                    setFormData({ ...formData, code: e.target.value });
                    if (errors.code) setErrors({ ...errors, code: '' });
                  }}
                  placeholder="e.g. ARP-2026"
                  className={errors.code ? 'w-full p-invalid' : 'w-full'}
                />
                {errors.code && (
                  <small className="text-red-500 mt-0.5">{errors.code}</small>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  value={formData.category}
                  options={categoryOptions}
                  onChange={e => {
                    setFormData({ ...formData, category: e.value });
                    if (errors.category) setErrors({ ...errors, category: '' });
                  }}
                  placeholder="Select Category"
                  className={errors.category ? 'w-full p-invalid' : 'w-full'}
                />
                {errors.category && (
                  <small className="text-red-500 mt-0.5">
                    {errors.category}
                  </small>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  value={formData.department}
                  options={departmentOptions}
                  onChange={e => {
                    setFormData({ ...formData, department: e.value });
                    if (errors.department)
                      setErrors({ ...errors, department: '' });
                  }}
                  placeholder="Select Department"
                  className={errors.department ? 'w-full p-invalid' : 'w-full'}
                />
                {errors.department && (
                  <small className="text-red-500 mt-0.5">
                    {errors.department}
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* Applicability & Lifecycle Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 border-b pb-2 mt-2">
              Applicability & Lifecycle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Effective Date <span className="text-red-500">*</span>
                </label>
                <Calendar
                  value={formData.effectiveDate}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      effectiveDate: e.value as Date,
                    });
                    if (errors.effectiveDate)
                      setErrors({ ...errors, effectiveDate: '' });
                  }}
                  dateFormat="dd-mm-yy"
                  placeholder="Select Date"
                  showIcon
                  className={
                    errors.effectiveDate ? 'w-full p-invalid' : 'w-full'
                  }
                />
                {errors.effectiveDate && (
                  <small className="text-red-500 mt-0.5">
                    {errors.effectiveDate}
                  </small>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Expiry Date (Optional)
                </label>
                <Calendar
                  value={formData.expiryDate}
                  onChange={e =>
                    setFormData({ ...formData, expiryDate: e.value as Date })
                  }
                  dateFormat="dd-mm-yy"
                  placeholder="Select Date"
                  showIcon
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Applicable To <span className="text-red-500">*</span>
                </label>
                <MultiSelect
                  value={formData.applicableTo}
                  options={applicableOptions}
                  onChange={e => {
                    setFormData({ ...formData, applicableTo: e.value });
                    if (errors.applicableTo)
                      setErrors({ ...errors, applicableTo: '' });
                  }}
                  placeholder="Select groups"
                  display="chip"
                  className={
                    errors.applicableTo ? 'w-full p-invalid' : 'w-full'
                  }
                />
                {errors.applicableTo && (
                  <small className="text-red-500 mt-0.5">
                    {errors.applicableTo}
                  </small>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Version Number
                </label>
                <InputText
                  value={formData.versionNumber}
                  onChange={e =>
                    setFormData({ ...formData, versionNumber: e.target.value })
                  }
                  placeholder="e.g. 1.0"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 border-b pb-2 mt-2">
              Additional Information
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <InputTextarea
                  value={formData.description}
                  onChange={e => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description)
                      setErrors({ ...errors, description: '' });
                  }}
                  rows={3}
                  placeholder="Provide a brief description of the policy..."
                  className={
                    errors.description
                      ? 'w-full resize-none p-invalid'
                      : 'w-full resize-none'
                  }
                />
                {errors.description && (
                  <small className="text-red-500 mt-0.5">
                    {errors.description}
                  </small>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Upload Policy Document (PDF/Word)
                </label>
                <div className="border border-dashed border-gray-300 p-4 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center gap-2">
                  <i className="pi pi-cloud-upload text-3xl text-gray-400"></i>
                  <span className="text-sm text-gray-600">
                    {formData.attachment
                      ? formData.attachment
                      : 'Drag and drop or click to browse'}
                  </span>
                  <FileUpload
                    mode="basic"
                    accept=".pdf,.doc,.docx"
                    maxFileSize={10000000}
                    customUpload
                    auto
                    chooseLabel="Browse Files"
                    className="p-button-outlined p-button-sm mt-2"
                    uploadHandler={e => {
                      setFormData({ ...formData, attachment: e.files[0].name });
                      e.options.clear();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Settings Box */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex items-center justify-between mt-4">
            <div>
              <label className="text-sm font-bold text-slate-800 block mb-1">
                Approval Workflow
              </label>
              <span className="text-xs text-slate-500">
                Require multi-level approval before publishing this policy.
              </span>
            </div>
            <InputSwitch
              checked={formData.approvalRequired}
              onChange={e =>
                setFormData({ ...formData, approvalRequired: e.value })
              }
            />
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <FormActions
              isEditMode={!!editingPolicy}
              onSave={handleSave}
              onReset={resetForm}
            />
          </div>
        </div>
      </FormPopup>

      {/* ── Policy Preview ── */}
      <FormPopup
        title="Policy Details"
        visible={showPreview}
        onHide={() => {
          setShowPreview(false);
          setPreviewPolicy(null);
        }}
      >
        {previewPolicy && (
          <div className="space-y-6">
            <FormGrid columns={2}>
              <PreviewField label="Policy ID" value={previewPolicy.id} />
              <PreviewField label="Policy Code" value={previewPolicy.code} />
              <PreviewField label="Policy Name" value={previewPolicy.name} />
              <PreviewField label="Category" value={previewPolicy.category} />
              <PreviewField
                label="Department"
                value={previewPolicy.department}
              />

              <PreviewField
                label="Status"
                value={
                  <StatusBadge
                    label={previewPolicy.status}
                    variant={
                      previewPolicy.status === 'Published'
                        ? 'approved'
                        : previewPolicy.status === 'Rejected'
                          ? 'rejected'
                          : previewPolicy.status === 'Draft'
                            ? 'neutral'
                            : 'pending'
                    }
                  />
                }
              />

              <PreviewField
                label="Effective Date"
                value={previewPolicy.effectiveDate}
              />
              <PreviewField
                label="Expiry Date"
                value={previewPolicy.expiryDate || 'N/A'}
              />
              <PreviewField
                label="Version"
                value={previewPolicy.versionNumber}
              />
              <PreviewField
                label="Created By"
                value={previewPolicy.createdBy}
              />
            </FormGrid>

            <PreviewField
              label="Description"
              value={previewPolicy.description}
              fullWidth
            />

            <PreviewField
              label="Applicable To"
              value={
                <div className="flex gap-2 flex-wrap mt-1">
                  {previewPolicy.applicableTo.map(a => (
                    <span
                      key={a}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              }
              fullWidth
            />

            {previewPolicy.reviewerComments && (
              <PreviewField
                label="Reviewer Comments"
                value={
                  <span className="italic text-gray-800">
                    "{previewPolicy.reviewerComments}"
                  </span>
                }
                fullWidth
              />
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
