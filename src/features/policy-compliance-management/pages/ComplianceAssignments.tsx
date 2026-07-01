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

import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'shared/components/buttons';
import {
  INITIAL_COMPLIANCE_ASSIGNMENTS,
  INITIAL_COMPLIANCE_REQUIREMENTS,
  DEPARTMENT_OPTIONS,
  ASSIGNED_TYPE_OPTIONS,
  type ComplianceAssignment,
} from '../data';

export default function ComplianceAssignments() {
  const [assignments, setAssignments] = useState<ComplianceAssignment[]>(
    INITIAL_COMPLIANCE_ASSIGNMENTS
  );
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<ComplianceAssignment | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    complianceId: '',
    assignedTo: '',
    assignedType: '' as string,
    deadline: null as Date | null,
  });

  const resetForm = () => {
    setFormData({
      complianceId: '',
      assignedTo: '',
      assignedType: '',
      deadline: null,
    });
    setEditingId(null);
    setFormError('');
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (item: ComplianceAssignment) => {
    setFormData({
      complianceId: item.complianceId,
      assignedTo: item.assignedTo,
      assignedType: item.assignedType,
      deadline: item.deadline ? new Date(item.deadline) : null,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleView = (item: ComplianceAssignment) => {
    setSelectedAssignment(item);
    setShowDetail(true);
  };

  const handleSave = () => {
    if (
      !formData.complianceId ||
      !formData.assignedType ||
      !formData.assignedTo ||
      !formData.deadline
    ) {
      setFormError('Please fill all required fields before saving.');
      return;
    }

    const compliance = INITIAL_COMPLIANCE_REQUIREMENTS.find(
      c => c.id === formData.complianceId
    );

    if (editingId) {
      setAssignments(prev =>
        prev.map(assignment =>
          assignment.id === editingId
            ? {
                ...assignment,
                complianceId: formData.complianceId,
                complianceName: compliance?.name || '',
                assignedTo: formData.assignedTo,
                assignedType: formData.assignedType as any,
                deadline: formData.deadline
                  ? formData.deadline.toISOString().split('T')[0]
                  : '',
              }
            : assignment
        )
      );
    } else {
      const newAssignment: ComplianceAssignment = {
        id: `ASGN-${String(assignments.length + 1).padStart(3, '0')}`,
        complianceId: formData.complianceId,
        complianceName: compliance?.name || '',
        assignedTo: formData.assignedTo,
        assignedType: formData.assignedType as any,
        deadline: formData.deadline
          ? formData.deadline.toISOString().split('T')[0]
          : '',
        status: 'Pending',
        assignedDate: new Date().toISOString().split('T')[0],
      };
      setAssignments(prev => [...prev, newAssignment]);
    }
    setShowForm(false);
    resetForm();
    setEditingId(null);
  };

  const complianceOptions = INITIAL_COMPLIANCE_REQUIREMENTS.map(c => ({
    label: c.name,
    value: c.id,
  }));

  const assignedTypeOptions = ASSIGNED_TYPE_OPTIONS.map(t => ({
    label: t,
    value: t,
  }));

  const departmentOptions = DEPARTMENT_OPTIONS.map(d => ({
    label: d,
    value: d,
  }));

  return (
    <FormPage
      title="Compliance Assignments"
      description="Assign compliance requirements to departments, colleges, faculty, staff, or students"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Compliance Assignments' },
      ]}
      headerAction={
        <Button label="Assign Compliance" icon="add" onClick={handleCreate} />
      }
    >
      <FormCard title="All Assignments" icon="users">
        <GridPanel
          data={assignments}
          columns={[
            { field: 'id', header: 'Assignment ID', width: '120px' },
            { field: 'complianceName', header: 'Compliance' },
            { field: 'assignedTo', header: 'Assigned To' },
            {
              field: 'assignedType',
              header: 'Type',
              width: '110px',
              cell: (item: any) => (
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded font-bold">
                  {item.assignedType}
                </span>
              ),
            },
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
              field: 'assignedDate',
              header: 'Assigned',
              width: '110px',
              cell: (item: any) => {
                if (!item.assignedDate) return '';
                const parts = item.assignedDate.split('-');
                if (parts.length === 3) {
                  return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return item.assignedDate;
              },
            },
            {
              field: 'status',
              header: 'Status',
              width: '130px',
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
              width: '80px',
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
          searchPlaceholder="Search assignments..."
        />
      </FormCard>

      {/* ── Assign Form ── */}
      <FormPopup
        title={editingId ? 'Edit Compliance Assignment' : 'Assign Compliance'}
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          resetForm();
        }}
        footer={
          <FormActions
            onSave={handleSave}
            onReset={resetForm}
            saveLabel={editingId ? 'Save Changes' : 'Assign'}
          />
        }
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm flex items-center gap-2">
            <i className="pi pi-exclamation-circle"></i>
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Compliance Requirement <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={formData.complianceId}
              options={complianceOptions}
              onChange={e =>
                setFormData({ ...formData, complianceId: e.value })
              }
              placeholder="Select compliance"
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Assigned Type <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={formData.assignedType}
              options={assignedTypeOptions}
              onChange={e =>
                setFormData({ ...formData, assignedType: e.value })
              }
              placeholder="Select type"
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Assign To <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={formData.assignedTo}
              options={departmentOptions}
              onChange={e => setFormData({ ...formData, assignedTo: e.value })}
              placeholder="Select department/user"
              editable
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
        </div>
      </FormPopup>

      {/* ── Detail View ── */}
      <FormPopup
        title={`Assignment: ${selectedAssignment?.id || ''}`}
        visible={showDetail}
        onHide={() => {
          setShowDetail(false);
          setSelectedAssignment(null);
        }}
      >
        {selectedAssignment && (
          <div className="space-y-4">
            <FormGrid columns={2}>
              <PreviewField
                label="Compliance"
                value={selectedAssignment.complianceName}
                className="border-none pb-0"
              />
              <PreviewField
                label="Assigned To"
                value={selectedAssignment.assignedTo}
                className="border-none pb-0"
              />
              <PreviewField
                label="Type"
                value={selectedAssignment.assignedType}
                className="border-none pb-0"
              />
              <PreviewField
                label="Deadline"
                value={selectedAssignment.deadline}
                className="border-none pb-0"
              />
              <PreviewField
                label="Assigned Date"
                value={selectedAssignment.assignedDate}
                className="border-none pb-0"
              />
              <PreviewField
                label="Status"
                className="border-none pb-0"
                value={
                  <StatusBadge
                    label={selectedAssignment.status}
                    variant={
                      selectedAssignment.status === 'Verified'
                        ? 'approved'
                        : selectedAssignment.status === 'Rejected'
                          ? 'rejected'
                          : selectedAssignment.status === 'Pending'
                            ? 'neutral'
                            : 'pending'
                    }
                  />
                }
              />
            </FormGrid>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
