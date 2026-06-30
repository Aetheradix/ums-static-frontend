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
import { Dropdown } from 'primereact/dropdown';
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
      <FormCard title="All Policies" icon="description">
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
            { field: 'effectiveDate', header: 'Effective Date' },
            {
              field: 'actions',
              header: 'Actions',
              width: '150px',
              cell: (item: any) => (
                <div className="flex items-center gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => handleView(item)}
                  >
                    <i className="pi pi-eye mr-1"></i>View
                  </button>
                  <button
                    className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                    onClick={() => handleEdit(item)}
                  >
                    <i className="pi pi-pencil mr-1"></i>Edit
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
      >
        <FormGrid columns={2}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Policy Name *
            </label>
            <InputText
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter policy name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Policy Code *
            </label>
            <InputText
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g. ARP-2026"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Category *
            </label>
            <Dropdown
              value={formData.category}
              options={categoryOptions}
              onChange={e => setFormData({ ...formData, category: e.value })}
              placeholder="Select category"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Department *
            </label>
            <Dropdown
              value={formData.department}
              options={departmentOptions}
              onChange={e => setFormData({ ...formData, department: e.value })}
              placeholder="Select department"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Effective Date *
            </label>
            <Calendar
              value={formData.effectiveDate}
              onChange={e =>
                setFormData({ ...formData, effectiveDate: e.value as Date })
              }
              dateFormat="yy-mm-dd"
              placeholder="Select date"
              showIcon
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Expiry Date (Optional)
            </label>
            <Calendar
              value={formData.expiryDate}
              onChange={e =>
                setFormData({ ...formData, expiryDate: e.value as Date })
              }
              dateFormat="yy-mm-dd"
              placeholder="Select date"
              showIcon
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Applicable To *
            </label>
            <MultiSelect
              value={formData.applicableTo}
              options={applicableOptions}
              onChange={e =>
                setFormData({ ...formData, applicableTo: e.value })
              }
              placeholder="Select applicable groups"
              display="chip"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Version Number
            </label>
            <InputText
              value={formData.versionNumber}
              onChange={e =>
                setFormData({ ...formData, versionNumber: e.target.value })
              }
              placeholder="e.g. 1.0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Attachment (PDF/Word)
            </label>
            <InputText
              value={formData.attachment}
              onChange={e =>
                setFormData({ ...formData, attachment: e.target.value })
              }
              placeholder="Upload file name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Approval Required
            </label>
            <InputSwitch
              checked={formData.approvalRequired}
              onChange={e =>
                setFormData({ ...formData, approvalRequired: e.value })
              }
            />
          </div>
        </FormGrid>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm font-semibold text-gray-700">
            Description *
          </label>
          <InputTextarea
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            placeholder="Enter policy description"
          />
        </div>
        <FormActions
          isEditMode={!!editingPolicy}
          onSave={handleSave}
          onReset={resetForm}
        />
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
          <div className="space-y-4">
            <FormGrid columns={2}>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Policy ID
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {previewPolicy.id}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Policy Code
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {previewPolicy.code}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Policy Name
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {previewPolicy.name}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Category
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {previewPolicy.category}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Department
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {previewPolicy.department}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Status
                </span>
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
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Effective Date
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {previewPolicy.effectiveDate}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Expiry Date
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {previewPolicy.expiryDate || 'N/A'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Version
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {previewPolicy.versionNumber}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Created By
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {previewPolicy.createdBy}
                </span>
              </div>
            </FormGrid>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Description
              </span>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {previewPolicy.description}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Applicable To
              </span>
              <div className="flex gap-2 flex-wrap">
                {previewPolicy.applicableTo.map(a => (
                  <span
                    key={a}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
            {previewPolicy.reviewerComments && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Reviewer Comments
                </span>
                <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                  {previewPolicy.reviewerComments}
                </p>
              </div>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
