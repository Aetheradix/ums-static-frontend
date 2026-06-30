import { useState } from 'react';
import {
  FormCard,
  FormGrid,
  FormPage,
  FormPopup,
  FormActions,
  GridPanel,
  StatusBadge,
  Stepper,
} from 'shared/new-components';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'shared/components/buttons';
import { INITIAL_AUDITS, DEPARTMENT_OPTIONS, type Audit } from '../data';

export default function AuditManagement() {
  const [audits, setAudits] = useState<Audit[]>(INITIAL_AUDITS);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    auditDate: null as Date | null,
    auditor: '',
    checklist: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      department: '',
      auditDate: null,
      auditor: '',
      checklist: '',
    });
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSave = () => {
    const newAudit: Audit = {
      id: `AUD-${String(audits.length + 1).padStart(3, '0')}`,
      name: formData.name,
      department: formData.department,
      auditDate: formData.auditDate
        ? formData.auditDate.toISOString().split('T')[0]
        : '',
      auditor: formData.auditor,
      checklist: formData.checklist.split('\n').filter(c => c.trim()),
      findings: '',
      status: 'Scheduled',
    };
    setAudits(prev => [...prev, newAudit]);
    setShowForm(false);
    resetForm();
  };

  const handleView = (audit: Audit) => {
    setSelectedAudit(audit);
    setShowDetail(true);
  };

  const departmentOptions = DEPARTMENT_OPTIONS.map(d => ({
    label: d,
    value: d,
  }));

  // Workflow steps for stepper
  const auditSteps = [
    { label: 'Schedule Audit' },
    { label: 'Conduct Audit' },
    { label: 'Record Findings' },
    { label: 'Upload Evidence' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 0;
      case 'In Progress':
        return 1;
      case 'Completed':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <FormPage
      title="Audit Management"
      description="Schedule, conduct, and manage internal audits"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Audits' },
      ]}
      headerAction={
        <Button label="Schedule Audit" icon="add" onClick={handleCreate} />
      }
    >
      <FormCard title="All Audits" icon="fact_check">
        <GridPanel
          data={audits}
          columns={[
            { field: 'id', header: 'Audit ID', width: '100px' },
            { field: 'name', header: 'Audit Name' },
            { field: 'department', header: 'Department' },
            { field: 'auditDate', header: 'Audit Date', width: '110px' },
            { field: 'auditor', header: 'Auditor' },
            {
              field: 'status',
              header: 'Status',
              width: '120px',
              cell: (item: any) => {
                const variant =
                  item.status === 'Completed'
                    ? 'approved'
                    : item.status === 'In Progress'
                      ? 'pending'
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
          searchPlaceholder="Search audits..."
        />
      </FormCard>

      {/* ── Schedule Audit Form ── */}
      <FormPopup
        title="Schedule New Audit"
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
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
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
              Audit Date *
            </label>
            <Calendar
              value={formData.auditDate}
              onChange={e =>
                setFormData({ ...formData, auditDate: e.value as Date })
              }
              dateFormat="yy-mm-dd"
              placeholder="Select date"
              showIcon
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Auditor *
            </label>
            <InputText
              value={formData.auditor}
              onChange={e =>
                setFormData({ ...formData, auditor: e.target.value })
              }
              placeholder="Enter auditor name"
            />
          </div>
        </FormGrid>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm font-semibold text-gray-700">
            Checklist Items (one per line) *
          </label>
          <InputTextarea
            value={formData.checklist}
            onChange={e =>
              setFormData({ ...formData, checklist: e.target.value })
            }
            rows={5}
            placeholder="Enter checklist items, one per line..."
          />
        </div>
        <FormActions
          onSave={handleSave}
          onReset={resetForm}
          saveLabel="Schedule"
        />
      </FormPopup>

      {/* ── Audit Detail View ── */}
      <FormPopup
        title={`Audit: ${selectedAudit?.name || ''}`}
        visible={showDetail}
        onHide={() => {
          setShowDetail(false);
          setSelectedAudit(null);
        }}
      >
        {selectedAudit && (
          <div className="space-y-5">
            {/* Workflow Stepper */}
            <div className="pb-2">
              <Stepper
                steps={auditSteps}
                activeStep={getStepIndex(selectedAudit.status)}
              />
            </div>

            <FormGrid columns={2}>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Department
                </span>
                <span className="text-sm font-medium">
                  {selectedAudit.department}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Audit Date
                </span>
                <span className="text-sm font-medium">
                  {selectedAudit.auditDate}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Auditor
                </span>
                <span className="text-sm font-medium">
                  {selectedAudit.auditor}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Status
                </span>
                <StatusBadge
                  label={selectedAudit.status}
                  variant={
                    selectedAudit.status === 'Completed'
                      ? 'approved'
                      : selectedAudit.status === 'In Progress'
                        ? 'pending'
                        : 'neutral'
                  }
                />
              </div>
            </FormGrid>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Audit Checklist
              </span>
              <div className="space-y-2">
                {selectedAudit.checklist.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm"
                  >
                    <i className="pi pi-check-circle text-green-500"></i>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedAudit.findings && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Findings
                </span>
                <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                  {selectedAudit.findings}
                </p>
              </div>
            )}

            {selectedAudit.evidence && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <i className="pi pi-file text-blue-500 text-lg"></i>
                <span className="text-sm font-medium text-blue-700">
                  {selectedAudit.evidence}
                </span>
              </div>
            )}
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
