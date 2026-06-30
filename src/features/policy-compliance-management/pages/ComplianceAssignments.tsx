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
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSave = () => {
    const compliance = INITIAL_COMPLIANCE_REQUIREMENTS.find(
      c => c.id === formData.complianceId
    );
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
    setShowForm(false);
    resetForm();
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
      <FormCard title="All Assignments" icon="assignment_ind">
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
            { field: 'deadline', header: 'Deadline', width: '110px' },
            { field: 'assignedDate', header: 'Assigned', width: '110px' },
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
          ]}
          searchBox
          searchPlaceholder="Search assignments..."
        />
      </FormCard>

      {/* ── Assign Form ── */}
      <FormPopup
        title="Assign Compliance"
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          resetForm();
        }}
      >
        <FormGrid columns={2}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Compliance Requirement *
            </label>
            <Dropdown
              value={formData.complianceId}
              options={complianceOptions}
              onChange={e =>
                setFormData({ ...formData, complianceId: e.value })
              }
              placeholder="Select compliance"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Assigned Type *
            </label>
            <Dropdown
              value={formData.assignedType}
              options={assignedTypeOptions}
              onChange={e =>
                setFormData({ ...formData, assignedType: e.value })
              }
              placeholder="Select type"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Assign To *
            </label>
            <Dropdown
              value={formData.assignedTo}
              options={departmentOptions}
              onChange={e => setFormData({ ...formData, assignedTo: e.value })}
              placeholder="Select department/user"
              editable
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Deadline *
            </label>
            <Calendar
              value={formData.deadline}
              onChange={e =>
                setFormData({ ...formData, deadline: e.value as Date })
              }
              dateFormat="yy-mm-dd"
              placeholder="Select deadline"
              showIcon
            />
          </div>
        </FormGrid>
        <FormActions onSave={handleSave} onReset={resetForm} />
      </FormPopup>
    </FormPage>
  );
}
