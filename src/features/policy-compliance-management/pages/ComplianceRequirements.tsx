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
import { Button } from 'shared/components/buttons';
import {
  INITIAL_COMPLIANCE_REQUIREMENTS,
  DEPARTMENT_OPTIONS,
  FREQUENCY_OPTIONS,
  APPLICABLE_TO_OPTIONS,
  type ComplianceRequirement,
} from '../data';

export default function ComplianceRequirements() {
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>(
    INITIAL_COMPLIANCE_REQUIREMENTS
  );
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRequirement, setSelectedRequirement] =
    useState<ComplianceRequirement | null>(null);
  const [editing, setEditing] = useState<ComplianceRequirement | null>(null);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: '',
    department: '',
    applicableTo: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      frequency: '',
      department: '',
      applicableTo: '',
    });
    setEditing(null);
    setFormError('');
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (item: ComplianceRequirement) => {
    setEditing(item);
    setFormData({
      name: item.name,
      description: item.description,
      frequency: item.frequency,
      department: item.department,
      applicableTo: item.applicableTo,
    });
    setShowForm(true);
  };

  const handleView = (item: ComplianceRequirement) => {
    setSelectedRequirement(item);
    setShowDetail(true);
  };

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.frequency ||
      !formData.department ||
      !formData.applicableTo ||
      !formData.description
    ) {
      setFormError('Please fill all required fields before saving.');
      return;
    }

    if (editing) {
      setRequirements(prev =>
        prev.map(r => (r.id === editing.id ? { ...r, ...formData } : r))
      );
    } else {
      const newReq: ComplianceRequirement = {
        id: `COMP-${String(requirements.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setRequirements(prev => [...prev, newReq]);
    }
    setShowForm(false);
    resetForm();
  };

  const frequencyOptions = FREQUENCY_OPTIONS.map(f => ({ label: f, value: f }));
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
      title="Compliance Requirements"
      description="Compliance Officer creates compliance activities with defined frequency"
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        {
          label: 'Policy & Compliance',
          to: '/policy-compliance-management/dashboard',
        },
        { label: 'Compliance Requirements' },
      ]}
      headerAction={
        <Button label="Create Compliance" icon="add" onClick={handleCreate} />
      }
    >
      <FormCard title="All Compliance Requirements" icon="check-square">
        <GridPanel
          data={requirements}
          columns={[
            { field: 'id', header: 'ID', width: '100px' },
            { field: 'name', header: 'Compliance Name' },
            { field: 'frequency', header: 'Frequency', width: '130px' },
            { field: 'department', header: 'Department' },
            { field: 'applicableTo', header: 'Applicable To', width: '120px' },
            {
              field: 'status',
              header: 'Status',
              width: '100px',
              cell: (item: any) => (
                <StatusBadge
                  label={item.status}
                  variant={item.status === 'Active' ? 'approved' : 'neutral'}
                />
              ),
            },
            {
              field: 'createdDate',
              header: 'Created',
              width: '110px',
              cell: (item: any) => {
                if (!item.createdDate) return '';
                const parts = item.createdDate.split('-');
                if (parts.length === 3) {
                  return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return item.createdDate;
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
          searchPlaceholder="Search compliance requirements..."
        />
      </FormCard>

      {/* ── Create/Edit Form ── */}
      <FormPopup
        title={
          editing
            ? 'Edit Compliance Requirement'
            : 'Create Compliance Requirement'
        }
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          resetForm();
        }}
        footer={
          <FormActions
            onSave={handleSave}
            onReset={resetForm}
            saveLabel={editing ? 'Save Changes' : 'Create'}
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
              Compliance Name <span className="text-red-500">*</span>
            </label>
            <InputText
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter compliance name"
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Frequency <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={formData.frequency}
              options={frequencyOptions}
              onChange={e => setFormData({ ...formData, frequency: e.value })}
              placeholder="Select frequency"
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
              Applicable To <span className="text-red-500">*</span>
            </label>
            <Dropdown
              value={formData.applicableTo}
              options={applicableOptions}
              onChange={e =>
                setFormData({ ...formData, applicableTo: e.value })
              }
              placeholder="Select applicable group"
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm font-semibold text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <InputTextarea
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            placeholder="Enter compliance description"
            className="w-full"
          />
        </div>
      </FormPopup>

      {/* ── Detail View ── */}
      <FormPopup
        title={`Compliance Requirement: ${selectedRequirement?.id || ''}`}
        visible={showDetail}
        onHide={() => {
          setShowDetail(false);
          setSelectedRequirement(null);
        }}
      >
        {selectedRequirement && (
          <div className="space-y-4">
            <FormGrid columns={2}>
              <PreviewField
                label="Compliance Name"
                value={selectedRequirement.name}
                className="border-none pb-0"
              />
              <PreviewField
                label="Frequency"
                value={selectedRequirement.frequency}
                className="border-none pb-0"
              />
              <PreviewField
                label="Department"
                value={selectedRequirement.department}
                className="border-none pb-0"
              />
              <PreviewField
                label="Applicable To"
                value={selectedRequirement.applicableTo}
                className="border-none pb-0"
              />
              <PreviewField
                label="Created Date"
                value={selectedRequirement.createdDate}
                className="border-none pb-0"
              />
              <PreviewField
                label="Status"
                className="border-none pb-0"
                value={
                  <StatusBadge
                    label={selectedRequirement.status}
                    variant={
                      selectedRequirement.status === 'Active'
                        ? 'approved'
                        : 'neutral'
                    }
                  />
                }
              />
            </FormGrid>
            <div className="mt-4">
              <PreviewField
                label="Description"
                value={selectedRequirement.description}
                className="border-none pb-0"
              />
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
