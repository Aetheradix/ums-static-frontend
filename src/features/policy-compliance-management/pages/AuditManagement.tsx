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
  PreviewField,
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

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
    setEditingId(null);
    setFormError('');
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (item: Audit) => {
    setFormData({
      name: item.name,
      department: item.department,
      auditDate: item.auditDate ? new Date(item.auditDate) : null,
      auditor: item.auditor,
      checklist: item.checklist.join('\n'),
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.department ||
      !formData.auditDate ||
      !formData.auditor ||
      !formData.checklist
    ) {
      setFormError('Please fill all required fields before saving.');
      return;
    }

    if (editingId) {
      setAudits(prev =>
        prev.map(audit =>
          audit.id === editingId
            ? {
                ...audit,
                name: formData.name,
                department: formData.department,
                auditDate: formData.auditDate
                  ? formData.auditDate.toISOString().split('T')[0]
                  : '',
                auditor: formData.auditor,
                checklist: formData.checklist.split('\n').filter(c => c.trim()),
              }
            : audit
        )
      );
    } else {
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
    }
    setShowForm(false);
    resetForm();
    setEditingId(null);
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
      <FormCard title="All Audits" icon="check-square">
        <GridPanel
          data={audits}
          columns={[
            { field: 'id', header: 'Audit ID', width: '100px' },
            { field: 'name', header: 'Audit Name' },
            { field: 'department', header: 'Department' },
            {
              field: 'auditDate',
              header: 'Audit Date',
              width: '110px',
              cell: (item: any) => {
                if (!item.auditDate) return '';
                const parts = item.auditDate.split('-');
                if (parts.length === 3) {
                  return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return item.auditDate;
              },
            },
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
          searchPlaceholder="Search audits..."
        />
      </FormCard>

      {/* ── Schedule / Edit Audit Form ── */}
      <FormPopup
        title={editingId ? 'Edit Audit Details' : 'Schedule New Audit'}
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          resetForm();
        }}
        footer={
          <FormActions
            onSave={handleSave}
            onReset={resetForm}
            saveLabel={editingId ? 'Save Changes' : 'Schedule'}
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
              Audit Name <span className="text-red-500">*</span>
            </label>
            <InputText
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
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
              Audit Date <span className="text-red-500">*</span>
            </label>
            <Calendar
              value={formData.auditDate}
              onChange={e =>
                setFormData({ ...formData, auditDate: e.value as Date })
              }
              dateFormat="dd-mm-yy"
              placeholder="Select date"
              showIcon
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Auditor <span className="text-red-500">*</span>
            </label>
            <InputText
              value={formData.auditor}
              onChange={e =>
                setFormData({ ...formData, auditor: e.target.value })
              }
              placeholder="Enter auditor name"
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm font-semibold text-gray-700">
            Checklist Items (one per line){' '}
            <span className="text-red-500">*</span>
          </label>
          <InputTextarea
            value={formData.checklist}
            onChange={e =>
              setFormData({ ...formData, checklist: e.target.value })
            }
            rows={5}
            placeholder="Enter checklist items, one per line..."
            className="w-full"
          />
        </div>
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
              <PreviewField
                label="Department"
                value={selectedAudit.department}
                className="border-none pb-0"
              />
              <PreviewField
                label="Audit Date"
                value={selectedAudit.auditDate}
                className="border-none pb-0"
              />
              <PreviewField
                label="Auditor"
                value={selectedAudit.auditor}
                className="border-none pb-0"
              />
              <PreviewField
                label="Status"
                className="border-none pb-0"
                value={
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
                }
              />
            </FormGrid>

            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
                Audit Checklist
              </span>
              <div className="space-y-2 mt-1">
                {selectedAudit.checklist.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-slate-800"
                  >
                    <i className="pi pi-check-circle text-green-500 text-lg"></i>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedAudit.findings && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-xs font-bold leading-4 text-slate-800 uppercase tracking-wider">
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
