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

  const [formData, setFormData] = useState({
    auditName: '',
    issue: '',
    responsiblePerson: '',
    department: '',
    deadline: null as Date | null,
  });

  const resetForm = () => {
    setFormData({
      auditName: '',
      issue: '',
      responsiblePerson: '',
      department: '',
      deadline: null,
    });
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSave = () => {
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
    setShowForm(false);
    resetForm();
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
      <FormCard title="Non-Compliance Issues" icon="report_problem">
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
            { field: 'deadline', header: 'Deadline', width: '110px' },
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
          searchPlaceholder="Search non-compliance issues..."
        />
      </FormCard>

      {/* ── Create Issue Form ── */}
      <FormPopup
        title="Create Non-Compliance Issue"
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          resetForm();
        }}
      >
        <FormGrid columns={2}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Audit Name *
            </label>
            <InputText
              value={formData.auditName}
              onChange={e =>
                setFormData({ ...formData, auditName: e.target.value })
              }
              placeholder="Enter audit name"
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
              Responsible Person *
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
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm font-semibold text-gray-700">
            Issue Description *
          </label>
          <InputTextarea
            value={formData.issue}
            onChange={e => setFormData({ ...formData, issue: e.target.value })}
            rows={4}
            placeholder="Describe the non-compliance issue..."
          />
        </div>
        <FormActions onSave={handleSave} onReset={resetForm} />
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
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Audit
                </span>
                <span className="text-sm font-medium">
                  {selectedIssue.auditName}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Department
                </span>
                <span className="text-sm font-medium">
                  {selectedIssue.department}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Responsible Person
                </span>
                <span className="text-sm font-medium">
                  {selectedIssue.responsiblePerson}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Deadline
                </span>
                <span className="text-sm font-medium">
                  {selectedIssue.deadline}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Status
                </span>
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
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Created
                </span>
                <span className="text-sm font-medium">
                  {selectedIssue.createdDate}
                </span>
              </div>
            </FormGrid>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Issue Description
              </span>
              <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                {selectedIssue.issue}
              </p>
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
