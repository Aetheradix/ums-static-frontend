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
import { Calendar } from 'primereact/calendar';
import { Button } from 'shared/components/buttons';
import {
  INITIAL_NON_COMPLIANCES,
  DEPARTMENT_OPTIONS,
  type NonCompliance,
} from '../data';

export default function NonComplianceManagement() {
  const [issues, setIssues] = useState<NonCompliance[]>(
    INITIAL_NON_COMPLIANCES
  );
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<NonCompliance | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    auditName: '',
    issue: '',
    responsiblePerson: '',
    department: '',
    deadline: null as Date | null,
  });

  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setFormData({
      auditName: '',
      issue: '',
      responsiblePerson: '',
      department: '',
      deadline: null,
    });
    setFormError('');
  };

  const handleCreate = () => {
    resetForm();
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: NonCompliance) => {
    setFormData({
      auditName: item.auditName,
      issue: item.issue,
      responsiblePerson: item.responsiblePerson,
      department: item.department,
      deadline: item.deadline ? new Date(item.deadline) : null,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (
      !formData.auditName ||
      !formData.department ||
      !formData.responsiblePerson ||
      !formData.deadline ||
      !formData.issue
    ) {
      setFormError('Please fill all required fields before saving.');
      return;
    }

    if (editingId) {
      setIssues(prev =>
        prev.map(issue =>
          issue.id === editingId
            ? {
                ...issue,
                auditName: formData.auditName,
                issue: formData.issue,
                responsiblePerson: formData.responsiblePerson,
                department: formData.department,
                deadline: formData.deadline
                  ? formData.deadline.toISOString().split('T')[0]
                  : '',
              }
            : issue
        )
      );
    } else {
      const newIssue: NonCompliance = {
        id: `NC-${String(issues.length + 1).padStart(3, '0')}`,
        auditId: '',
        auditName: formData.auditName,
        issue: formData.issue,
        responsiblePerson: formData.responsiblePerson,
        department: formData.department,
        deadline: formData.deadline
          ? formData.deadline.toISOString().split('T')[0]
          : '',
        status: 'Open',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setIssues(prev => [...prev, newIssue]);
    }
    setShowForm(false);
    resetForm();
    setEditingId(null);
  };

  const handleView = (item: NonCompliance) => {
    setSelectedIssue(item);
    setShowDetail(true);
  };

  const departmentOptions = DEPARTMENT_OPTIONS.map(d => ({
    label: d,
    value: d,
  }));

  return (
    <FormPage
      title="Non-Compliance Management"
      description="Track and manage non-compliance issues found during audits"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Non-Compliance' },
      ]}
      headerAction={
        <Button label="Create Issue" icon="add" onClick={handleCreate} />
      }
    >
      <FormCard title="Non-Compliance Issues" icon="exclamation-triangle">
        <GridPanel
          data={issues}
          columns={[
            { field: 'id', header: 'NC ID', width: '90px' },
            { field: 'auditName', header: 'Audit' },
            {
              field: 'issue',
              header: 'Issue',
              cell: (item: any) => (
                <span className="text-sm text-gray-700 truncate block max-w-64">
                  {item.issue}
                </span>
              ),
            },
            { field: 'responsiblePerson', header: 'Responsible Person' },
            { field: 'department', header: 'Department' },
            {
              field: 'deadline',
              header: 'Deadline',
              width: '110px',
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
              width: '120px',
              cell: (item: any) => {
                const variant =
                  item.status === 'Resolved' || item.status === 'Closed'
                    ? 'approved'
                    : item.status === 'In Progress'
                      ? 'pending'
                      : item.status === 'Open'
                        ? 'rejected'
                        : 'neutral';
                return <StatusBadge label={item.status} variant={variant} />;
              },
            },
            {
              field: 'actions',
              header: 'Actions',
              width: '100px',
              cell: (item: any) => (
                <div className="flex items-center gap-2">
                  <button
                    className="text-amber-600 hover:text-amber-800 text-lg transition-colors p-1"
                    onClick={() => handleEdit(item)}
                    title="Edit"
                  >
                    <i className="pi pi-pencil"></i>
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-800 text-lg transition-colors p-1"
                    onClick={() => handleView(item)}
                    title="View"
                  >
                    <i className="pi pi-eye"></i>
                  </button>
                </div>
              ),
            },
          ]}
          searchBox
          searchPlaceholder="Search non-compliance issues..."
        />
      </FormCard>

      {/* ── Create / Edit Issue Form ── */}
      <FormPopup
        title={
          editingId
            ? 'Edit Non-Compliance Issue'
            : 'Create Non-Compliance Issue'
        }
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          resetForm();
        }}
        footer={<FormActions onSave={handleSave} onReset={resetForm} />}
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm flex items-center gap-2">
            <i className="pi pi-exclamation-circle"></i>
            {formError}
          </div>
        )}
        <FormGrid columns={2}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Audit Name <span className="text-red-500">*</span>
            </label>
            <InputText
              value={formData.auditName}
              onChange={e =>
                setFormData({ ...formData, auditName: e.target.value })
              }
              placeholder="Enter audit name"
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Department <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={formData.department}
              options={departmentOptions}
              onChange={e => setFormData({ ...formData, department: e.value })}
              placeholder="Select department"
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Responsible Person <span className="text-red-500">*</span>
            </label>
            <InputText
              value={formData.responsiblePerson}
              onChange={e =>
                setFormData({
                  ...formData,
                  responsiblePerson: e.target.value,
                })
              }
              placeholder="Enter responsible person"
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Deadline <span className="text-red-500">*</span>
            </label>
            <Calendar
              value={formData.deadline}
              onChange={e =>
                setFormData({ ...formData, deadline: e.value as Date })
              }
              dateFormat="dd-mm-yy"
              placeholder="Select deadline"
              showIcon
              className="w-full"
            />
          </div>
        </FormGrid>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm font-semibold text-gray-700">
            Issue Description <span className="text-red-500">*</span>
          </label>
          <InputTextarea
            value={formData.issue}
            onChange={e => setFormData({ ...formData, issue: e.target.value })}
            rows={4}
            placeholder="Describe the non-compliance issue..."
            className="w-full"
          />
        </div>
      </FormPopup>

      {/* ── Detail View ── */}
      <FormPopup
        title={`Non-Compliance: ${selectedIssue?.id || ''}`}
        visible={showDetail}
        onHide={() => {
          setShowDetail(false);
          setSelectedIssue(null);
        }}
      >
        {selectedIssue && (
          <div className="space-y-4">
            <FormGrid columns={2}>
              <PreviewField
                label="Audit"
                value={selectedIssue.auditName}
                className="border-none pb-0"
              />
              <PreviewField
                label="Department"
                value={selectedIssue.department}
                className="border-none pb-0"
              />
              <PreviewField
                label="Responsible Person"
                value={selectedIssue.responsiblePerson}
                className="border-none pb-0"
              />
              <PreviewField
                label="Deadline"
                value={selectedIssue.deadline}
                className="border-none pb-0"
              />
              <PreviewField
                label="Status"
                className="border-none pb-0"
                value={
                  <StatusBadge
                    label={selectedIssue.status}
                    variant={
                      selectedIssue.status === 'Resolved' ||
                      selectedIssue.status === 'Closed'
                        ? 'approved'
                        : selectedIssue.status === 'In Progress'
                          ? 'pending'
                          : 'rejected'
                    }
                  />
                }
              />
              <PreviewField
                label="Created"
                value={selectedIssue.createdDate}
                className="border-none pb-0"
              />
            </FormGrid>

            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                Issue Description
              </span>
              <p className="text-sm text-red-700 bg-red-50 p-3 border border-red-100 rounded-lg mt-1">
                {selectedIssue.issue}
              </p>
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
